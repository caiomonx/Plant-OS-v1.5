import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    ArrowLeft,
    BarChart2,
    FlaskConical,
    Braces, // Fallback for BriefcaseMedical if not strictly available or similar
    BriefcaseMedical, // Ensure this exists in your lucid version or fallback
    Activity,
    Play
} from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// --- MOCK DATA ---
const MODULES_DATA = [
    {
        id: 'sodium',
        title: "Distúrbios do Sódio",
        category: "Hidroeletrolíticos",
        difficulty: 3,
        description: "Estudo clínico aprofundado sobre Hiponatremia e Hipernatremia, diagnósticos diferenciais e protocolos de manejo.",
        icon: 'flask', // FlaskConical
        color: 'cyan',
    },
    {
        id: 'potassium',
        title: "Distúrbios do Potássio",
        category: "Hidroeletrolíticos",
        difficulty: 4,
        description: "Manejo crítico de arritmias, reposição segura e identificação de sinais no ECG. Casos reais e simulações.",
        icon: 'case', // BriefcaseMedical
        color: 'emerald',
    },
    {
        id: 'ecg',
        title: "ECG Básico",
        category: "Cardiologia",
        difficulty: 2,
        description: "Identificação sistemática de ritmos, intervalos e ondas principais. O guia definitivo para o clínico geral.",
        icon: 'wave', // Activity
        color: 'rose',
    }
];

// --- ICONS MAPPING ---
const ModuleIcon = ({ name, size = 24, className }) => {
    switch (name) {
        case 'flask': return <FlaskConical size={size} className={className} />;
        case 'case': return <BriefcaseMedical size={size} className={className} />;
        case 'wave': return <Activity size={size} className={className} />;
        default: return <Activity size={size} className={className} />;
    }
};

const COLOR_MAP = {
    cyan: 'text-cyan-400',
    emerald: 'text-emerald-400',
    rose: 'text-rose-400',
    bg_cyan: 'bg-cyan-400',
    bg_emerald: 'bg-emerald-400',
    bg_rose: 'bg-rose-400',
};

import PageTransition from './components/PageTransition';

