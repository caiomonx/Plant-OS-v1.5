import { useState, useCallback, useRef } from 'react';

// States: 'OFF' | 'BOOTING' | 'ACTIVE'

export default function useMonitorBoot() {
    const [bootStatus, setBootStatus] = useState('OFF');
    const [showGrid, setShowGrid] = useState(false);
    const [showWaves, setShowWaves] = useState(false);
    const [showVitals, setShowVitals] = useState(false);

    // Refs to prevent state update on unmount if needed, though cleanups are better.
    // For simple timeouts, standard useEffect cleanup or just letting them run is usually fine, 
    // but we'll use a ref to track if mounted or active just in case.
    
    const startBootSequence = useCallback(() => {
        if (bootStatus !== 'OFF') return;

        setBootStatus('BOOTING');

        // Sequence timeline
        // 0ms: Booting start (Spinner)
        
        // 1500ms: Grid appears
        setTimeout(() => {
            setShowGrid(true);
        }, 1500);

        // 2000ms: Waves start (Canvas)
        setTimeout(() => {
            setShowWaves(true);
        }, 2000);

        // 2500ms: Vitals Pop + Fully Active
        setTimeout(() => {
            setShowVitals(true);
            setBootStatus('ACTIVE');
        }, 2500);

    }, [bootStatus]);

    const turnOff = useCallback(() => {
        setBootStatus('OFF');
        setShowGrid(false);
        setShowWaves(false);
        setShowVitals(false);
    }, []);

    // Instant on for debugging or resuming
    const instantOn = useCallback(() => {
        setBootStatus('ACTIVE');
        setShowGrid(true);
        setShowWaves(true);
        setShowVitals(true);
    }, []);

    return {
        bootStatus,
        showGrid,
        showWaves,
        showVitals,
        startBootSequence,
        turnOff,
        instantOn
    };
}
