import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import { Wind, Sparkles } from 'lucide-react-native';
import { BreathPhase } from '../../hooks/useBreatheEngine';
import { Colors } from '../../theme/colors';

interface BreathingCircleProps {
  phase: BreathPhase;
  phaseSecondsRemaining: number;
  phaseDuration: number;
  instruction: string;
  isActive: boolean;
  onPress: () => void;
}

export function BreathingCircle({
  phase,
  phaseSecondsRemaining,
  phaseDuration,
  instruction,
  isActive,
  onPress,
}: BreathingCircleProps) {
  const outerScale = useSharedValue(1);
  const middleScale = useSharedValue(1);
  const haloOpacity = useSharedValue(0.35);

  useEffect(() => {
    if (!isActive) {
      outerScale.value = withRepeat(
        withSequence(
          withTiming(1.08, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 3000, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      middleScale.value = 1;
      haloOpacity.value = 0.35;
      return;
    }

    const durationMs = Math.max(500, phaseDuration * 1000);

    if (phase === 'inhale') {
      outerScale.value = withTiming(1.4, { duration: durationMs, easing: Easing.out(Easing.quad) });
      middleScale.value = withTiming(1.2, { duration: durationMs, easing: Easing.out(Easing.quad) });
      haloOpacity.value = withTiming(0.65, { duration: durationMs });
    } else if (phase === 'hold') {
      outerScale.value = withRepeat(
        withSequence(
          withTiming(1.42, { duration: 1500, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.38, { duration: 1500, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      haloOpacity.value = 0.55;
    } else if (phase === 'exhale') {
      outerScale.value = withTiming(1.0, { duration: durationMs, easing: Easing.inOut(Easing.quad) });
      middleScale.value = withTiming(1.0, { duration: durationMs, easing: Easing.inOut(Easing.quad) });
      haloOpacity.value = withTiming(0.3, { duration: durationMs });
    } else if (phase === 'rest') {
      outerScale.value = withTiming(0.95, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
      middleScale.value = withTiming(0.98, { duration: durationMs });
      haloOpacity.value = 0.25;
    }
  }, [isActive, phase, phaseDuration]);

  const outerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: outerScale.value }],
    opacity: haloOpacity.value,
  }));

  const middleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: middleScale.value }],
  }));

  const phaseLabel = phase === 'idle' ? 'Breathe' : phase.charAt(0).toUpperCase() + phase.slice(1);

  return (
    <View style={styles.container}>
      <TouchableOpacity activeOpacity={0.88} onPress={onPress} style={styles.touchable}>
        {/* Outermost halo */}
        <Animated.View style={[styles.outerRing, outerStyle]} />
        {/* Middle layer */}
        <Animated.View style={[styles.middleRing, middleStyle]} />
        {/* Core button */}
        <View style={styles.core}>
          <Wind size={28} color={Colors.stone.ink} />
          <Text style={styles.coreLabel}>{phaseLabel}</Text>
          {isActive && phaseSecondsRemaining > 0 && (
            <Text style={styles.countdown}>{phaseSecondsRemaining}s</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.instructionBox}>
        <Text style={styles.instruction}>
          {isActive ? instruction : 'Tap the circle to begin guided calm'}
        </Text>
        {!isActive && (
          <View style={styles.hintRow}>
            <Sparkles size={13} color={Colors.coral.active} />
            <Text style={styles.hint}>  100% offline · gentle haptics</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const C = Colors.coral.accent;

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  touchable: { width: 288, height: 288, alignItems: 'center', justifyContent: 'center' },
  outerRing: {
    position: 'absolute',
    width: 256, height: 256,
    borderRadius: 128,
    backgroundColor: C,
  },
  middleRing: {
    position: 'absolute',
    width: 192, height: 192,
    borderRadius: 96,
    backgroundColor: C,
    opacity: 0.7,
  },
  core: {
    width: 128, height: 128,
    borderRadius: 64,
    backgroundColor: C,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.coral.deep,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.6)',
  },
  coreLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.stone.ink,
    marginTop: 4,
  },
  countdown: { fontSize: 18, fontWeight: '600', color: Colors.stone.ink },
  instructionBox: { marginTop: 16, paddingHorizontal: 24, alignItems: 'center' },
  instruction: { fontSize: 13, fontWeight: '500', color: Colors.stone.body, textAlign: 'center', lineHeight: 20 },
  hintRow: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  hint: { fontSize: 11, color: Colors.stone.muted },
});
