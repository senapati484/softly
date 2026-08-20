import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Volume2, Coffee, Play, Pause, User, Sparkles } from 'lucide-react-native';
import { BreathingCircle } from '../../components/breathe/BreathingCircle';
import { PatternSelector } from '../../components/breathe/PatternSelector';
import { GrainTexture } from '../../components/ui/GrainTexture';
import { useBreatheEngine } from '../../hooks/useBreatheEngine';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { useSoundscapes } from '../../hooks/useSoundscapes';
import { Colors } from '../../theme/colors';

export default function QuietRoomScreen() {
  const router = useRouter();
  const { userName, userIntention, unplugRemainingMinutes, isUnplugActive, toggleUnplug } = useSoftlyStore();
  const { activeSound, isPlayingSound, toggleSound } = useSoundscapes();
  const breathe = useBreatheEngine();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initialLetter = (userName?.trim() || 'F')[0].toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GrainTexture />
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with Profile Link */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <View style={styles.dot} />
            <Text style={styles.headerTag}>Quiet Room</Text>
          </View>

          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => router.push('/modal/profile')}
            style={styles.profilePill}
          >
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>{initialLetter}</Text>
            </View>
            <Text style={styles.profilePillText}>{userName || 'Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Greeting */}
        <View style={styles.greeting}>
          <View style={styles.intentionRow}>
            <Sparkles size={11} color={Colors.coral.deep} />
            <Text style={styles.greetingTag}>{userIntention || 'Living Room'}</Text>
          </View>
          <Text style={styles.greetingText}>
            {getGreeting()},{' '}
            <Text style={styles.greetingName}>{userName || 'Friend'}</Text>
          </Text>
          <Text style={styles.greetingSub}>Your space is calm and ready.</Text>
        </View>

        {/* Pattern selector (only when idle) */}
        {!breathe.isActive && (
          <View style={styles.patternWrap}>
            <PatternSelector />
          </View>
        )}

        {/* Breathing circle */}
        <BreathingCircle
          phase={breathe.currentPhase}
          phaseSecondsRemaining={breathe.phaseSecondsRemaining}
          phaseDuration={breathe.phaseDuration}
          instruction={breathe.instruction}
          isActive={breathe.isActive}
          onPress={() => {
            breathe.isActive ? breathe.stopBreathing() : breathe.startBreathing();
          }}
        />

        {/* Live session stats */}
        {breathe.isActive && (
          <View style={styles.sessionStats}>
            <View style={styles.stat}>
              <Text style={styles.statLabel}>CYCLES</Text>
              <Text style={styles.statValue}>{breathe.completedCycles}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statLabel}>ELAPSED</Text>
              <Text style={styles.statValue}>
                {Math.floor(breathe.totalSecondsElapsed / 60)}:
                {String(breathe.totalSecondsElapsed % 60).padStart(2, '0')}
              </Text>
            </View>
          </View>
        )}

        {/* Ambient quick player */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleSound(activeSound || 'Rain on Cedar')}
          style={styles.audioCard}
        >
          <View style={[styles.audioIcon, isPlayingSound && styles.audioIconActive]}>
            <Volume2 size={16} color={isPlayingSound ? Colors.coral.active : Colors.stone.body} />
          </View>
          <View style={styles.audioInfo}>
            <Text style={styles.audioName}>{activeSound || 'Rain on Cedar'}</Text>
            <Text style={styles.audioSub}>
              {isPlayingSound ? 'Playing in background' : 'Tap to play ambient sound'}
            </Text>
          </View>
          <View style={[styles.audioBtn, isPlayingSound && styles.audioBtnActive]}>
            {isPlayingSound
              ? <Pause size={12} color={Colors.stone.ink} />
              : <Play size={12} color={Colors.stone.ink} style={{ marginLeft: 2 }} />}
          </View>
        </TouchableOpacity>

        {/* Unplug card */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={toggleUnplug}
          style={styles.unplugCard}
        >
          <View style={styles.unplugIcon}>
            <Coffee size={17} color={Colors.sage.deep} />
          </View>
          <View style={styles.unplugInfo}>
            <Text style={styles.unplugTitle}>Unplug Window</Text>
            <Text style={styles.unplugSub}>
              {isUnplugActive ? `Next mindful pause in ${unplugRemainingMinutes} min` : 'Detox timer paused'}
            </Text>
          </View>
          <View style={[styles.unplugBadge, isUnplugActive && styles.unplugBadgeActive]}>
            <Text style={[styles.unplugBadgeText, isUnplugActive && styles.unplugBadgeTextActive]}>
              {isUnplugActive ? 'Active' : 'Paused'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream.canvas },
  scroll: { paddingHorizontal: 20, paddingBottom: 120 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: 12, paddingBottom: 16 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#34D399' },
  headerTag: { fontSize: 11, fontWeight: '700', letterSpacing: 1, textTransform: 'uppercase', color: Colors.stone.muted },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingLeft: 4,
    paddingRight: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(214,211,208,0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  avatarMini: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.coral.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.coral.deep,
  },
  profilePillText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.stone.ink,
  },
  greeting: { marginBottom: 16 },
  intentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  greetingTag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.stone.muted },
  greetingText: { fontSize: 28, fontWeight: '300', color: Colors.stone.ink, marginTop: 2 },
  greetingName: {
    fontFamily: 'ReenieBeanie_400Regular',
    fontSize: 38,
    color: '#e8908a',
  },
  greetingSub: { fontSize: 12, color: Colors.stone.muted, marginTop: 2 },
  patternWrap: { marginBottom: 8 },
  sessionStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,228,225,0.5)',
    borderRadius: 18,
    padding: 14,
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,183,178,0.4)',
  },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: Colors.stone.muted },
  statValue: { fontSize: 16, fontWeight: '600', color: Colors.stone.ink, marginTop: 2 },
  statDivider: { width: 1, height: 24, backgroundColor: 'rgba(214,211,208,0.6)' },
  audioCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.85)',
    borderRadius: 18, padding: 14,
    marginBottom: 10,
    borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)',
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1,
    gap: 12,
  },
  audioIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F3F2F0', alignItems: 'center', justifyContent: 'center' },
  audioIconActive: { backgroundColor: Colors.coral.background },
  audioInfo: { flex: 1 },
  audioName: { fontSize: 12, fontWeight: '600', color: Colors.stone.ink },
  audioSub: { fontSize: 10, color: Colors.stone.muted, marginTop: 1 },
  audioBtn: { width: 28, height: 28, borderRadius: 14, backgroundColor: 'rgba(168,162,158,0.3)', alignItems: 'center', justifyContent: 'center' },
  audioBtnActive: { backgroundColor: Colors.coral.accent },
  unplugCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F9F8F5',
    borderRadius: 18, padding: 14,
    borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)',
    gap: 12,
  },
  unplugIcon: { width: 36, height: 36, borderRadius: 10, backgroundColor: Colors.sage.background, alignItems: 'center', justifyContent: 'center' },
  unplugInfo: { flex: 1 },
  unplugTitle: { fontSize: 12, fontWeight: '600', color: Colors.stone.ink },
  unplugSub: { fontSize: 10, color: Colors.stone.muted, marginTop: 1 },
  unplugBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 99, backgroundColor: 'rgba(168,162,158,0.2)' },
  unplugBadgeActive: { backgroundColor: Colors.sage.background },
  unplugBadgeText: { fontSize: 11, fontWeight: '600', color: Colors.stone.muted },
  unplugBadgeTextActive: { color: Colors.stone.ink },
});
