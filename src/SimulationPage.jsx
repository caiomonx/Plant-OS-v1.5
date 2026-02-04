import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Activity,
    Heart,
    Droplet,
    Monitor,
    Pill,
    Syringe,
    AlertCircle,
    CheckCircle2,
    Scale,
    Stethoscope,
    TestTube,
    Zap,
    Thermometer,
    Timer,
    Check,
    Wind,
    Lock
} from 'lucide-react';
import useSimulation from './hooks/useSimulation';
import { scenarioData } from './data/scenarios/hyperkalemia';
// import { ecgPatterns } from './data/ecgData'; // OLD
import { ecgPatterns } from './data/ecgPaths'; // NEW Vectors
import LabRibbon from './components/LabRibbon';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// New Architecture Components
import MonitorShell from './components/layout/MonitorShell';
import ECGCanvas from './components/visuals/ECGCanvas';
import VitalBox from './components/data/VitalBox';
import useMonitorBoot from './hooks/useMonitorBoot';
import { ecgArrays } from './data/ecgArrays';
import { Loader2 } from 'lucide-react';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- CONSTANTS ---
// Strict Whitelist of actions that disable after use.
// ALL other actions (labs, drugs, fluids) remain enabled indefinitely.
const SINGLE_USE_IDS = [
    'exam_ecg',
    'exam_dialysis',
    'proc_monitor',
    'proc_iv_access',
    'proc_sonda'
];

// --- ICON MAPPING COMPONENT ---
const RenderActionIcon = ({ iconString }) => {
    switch (iconString) {
        case 'water':
            return <Droplet size={18} className="text-cyan-400 fill-current" />;
        case 'blood':
            return <Droplet size={18} className="text-red-600 fill-current" />;
        case 'urine':
            return <Droplet size={18} className="text-yellow-400 fill-current" />;
        case 'wind':
            return <Wind size={18} className="text-slate-200" />;
        case 'syringe':
            return <Syringe size={18} className="text-emerald-500" />;
        case 'pill':
            return <Pill size={18} className="text-purple-400" />;
        case 'ecg':
            return <Activity size={18} className="text-yellow-400" />;
        case 'monitor':
            return <Monitor size={18} className="text-blue-400" />;
        default:
            return <Activity size={18} className="text-slate-400" />;
    }
};

