import React, { useEffect, useRef } from 'react';
import { cn } from '../../lib/utils';

const ECGCanvas = ({
    pathData, // SVG "d" string for ONE cycle
    color = '#10b981',
    speed = 2, // Animation duration in seconds (lower = faster HR)
    className
}) => {
    // We create a "track" of 4 cycles to ensure it fills the generic view width
    const cycles = 4;

    // ViewBox Y Logic: 0 -30 400 160
    const viewWidth = cycles * 100;

    const maskRef = useRef(null);
    const headRef = useRef(null);

    // RAF Animation: "Progressive Draw"
    // Instead of a moving gap, we have a GROWING WINDOW.
    // Width goes from 0% to 100%.
    // At 100%, it snaps back to 0% (Clears screen).

    useEffect(() => {
        const mask = maskRef.current;
        const head = headRef.current;
        if (!mask || !head) return;

        let startTime = null;
        let animationFrameId;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const elapsed = timestamp - startTime;
            const cycleDuration = speed * 1000 * 2; // Slower because filling screen once takes longer than a gap passing?
            // Actually, keep standard speed.
            const realDuration = speed * 1000 * 2;

            const progress = (elapsed % realDuration) / realDuration;

            // Mask Width: 0% -> 100%
            const widthPct = progress * 100;

            // Mask Animation: Reveal Left to Right
            // clip-path: inset(top right bottom left)
            // We want to animate the RIGHT inset value.
            // Start: inset(0 100% 0 0) -> Right edge is at left (Hidden)
            // End: inset(0 0% 0 0) -> Right edge is at right (Visible)

            const rightInset = 100 - widthPct;

            // Apply Clip Path
            mask.style.clipPath = `inset(0 ${rightInset}% 0 0)`;

            // Move Head
            head.style.left = `${widthPct}%`;

            animationFrameId = requestAnimationFrame(animate);
        };

        animationFrameId = requestAnimationFrame(animate);

        return () => cancelAnimationFrame(animationFrameId);
    }, [speed]);

    return (
        <div
            className={cn("relative overflow-hidden bg-transparent w-full h-full", className)}
        >
            {/* The "Paper" is transparent. The "Trace" is revealed by the mask container. */}

            {/* OUTER DIV = The "Monitor Screen" */}
            {/* INNER DIV (Mask) = Controls visibility of the SVG inside */}
            <div
                ref={maskRef}
                className="absolute inset-0"
                style={{
                    // clip-path: inset(0 50% 0 0); -> shows left 50%.
                    // We animate the RIGHT value from 100% (Fully Hidden) to 0% (Fully Visible).
                    clipPath: 'inset(0 100% 0 0)',
                    willChange: 'clip-path'
                }}
            >
                <svg
                    viewBox={`0 -30 ${viewWidth} 160`}
                    preserveAspectRatio="none"
                    className="w-full h-full"
                    style={{
                        // CRT Glow
                        filter: `drop-shadow(0 0 3px ${color}) drop-shadow(0 0 6px ${color})`
                    }}
                >
                    {[...Array(cycles)].map((_, i) => (
                        <path
                            key={i}
                            d={pathData}
                            transform={`translate(${i * 100}, 0)`}
                            fill="none"
                            stroke={color}
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            vectorEffect="non-scaling-stroke"
                        />
                    ))}
                </svg>
            </div>

            {/* WRITE HEAD (The Pen Tip) */}
            {/* A small glowing dot that leads the line */}
            <div
                ref={headRef}
                className="absolute top-0 bottom-0 w-[2px] z-20 pointer-events-none"
                style={{
                    left: '0%',
                    willChange: 'left',
                    background: 'transparent', // The vertical line itself is invisible, just the 'dot'
                }}
            >
                {/* The Glowing Dot centered vertically */}
                {/* Positioned at top-1/2? No, ECG varies in height. 
                     We can't easily track Y position without complex logic.
                     So we just show a "Vertical Bar" or "Scanner Beam"?
                     User wanted "Comet Tail".
                     If we can't track Y, maybe just a vertical soft beam is safer.
                 */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-gradient-to-b from-transparent via-white/50 to-transparent blur-[1px]" />
            </div>

        </div>
    );
};

export default ECGCanvas;
