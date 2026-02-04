import { cn } from '../../lib/utils';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

// MonitorShell Component
export default function MonitorShell({ children, className }) {
    return (
        <div className={cn(
            "relative w-full h-full overflow-hidden bg-slate-950 rounded-xl border-4 border-slate-900 shadow-2xl",
            "before:absolute before:inset-0 before:pointer-events-none before:z-50 before:shadow-[inset_0_0_80px_rgba(0,0,0,0.8)]", // Vignette
            "after:absolute after:inset-0 after:pointer-events-none after:z-50 after:bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] after:bg-[length:100%_2px,3px_100%] after:bg-repeat", // CRT Scanline effect (subtle)
            className
        )}>
            {/* Screen Glare/Reflection */}
            <div className="absolute top-0 right-0 w-2/3 h-full bg-gradient-to-l from-white/5 to-transparent skew-x-12 pointer-events-none z-40 mix-blend-overlay"></div>

            {/* Content Container */}
            <div className="relative z-10 w-full h-full flex">
                {children}
            </div>
        </div>
    );
}
