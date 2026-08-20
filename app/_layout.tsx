import React, { useEffect } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Colors } from '../theme/colors';
import { useSoftlyStore } from '../store/useSoftlyStore';

export default function RootLayout() {
  const router = useRouter();
  const segments = useSegments();
  const { hasCompletedOnboarding } = useSoftlyStore();

  useEffect(() => {
    const inOnboarding = segments[0] === 'onboarding';
    if (!hasCompletedOnboarding && !inOnboarding) {
      router.replace('/onboarding');
    }
  }, [hasCompletedOnboarding, segments]);

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
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
