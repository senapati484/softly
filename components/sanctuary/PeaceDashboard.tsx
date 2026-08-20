import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Shield, Clock, Heart, Sparkles } from 'lucide-react-native';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

export function PeaceDashboard() {
  const { peaceStats, streak } = useSoftlyStore();

  return (
    <View style={styles.container}>
      {/* Hero Metric */}
      <View style={styles.heroCard}>
        <View style={styles.heroTop}>
          <Text style={styles.heroLabel}>THIS WEEK'S PEACE</Text>
          <View style={styles.activePill}>
            <Sparkles size={11} color="#047857" />
            <Text style={styles.activePillText}> Active Protection</Text>
          </View>
        </View>
        <View style={styles.heroMetricRow}>
          <Text style={styles.heroNumber}>{peaceStats.estimatedSavedHours}h</Text>
          <Text style={styles.heroSub}>Preserved from infinite feeds</Text>
        </View>
        <Text style={styles.heroNote}>Zero late-night algorithmic doomscrolls detected.</Text>
      </View>

      {/* Two Mini Cards */}
      <View style={styles.miniRow}>
        <View style={styles.miniCard}>
          <View style={styles.miniHeader}>
            <Clock size={14} color={Colors.stone.body} />
            <Text style={styles.miniLabel}> Breathe Time</Text>
          </View>
          <Text style={styles.miniNumber}>{peaceStats.totalBreathingMinutes}m</Text>
          <Text style={styles.miniSub}>{peaceStats.sessionsCompleted} calming sessions</Text>
        </View>

        <View style={[styles.miniCard, { marginLeft: 10 }]}>
          <View style={styles.miniHeader}>
            <Heart size={14} color={Colors.coral.active} />
            <Text style={styles.miniLabel}> Mindful Streak</Text>
          </View>
          <Text style={styles.miniNumber}>{streak.current} days</Text>
          <Text style={styles.miniSub}>Best: {streak.longest} days</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { gap: 10 },
  heroCard: {
    backgroundColor: 'rgba(255,255,255,0.85)',
    padding: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(200,194,216,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  heroLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: Colors.stone.muted },
  activePill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 99, backgroundColor: '#ECFDF5',
    borderWidth: 1, borderColor: '#A7F3D0',
  },
  activePillText: { fontSize: 10, fontWeight: '600', color: '#065F46' },
  heroMetricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginVertical: 4 },
  heroNumber: { fontSize: 40, fontWeight: '300', color: Colors.stone.ink },
  heroSub: { fontSize: 12, fontWeight: '500', color: '#059669' },
  heroNote: { fontSize: 11, color: Colors.stone.muted, marginTop: 4 },
  miniRow: { flexDirection: 'row' },
  miniCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.75)',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(214,211,208,0.6)',
  },
  miniHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  miniLabel: { fontSize: 11, color: Colors.stone.muted, fontWeight: '500' },
  miniNumber: { fontSize: 20, fontWeight: '500', color: Colors.stone.ink },
  miniSub: { fontSize: 10, color: Colors.stone.muted, marginTop: 2 },
});
