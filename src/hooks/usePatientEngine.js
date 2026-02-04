import { useState, useEffect, useCallback, useRef } from 'react';

const INITIAL_PATIENT_STATE = {
    vitals: {
        hr: 45,       // Bradicardia (K+ high)
        bp: { sys: 90, dia: 60 },
        sats: 96,     // Clean lungs
        resp: 22,
        temp: 36.5
    },
    labs: {
        k: 7.8,       // Severe Hyperkalemia
        gl: 110,      // Glucose
        ph: 7.25      // Acidosis
    },
    physiology: {
        membraneStability: 0, // 0 = Unstable, 100 = Protected (Gluconate)
        fluidBalance: 0,      // In ml. If > 1000ml in anuric -> SpO2 drops (Edema)
        kShiftRate: 0         // Rate of K+ drop per minute (drug effect)
    }
};

// Helper to parse BP string "90/60" to object {sys: 90, dia: 60}
const parseBP = (bp) => {
    if (typeof bp === 'object') return bp; // Already object (fallback)
    if (typeof bp === 'string') {
        const [sys, dia] = bp.split('/').map(Number);
        return { sys: sys || 90, dia: dia || 60 };
    }
    return { sys: 90, dia: 60 }; // Default
};

// Helper to format BP object back to string
const formatBP = (sys, dia) => `${Math.round(sys)}/${Math.round(dia)}`;

/**
 * Derives the ECG stage based on Potassium levels and Membrane Stability.
 * @param {Object} labs - Patient labs
 * @param {Object} physiology - Patient physiology
 * @returns {number} ECG Stage (0-3)
 */
export const getECGStage = (labs, physiology) => {
    const k = labs.k;
    const isProtected = physiology.membraneStability > 50;

    // 1. Calculate base stage from Potassium
    let stage = 0;
    if (k < 2.5) stage = -2;         // Severe Hypokalemia
    else if (k < 3.5) stage = -1;    // Mild Hypokalemia
    else if (k <= 5.5) stage = 0;    // Normal
    else if (k <= 6.5) stage = 1;    // Mild Hyperkalemia
    else if (k <= 7.5) stage = 2;    // Moderate Hyperkalemia
    else if (k <= 8.5) stage = 3;    // Severe Hyperkalemia
    else stage = 4;                  // Sine Wave

    // 2. Apply Calcium Shield (Membrane Stabilization)
    // If patient is protected, the ECG "looks" better than the K level implies.
    // However, Calcium does NOT correct T-waves (repolarization). It corrects QRS widening (depolarization).
    // Rule: If Stage > 1 (QRS issues start), force back to Stage 1.
    if (isProtected && stage > 1) {
        return 1;
    }

    return stage;
};

