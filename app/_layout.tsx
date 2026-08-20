import React, { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useFonts, ReenieBeanie_400Regular } from '@expo-google-fonts/reenie-beanie';
import {
  Outfit_300Light,
  Outfit_400Regular,
  Outfit_500Medium,
  Outfit_600SemiBold,
} from '@expo-google-fonts/outfit';
import { Colors } from '../theme/colors';
import { useSoftlyStore } from '../store/useSoftlyStore';
import { AnimatedSplashScreen } from '../components/ui/AnimatedSplashScreen';
import { setupNotificationChannel, requestNotificationPermissionAndWelcome } from '../services/notificationService';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { hasCompletedOnboarding, userName } = useSoftlyStore();
  const [isSplashComplete, setIsSplashComplete] = useState(false);

  const [fontsLoaded] = useFonts({
    ReenieBeanie_400Regular,
    Outfit_300Light,
    Outfit_400Regular,
    Outfit_500Medium,
    Outfit_600SemiBold,
  });

  useEffect(() => {
    setupNotificationChannel();
    if (hasCompletedOnboarding) {
      requestNotificationPermissionAndWelcome(userName || 'Friend');
    }
  }, [hasCompletedOnboarding, userName]);

  useEffect(() => {
    if (fontsLoaded && isSplashComplete) {
      const inOnboarding = segments[0] === 'onboarding';
      if (!hasCompletedOnboarding && !inOnboarding) {
        router.replace('/onboarding');
      }
    }
  }, [hasCompletedOnboarding, segments, fontsLoaded, isSplashComplete]);

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: Colors.cream.canvas }}>
      <SafeAreaProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: Colors.cream.canvas },
            animation: 'fade',
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="onboarding" options={{ headerShown: false, animation: 'fade' }} />
          <Stack.Screen
            name="modal/new-entry"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="modal/profile"
            options={{
              presentation: 'modal',
              animation: 'slide_from_bottom',
              headerShown: false,
            }}
          />
        </Stack>

        {/* Smooth Breathing Splash Screen Overlay */}
        {!isSplashComplete && (
          <AnimatedSplashScreen onAnimationComplete={() => setIsSplashComplete(true)} />
        )}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
