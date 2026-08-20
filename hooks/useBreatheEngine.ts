import { useState, useEffect, useRef, useCallback } from 'react';
import * as Haptics from 'expo-haptics';
import { useSoftlyStore, BreathePattern } from '../store/useSoftlyStore';

export type BreathPhase = 'idle' | 'inhale' | 'hold' | 'exhale' | 'rest';

interface PhaseConfig {
  phase: BreathPhase;
  duration: number; // seconds
  instruction: string;
}

const PATTERNS: Record<BreathePattern, PhaseConfig[]> = {
  '4-7-8': [
    { phase: 'inhale', duration: 4, instruction: 'Breathe in slowly through the nose' },
    { phase: 'hold', duration: 7, instruction: 'Hold gently and stay relaxed' },
    { phase: 'exhale', duration: 8, instruction: 'Exhale completely with a soft whoosh' },
  ],
  'box': [
    { phase: 'inhale', duration: 4, instruction: 'Inhale clarity' },
    { phase: 'hold', duration: 4, instruction: 'Hold the space' },
    { phase: 'exhale', duration: 4, instruction: 'Exhale release' },
    { phase: 'rest', duration: 4, instruction: 'Rest in stillness' },
  ],
  'gentle': [
    { phase: 'inhale', duration: 3, instruction: 'Soft inhale' },
    { phase: 'exhale', duration: 3, instruction: 'Gentle exhale' },
  ],
};

export function useBreatheEngine() {
  const { breathePattern, hapticsEnabled, recordBreathingSession } = useSoftlyStore();
  const [isActive, setIsActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseSecondsRemaining, setPhaseSecondsRemaining] = useState(0);
  const [totalSecondsElapsed, setTotalSecondsElapsed] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);

  const patternSteps = PATTERNS[breathePattern] || PATTERNS['4-7-8'];
  const patternStepsRef = useRef(patternSteps);
  patternStepsRef.current = patternSteps;

  const currentStep = patternSteps[currentPhaseIndex] || patternSteps[0];

  const triggerHaptic = useCallback(
    (phase: BreathPhase) => {
      if (!hapticsEnabled) return;
      try {
        if (phase === 'inhale') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (phase === 'hold') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        } else if (phase === 'exhale') {
          Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        } else if (phase === 'rest') {
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        }
      } catch {
        // Haptics unavailable
      }
    },
    [hapticsEnabled]
  );

  const startBreathing = useCallback(() => {
    setIsActive(true);
    setCurrentPhaseIndex(0);
    setPhaseSecondsRemaining(patternStepsRef.current[0].duration);
    setTotalSecondsElapsed(0);
    setCompletedCycles(0);
    triggerHaptic(patternStepsRef.current[0].phase);
  }, [triggerHaptic]);

  const stopBreathing = useCallback(() => {
    if (isActive && totalSecondsElapsed >= 15) {
      const minutes = Math.max(1, Math.round(totalSecondsElapsed / 60));
      recordBreathingSession(minutes);
    }
    setIsActive(false);
    setCurrentPhaseIndex(0);
    setPhaseSecondsRemaining(0);
  }, [isActive, totalSecondsElapsed, recordBreathingSession]);

  useEffect(() => {
    if (!isActive) return;

    const interval = setInterval(() => {
      setTotalSecondsElapsed((t) => t + 1);

      setPhaseSecondsRemaining((prevRemaining) => {
        if (prevRemaining <= 1) {
          // Advance to next step safely
          let nextRemaining = 0;
          setCurrentPhaseIndex((prevIndex) => {
            const steps = patternStepsRef.current;
            const nextIndex = (prevIndex + 1) % steps.length;
            if (nextIndex === 0) {
              setCompletedCycles((c) => c + 1);
            }
            triggerHaptic(steps[nextIndex].phase);
            nextRemaining = steps[nextIndex].duration;
            return nextIndex;
          });
          return nextRemaining || patternStepsRef.current[0].duration;
        }
        return prevRemaining - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, triggerHaptic]);

  return {
    isActive,
    currentPhase: currentStep.phase,
    instruction: currentStep.instruction,
    phaseDuration: currentStep.duration,
    phaseSecondsRemaining,
    totalSecondsElapsed,
    completedCycles,
    breathePattern,
    startBreathing,
    stopBreathing,
  };
}