export default function ModulesPage() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeFilter, setActiveFilter] = useState('Todos');

    // Filter Logic
    const filteredModules = useMemo(() => {
        return MODULES_DATA.filter(module => {
            const matchesSearch = module.title.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesCategory = activeFilter === 'Todos' || module.category === activeFilter;
            return matchesSearch && matchesCategory;
        });
    }, [searchTerm, activeFilter]);

    // Group by Category for displaying sections
    const groupedModules = useMemo(() => {
        const groups = {};
        filteredModules.forEach(mod => {
            if (!groups[mod.category]) groups[mod.category] = [];
            groups[mod.category].push(mod);
        });
        return groups;
    }, [filteredModules]);

    const handlePlay = (mod) => {
        if (mod.id === 'potassium') {
            navigate('/potassio');
        } else {
            // For now, only potassium is active
            alert("Módulo em desenvolvimento.");
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-[#11131F] pb-8 font-sans text-slate-100">

                {/* --- HEADER --- */}
                <div className="sticky top-0 z-30 bg-[#11131F]/90 backdrop-blur-md pt-6 pb-4 px-6 space-y-6">

                    {/* Top Row */}
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="text-slate-400 hover:text-white transition-colors"
                            >
                                <ArrowLeft size={24} />
                            </button>
                            <h1 className="text-2xl font-bold text-white">
                                Módulos de Estudo
                            </h1>
                        </div>

                        <button
                            onClick={() => navigate('/estatisticas')}
                            className="flex items-center gap-2 bg-slate-900 border border-slate-800 hover:border-teal-900/50 hover:bg-slate-800 transition-all px-4 py-2 rounded-full group"
                        >
                            <BarChart2 size={16} className="text-teal-500 group-hover:scale-110 transition-transform" />
                            <span className="text-xs font-bold text-teal-500">Meu Progresso</span>
                        </button>
                    </div>

                    {/* Search Bar */}
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-teal-500 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Pesquise por tema ou módulo..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-slate-900 border border-transparent focus:border-slate-700 rounded-2xl py-4 pl-12 pr-4 text-slate-200 placeholder-slate-600 focus:outline-none focus:ring-1 focus:ring-slate-700 transition-all shadow-inner"
                        />
                    </div>

                    {/* Filters */}
                    <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                        {['Todos', 'Hidroeletrolíticos', 'Cardiologia', 'Nefrologia'].map(filter => {
                            const isActive = activeFilter === filter;
                            return (
                                <button
                                    key={filter}
                                    onClick={() => setActiveFilter(filter)}
                                    className={cn(
                                        "px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all",
                                        isActive
                                            ? "bg-teal-500 text-slate-950 shadow-lg shadow-teal-500/20"
                                            : "bg-slate-800 text-slate-500 hover:bg-slate-700 hover:text-slate-300"
                                    )}
                                >
                                    {filter}
                                </button>
                            )
                        })}
                    </div>
                </div>

                {/* --- CONTENT --- */}
                <div className="px-6 space-y-8 mt-2">

                    {Object.keys(groupedModules).length > 0 ? Object.entries(groupedModules).map(([category, modules]) => (
                        <section key={category} className="space-y-4">

                            {/* Section Title */}
                            <div className="flex items-center gap-3">
                                <div className="w-1 h-6 rounded-full bg-teal-500 shadow-[0_0_10px_rgba(20,184,166,0.5)]"></div>
                                <h2 className="text-lg font-bold text-white tracking-wide">{category}</h2>
                            </div>

                            {/* Modules List */}
                            <div className="space-y-4">
                                {modules.map(module => (
                                    <div
                                        key={module.id}
                                        className="relative group bg-slate-800/40 border border-white/5 rounded-3xl p-6 overflow-hidden hover:bg-slate-800/60 transition-all duration-300"
                                    >
                                        {/* Watermark Icon */}
                                        <div className="absolute -top-4 -right-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity duration-500 rotate-12 scale-150 pointer-events-none">
                                            <ModuleIcon name={module.icon} size={180} />
                                        </div>

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col gap-4">

                                            <div>
                                                <div className="flex justify-between items-start">
                                                    <h3 className="text-xl font-bold text-white mb-2 max-w-[80%] leading-tight">
                                                        {module.title}
                                                    </h3>

                                                    {/* Corner Icon (Optional small one) */}
                                                    <div className={cn("p-2 rounded-lg bg-white/5", COLOR_MAP[module.color])}>
                                                        <ModuleIcon name={module.icon} size={24} />
                                                    </div>
                                                </div>

                                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2">
                                                    {module.description}
                                                </p>
                                            </div>

                                            {/* Divider */}
                                            <div className="h-px w-full bg-white/5"></div>

                                            {/* Footer */}
                                            <div className="flex items-end justify-between">

                                                {/* Difficulty */}
                                                <div className="flex flex-col gap-1.5">
                                                    <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">
                                                        Dificuldade
                                                    </span>
                                                    <div className="flex gap-1">
                                                        {[1, 2, 3, 4, 5].map(level => {
                                                            const isFilled = level <= module.difficulty;
                                                            return (
                                                                <div
                                                                    key={level}
                                                                    className={cn(
                                                                        "w-1.5 h-4 rounded-full transition-colors",
                                                                        isFilled ? "bg-teal-500 shadow-[0_0_8px_rgba(20,184,166,0.4)]" : "bg-slate-700/50"
                                                                    )}
                                                                ></div>
                                                            )
                                                        })}
                                                    </div>
                                                </div>

                                                {/* Play Button */}
                                                <button
                                                    onClick={() => handlePlay(module)}
                                                    className="w-12 h-12 rounded-full bg-slate-700 flex items-center justify-center text-slate-400 hover:bg-teal-500 hover:text-slate-950 transition-all shadow-lg hover:shadow-teal-500/20 active:scale-90"
                                                >
                                                    <Play size={20} fill="currentColor" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    )) : (
                        <div className="text-center py-20 opacity-50">
                            <p>Nenhum módulo encontrado.</p>
                        </div>
                    )}
                </div>

            </div>
        </PageTransition>
    );
}
