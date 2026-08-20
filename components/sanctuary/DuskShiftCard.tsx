import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

export function DuskShiftCard() {
  const { amberShiftLevel, setAmberShiftLevel, sleepGuardEnabled, toggleSleepGuard, hapticsEnabled } = useSoftlyStore();

  const triggerHaptic = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
    }
  };

  return (
    <View style={styles.container}>
      {/* Blue Light Shift Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconRow}>
            <View style={styles.sunIcon}>
              <Sun size={16} color={Colors.lavender.deep} strokeWidth={2.2} />
            </View>
            <Text style={styles.cardTitle}>Blue-Light Wind Down</Text>
          </View>
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>8:30 PM</Text>
          </View>
        </View>

        <Text style={styles.desc}>
          Screen temperature shifts to warm candle amber at 8:30 PM to preserve natural melatonin production.
        </Text>

        {/* Level bar */}
        <View style={styles.barRow}>
          <Text style={styles.barLabel}>Warm Amber Level</Text>
          <Text style={styles.barValue}>{amberShiftLevel}%</Text>
        </View>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, { width: `${amberShiftLevel}%` }]} />
        </View>

        {/* Quick presets */}
        <View style={styles.presets}>
          {[50, 70, 85, 100].map((val) => (
            <TouchableOpacity
              key={val}
              activeOpacity={0.75}
              onPress={() => {
                triggerHaptic();
                setAmberShiftLevel(val);
              }}
              style={[styles.preset, amberShiftLevel === val && styles.presetActive]}
            >
              <Text style={[styles.presetText, amberShiftLevel === val && styles.presetTextActive]}>
                {val}%
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Sleep Guard */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => {
          triggerHaptic();
          toggleSleepGuard();
        }}
        style={styles.guardCard}
      >
        <View style={[styles.guardIcon, sleepGuardEnabled && styles.guardIconActive]}>
          <Moon size={17} color={sleepGuardEnabled ? Colors.lavender.deep : Colors.stone.muted} strokeWidth={2.2} />
        </View>
        <View style={styles.guardInfo}>
          <Text style={styles.guardTitle}>Evening Sleep Guard</Text>
          <Text style={styles.guardSub}>
            {sleepGuardEnabled ? 'Engages automatically at 10:00 PM' : 'Tap to enable evening protection'}
          </Text>
        </View>
        <View style={[styles.guardBadge, sleepGuardEnabled && styles.guardBadgeActive]}>
          <Text style={[styles.guardBadgeText, sleepGuardEnabled && styles.guardBadgeTextActive]}>
            {sleepGuardEnabled ? 'Active' : 'Off'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 12 },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    gap: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sunIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.lavender.background,
    alignItems: 'center', justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2DFDA',
  },
  cardTitle: { fontSize: 14.5, fontWeight: '700', color: Colors.stone.ink },
  timePill: {
    paddingHorizontal: 10, paddingVertical: 3.5,
    borderRadius: 99, backgroundColor: Colors.lavender.background,
    borderWidth: 1, borderColor: '#E2DFDA',
  },
  timePillText: { fontSize: 11, fontWeight: '700', color: Colors.lavender.deep },
  desc: { fontSize: 13, color: Colors.stone.body, lineHeight: 19 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 11.5, fontWeight: '600', color: Colors.stone.body },
  barValue: { fontSize: 12, fontWeight: '700', color: Colors.lavender.deep },
  barTrack: {
    height: 8, borderRadius: 4,
    backgroundColor: '#F0EEEA', overflow: 'hidden',
  },
  barFill: {
    height: '100%', borderRadius: 4,
    backgroundColor: Colors.lavender.accent,
  },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1, paddingVertical: 8, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#F8F7F4',
    borderWidth: 1, borderColor: '#E2DFDA',
  },
  presetActive: {
    backgroundColor: Colors.lavender.background,
    borderColor: Colors.lavender.deep,
  },
  presetText: { fontSize: 11.5, fontWeight: '600', color: Colors.stone.muted },
  presetTextActive: { color: Colors.lavender.deep, fontWeight: '700' },
  guardCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 16, borderRadius: 20,
    borderWidth: 1, borderColor: '#E2DFDA',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 4,
    elevation: 1,
    gap: 12,
  },
  guardIcon: {
    width: 38, height: 38, borderRadius: 12,
    backgroundColor: '#F4F2EE',
    alignItems: 'center', justifyContent: 'center',
  },
  guardIconActive: { backgroundColor: Colors.lavender.background },
  guardInfo: { flex: 1 },
  guardTitle: { fontSize: 13.5, fontWeight: '700', color: Colors.stone.ink },
  guardSub: { fontSize: 11.5, color: Colors.stone.muted, marginTop: 1 },
  guardBadge: {
    paddingHorizontal: 11, paddingVertical: 4.5,
    borderRadius: 99, backgroundColor: '#F0EEEA',
  },
  guardBadgeActive: { backgroundColor: Colors.sage.background, borderWidth: 1, borderColor: '#DCE8DC' },
  guardBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.stone.muted },
  guardBadgeTextActive: { color: Colors.sage.deep, fontWeight: '700' },
});
