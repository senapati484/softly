import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Heart, Plus, Volume2, Trash2, Sparkles } from 'lucide-react-native';
import { GrainTexture } from '../../components/ui/GrainTexture';
import { SoundCard } from '../../components/sounds/SoundCard';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { useSoundscapes } from '../../hooks/useSoundscapes';
import { Colors } from '../../theme/colors';

export default function ReflectionsScreen() {
  const router = useRouter();
  const { reflections, streak, toggleFavorite, deleteReflection } = useSoftlyStore();
  const { tracks, activeSound, isPlayingSound, toggleSound } = useSoundscapes();

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
            <Text style={styles.headerTag}>Daily Practice</Text>
            <Text style={styles.title}>Morning Pebble</Text>
          </View>
          <View style={styles.streak}>
            <Text>🌿</Text>
            <Text style={styles.streakText}>{streak.current} days calm</Text>
          </View>
        </View>

        {/* Featured Pebble Card */}
        <View style={styles.pebbleCard}>
          <View style={styles.pebbleCardTop}>
            <View style={styles.pebblePill}>
              <Text style={styles.pebblePillText}>Slow Note #142</Text>
            </View>
            <View style={styles.pebbleHint}>
              <Sparkles size={13} color={Colors.coral.deep} />
              <Text style={styles.pebbleHintText}> Daily Prompt</Text>
            </View>
          </View>

          <Text style={styles.pebbleQuote}>
            "Notice the way the light hits the floorboards. You do not have to conquer today; simply be in it."
          </Text>

          <View style={styles.pebbleBottom}>
            <Text style={styles.pebbleCredit}>Curated for stillness</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/modal/new-entry')}
              style={styles.writeBtn}
            >
              <Plus size={12} color={Colors.stone.ink} />
              <Text style={styles.writeBtnText}> Write Note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Soundscapes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Volume2 size={16} color={Colors.stone.body} />
              <Text style={styles.sectionTitle}> Ambient Noise</Text>
            </View>
            <Text style={styles.sectionSub}>Offline & Looping</Text>
          </View>

          {tracks.map((track) => (
            <SoundCard
              key={track.id}
              track={track}
              isActive={activeSound === track.name}
              isPlaying={isPlayingSound}
              onToggle={() => toggleSound(track.name)}
            />
          ))}
        </View>

        {/* Journal */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Your Journal Entries</Text>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => router.push('/modal/new-entry')}
              style={styles.newEntryBtn}
            >
              <Plus size={14} color={Colors.coral.active} />
              <Text style={styles.newEntryBtnText}> New Entry</Text>
            </TouchableOpacity>
          </View>

          {reflections.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyText}>No entries yet. Tap '+ New Entry' to capture a quiet thought.</Text>
            </View>
          ) : (
            reflections.map((entry) => (
              <View key={entry.id} style={styles.entryCard}>
                {entry.quote && (
                  <View style={styles.entryQuoteRow}>
                    <View style={styles.entryQuoteLine} />
                    <Text style={styles.entryQuote}>"{entry.quote}"</Text>
                  </View>
                )}
                <Text style={styles.entryNotes}>{entry.userNotes}</Text>
                <View style={styles.entryFooter}>
                  <View style={styles.entryMeta}>
                    <View style={styles.moodPill}>
                      <Text style={styles.moodPillText}>{entry.moodTag}</Text>
                    </View>
                    <Text style={styles.entryDate}>
                      {new Date(entry.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                  <View style={styles.entryActions}>
                    <TouchableOpacity onPress={() => toggleFavorite(entry.id)} activeOpacity={0.7}>
                      <Heart size={15} color={entry.isFavorite ? Colors.coral.accent : Colors.stone.muted} fill={entry.isFavorite ? Colors.coral.accent : 'none'} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => deleteReflection(entry.id)} activeOpacity={0.7} style={{ marginLeft: 12 }}>
                      <Trash2 size={14} color={Colors.stone.light} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}
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
  streak: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: Colors.sage.background, borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)' },
  streakText: { fontSize: 12, fontWeight: '600', color: Colors.stone.ink },
  pebbleCard: { backgroundColor: Colors.sage.background, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)', marginBottom: 24, gap: 12 },
  pebbleCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pebblePill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.8)', borderWidth: 1, borderColor: 'rgba(214,211,208,0.5)' },
  pebblePillText: { fontSize: 10, fontWeight: '600', color: Colors.stone.body },
  pebbleHint: { flexDirection: 'row', alignItems: 'center' },
  pebbleHintText: { fontSize: 11, color: Colors.stone.muted, fontWeight: '500' },
  pebbleQuote: { fontSize: 13, color: Colors.stone.ink, fontStyle: 'italic', lineHeight: 20 },
  pebbleBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: 'rgba(214,211,208,0.6)' },
  pebbleCredit: { fontSize: 11, color: Colors.stone.muted },
  writeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.9)', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 3, elevation: 1 },
  writeBtnText: { fontSize: 12, fontWeight: '600', color: Colors.stone.ink },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center' },
  sectionTitle: { fontSize: 14, fontWeight: '600', color: Colors.stone.ink },
  sectionSub: { fontSize: 11, color: Colors.stone.muted },
  newEntryBtn: { flexDirection: 'row', alignItems: 'center' },
  newEntryBtnText: { fontSize: 12, fontWeight: '600', color: Colors.coral.active },
  emptyCard: { backgroundColor: 'rgba(255,255,255,0.65)', padding: 24, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)', alignItems: 'center' },
  emptyText: { fontSize: 12, color: Colors.stone.muted, textAlign: 'center' },
  entryCard: { backgroundColor: 'rgba(255,255,255,0.9)', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  entryQuoteRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  entryQuoteLine: { width: 2, borderRadius: 1, backgroundColor: Colors.coral.accent, marginRight: 8, alignSelf: 'stretch' },
  entryQuote: { flex: 1, fontSize: 11, color: Colors.stone.muted, fontStyle: 'italic', lineHeight: 16 },
  entryNotes: { fontSize: 12, color: Colors.stone.ink, lineHeight: 18 },
  entryFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, marginTop: 8, borderTopWidth: 1, borderTopColor: '#F5F4F2' },
  entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moodPill: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 99, backgroundColor: Colors.sage.background },
  moodPillText: { fontSize: 10, color: Colors.stone.body, fontWeight: '500' },
  entryDate: { fontSize: 10, color: Colors.stone.muted },
  entryActions: { flexDirection: 'row', alignItems: 'center' },
});
