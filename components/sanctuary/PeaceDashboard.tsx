import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Clock, Heart, Sparkles } from 'lucide-react-native';
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
            <Sparkles size={11} color={Colors.sage.deep} />
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
            <Clock size={14} color={Colors.stone.ink} />
            <Text style={styles.miniLabel}> Breathe Time</Text>
          </View>
          <Text style={styles.miniNumber}>{peaceStats.totalBreathingMinutes}m</Text>
          <Text style={styles.miniSub}>{peaceStats.sessionsCompleted} calming sessions</Text>
        </View>

        <View style={[styles.miniCard, { marginLeft: 10 }]}>
          <View style={styles.miniHeader}>
            <Heart size={14} color={Colors.coral.deep} />
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
  },
  heroTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 },
  heroLabel: { fontSize: 10.5, fontWeight: '700', letterSpacing: 0.8, color: Colors.stone.muted },
  activePill: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 99, backgroundColor: Colors.sage.background,
    borderWidth: 1, borderColor: '#DCE8DC',
  },
  activePillText: { fontSize: 10.5, fontWeight: '700', color: Colors.sage.deep },
  heroMetricRow: { flexDirection: 'row', alignItems: 'baseline', gap: 8, marginVertical: 4 },
  heroNumber: { fontSize: 38, fontWeight: '300', color: Colors.stone.ink },
  heroSub: { fontSize: 12.5, fontWeight: '600', color: Colors.sage.deep },
  heroNote: { fontSize: 11.5, color: Colors.stone.muted, marginTop: 4, fontWeight: '500' },
  miniRow: { flexDirection: 'row' },
  miniCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  miniHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  miniLabel: { fontSize: 11.5, color: Colors.stone.body, fontWeight: '600' },
  miniNumber: { fontSize: 22, fontWeight: '700', color: Colors.stone.ink },
  miniSub: { fontSize: 10.5, color: Colors.stone.muted, marginTop: 2, fontWeight: '500' },
});
