import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import {
    Activity,
    Wind,
    Scale,
    Droplet,
    FlaskConical,
    Candy,
    Zap,
    Atom,
    Hexagon,
    Gem // For Salt/Crystal
} from 'lucide-react';

function cn(...inputs) {
    return twMerge(clsx(inputs));
}

// Sub-component for a single lab metric
const LabMetric = ({ label, value, unit, icon: Icon, variant = 'default', colorClass = 'text-slate-300' }) => {
    return (
        <div className={cn(
            "flex items-center gap-2.5 px-3 py-1 rounded-lg border transition-all h-[42px]", // Reduced padding/height
            variant === 'highlight' && "bg-yellow-950/20 border-yellow-900/40 shadow-[0_0_10px_rgba(234,179,8,0.1)]",
            variant === 'default' && "bg-slate-800/50 border-slate-700/50",
            variant === 'subtle' && "bg-transparent border-transparent px-1"
        )}>
            {Icon && (
                <div className={cn(
                    "p-1.5 rounded-md flex-shrink-0", // Adjusted padding
                    variant === 'highlight' ? "bg-yellow-900/30 text-yellow-400" : "bg-slate-800 text-slate-400"
                )}>
                    <Icon size={14} className={colorClass} />
                </div>
            )}
            <div className="flex flex-col justify-center h-full pt-1">
                <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500 leading-none mb-0.5">{label}</span>
                <div className="flex items-baseline gap-1 leading-none">
                    <span className={cn(
                        "font-mono font-bold",
                        variant === 'highlight' ? "text-xl text-yellow-400" : "text-base text-slate-200",
                        colorClass
                    )}>
                        {value}
                    </span>
                    {unit && <span className="text-[8px] text-slate-600 font-bold self-end mb-0.5">{unit}</span>}
                </div>
            </div>
        </div>
    );
};

export default function LabRibbon({ visible, labs, onClose }) {
    // Fallsbacks
    const data = {
        k: labs?.k?.toFixed(1) || '—',
        mg: labs?.mg?.toFixed(1) || '1.9',
        ph: labs?.ph?.toFixed(2) || '7.32',
        pco2: labs?.pco2 || '35',
        hco3: labs?.hco3 || '18',
        cl: labs?.cl || '102',
        glucose: labs?.glucose || '145',
        creatinine: labs?.creatinin || '1.5'
    };

    return (
        <div
            className={cn(
                "absolute bottom-0 left-0 w-full z-40 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] bg-[#0a0a0a]/95 backdrop-blur-md border-t border-slate-800/80 shadow-[0_-10px_20px_-5px_rgba(0,0,0,0.5)]",
                visible ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0 pointer-events-none"
            )}
        >
            <div className="flex items-center justify-between px-4 py-2 max-w-[1400px] mx-auto h-[64px]">

                {/* 1. LEFT: POTASSIUM (HERO) */}
                <div className="flex items-center gap-4 pr-6 border-r border-slate-800/50">
                    <LabMetric
                        label="Potássio"
                        value={data.k}
                        unit="mEq/L"
                        icon={Zap}
                        variant="highlight"
                        colorClass="text-yellow-400"
                    />
                    <LabMetric
                        label="Magnésio"
                        value={data.mg}
                        unit="mg/dL"
                        icon={Atom}
                        colorClass="text-purple-400"
                    />
                </div>

                {/* 2. CENTER: METABOLISM */}
                <div className="flex items-center gap-4 px-6 md:flex-1 justify-center">
                    <LabMetric
                        label="Glicose"
                        value={data.glucose}
                        unit="mg/dL"
                        icon={Candy}
                        colorClass="text-cyan-400"
                    />
                    <LabMetric
                        label="Creatinina"
                        value={data.creatinine}
                        unit="mg/dL"
                        icon={FlaskConical}
                        colorClass="text-orange-400"
                    />
                </div>

                {/* 3. RIGHT: GASOMETRY (GROUPED) */}
                <div className="flex items-center gap-2 pl-6 border-l border-slate-800/50 bg-slate-900/20 rounded-xl px-4 py-1 border border-slate-800/30">
                    <div className="flex flex-col items-end mr-2">
                        <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">Gasometria</span>
                        <span className="text-[8px] text-slate-600">Arterial</span>
                    </div>

                    <div className="flex gap-3">
                        <LabMetric
                            label="pH"
                            value={data.ph}
                            variant="subtle"
                            icon={Scale}
                            colorClass="text-teal-300"
                        />
                        <div className="w-px h-6 bg-slate-800 my-auto"></div>
                        <LabMetric
                            label="pCO2"
                            value={data.pco2}
                            variant="subtle"
                            icon={Wind}
                            colorClass="text-slate-300"
                        />
                        <div className="w-px h-6 bg-slate-800 my-auto"></div>
                        <LabMetric
                            label="HCO3"
                            value={data.hco3}
                            variant="subtle"
                            icon={Gem} // Salt Crystal
                            colorClass="text-slate-300"
                        />
                        <div className="w-px h-6 bg-slate-800 my-auto"></div>
                        <LabMetric
                            label="Cloreto"
                            value={data.cl}
                            variant="subtle"
                            icon={Hexagon}
                            colorClass="text-slate-300"
                        />
                    </div>
                </div>

                {/* 4. CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    className="ml-4 p-1.5 rounded-full hover:bg-slate-800 text-slate-500 hover:text-white transition-colors"
                    title="Fechar Painel"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"></line>
                        <line x1="6" y1="6" x2="18" y2="18"></line>
                    </svg>
                </button>

            </div>

            {/* Elegant Top Accent Line */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-cyan-900/30 to-transparent"></div>
        </div>
    );
}
