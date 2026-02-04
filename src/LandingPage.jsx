import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Moon, GraduationCap, Stethoscope, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export default function LandingPage() {
    const [selectedPersona, setSelectedPersona] = useState(null); // 'interno' | 'residente'
    const navigate = useNavigate();

    useEffect(() => {
        const savedPersona = localStorage.getItem('plantao_os_persona');
        if (savedPersona) {
            setSelectedPersona(savedPersona);
        }
    }, []);

    const handlePersonaSelect = (persona) => {
        setSelectedPersona(persona);
        localStorage.setItem('plantao_os_persona', persona);
    };

    const handleStart = () => {
        if (selectedPersona) {
            navigate('/modulos');
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 flex flex-col font-sans text-slate-100 p-6 relative overflow-hidden">

            {/* --- Background Ambient Glows --- */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-[10%] -left-[10%] w-[50%] h-[50%] bg-teal-900/10 rounded-full blur-[120px]"></div>
                <div className="absolute top-[20%] -right-[10%] w-[40%] h-[40%] bg-cyan-900/10 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[30%] bg-gradient-to-t from-teal-950/20 to-transparent blur-3xl"></div>
            </div>

            {/* --- HEADER --- */}
            <div className="w-full max-w-md mx-auto flex items-center justify-end relative z-10 pt-4 mb-12">
                <button className="p-2.5 bg-slate-900/50 backdrop-blur-sm border border-slate-800 rounded-full text-slate-400 hover:text-cyan-400 hover:border-cyan-900/50 transition-colors">
                    <Moon size={18} />
                </button>
            </div>

            {/* --- HERO --- */}
            <div className="w-full max-w-md mx-auto flex flex-col relative z-10 flex-1">
                <div className="mb-12 text-center mt-8">
                    <h2 className="text-7xl font-['Outfit'] font-black text-white mb-6 tracking-tighter drop-shadow-2xl">
                        Plantão
                        <span className={cn(
                            "transition-colors duration-300",
                            selectedPersona === 'interno' ? "text-teal-500" :
                                selectedPersona === 'residente' ? "text-cyan-500" :
                                    "text-teal-500" // Default to Teal as user disliked the Blue/Cyan default
                        )}>.OS</span>
                    </h2>
                    <p className="text-2xl font-['Outfit'] font-bold text-white drop-shadow-md tracking-normal whitespace-nowrap overflow-hidden text-ellipsis">
                        Simule com rigor, atue com maestria.
                    </p>
                </div>

                {/* --- SELECTION SECTION --- */}
                <div className="space-y-6 flex-1">
                    <div className="flex items-center gap-4">
                        <span className="text-[10px] font-bold tracking-[0.2em] text-slate-500 uppercase whitespace-nowrap">
                            SELECIONE O NÍVEL
                        </span>
                        <div className="h-[1px] bg-slate-800 w-full"></div>
                    </div>

                    <div className="space-y-4">
                        {/* INTERNO CARD */}
                        <button
                            onClick={() => handlePersonaSelect('interno')}
                            className={cn(
                                "w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group",
                                selectedPersona === 'interno'
                                    ? "bg-slate-900/80 border-teal-500 shadow-[0_0_20px_rgba(20,184,166,0.15)]"
                                    : "bg-slate-900/30 border-slate-800 hover:bg-slate-900/50 hover:border-slate-700"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={cn(
                                    "p-3 rounded-xl transition-colors",
                                    selectedPersona === 'interno' ? "bg-teal-950/30 text-teal-400" : "bg-slate-800 text-slate-500"
                                )}>
                                    <GraduationCap size={24} />
                                </div>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 transition-all",
                                    selectedPersona === 'interno' ? "border-teal-500 bg-teal-500" : "border-slate-700"
                                )}>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Interno</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Foco em diagnósticos básicos e condutas essenciais supervisionadas.
                            </p>
                        </button>

                        {/* RESIDENTE CARD */}
                        <button
                            onClick={() => handlePersonaSelect('residente')}
                            className={cn(
                                "w-full text-left p-5 rounded-2xl border transition-all duration-300 relative group",
                                selectedPersona === 'residente'
                                    ? "bg-slate-900/80 border-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.15)]"
                                    : "bg-slate-900/30 border-slate-800 hover:bg-slate-900/50 hover:border-slate-700"
                            )}
                        >
                            <div className="flex justify-between items-start mb-3">
                                <div className={cn(
                                    "p-3 rounded-xl transition-colors",
                                    selectedPersona === 'residente' ? "bg-cyan-950/30 text-cyan-400" : "bg-slate-800 text-slate-500"
                                )}>
                                    <Stethoscope size={24} />
                                </div>
                                <div className={cn(
                                    "w-5 h-5 rounded-full border-2 transition-all",
                                    selectedPersona === 'residente' ? "border-cyan-500 bg-cyan-500" : "border-slate-700"
                                )}>
                                </div>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-1">Residente</h3>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Casos complexos exigindo precisão técnica e tomada de decisão imediata.
                            </p>
                        </button>
                    </div>
                </div>

                {/* --- CTA FOOTER --- */}
                <div className="mt-8 mb-6">
                    <button
                        onClick={handleStart}
                        disabled={!selectedPersona}
                        className={cn(
                            "w-full py-4 rounded-xl font-bold text-base tracking-wide flex items-center justify-center gap-2 transition-all shadow-lg",
                            selectedPersona
                                ? cn(
                                    "text-white hover:scale-[1.01] active:scale-[0.98]",
                                    selectedPersona === 'interno' ? "bg-teal-500 hover:bg-teal-400 shadow-teal-500/20" :
                                        "bg-cyan-500 hover:bg-cyan-400 shadow-cyan-500/20"
                                )
                                : "bg-slate-800 text-slate-600 cursor-not-allowed shadow-none"
                        )}
                    >
                        <span>Iniciar Plantão</span>
                        <ArrowRight size={18} />
                    </button>
                </div>

            </div>
        </div>
    );
}