export const usePatientEngine = (onLog = () => { }, initialData = null) => {
    // Merge initialData with defaults to ensure all fields (like physiology) exist
    // even if the scenario file only provides partial data (e.g. labs/vitals).
    const [patient, setPatient] = useState(() => {
        if (!initialData) return INITIAL_PATIENT_STATE;
        return {
            ...INITIAL_PATIENT_STATE,
            ...initialData,
            vitals: { ...INITIAL_PATIENT_STATE.vitals, ...initialData.vitals },
            labs: { ...INITIAL_PATIENT_STATE.labs, ...initialData.labs },
            // Ensure physiology is present even if not in initialData
            physiology: { ...INITIAL_PATIENT_STATE.physiology, ...initialData.physiology }
        };
    });
    const timeRef = useRef(0); // Tracks total seconds

    // --- Actions ---

    const applyAction = useCallback((actionType) => {
        setPatient(prev => {
            const newPhys = { ...prev.physiology };
            const newLabs = { ...prev.labs };
            const newVitals = { ...prev.vitals };
            let logMessage = "";

            switch (actionType) {
                case "GLUCONATO_CALCIO":
                    newPhys.membraneStability = 100;
                    logMessage = "Infusão de Cálcio. Estabilização de membrana iniciada.";
                    break;

                case "SOLUCAO_POLARIZANTE":
                    newPhys.kShiftRate = -0.05;
                    logMessage = "Solução polarizante em curso. Monitorando glicemia.";
                    if (newLabs.gl < 70) {
                        logMessage += " ALERTA: Hipo iminente.";
                    }
                    break;

                case "EXPANSAO_VOLUMETRICA":
                    const currentBP = parseBP(newVitals.bp);
                    const newSys = Math.min(140, currentBP.sys + 10);
                    const newDia = Math.min(90, currentBP.dia + 5);
                    newVitals.bp = formatBP(newSys, newDia);
                    newPhys.fluidBalance += 500;

                    logMessage = "Volume infundido.";
                    if (newPhys.fluidBalance > 1000) {
                        const drop = Math.floor((newPhys.fluidBalance - 1000) / 500); // 1% drop per extra 500ml roughly, or handled in tick
                        // Immediate effect or start trend?
                        // Prompt says: "sats começa a cair" -> handled in tick
                        logMessage += " Paciente refere dispneia súbita! Estertores audíveis.";
                    }
                    break;

                case "DIALISE":
                    newLabs.k = 4.0;
                    newPhys.kShiftRate = 0; // Reset shifts
                    logMessage = "Sessão de hemodiálise concluída. Distúrbios corrigidos.";
                    break;

                default:
                    break;
            }

            if (logMessage) onLog(logMessage);

            return {
                ...prev,
                vitals: newVitals,
                labs: newLabs,
                physiology: newPhys
            };
        });
    }, [onLog]);

    // --- Simulation Loop ---

    useEffect(() => {
        const timer = setInterval(() => {
            timeRef.current += 1;
            const seconds = timeRef.current;

            setPatient(prev => {
                let { vitals, labs, physiology } = prev;

                // Clone deep enough to modify
                vitals = { ...vitals }; // BP is string now, shallow copy ok for property
                labs = { ...labs };
                physiology = { ...physiology };

                // 1. Natural Deterioration & Metabolism
                // K+ rises +0.02 every minute (60 seconds)
                if (seconds % 60 === 0) {
                    // Basal rise
                    labs.k += 0.02;

                    // Apply Shift (Polarizing solution effect)
                    if (physiology.kShiftRate !== 0) {
                        labs.k += physiology.kShiftRate;
                    }

                    // Clamp K to reasonable limits for game
                    labs.k = Math.max(2.0, Math.min(12.0, labs.k));

                    // Membrane stability decay (-5 per minute)
                    if (physiology.membraneStability > 0) {
                        physiology.membraneStability = Math.max(0, physiology.membraneStability - 5);
                    }
                }

                // 2. Physiological Consequences

                // HR Drop Risk (Unstable + High K)
                if (physiology.membraneStability === 0 && labs.k > 7.0) {
                    // Every 10 seconds, drop 1 bpm
                    if (seconds % 10 === 0) {
                        vitals.hr = Math.max(20, vitals.hr - 1);
                    }
                }

                // Pulmonary Edema (Fluid Overload)
                if (physiology.fluidBalance > 1000) {
                    // Drop 1% sats every tick (aggressive as requested: "a cada tick")
                    // Adjusted to be slightly playable: maybe every 2-3 seconds or check prompt "a cada tick" literally?
                    // "vitals.sats começa a cair 1% a cada tick" -> Literal interpretation
                    vitals.sats = Math.max(50, vitals.sats - 1);

                    // Reflex Tachypnea
                    vitals.resp = Math.min(40, vitals.resp + 0.1);
                }

                // Rounding for UI cleanliness
                labs.k = Math.round(labs.k * 100) / 100;
                vitals.resp = Math.round(vitals.resp);

                return { vitals, labs, physiology };
            });

        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return {
        patient,
        applyAction,
        getECGStage: () => getECGStage(patient.labs, patient.physiology)
    };
};
