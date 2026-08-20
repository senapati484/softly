import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Moon, Feather } from 'lucide-react-native';
import { GrainTexture } from '../../components/ui/GrainTexture';
import { PeaceDashboard } from '../../components/sanctuary/PeaceDashboard';
import { DuskShiftCard } from '../../components/sanctuary/DuskShiftCard';
import { Colors } from '../../theme/colors';

export default function SanctuaryScreen() {
  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GrainTexture />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTag}>Evening Transition</Text>
            <Text style={styles.title}>Night Sanctuary</Text>
          </View>
          <View style={styles.sunsetPill}>
            <Moon size={13} color={Colors.lavender.deep} />
            <Text style={styles.sunsetText}> Sunset Mode</Text>
          </View>
        </View>

        {/* Dusk Light Card */}
        <View style={styles.section}>
          <DuskShiftCard />
        </View>

        {/* Peace Dashboard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Screentime Balance</Text>
          <PeaceDashboard />
        </View>

        {/* Bedtime Principle card */}
        <View style={styles.wisdomCard}>
          <View style={styles.wisdomHeader}>
            <Feather size={14} color={Colors.lavender.deep} />
            <Text style={styles.wisdomTag}> Bedtime Principle</Text>
          </View>
          <Text style={styles.wisdomText}>
            The hour before sleep belongs to you, not an algorithm. Leave your charging dock outside the bedroom to wake naturally to sunrise.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream.canvas },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 16 },
  headerTag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.stone.muted },
  title: { fontSize: 26, fontWeight: '300', color: Colors.stone.ink, marginTop: 2 },
  sunsetPill: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: Colors.lavender.background, borderWidth: 1, borderColor: 'rgba(200,194,216,0.5)' },
  sunsetText: { fontSize: 12, fontWeight: '600', color: Colors.lavender.deep },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.stone.ink, marginBottom: 12 },
  wisdomCard: { backgroundColor: Colors.lavender.background, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(200,194,216,0.5)', gap: 8 },
  wisdomHeader: { flexDirection: 'row', alignItems: 'center' },
  wisdomTag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.lavender.deep },
  wisdomText: { fontSize: 12, color: Colors.stone.body, lineHeight: 18 },
});
