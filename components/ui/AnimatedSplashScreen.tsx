import React, { useEffect } from 'react';
import { StyleSheet, View, Image, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import * as SplashScreen from 'expo-splash-screen';
import { Colors } from '../../theme/colors';

// Keep native splash screen visible while custom animated splash mounts
SplashScreen.preventAutoHideAsync().catch(() => {});

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationComplete,
}) => {
  // Shared values for the breathing cycle
  const scale = useSharedValue(0.96);
  const haloScale = useSharedValue(0.92);
  const haloOpacity = useSharedValue(0.25);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Hide the static native splash screen immediately so our animated one is seen
    SplashScreen.hideAsync().catch(() => {});

    // Gentle rhythmic breathing easing (2200ms inhale, 2200ms exhale)
    const breathEasing = Easing.bezier(0.42, 0, 0.58, 1);

    scale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2000, easing: breathEasing }),
        withTiming(0.96, { duration: 2000, easing: breathEasing })
      ),
      -1,
      true
    );

    haloScale.value = withRepeat(
      withSequence(
        withTiming(1.22, { duration: 2000, easing: breathEasing }),
        withTiming(0.92, { duration: 2000, easing: breathEasing })
      ),
      -1,
      true
    );

    haloOpacity.value = withRepeat(
      withSequence(
        withTiming(0.55, { duration: 2000, easing: breathEasing }),
        withTiming(0.2, { duration: 2000, easing: breathEasing })
      ),
      -1,
      true
    );

    // After 2.4s (one complete gentle breath), smoothly fade out splash screen
    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(
        0,
        { duration: 650, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        }
      );
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const haloAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: haloScale.value }],
    opacity: haloOpacity.value,
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      {/* Centered Breathing Logo & Halo */}
      <View style={styles.centerWrap}>
        {/* Soft Ambient Halo */}
        <Animated.View style={[styles.halo, haloAnimatedStyle]} />

        {/* Pulsing Breathing App Icon */}
        <Animated.View style={[styles.logoContainer, logoAnimatedStyle]}>
          <Image
            source={require('../../assets/logo.png')}
            style={styles.logoImage}
            resizeMode="cover"
          />
        </Animated.View>

        {/* Brand Text */}
        <View style={styles.textWrap}>
          <Text style={styles.brandTitle}>Softly</Text>
          <Text style={styles.brandSubtitle}>breathe in...</Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FDFCF8',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  halo: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#FFE4E1',
  },
  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    borderWidth: 1.5,
    borderColor: 'rgba(214, 211, 208, 0.4)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    width: 96,
    height: 96,
    borderRadius: 28,
  },
  textWrap: {
    marginTop: 20,
    alignItems: 'center',
  },
  brandTitle: {
    fontSize: 22,
    fontWeight: '300',
    color: '#292524',
    letterSpacing: -0.5,
  },
  brandSubtitle: {
    fontFamily: 'ReenieBeanie_400Regular',
    fontSize: 26,
    color: '#e8908a',
    marginTop: 2,
    transform: [{ rotate: '-2deg' }],
  },
});
