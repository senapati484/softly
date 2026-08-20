import React, { useState, useMemo } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { Heart, Plus, Volume2, Trash2, Sparkles, Search, X, Leaf } from 'lucide-react-native';
import { GrainTexture } from '../../components/ui/GrainTexture';
import { SoundCard } from '../../components/sounds/SoundCard';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { useSoundscapes } from '../../hooks/useSoundscapes';
import { Colors } from '../../theme/colors';

const FILTER_TAGS: { id: string; label: string }[] = [
  { id: 'all', label: 'All Notes' },
  { id: 'favorites', label: 'Favorites' },
  { id: 'Grounded', label: 'Grounded' },
  { id: 'Peaceful', label: 'Peaceful' },
  { id: 'Restful', label: 'Restful' },
  { id: 'Reflective', label: 'Reflective' },
  { id: 'Gentle', label: 'Gentle' },
];

export default function ReflectionsScreen() {
  const router = useRouter();
  const { reflections, streak, hapticsEnabled, toggleFavorite, deleteReflection } = useSoftlyStore();
  const { tracks, activeSound, isPlayingSound, toggleSound } = useSoundscapes();

  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const triggerHaptic = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
    }
  };

  const handleToggleFav = (id: string) => {
    triggerHaptic();
    toggleFavorite(id);
  };

  const filteredReflections = useMemo(() => {
    return reflections.filter((entry) => {
      // Filter logic
      if (activeFilter === 'favorites' && !entry.isFavorite) return false;
      if (
        activeFilter !== 'all' &&
        activeFilter !== 'favorites' &&
        entry.moodTag !== activeFilter
      ) {
        return false;
      }

      // Search query logic
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesNotes = entry.userNotes.toLowerCase().includes(q);
        const matchesQuote = entry.quote ? entry.quote.toLowerCase().includes(q) : false;
        const matchesMood = entry.moodTag.toLowerCase().includes(q);
        return matchesNotes || matchesQuote || matchesMood;
      }

      return true;
    });
  }, [reflections, activeFilter, searchQuery]);

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GrainTexture />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTag}>Daily Practice</Text>
            <Text style={styles.title}>Morning Pebble</Text>
          </View>
          <View style={styles.streak}>
            <Leaf size={13} color={Colors.sage.deep} strokeWidth={2.4} />
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
              activeOpacity={0.75}
              onPress={() => router.push('/modal/new-entry')}
              style={styles.writeBtn}
            >
              <Plus size={13} color={Colors.stone.ink} strokeWidth={2.4} />
              <Text style={styles.writeBtnText}> Write Note</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Soundscapes */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderLeft}>
              <Volume2 size={16} color={Colors.stone.ink} />
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

        {/* Journal Section with Search & Filter */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.journalHeaderLeft}>
              <Text style={styles.sectionTitle}>Your Journal Entries</Text>
              <View style={styles.countBadge}>
                <Text style={styles.countBadgeText}>{filteredReflections.length}</Text>
              </View>
            </View>

            <TouchableOpacity
              activeOpacity={0.75}
              onPress={() => router.push('/modal/new-entry')}
              style={styles.newEntryBtn}
            >
              <Plus size={14} color={Colors.coral.deep} strokeWidth={2.4} />
              <Text style={styles.newEntryBtnText}> New Entry</Text>
            </TouchableOpacity>
          </View>

          {/* Search Input Bar */}
          <View style={styles.searchBar}>
            <Search size={15} color={Colors.stone.muted} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search thoughts, quotes, moods..."
              placeholderTextColor={Colors.stone.muted}
              style={styles.searchInput}
              clearButtonMode="while-editing"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')} activeOpacity={0.7}>
                <X size={14} color={Colors.stone.muted} />
              </TouchableOpacity>
            )}
          </View>

          {/* Filter Chips Carousel */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.filterScroll}
          >
            {FILTER_TAGS.map((tag) => {
              const isSelected = activeFilter === tag.id;
              return (
                <TouchableOpacity
                  key={tag.id}
                  activeOpacity={0.75}
                  onPress={() => {
                    triggerHaptic();
                    setActiveFilter(tag.id);
                  }}
                  style={[styles.filterChip, isSelected && styles.filterChipActive]}
                >
                  {tag.id === 'favorites' && (
                    <Heart
                      size={11}
                      color={isSelected ? '#FFFFFF' : Colors.coral.deep}
                      fill={isSelected ? '#FFFFFF' : Colors.coral.deep}
                      style={{ marginRight: 4 }}
                    />
                  )}
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {tag.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Reflections List */}
          {filteredReflections.length === 0 ? (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>No matching notes found</Text>
              <Text style={styles.emptyText}>
                {searchQuery || activeFilter !== 'all'
                  ? 'Try selecting a different filter chip or clearing your search.'
                  : 'Tap "+ New Entry" above to write your first slow reflection.'}
              </Text>
            </View>
          ) : (
            filteredReflections.map((entry) => (
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
                      {new Date(entry.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </Text>
                  </View>
                  <View style={styles.entryActions}>
                    <TouchableOpacity
                      onPress={() => handleToggleFav(entry.id)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Heart
                        size={16}
                        color={entry.isFavorite ? Colors.coral.active : Colors.stone.muted}
                        fill={entry.isFavorite ? Colors.coral.active : 'none'}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => deleteReflection(entry.id)}
                      activeOpacity={0.7}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      style={{ marginLeft: 14 }}
                    >
                      <Trash2 size={15} color={Colors.stone.muted} />
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
  streak: { flexDirection: 'row', alignItems: 'center', gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: Colors.sage.background, borderWidth: 1, borderColor: '#DCE8DC' },
  streakText: { fontSize: 12, fontWeight: '700', color: Colors.sage.deep },
  pebbleCard: { backgroundColor: Colors.sage.background, padding: 20, borderRadius: 24, borderWidth: 1, borderColor: '#DCE8DC', marginBottom: 24, gap: 12 },
  pebbleCardTop: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  pebblePill: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 99, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#DCE8DC' },
  pebblePillText: { fontSize: 10.5, fontWeight: '700', color: Colors.stone.body },
  pebbleHint: { flexDirection: 'row', alignItems: 'center' },
  pebbleHintText: { fontSize: 11, color: Colors.stone.body, fontWeight: '600' },
  pebbleQuote: { fontSize: 14, color: Colors.stone.ink, fontStyle: 'italic', lineHeight: 21 },
  pebbleBottom: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 8, borderTopWidth: 1, borderTopColor: '#DCE8DC' },
  pebbleCredit: { fontSize: 11, color: Colors.stone.muted, fontWeight: '500' },
  writeBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 99, backgroundColor: '#FFFFFF', shadowColor: '#1C1917', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2, borderWidth: 1, borderColor: '#DCE8DC' },
  writeBtnText: { fontSize: 12, fontWeight: '700', color: Colors.stone.ink },
  section: { marginBottom: 24 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 },
  sectionHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  journalHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  countBadge: {
    backgroundColor: '#EAE8E4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 99,
  },
  countBadgeText: {
    fontSize: 10.5,
    fontWeight: '700',
    color: Colors.stone.body,
  },
  sectionTitle: { fontSize: 14, fontWeight: '700', color: Colors.stone.ink },
  sectionSub: { fontSize: 11, color: Colors.stone.muted, fontWeight: '500' },
  newEntryBtn: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  newEntryBtnText: { fontSize: 12, fontWeight: '700', color: Colors.coral.deep },

  // Search & Filter
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    marginBottom: 10,
    gap: 8,
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: Colors.stone.ink,
    padding: 0,
    fontWeight: '500',
  },
  filterScroll: {
    gap: 6,
    paddingBottom: 12,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2DFDA',
  },
  filterChipActive: {
    backgroundColor: Colors.stone.ink,
    borderColor: Colors.stone.ink,
  },
  filterChipText: {
    fontSize: 11.5,
    fontWeight: '500',
    color: Colors.stone.body,
  },
  filterChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },

  emptyCard: { backgroundColor: '#FFFFFF', padding: 24, borderRadius: 18, borderWidth: 1, borderColor: '#E2DFDA', alignItems: 'center', gap: 4 },
  emptyTitle: { fontSize: 13.5, fontWeight: '700', color: Colors.stone.ink },
  emptyText: { fontSize: 12, color: Colors.stone.muted, textAlign: 'center', lineHeight: 18 },
  entryCard: { backgroundColor: '#FFFFFF', padding: 16, borderRadius: 18, borderWidth: 1, borderColor: '#E2DFDA', marginBottom: 12, shadowColor: '#1C1917', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  entryQuoteRow: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 8 },
  entryQuoteLine: { width: 2.5, borderRadius: 2, backgroundColor: Colors.coral.accent, marginRight: 8, alignSelf: 'stretch' },
  entryQuote: { flex: 1, fontSize: 11.5, color: Colors.stone.muted, fontStyle: 'italic', lineHeight: 16 },
  entryNotes: { fontSize: 13, color: Colors.stone.ink, lineHeight: 19, fontWeight: '400' },
  entryFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 10, marginTop: 8, borderTopWidth: 1, borderTopColor: '#F4F2EE' },
  entryMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  moodPill: { paddingHorizontal: 9, paddingVertical: 2.5, borderRadius: 99, backgroundColor: Colors.sage.background, borderWidth: 1, borderColor: '#DCE8DC' },
  moodPillText: { fontSize: 10.5, color: Colors.sage.deep, fontWeight: '700' },
  entryDate: { fontSize: 10.5, color: Colors.stone.muted, fontWeight: '500' },
  entryActions: { flexDirection: 'row', alignItems: 'center' },
});
