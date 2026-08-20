import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import * as Haptics from 'expo-haptics';
import { Moon, Box, Leaf } from 'lucide-react-native';
import { BreathePattern, useSoftlyStore } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

interface PatternOption {
  id: BreathePattern;
  name: string;
  moodTarget: string;
  timing: string;
  icon: (color: string) => React.ReactNode;
}

const OPTIONS: PatternOption[] = [
  {
    id: '4-7-8',
    name: '4-7-8 Relax',
    moodTarget: 'Deep Calm',
    timing: 'Inhale 4s · Hold 7s · Exhale 8s',
    icon: (color) => <Moon size={13} color={color} strokeWidth={2.2} />,
  },
  {
    id: 'box',
    name: 'Box 4-4',
    moodTarget: 'Clarity',
    timing: 'Inhale 4s · Hold 4s · Exhale 4s · Hold 4s',
    icon: (color) => <Box size={13} color={color} strokeWidth={2.2} />,
  },
  {
    id: 'gentle',
    name: 'Gentle 3-3',
    moodTarget: 'Centering',
    timing: 'Inhale 3s · Exhale 3s',
    icon: (color) => <Leaf size={13} color={color} strokeWidth={2.2} />,
  },
];

export function PatternSelector() {
  const { breathePattern, setBreathePattern, hapticsEnabled } = useSoftlyStore();

  const handleSelect = (pattern: BreathePattern) => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
    }
    setBreathePattern(pattern);
  };

  const activeOption = OPTIONS.find((o) => o.id === breathePattern) || OPTIONS[0];

  return (
    <View style={styles.wrapper}>
      {/* 3-Capsule Segmented Pill Bar */}
      <View style={styles.capsuleDock}>
        {OPTIONS.map((opt) => {
          const selected = breathePattern === opt.id;
          const activeColor = selected ? Colors.coral.deep : Colors.stone.muted;

          return (
            <TouchableOpacity
              key={opt.id}
              activeOpacity={0.75}
              onPress={() => handleSelect(opt.id)}
              style={[styles.pill, selected && styles.pillSelected]}
            >
              <View style={styles.pillContent}>
                {opt.icon(activeColor)}
                <View style={styles.pillTextWrap}>
                  <Text style={[styles.name, selected && styles.nameSelected]}>
                    {opt.name}
                  </Text>
                  <Text style={[styles.moodTarget, selected && styles.moodTargetSelected]}>
                    {opt.moodTarget}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Subtle Timing Helper */}
      <View style={styles.timingRow}>
        <Text style={styles.timingText}>{activeOption.timing}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 4,
  },
  capsuleDock: {
    flexDirection: 'row',
    backgroundColor: '#ECEAE6',
    borderRadius: 18,
    padding: 3,
    gap: 3,
    borderWidth: 1,
    borderColor: '#E2DFDA',
  },
  pill: {
    flex: 1,
    paddingVertical: 7,
    paddingHorizontal: 6,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E2DFDA',
  },
  pillContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  pillTextWrap: {
    alignItems: 'flex-start',
  },
  name: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.stone.muted,
    lineHeight: 14,
  },
  nameSelected: {
    color: Colors.stone.ink,
    fontWeight: '700',
  },
  moodTarget: {
    fontSize: 9.5,
    color: Colors.stone.muted,
    lineHeight: 12,
  },
  moodTargetSelected: {
    color: Colors.coral.deep,
    fontWeight: '600',
  },
  timingRow: {
    alignItems: 'center',
    marginTop: 6,
  },
  timingText: {
    fontSize: 11,
    fontWeight: '500',
    color: Colors.stone.muted,
    letterSpacing: 0.2,
  },
});
