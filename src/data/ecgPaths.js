// ECG Vectors for Potassium Simulation - LITFL STANDARDS
// ViewBox Reference: 0 -30 400 160 (Height 160, Baseline 50)
// X Scale: 100 units = 1 Normal Cycle
// Y Scale: Baseline = 50. Up = <50. Down = >50.

export const ecgPatterns = {
    // --- NORMAL (Sinus Rhythm) [K+ 3.5 - 5.5] ---
    // LITFL:
    // User Feedback: Shorten ST interval, Narrow T-wave.
    // DII: P upright monophasic. qRs pattern. T upright rounded.
    // V1:  Biphasic P (+/-). rS pattern (small r, deep S). T flat/inverted.
    0: {
        // DI: Standard Normal
        // T starts 35 (was 45), Ends 65 (was 90)
        DI: "M 0 50 L 5 50 Q 8 45 12 50 L 15 50 L 16 52 L 20 20 L 23 55 L 25 50 L 35 50 Q 45 50 50 35 Q 55 25 60 40 Q 65 50 70 50 L 100 50",

        // DII: Textbook Sinus
        // QRS Ends 30. ST: 30->35 (Short). T: 35->65 (Narrower, 30 units).
        DII: "M 0 50 L 5 50 C 8 40 12 40 15 50 L 20 50 L 22 55 L 25 5 L 28 55 L 30 50 L 35 50 C 42 50 45 15 55 20 C 60 22 62 50 65 50 L 100 50",

        // V1: rS Pattern + Biphasic P
        // T starts 35, ends 55 (Very narrow/flat).
        V1: "M 0 50 L 5 50 Q 8 45 10 50 Q 12 55 15 50 L 20 50 L 22 40 L 25 90 L 28 50 L 35 50 Q 45 52 55 50 L 100 50"
    },

    // --- MILD HYPERKALEMIA [K+ 5.5 - 6.5] ---
    // LITFL: "Tented T waves" - Symmetrical, NARROW BASE, Sharp, Pointed.
    // Key Difference: Base is narrow. Normal T base is 45-85 (40 units). 
    // Tented T base should be narrower, e.g., 55-75 (20 units).
    1: {
        // DI: Tented T
        DI: "M 0 50 L 5 50 Q 8 45 12 50 L 15 50 L 16 52 L 20 20 L 23 55 L 25 50 L 50 50 L 60 10 L 70 50 L 100 50",

        // DII: Tented T
        // P-QRS Normal. T is linear triangle, narrow.
        DII: "M 0 50 L 5 50 C 8 40 12 40 15 50 L 20 50 L 22 55 L 25 5 L 28 55 L 30 50 L 50 50 L 62 -10 L 74 50 L 100 50",

        // V1: Tented T Upright in V1
        V1: "M 0 50 L 5 50 Q 8 45 10 50 Q 12 55 15 50 L 20 50 L 22 40 L 25 90 L 28 50 L 55 50 L 62 10 L 69 50 L 100 50"
    },

    // --- MODERATE HYPERKALEMIA [K+ 6.5 - 7.5] ---
    // LITFL: P flattens/widens/disappears. PR prolongs. QRS widens.
    2: {
        // DI
        DI: "M 0 50 L 5 50 Q 12 48 20 50 L 25 50 L 28 55 L 32 15 L 38 65 L 42 50 L 50 50 L 60 0 L 70 50 L 100 50",

        // DII: P almost gone. QRS wide. T Giant Narrow Tent.
        DII: "M 0 50 L 10 50 Q 18 48 25 50 L 30 50 L 32 55 L 38 10 L 45 65 L 50 50 L 55 50 L 65 -20 L 75 50 L 100 50",

        // V1: Deep Wide S. Tented T.
        V1: "M 0 50 L 15 50 L 20 45 L 30 95 L 40 50 L 45 50 L 55 10 L 65 50 L 100 50"
    },

    // --- SEVERE HYPERKALEMIA [K+ 7.5 - 8.5] ---
    // LITFL: Sinoventricular (No P). Bizarre QRS.
    3: {
        // DII: Bizarre Wide. Tented T still visible basically merging.
        DII: "M 0 50 L 20 50 L 35 30 L 50 70 L 65 0 L 80 50 L 100 50",
        DI: "M 0 50 L 20 50 L 35 30 L 45 60 L 60 20 L 80 50 L 100 50",
        V1: "M 0 50 L 20 50 L 30 80 L 50 40 L 70 20 L 90 50 L 100 50"
    },

    // --- CRITICAL / SINE WAVE [K+ > 8.5] ---
    // LITFL: Sine Wave.
    4: {
        DII: "M 0 50 Q 25 -10 50 50 Q 75 110 100 50",
        DI: "M 0 50 Q 25 10 50 50 Q 75 90 100 50",
        V1: "M 0 50 Q 25 10 50 50 Q 75 90 100 50"
    },

    // --- MILD HYPOKALEMIA [K+ 2.5 - 3.5] ---
    // LITFL: Flat/inverted T. Prominent U Wave.
    '-1': {
        // DII: T flat/down. U bump positive.
        // T at 40-60. U at 70-80.
        DII: "M 0 50 L 5 50 C 8 40 12 40 15 50 L 20 50 L 22 55 L 25 5 L 28 55 L 30 55 L 45 55 Q 50 58 55 55 L 60 55 Q 70 45 80 55 L 100 50",

        // V1: U wave visible.
        V1: "M 0 50 L 5 50 L 22 40 L 25 90 L 28 50 L 50 50 L 60 50 Q 70 45 80 50 L 100 50",

        DI: "M 0 50 L 20 50 L 25 20 L 28 55 L 30 55 L 60 55 Q 80 45 90 50 L 100 50"
    },

    // --- SEVERE HYPOKALEMIA [K+ < 2.5] ---
    // LITFL: Giant U Wave ("Camel Hump"). T + U fusion.
    '-2': {
        // DII: T inv, U giant.
        DII: "M 0 50 L 5 50 L 15 50 L 22 55 L 25 5 L 28 55 L 32 55 L 45 55 Q 55 65 65 55 Q 75 30 90 55 L 100 50",

        V1: "M 0 50 L 22 40 L 25 90 L 28 50 L 60 50 Q 80 30 95 50 L 100 50",

        DI: "M 0 50 L 25 20 L 28 55 L 30 55 Q 50 65 60 55 Q 80 30 90 55 L 100 50"
    }
};