export default function SimulationPage() {
    const navigate = useNavigate();
    const { gameState, executeAction, logs } = useSimulation(scenarioData);
    const [activeTab, setActiveTab] = useState('CONDUTAS');
    const [showLabs, setShowLabs] = useState(false);

    // Logic for Fluid Dosing Submenu
    const [selectedFluid, setSelectedFluid] = useState(null);

    const logsEndRef = useRef(null);

    // --- MONITOR BOOT LOGIC ---
    const {
        bootStatus,
        showGrid,
        showWaves,
        showVitals,
        startBootSequence
    } = useMonitorBoot();

    // Trigger boot when game status changes to monitored
    useEffect(() => {
        if (gameState.status.isMonitored && bootStatus === 'OFF') {
            startBootSequence();
        }
    }, [gameState.status.isMonitored, bootStatus, startBootSequence]);

    useEffect(() => {
        logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [logs]);

    // Defensive Check for Game State
    if (!gameState || !gameState.vitals) {
        return (
            <div className="h-screen w-full bg-slate-950 flex flex-col items-center justify-center text-slate-400 gap-4">
                <Activity className="animate-pulse text-cyan-500" size={48} />
                <span className="font-mono text-sm tracking-widest uppercase">Carregando Simulação...</span>
            </div>
        );
    }

    const { vitals, status, timeElapsed, patientName, age, history, weight, executedActionIds = [], physiology } = gameState;
    const isAlive = vitals.hr > 0;

    // --- DYNAMIC ECG LOGIC ---
    const currentStage = physiology?.ecgStage || 0;

    // Safety check for calculated stage
    const safeStage = ecgPatterns[currentStage] ? currentStage : 0;
    const currentVectors = ecgPatterns[safeStage];

    // --- VISIBILITY LOGIC ---
    // User Requirement: "Monitorizar" shows numbers, but "ECG" shows waves.
    // If Monitor is ON but ECG Exam NOT requested -> Show Baseline (Flatline).
    // If Monitor is OFF -> Handled by Shell (Black Screen).
    const hasECGExam = executedActionIds.includes('exam_ecg');

    // Flatline vector for baseline
    const FLATLINE_PATH = "M 0 50 L 100 50";

    // Select vectors based on exam status
    const visibleVectors = hasECGExam ? currentVectors : {
        DI: FLATLINE_PATH,
        DII: FLATLINE_PATH,
        V1: FLATLINE_PATH
    };

    // Critical alert for Stage 3 (No P) and 4 (Sine Wave)
    const isCriticalECG = currentStage >= 3;

    // --- TABS VISUAL CONFIG (Theming) ---
    const tabs = [
        {
            id: 'CONDUTAS',
            label: 'Condutas',
            icon: Activity,
            theme: {
                text: 'text-red-500',
                border: 'border-red-500',
                bgActive: 'bg-red-950/30',
                hover: 'hover:border-red-500/50',
                btnBorder: 'border-red-900/40 hover:border-red-500',
                indicator: 'bg-red-500'
            }
        },
        {
            id: 'DROGAS',
            label: 'Medicamentos',
            icon: Pill,
            theme: {
                text: 'text-purple-500',
                border: 'border-purple-500',
                bgActive: 'bg-purple-950/30',
                hover: 'hover:border-purple-500/50',
                btnBorder: 'border-purple-900/40 hover:border-purple-500',
                indicator: 'bg-purple-500'
            }
        },
        {
            id: 'FLUIDOS',
            label: 'Fluidos',
            icon: Droplet,
            theme: {
                text: 'text-cyan-400',
                border: 'border-cyan-400',
                bgActive: 'bg-cyan-950/30',
                hover: 'hover:border-cyan-400/50',
                btnBorder: 'border-cyan-900/40 hover:border-cyan-400',
                indicator: 'bg-cyan-400'
            }
        },
    ];

    const currentTheme = tabs.find(t => t.id === activeTab)?.theme || tabs[0].theme;

    // Filter Actions
    const activeActions = scenarioData.availableActions.filter(action => {
        if (activeTab === 'CONDUTAS') {
            return action.type === 'Exames' || action.type === 'Procedimentos';
        }
        // Match the ID "DROGAS/FLUIDOS" from tabs with the "Drogas/Fluidos" type in data
        const formattedTab = activeTab.charAt(0) + activeTab.slice(1).toLowerCase();
        return action.type === formattedTab;
    });

    // Handle Action Click
    const handleActionClick = (action) => {
        // Special Logic for Labs
        if (action.id === 'exam_labs') {
            setShowLabs(true); // Always show, no toggle
            // Always execute to trigger new snapshot (update time/cost)
            executeAction(action.id);
            return;
        }

        if (activeTab === 'FLUIDOS') {
            setSelectedFluid(action); // Show submenu
        } else {
            executeAction(action.id);
        }
    };

    // Handle Fluid Dose Confirmation
    const handleDoseSelection = (doseLabel, cost) => {
        if (!selectedFluid) return;

        executeAction(selectedFluid.id, {
            label: `${selectedFluid.label} - ${doseLabel}`,
            cost: cost
        });
        setSelectedFluid(null); // Return to list
    };

    // Helper to format time
    const formatTime = (minutes) => {
        const hrs = Math.floor(minutes / 60);
        const mins = minutes % 60;
        return `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}`;
    };

    // --- DATA PROCESSING ---
    const calculateMAP = (bpString) => {
        if (!bpString) return 0;
        const [sys, dia] = bpString.split('/').map(Number);
        if (isNaN(sys) || isNaN(dia)) return 0;
        return Math.round((sys + (2 * dia)) / 3);
    };

    const pam = calculateMAP(vitals.bp);

    // Check if ECG leads are connected (simulated by requesting ECG exam)
    const hasECG = executedActionIds.includes('exam_ecg');

    // ECG Data Selection
    // If not connected, show baseline (flatline constant at 50)
    // If connected, show pattern
    const flatLine = new Array(100).fill(50);
    const waveData = hasECG ? ecgArrays[currentStage] : flatLine;


    return (
        <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans text-slate-100">

            {/* ======================= LEFT WORKSPACE (70-75%) ======================= */}
            <div className="flex-1 flex flex-col h-full border-r border-slate-900">

                {/* --- TOP: CONTROLS (40%) --- */}
                <div className="h-[40%] flex flex-col bg-slate-900/80 relative z-30">

                    {/* Tabs Header - Compact */}
                    <div className="flex bg-slate-950 border-b border-slate-800 shadow-md">
                        <button
                            onClick={() => navigate('/modulos')}
                            className="w-14 flex items-center justify-center text-slate-500 hover:text-white hover:bg-slate-800 transition-colors border-r border-slate-800"
                        >
                            <ArrowLeft size={20} />
                        </button>
                        {tabs.map((tab) => {
                            const isActive = activeTab === tab.id;
                            const Icon = tab.icon;
                            // Dynamic Theme Classes
                            const activeClass = isActive
                                ? `bg-slate-900 text-white ${tab.theme.border} border-b-2`
                                : "text-slate-500 hover:text-slate-300 hover:bg-slate-900 border-transparent border-b-2";

                            return (
                                <button
                                    key={tab.id}
                                    onClick={() => { setActiveTab(tab.id); setSelectedFluid(null); }}
                                    className={cn(
                                        "flex-1 flex items-center justify-center gap-2 py-3 text-sm font-bold uppercase tracking-widest transition-all",
                                        activeClass
                                    )}
                                >
                                    <Icon size={16} className={isActive ? tab.theme.text : ""} />
                                    {tab.label}
                                </button>
                            );
                        })}
                    </div>

                    {/* Action Grid OR Dosing Submenu */}
                    <div className="flex-1 overflow-y-auto p-4 relative bg-slate-900">
                        {/* LAB RIBBON (Overlays Controls Bottom) */}
                        <LabRibbon visible={showLabs} labs={gameState.labs} onClose={() => setShowLabs(false)} />

                        {/* FLUID DOSING SUBMENU */}
                        {activeTab === 'FLUIDOS' && selectedFluid ? (
                            <div className="absolute inset-0 z-20 bg-slate-900 p-6 flex flex-col items-center justify-center animate-in fade-in slide-in-from-bottom-4 duration-300">
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <Droplet className="text-cyan-400" />
                                    {selectedFluid.label}
                                </h3>
                                <div className="grid grid-cols-4 gap-4 w-full max-w-2xl">
                                    {[
                                        { l: '250ml', c: 15 },
                                        { l: '500ml', c: 30 },
                                        { l: '1000ml', c: 60 },
                                        { l: 'Bolus Rapido', c: 5 }
                                    ].map((opt) => (
                                        <button
                                            key={opt.l}
                                            onClick={() => handleDoseSelection(opt.l, opt.c)}
                                            className="px-6 py-4 bg-slate-800 border border-cyan-900/50 hover:border-cyan-400 text-cyan-100 font-bold rounded-xl hover:bg-cyan-950/20 transition-all shadow-lg active:scale-95 flex flex-col items-center gap-1"
                                        >
                                            <span className="text-lg">{opt.l}</span>
                                            <span className="text-xs text-cyan-600">+{opt.c}min</span>
                                        </button>
                                    ))}
                                </div>
                                <button
                                    onClick={() => setSelectedFluid(null)}
                                    className="mt-8 text-slate-500 hover:text-white underline text-sm"
                                >
                                    Cancelar Voltar
                                </button>
                            </div>
                        ) : (
                            /* NORMAL GRID */
                            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                                {activeActions.map((action) => {

                                    // ---- BUTTON STATE LOGIC ----
                                    const isDone = executedActionIds.includes(action.id);
                                    const isSingleUse = SINGLE_USE_IDS.includes(action.id);

                                    // Condition 1: Block by IV Access
                                    const needsIV = action.requiresIV && !status.hasIVAccess;

                                    // Condition 2: Block by Single Use Completion
                                    const isCompletedSingleUse = isSingleUse && isDone;

                                    const shouldDisable = needsIV || isCompletedSingleUse;

                                    // Determine disable reason for UI feedback
                                    const disableReason = needsIV ? 'needs_iv' : (isCompletedSingleUse ? 'completed' : null);

                                    return (
                                        <button
                                            key={action.id}
                                            onClick={() => !shouldDisable && handleActionClick(action)}
                                            disabled={shouldDisable}
                                            className={cn(
                                                "group relative flex flex-col p-4 rounded-xl border bg-slate-800 transition-all text-left shadow-md",
                                                shouldDisable
                                                    ? "opacity-50 cursor-not-allowed border-slate-700 bg-slate-800/50"
                                                    : `hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0 active:shadow-sm ${currentTheme.btnBorder}`
                                            )}
                                        >
                                            <div className="flex justify-between items-start w-full mb-3">
                                                <div className={cn(
                                                    "p-1.5 rounded-md",
                                                    shouldDisable ? "bg-slate-800 text-slate-500" : `bg-slate-950 ${currentTheme.text}`
                                                )}>
                                                    <RenderActionIcon iconString={action.icon} />
                                                </div>

                                                <div className="flex items-center gap-1">
                                                    {/* LOCK ICON for IV Block */}
                                                    {disableReason === 'needs_iv' && (
                                                        <span className="text-red-500 bg-red-950/30 p-0.5 rounded mr-1">
                                                            <Lock size={14} strokeWidth={2} />
                                                        </span>
                                                    )}

                                                    {/* CHECK ICON for Completed Single Use */}
                                                    {disableReason === 'completed' && (
                                                        <span className="text-green-500 bg-green-950/30 p-0.5 rounded mr-1">
                                                            <Check size={14} strokeWidth={3} />
                                                        </span>
                                                    )}

                                                    {/* TIME COST - IMPROVED VISIBILITY */}
                                                    <span className={cn(
                                                        "text-lg font-bold font-mono px-2 py-0.5 rounded",
                                                        shouldDisable ? "text-slate-600 bg-slate-800" : "text-teal-300 bg-teal-950/40"
                                                    )}>
                                                        +{action.cost}m
                                                    </span>
                                                </div>
                                            </div>

                                            <h3 className={cn(
                                                "font-bold text-sm leading-snug",
                                                shouldDisable ? "text-slate-500" : "text-slate-200 group-hover:text-white"
                                            )}>
                                                {action.label}
                                            </h3>

                                        </button>
                                    )
                                })}
                                {activeActions.length === 0 && (
                                    <div className="col-span-full h-32 flex items-center justify-center text-slate-600 italic">
                                        Nenhuma ação disponível.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>


                {/* --- BOTTOM: MONITOR (60%) --- */}
                <div className="h-[60%] w-full bg-black relative border-t border-slate-800 p-4 flex">

                    <MonitorShell className="w-full h-full">

                        {/* 1. OFF STATE */}
                        {bootStatus === 'OFF' && (
                            <div className="w-full h-full flex flex-col items-center justify-center text-slate-800 z-10 transition-opacity duration-300">
                                <Activity size={64} className="mb-4 opacity-20" />
                                <h2 className="text-xl tracking-[0.3em] font-bold uppercase text-slate-800/50">Monitor Desligado</h2>
                            </div>
                        )}

                        {/* 2. BOOTING STATE */}
                        {bootStatus === 'BOOTING' && !showGrid && (
                            <div className="absolute inset-0 flex items-center justify-center z-50">
                                <div className="flex flex-col items-center gap-4">
                                    <Loader2 className="animate-spin text-teal-500" size={48} />
                                    <span className="text-teal-500 font-mono text-sm tracking-widest animate-pulse">INICIALIZANDO SISTEMA...</span>
                                </div>
                            </div>
                        )}

                        {/* 3. ACTIVE/GRID STATE */}
                        {/* Grid is handled by MonitorShell CSS, but we toggle visibility via content opacity or similar if we want progressive reveal */}

                        {(bootStatus === 'BOOTING' || bootStatus === 'ACTIVE') && (
                            <div className={cn("w-full h-full flex relative z-20 transition-all duration-1000", showGrid ? "opacity-100" : "opacity-0")}>

                                {/* WAVES COLUMN (75%) */}
                                <div className="w-[75%] h-full flex flex-col border-r border-slate-800/50">
                                    {/* DI */}
                                    <div className="flex-1 border-b border-slate-800/30 relative overflow-hidden group">
                                        <span className="absolute top-2 left-2 text-teal-600/50 font-bold text-xs font-mono z-10">I</span>
                                        {showWaves && <ECGCanvas pathData={visibleVectors.DI} speed={2} color="#14b8a6" className="opacity-90" />}
                                    </div>
                                    {/* DII */}
                                    <div className="flex-1 border-b border-slate-800/30 relative overflow-hidden">
                                        <span className="absolute top-2 left-2 text-teal-600/50 font-bold text-xs font-mono z-10">II</span>
                                        {showWaves && <ECGCanvas pathData={visibleVectors.DII} speed={2} color="#14b8a6" className="opacity-90" />}
                                    </div>
                                    {/* V1 */}
                                    <div className="flex-1 relative overflow-hidden">
                                        <span className="absolute top-2 left-2 text-teal-600/50 font-bold text-xs font-mono z-10">V1</span>
                                        {showWaves && <ECGCanvas pathData={visibleVectors.V1} speed={2} color="#14b8a6" className="opacity-90" />}
                                    </div>
                                </div>

                                {/* VITALS COLUMN (25%) */}
                                <div className="w-[25%] h-full flex flex-col p-4 gap-3 bg-slate-950/30">

                                    {/* CLOCK */}
                                    <div className={cn("flex justify-end mb-2 transition-all duration-700", showVitals ? "opacity-100 translate-x-0" : "opacity-0 translate-x-4")}>
                                        <div className="flex items-center gap-2 bg-slate-900/80 px-3 py-1 rounded border border-slate-800/50">
                                            <Timer size={14} className="text-teal-500" />
                                            <span className="font-mono text-teal-400 text-lg font-bold tracking-widest">
                                                {formatTime(timeElapsed)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* VITAL BOXES */}
                                    <div className={cn("flex-1 flex flex-col gap-2 transition-all duration-1000 delay-300", showVitals ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>

                                        <VitalBox
                                            label="FC"
                                            value={vitals.hr}
                                            unit="bpm"
                                            icon={Heart}
                                            color="text-green-500"
                                            isAlarming={vitals.hr < 40 || vitals.hr > 120}
                                        />

                                        <VitalBox
                                            label="PA"
                                            value={vitals.bp}
                                            subValue={`(${pam})`}
                                            icon={Activity}
                                            color="text-yellow-500"
                                        />

                                        <VitalBox
                                            label="SpO2"
                                            value={vitals.sah}
                                            unit="%"
                                            icon={Droplet}
                                            color="text-sky-500"
                                            isAlarming={vitals.sah < 90}
                                        />

                                        <div className="flex gap-2">
                                            <div className="flex-1">
                                                <VitalBox label="FR" value={vitals.rr || 18} icon={Wind} color="text-teal-500" />
                                            </div>
                                            <div className="flex-1">
                                                <VitalBox label="Temp" value={vitals.temp || 36.5} icon={Thermometer} color="text-rose-500" />
                                            </div>
                                        </div>

                                    </div>
                                </div>

                            </div>
                        )}

                    </MonitorShell>

                </div>

            </div>

            {/* ======================= RIGHT SIDEBAR (Fixed Width) ======================= */}
            <div className="w-[350px] bg-slate-900 border-l border-slate-800 flex flex-col shadow-2xl z-40 relative">

                {/* Patient Header */}
                <div className="bg-slate-950 p-6 border-b border-slate-800">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white leading-tight">{patientName}</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded font-mono font-bold">{age} ANOS</span>
                                <span className="bg-slate-800 text-slate-400 text-xs px-2 py-0.5 rounded font-mono font-bold">{weight || "70kg"}</span>
                            </div>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700">
                            <span className="text-xs font-bold text-slate-500">ID</span>
                        </div>
                    </div>

                    {/* HISTORY - RESTORED VISUAL */}
                    <div className="bg-slate-800/50 border-l-4 border-teal-500 rounded-r-lg p-4 mt-4">
                        <p className="text-slate-100 font-medium text-sm leading-relaxed">
                            "{history}"
                        </p>
                    </div>

                    {/* Status Indicators */}
                    <div className="flex flex-col gap-2 mt-4">
                        <div className={cn(
                            "flex items-center justify-between px-3 py-2 rounded border text-xs font-bold transition-all",
                            status.hasIVAccess
                                ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                                : "bg-rose-950/30 border-rose-900/50 text-rose-400"
                        )}>
                            <div className="flex items-center gap-2">
                                {status.hasIVAccess ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
                                <span>Acesso Venoso</span>
                            </div>
                            <span className="opacity-70">{status.hasIVAccess ? "Estabelecido" : "Ausente"}</span>
                        </div>
                    </div>
                </div>

                {/* Log Feed */}
                <div className="flex-1 flex flex-col bg-slate-950/50 overflow-hidden">
                    <div className="p-3 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-500">Log de Eventos</span>
                        <div className="w-2 h-2 rounded-full bg-cyan-500 animate-pulse"></div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-5">
                        {logs.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-slate-700 text-sm italic opacity-60">
                                <span>A simulação começou.</span>
                                <span>Aguardando condutas...</span>
                            </div>
                        ) : (
                            logs.map((log, idx) => (
                                <div key={idx} className="relative pl-6">
                                    {/* Timeline Line */}
                                    {idx !== logs.length - 1 && (
                                        <div className="absolute left-[3px] top-2 bottom-[-24px] w-[2px] bg-slate-800"></div>
                                    )}

                                    {/* Timeline Dot */}
                                    <div className={cn(
                                        "absolute left-[-1px] top-1.5 w-2.5 h-2.5 rounded-full border-2 border-slate-950 z-10",
                                        log.type === 'error' ? 'bg-red-500' : 'bg-cyan-500'
                                    )}></div>

                                    <div className="flex flex-col">
                                        <div className="flex items-baseline justify-between mb-0.5">
                                            <span className="text-slate-200 text-sm font-bold leading-tight">
                                                {log.text}
                                            </span>
                                            <span className="text-cyan-600 font-mono text-[10px] bg-cyan-950/20 px-1 py-0.5 rounded ml-2 whitespace-nowrap">
                                                {log.time}
                                            </span>
                                        </div>
                                        <span className={cn(
                                            "text-xs leading-snug",
                                            log.type === 'error' ? "text-red-400 italic" : "text-slate-500"
                                        )}>
                                            {log.consequence}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                        <div ref={logsEndRef} />
                    </div>
                </div>

            </div>
        </div>
    );
}
