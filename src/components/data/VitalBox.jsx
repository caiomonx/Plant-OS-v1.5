import React from 'react';
import { cn } from '../../lib/utils';

export default function VitalBox({
    label,
    value,
    unit,
    color = "text-teal-400",
    shadowColor = "shadow-teal-500/50",
    icon: Icon,
    isAlarming = false,
    subValue = null
}) {
    return (
        <div className={cn(
            "relative flex flex-col justify-center p-3 rounded-lg border-l-4 transition-all duration-300 overflow-hidden",
            // Base Style
            "bg-slate-900/40 border-slate-800",
            // Alarm Style (conditional)
            isAlarming
                ? "animate-pulse border-red-500 bg-red-950/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]"
                : `hover:bg-slate-900/60 ${color.replace('text-', 'border-').replace('400', '900')}/30`
        )}>
            {/* Header */}
            <div className="flex items-center gap-2 mb-1">
                {Icon && <Icon size={14} className={isAlarming ? "text-red-500" : color} />}
                <span className={cn(
                    "text-xs font-bold tracking-widest uppercase transition-colors",
                    isAlarming ? "text-red-400" : "text-slate-500"
                )}>
                    {label}
                </span>
            </div>

            {/* Value */}
            <div className="flex items-baseline gap-2">
                <span className={cn(
                    "text-4xl font-mono font-bold leading-none tracking-tighter transition-all",
                    // Text Color
                    isAlarming ? "text-red-500" : color,
                    // Glow Effect
                    isAlarming ? "drop-shadow-[0_0_10px_rgba(239,68,68,0.8)]" : `drop-shadow-[0_0_8px_rgba(var(--tw-shadow-color),0.5)]`
                )}
                // Inline style for dynamic colored shadow if needed, but Tailwind `shadow-color` needs custom config or specific utility. 
                // We'll trust the class passed or default.
                >
                    {value}
                </span>

                {(unit || subValue) && (
                    <div className="flex flex-col">
                        {unit && (
                            <span className={cn("text-xs font-bold opacity-70", isAlarming ? "text-red-400" : color)}>
                                {unit}
                            </span>
                        )}
                        {subValue && (
                            <span className={cn("text-lg font-mono font-bold opacity-80", isAlarming ? "text-red-400" : color)}>
                                {subValue}
                            </span>
                        )}
                    </div>
                )}
            </div>

            {/* Alarm Text Overlay (Optional) */}
            {isAlarming && (
                <div className="absolute top-2 right-2 flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                </div>
            )}
        </div>
    );
}
