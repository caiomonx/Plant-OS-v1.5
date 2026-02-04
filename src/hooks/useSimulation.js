import { useState, useCallback, useEffect } from 'react';
import { usePatientEngine, getECGStage } from './usePatientEngine';

export default function useSimulation(scenarioData) {
    // 1. Initialize Log State
    const [logs, setLogs] = useState([]);

    // Helper helper to add logs (passed to engine)
    const addLog = useCallback((textOrObj) => {
        const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Placeholder time or synced
        // If string, simple log. If obj, full log.
        if (typeof textOrObj === 'string') {
            setLogs(prev => [...prev, { time: "SYS", text: textOrObj, type: 'info' }]);
        } else {
            setLogs(prev => [...prev, textOrObj]);
        }
    }, []);

    // 2. Initialize Patient Engine (The Heart)
    // We must memoize the callback to prevent engine re-renders/infinite loops
    const onPatientLog = useCallback((msg) => {
        addLog({
            time: "AUTO",
            text: msg,
            consequence: "Alteração fisiológica detectada",
            type: 'info'
        });
    }, [addLog]);

    const { patient, applyAction: applyPatientAction } = usePatientEngine(onPatientLog, scenarioData.initialState);

    // 3. Game/Task State (Inventory, Checklist, Telemetry - things NOT in the body)
    const [gameState, setGameState] = useState(() => {
        const initial = JSON.parse(JSON.stringify(scenarioData.initialState));

        // Ensure strictly game-logic fields are present
        initial.status = initial.status || {};
        initial.executedActionIds = [];
        initial.timeElapsed = 0; // Game Logic Time (Cost based)
        initial.telemetry = {
            monitorTime: null,
            ecgTime: null,
            accessTime: null,
            calciumTime: null,
            treatmentTime: null,
            dialysisRequested: false,
            fatalErrors: 0
        };

        return initial;
    });

    // Helper to format time (Cost based time)
    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // --- ACTION EXECUTOR ---
    const executeAction = useCallback((actionId, overrides = {}) => {
        const action = scenarioData.availableActions.find(a => a.id === actionId);

        if (!action) {
            console.error(`Action ${actionId} not found.`);
            return;
        }

        const currentStatus = gameState.status;
        const currentTimeVal = gameState.timeElapsed;
        const currentSimTime = formatTime(currentTimeVal);
        const actionLabel = overrides.label || action.label;

        // 1. Check Prerequisites (Game Logic)
        if (action.requiresIV && !currentStatus.hasIVAccess) {
            addLog({
                time: currentSimTime,
                text: `Falha: ${actionLabel}`,
                consequence: "Requer acesso venoso prévio.",
                type: 'error'
            });
            setGameState(prev => ({
                ...prev,
                telemetry: { ...prev.telemetry, fatalErrors: (prev.telemetry?.fatalErrors || 0) + 1 }
            }));
            return;
        }

        // 2. Apply to Patient Engine (Physiology)
        // We pass the RAW action ID. The engine decides if it cares.
        applyPatientAction(action.id.toUpperCase()); // Normalize to upper/match engine cases?
        // Engine cases: "GLUCONATO_CALCIO", "SOLUCAO_POLARIZANTE", "EXPANSAO_VOLUMETRICA", "DIALISE"
        // Action IDs in scenario: "drug_gluconato", "drug_polarizing", "fluid_saline", "proc_dialysis"
        // MAPPING NEEDED:
        let engineActionType = null;
        if (action.id.includes('gluconato')) engineActionType = "GLUCONATO_CALCIO";
        else if (action.id.includes('polarizante')) engineActionType = "SOLUCAO_POLARIZANTE";
        else if (action.id.includes('dialysis') || action.id.includes('dialise')) engineActionType = "DIALISE";
        // Fluids usually handled by specific fluid ID logic in UI calling executeAction with 'fluid_saline' etc
        else if (action.id.includes('fluid') || action.id === 'expansao_volumetrica') engineActionType = "EXPANSAO_VOLUMETRICA"; // Simplify: all fluids = expansion

        if (engineActionType) {
            applyPatientAction(engineActionType);
        }

        // 3. Update Game State (Cost, Flags, Telemetry)
        const newCost = overrides.cost !== undefined ? overrides.cost : (action.cost || 0);
        const newTimeVal = currentTimeVal + newCost;
        const newSimTime = formatTime(newTimeVal);

        setGameState(prev => {
            const newState = { ...prev };
            newState.timeElapsed = newTimeVal;

            // Update Status Flags
            switch (action.id) {
                case 'proc_monitor': newState.status.isMonitored = true; break;
                case 'proc_iv_access': newState.status.hasIVAccess = true; break;
                case 'proc_sonda': newState.status.hasFoley = true; break;
                default: break;
            }
            if (action.triggersVitals) newState.status.isMonitored = true;

            // Track Executed Action
            if (!newState.executedActionIds) newState.executedActionIds = [];
            newState.executedActionIds.push(action.id);

            // Telemetry
            if (!newState.telemetry) newState.telemetry = {};
            const recordTelemetry = (field) => {
                if (newState.telemetry[field] === null) newState.telemetry[field] = newState.timeElapsed;
            };

            const lowerId = action.id.toLowerCase();
            if (lowerId.includes('monitor')) recordTelemetry('monitorTime');
            else if (lowerId.includes('ecg')) recordTelemetry('ecgTime');
            else if (lowerId.includes('access') || lowerId.includes('acesso')) recordTelemetry('accessTime');
            else if (lowerId.includes('gluconato')) recordTelemetry('calciumTime');
            else if (lowerId.includes('polarizante') || lowerId.includes('salbutamol')) recordTelemetry('treatmentTime');
            else if (lowerId.includes('dialysis')) newState.telemetry.dialysisRequested = true;

            // Lab Snapshot Logic
            if (action.triggersLabs) {
                // Capture the current physiological state into the game state
                // This creates a "Report" that doesn't change until requested again
                newState.labs = JSON.parse(JSON.stringify(patient.labs));
            }

            return newState;
        });

        // 4. Log User Action
        addLog({
            time: newSimTime,
            text: actionLabel,
            consequence: action.resultLog || "Ação realizada.",
            type: 'success'
        });

    }, [gameState, scenarioData, applyPatientAction, addLog, patient]);

    // --- COMPOSE FINAL STATE ---
    // Merge the real-time patient state into the game state for the UI
    const finalGameState = {
        ...gameState,
        vitals: patient.vitals,
        // labs: patient.labs, // REMOVED: We now use gameState.labs (snapshot) instead of live feed
        physiology: {
            ...gameState.physiology,
            ...patient.physiology,
            ecgStage: (patient.labs && patient.physiology)
                ? getECGStage(patient.labs, patient.physiology)
                : 0
        }
    };

    return {
        gameState: finalGameState,
        logs,
        executeAction,
        scenarioData
    };
}
