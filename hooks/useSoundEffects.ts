import { useRef, useEffect, useCallback } from 'react';

export const useSoundEffects = () => {
    const audioContextRef = useRef<AudioContext | null>(null);
    const droneOscRef = useRef<OscillatorNode | null>(null);

    const initAudio = useCallback(() => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Start ambient drone
            startDrone(audioContextRef.current);

            // Start random atmospheric sounds
            scheduleRandomSounds();
        } else if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    }, []);

    const startDrone = (ctx: AudioContext) => {
        // Main drone oscillator - Low, ominous hum (Reactor core)
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        // Secondary drone - Higher harmonic to add "whine" or presence
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();

        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();

        // 55Hz = A1 (Low deep hum)
        osc.type = 'sawtooth';
        osc.frequency.value = 55;

        // 110Hz = A2 (Octave up) - Adds texture
        osc2.type = 'triangle';
        osc2.frequency.value = 111; // Slightly detuned for phasing effect

        // Filter to muffle it, making it sound like it's behind a wall
        const filter = ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 140;

        // LFO to modulate volume (slow breathing effect of a machine)
        lfo.type = 'sine';
        lfo.frequency.value = 0.15; // Slightly faster cycle
        lfoGain.gain.value = 0.02; // Modulation amount

        // Base volume
        gain.gain.value = 0.04; // Increased base volume slightly
        gain2.gain.value = 0.02;

        // Connections: LFO -> LFO Gain -> Drone Gain
        lfo.connect(lfoGain);
        lfoGain.connect(gain.gain);

        // Connections: Drone -> Filter -> Gain -> Destination
        osc.connect(filter);
        osc2.connect(filter); // Route second osc through same filter

        filter.connect(gain);
        gain.connect(ctx.destination);

        // Connect osc2 gain directly or through filter? Through filter for consistency
        // Actually simplicity: OSC1+OSC2 -> Filter -> Gain -> Out

        osc.start();
        osc2.start();
        lfo.start();

        // Store array or object if we need to stop multiple. For now, stopping osc stops the sound source.
        // We attach osc to ref to track "active" state, but we should really track the context or gain to stop.
        // For simple cleanup, we'll just track the main osc, and added a cleanup function in useEffect that closes context.
        droneOscRef.current = osc;
        // Ideally we track both, but closing context handles it. Keeping ref for check.
    };

    const playTone = (freq: number, type: OscillatorType, duration: number, startTime: number, vol: number = 0.1) => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = type;
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0, startTime);
        gain.gain.linearRampToValueAtTime(vol, startTime + 0.1); // Attack
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration); // Decay

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);
    };

    const playDeepPulse = (ctx: AudioContext) => {
        const t = ctx.currentTime;
        // Deep, resonant throb (Heart of the lucky 38)
        playTone(60, 'sine', 2.5, t, 0.2);
        playTone(120, 'triangle', 2.0, t, 0.05); // Harmonic
    };

    const playDissonantChime = (ctx: AudioContext) => {
        const t = ctx.currentTime;
        // Tritone interval (unsettling warning sound)
        playTone(300, 'sine', 3.0, t, 0.08);
        playTone(424, 'sine', 3.0, t + 0.05, 0.08); // Approx tritone
    };

    const playGeigerClick = (ctx: AudioContext) => {
        const t = ctx.currentTime;
        // Very short burst of noise (simulated by high freq square) - Radiation counter clip
        playTone(Math.random() * 5000 + 1000, 'square', 0.02, t, 0.02);
    };

    const playRandomAtmosphere = () => {
        if (!audioContextRef.current) return;
        const ctx = audioContextRef.current;

        const rand = Math.random();

        if (rand > 0.7) {
            playDeepPulse(ctx);
        } else if (rand > 0.4) {
            playDissonantChime(ctx);
        } else {
            playGeigerClick(ctx);
        }

        scheduleRandomSounds();
    };

    const scheduleRandomSounds = () => {
        // Schedule next sound randomly between 8 and 25 seconds (sparser,creepier)
        const delay = Math.random() * 17000 + 8000;
        setTimeout(playRandomAtmosphere, delay);
    };

    // Keystroke sound (mechanical keyboard style)
    const playKeystrokeSound = () => {
        if (!audioContextRef.current) return;
        // Duller, more mechanical thud/click for inputs
        playTone(150, 'square', 0.05, audioContextRef.current.currentTime, 0.05);
        playTone(800, 'triangle', 0.02, audioContextRef.current.currentTime, 0.02);
    };

    useEffect(() => {
        // Cleanup
        return () => {
            if (droneOscRef.current) {
                try {
                    droneOscRef.current.stop();
                    droneOscRef.current.disconnect();
                } catch (e) {
                    // ignore if already stopped
                }
            }
            if (audioContextRef.current) {
                audioContextRef.current.close();
            }
        }
    }, []);

    return { initAudio, playKeystrokeSound };
};
