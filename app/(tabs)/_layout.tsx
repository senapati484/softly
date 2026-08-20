import React from 'react';
import { Tabs } from 'expo-router';
import { CustomTabBar } from '../../components/navigation/CustomTabBar';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Breathe',
        }}
      />
      <Tabs.Screen
        name="reflections"
        options={{
          title: 'Pebble',
        }}
      />
      <Tabs.Screen
        name="sanctuary"
        options={{
          title: 'Sanctuary',
        }}
      />
    </Tabs>
  );
}
