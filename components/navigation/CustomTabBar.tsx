import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { Wind, BookOpen, Moon, Volume2 } from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { useSoftlyStore } from '../../store/useSoftlyStore';

interface TabConfig {
  label: string;
  activeBg: string;
  activeColor: string;
  accentBorder: string;
}

const TAB_CONFIGS: Record<string, TabConfig> = {
  index: {
    label: 'Breathe',
    activeBg: '#FDEEEB', // Warm soft coral
    activeColor: '#C04B43', // Rich terracotta/coral
    accentBorder: 'rgba(255, 183, 178, 0.45)',
  },
  reflections: {
    label: 'Pebble',
    activeBg: '#EAF1EA', // Gentle soothing sage
    activeColor: '#2F522F', // Forest deep sage
    accentBorder: 'rgba(183, 201, 183, 0.45)',
  },
  sanctuary: {
    label: 'Sanctuary',
    activeBg: '#F0EEF7', // Serene dusk lavender
    activeColor: '#4E4270', // Deep twilight lavender
    accentBorder: 'rgba(200, 194, 216, 0.45)',
  },
};

function renderTabIcon(name: string, isFocused: boolean, color: string) {
  const size = isFocused ? 17 : 19;
  const strokeWidth = isFocused ? 2.2 : 1.8;
  switch (name) {
    case 'index':
      return <Wind size={size} color={color} strokeWidth={strokeWidth} />;
    case 'reflections':
      return <BookOpen size={size} color={color} strokeWidth={strokeWidth} />;
    case 'sanctuary':
      return <Moon size={size} color={color} strokeWidth={strokeWidth} />;
    default:
      return <Wind size={size} color={color} strokeWidth={strokeWidth} />;
  }
}

export function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { isPlayingSound } = useSoftlyStore();

  const bottomOffset = Math.max(14, insets.bottom + 4);

  return (
    <View style={[styles.container, { bottom: bottomOffset }]}>
      <View style={styles.tabDock}>
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const config = TAB_CONFIGS[route.name] || {
            label: options.title || route.name,
            activeBg: Colors.sage.background,
            activeColor: Colors.stone.ink,
            accentBorder: Colors.cream.border,
          };

          const showSoundPlaying = isPlayingSound && route.name === 'reflections';

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              try {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              } catch {
                // Ignore haptics error on unsupported platforms
              }
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="tab"
              accessibilityState={{ selected: isFocused }}
              accessibilityLabel={`${config.label} tab, ${index + 1} of ${state.routes.length}`}
              accessibilityHint={`Navigates to ${config.label} screen`}
              activeOpacity={0.7}
              onPress={onPress}
              onLongPress={onLongPress}
              style={styles.tabButton}
              hitSlop={{ top: 10, bottom: 10, left: 8, right: 8 }}
            >
              {isFocused ? (
                <View
                  style={[
                    styles.activePill,
                    {
                      backgroundColor: config.activeBg,
                      borderColor: config.accentBorder,
                    },
                  ]}
                >
                  {renderTabIcon(route.name, true, config.activeColor)}
                  <Text style={[styles.activeLabel, { color: config.activeColor }]}>
                    {config.label}
                  </Text>
                  {showSoundPlaying && (
                    <View style={[styles.soundBadge, { backgroundColor: config.activeColor }]}>
                      <Volume2 size={9} color="#FFFFFF" />
                    </View>
                  )}
                </View>
              ) : (
                <View style={styles.inactiveTab}>
                  <View style={styles.inactiveIconWrap}>
                    {renderTabIcon(route.name, false, Colors.stone.body)}
                    {showSoundPlaying && (
                      <View style={styles.soundDot} />
                    )}
                  </View>
                  <Text style={styles.inactiveLabel}>{config.label}</Text>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 100,
  },
  tabDock: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.94)',
    borderRadius: 36,
    paddingVertical: 6,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderColor: 'rgba(231, 229, 228, 0.85)',
    ...Platform.select({
      ios: {
        shadowColor: '#1C1917',
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 18,
      },
      android: {
        elevation: 8,
      },
    }),
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
    minHeight: 48,
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 24,
    borderWidth: 1,
    gap: 6,
    minHeight: 40,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  soundBadge: {
    width: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 2,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 2,
    gap: 2,
    minHeight: 40,
  },
  inactiveIconWrap: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  soundDot: {
    position: 'absolute',
    top: -2,
    right: -4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.coral.active,
  },
  inactiveLabel: {
    fontSize: 10.5,
    fontWeight: '500',
    color: Colors.stone.body,
    letterSpacing: 0.1,
  },
});
