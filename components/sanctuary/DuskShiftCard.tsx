import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Moon, Sun } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

export function DuskShiftCard() {
  const { amberShiftLevel, setAmberShiftLevel, sleepGuardEnabled, toggleSleepGuard } = useSoftlyStore();

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  };

  return (
    <View style={styles.container}>
      {/* Blue Light Shift Card */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={styles.iconRow}>
            <View style={styles.sunIcon}>
              <Sun size={16} color={Colors.lavender.deep} />
            </View>
            <Text style={styles.cardTitle}>Blue-Light Wind Down</Text>
          </View>
          <View style={styles.timePill}>
            <Text style={styles.timePillText}>8:30 PM</Text>
          </View>
        </View>

        <Text style={styles.desc}>
          Screen temperature shifts to warm candle amber at 8:30 PM to preserve melatonin production.
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
              activeOpacity={0.7}
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
          <Moon size={17} color={sleepGuardEnabled ? '#6B21A8' : Colors.stone.body} />
        </View>
        <View style={styles.guardInfo}>
          <Text style={styles.guardTitle}>Evening Sleep Guard</Text>
          <Text style={styles.guardSub}>
            {sleepGuardEnabled ? 'Engages automatically at 10:00 PM' : 'Disabled'}
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
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(214,211,208,0.6)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  cardHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  iconRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sunIcon: {
    width: 32, height: 32, borderRadius: 10,
    backgroundColor: Colors.lavender.background,
    alignItems: 'center', justifyContent: 'center',
  },
  cardTitle: { fontSize: 14, fontWeight: '600', color: Colors.stone.ink },
  timePill: {
    paddingHorizontal: 10, paddingVertical: 3,
    borderRadius: 99, backgroundColor: Colors.lavender.background,
  },
  timePillText: { fontSize: 11, fontWeight: '600', color: Colors.lavender.deep },
  desc: { fontSize: 12, color: Colors.stone.body, lineHeight: 18 },
  barRow: { flexDirection: 'row', justifyContent: 'space-between' },
  barLabel: { fontSize: 11, color: Colors.stone.muted },
  barValue: { fontSize: 11, fontWeight: '500', color: Colors.stone.body },
  barTrack: {
    height: 8, borderRadius: 4,
    backgroundColor: '#F3F2F0', overflow: 'hidden',
  },
  barFill: {
    height: '100%', borderRadius: 4,
    backgroundColor: Colors.lavender.accent,
  },
  presets: { flexDirection: 'row', gap: 8 },
  preset: {
    flex: 1, paddingVertical: 6, borderRadius: 12,
    alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.5)',
    borderWidth: 1, borderColor: 'rgba(214,211,208,0.5)',
  },
  presetActive: {
    backgroundColor: Colors.lavender.background,
    borderColor: Colors.lavender.accent,
  },
  presetText: { fontSize: 11, fontWeight: '500', color: Colors.stone.muted },
  presetTextActive: { color: Colors.lavender.deep },
  guardCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 16, borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)',
    gap: 12,
  },
  guardIcon: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#F3F2F0',
    alignItems: 'center', justifyContent: 'center',
  },
  guardIconActive: { backgroundColor: '#F3E8FF' },
  guardInfo: { flex: 1 },
  guardTitle: { fontSize: 13, fontWeight: '600', color: Colors.stone.ink },
  guardSub: { fontSize: 11, color: Colors.stone.muted, marginTop: 1 },
  guardBadge: {
    paddingHorizontal: 10, paddingVertical: 4,
    borderRadius: 99, backgroundColor: '#F3F2F0',
  },
  guardBadgeActive: { backgroundColor: Colors.sage.background },
  guardBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.stone.muted },
  guardBadgeTextActive: { color: '#065F46' },
});
