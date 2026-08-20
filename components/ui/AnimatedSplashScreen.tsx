import React, { useEffect } from 'react';
import { StyleSheet, View, Image } from 'react-native';
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

SplashScreen.preventAutoHideAsync().catch(() => {});

interface AnimatedSplashScreenProps {
  onAnimationComplete: () => void;
}

export const AnimatedSplashScreen: React.FC<AnimatedSplashScreenProps> = ({
  onAnimationComplete,
}) => {
  const scale = useSharedValue(0.95);
  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    SplashScreen.hideAsync().catch(() => {});

    // Pure, gentle breathing flow (sine easing)
    const breathEasing = Easing.bezier(0.42, 0, 0.58, 1);

    scale.value = withRepeat(
      withSequence(
        withTiming(1.06, { duration: 1800, easing: breathEasing }),
        withTiming(0.95, { duration: 1800, easing: breathEasing })
      ),
      -1,
      true
    );

    // Fade out smoothly into the app
    const timer = setTimeout(() => {
      containerOpacity.value = withTiming(
        0,
        { duration: 500, easing: Easing.out(Easing.cubic) },
        (finished) => {
          if (finished) {
            runOnJS(onAnimationComplete)();
          }
        }
      );
    }, 2200);

    return () => clearTimeout(timer);
  }, []);

  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  return (
    <Animated.View style={[styles.container, containerAnimatedStyle]}>
      <Animated.View style={logoAnimatedStyle}>
        <Image
          source={require('../../assets/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
    zIndex: 9999,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 140,
    height: 140,
  },
});
