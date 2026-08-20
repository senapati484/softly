import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
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

const { width } = Dimensions.get('window');
const CIRCLE_CONTAINER_SIZE = Math.min(280, width * 0.72);

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
  const haloOpacity = useSharedValue(0.45);

  useEffect(() => {
    if (!isActive) {
      outerScale.value = withRepeat(
        withSequence(
          withTiming(1.06, { duration: 3200, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.0, { duration: 3200, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      middleScale.value = 1;
      haloOpacity.value = 0.45;
      return;
    }

    const durationMs = Math.max(500, phaseDuration * 1000);

    if (phase === 'inhale') {
      outerScale.value = withTiming(1.35, { duration: durationMs, easing: Easing.out(Easing.quad) });
      middleScale.value = withTiming(1.18, { duration: durationMs, easing: Easing.out(Easing.quad) });
      haloOpacity.value = withTiming(0.75, { duration: durationMs });
    } else if (phase === 'hold') {
      outerScale.value = withRepeat(
        withSequence(
          withTiming(1.37, { duration: 1600, easing: Easing.inOut(Easing.ease) }),
          withTiming(1.33, { duration: 1600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
      haloOpacity.value = 0.65;
    } else if (phase === 'exhale') {
      outerScale.value = withTiming(1.0, { duration: durationMs, easing: Easing.inOut(Easing.quad) });
      middleScale.value = withTiming(1.0, { duration: durationMs, easing: Easing.inOut(Easing.quad) });
      haloOpacity.value = withTiming(0.4, { duration: durationMs });
    } else if (phase === 'rest') {
      outerScale.value = withTiming(0.96, { duration: durationMs, easing: Easing.inOut(Easing.ease) });
      middleScale.value = withTiming(0.98, { duration: durationMs });
      haloOpacity.value = 0.35;
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
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={onPress}
        style={[styles.touchable, { width: CIRCLE_CONTAINER_SIZE, height: CIRCLE_CONTAINER_SIZE }]}
      >
        {/* Outermost soft halo ring */}
        <Animated.View
          style={[
            styles.outerRing,
            {
              width: CIRCLE_CONTAINER_SIZE * 0.92,
              height: CIRCLE_CONTAINER_SIZE * 0.92,
              borderRadius: (CIRCLE_CONTAINER_SIZE * 0.92) / 2,
            },
            outerStyle,
          ]}
        />

        {/* Middle soft translucent ring */}
        <Animated.View
          style={[
            styles.middleRing,
            {
              width: CIRCLE_CONTAINER_SIZE * 0.72,
              height: CIRCLE_CONTAINER_SIZE * 0.72,
              borderRadius: (CIRCLE_CONTAINER_SIZE * 0.72) / 2,
            },
            middleStyle,
          ]}
        />

        {/* Core button with soft gradient depth */}
        <View
          style={[
            styles.core,
            {
              width: CIRCLE_CONTAINER_SIZE * 0.48,
              height: CIRCLE_CONTAINER_SIZE * 0.48,
              borderRadius: (CIRCLE_CONTAINER_SIZE * 0.48) / 2,
            },
          ]}
        >
          <Wind size={24} color={Colors.stone.ink} strokeWidth={2.2} />
          <Text style={styles.coreLabel}>{phaseLabel}</Text>
          {isActive && phaseSecondsRemaining > 0 && (
            <Text style={styles.countdown}>{phaseSecondsRemaining}s</Text>
          )}
        </View>
      </TouchableOpacity>

      <View style={styles.instructionBox}>
        <Text style={styles.instruction}>
          {isActive ? instruction : 'Tap circle to begin calm flow'}
        </Text>
        {!isActive && (
          <View style={styles.hintRow}>
            <Sparkles size={12} color={Colors.coral.active} />
            <Text style={styles.hint}> Offline sanctuary · Gentle haptics</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
  },
  touchable: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    position: 'absolute',
    backgroundColor: 'rgba(244, 162, 155, 0.25)',
  },
  middleRing: {
    position: 'absolute',
    backgroundColor: 'rgba(244, 162, 155, 0.45)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.65)',
  },
  core: {
    backgroundColor: '#FFE1DD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#8A3B36',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 14,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  coreLabel: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    color: Colors.stone.ink,
    marginTop: 3,
  },
  countdown: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.coral.deep,
    marginTop: 1,
  },
  instructionBox: {
    marginTop: 12,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  instruction: {
    fontSize: 13.5,
    fontWeight: '500',
    color: Colors.stone.body,
    textAlign: 'center',
    lineHeight: 19,
  },
  hintRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  hint: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.stone.muted,
  },
});
