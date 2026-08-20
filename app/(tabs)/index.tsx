import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Volume2, Coffee, Play, Pause, Sparkles } from 'lucide-react-native';
import { BreathingCircle } from '../../components/breathe/BreathingCircle';
import { PatternSelector } from '../../components/breathe/PatternSelector';
import { GrainTexture } from '../../components/ui/GrainTexture';
import { useBreatheEngine } from '../../hooks/useBreatheEngine';
import { useSoftlyStore } from '../../store/useSoftlyStore';
import { useSoundscapes } from '../../hooks/useSoundscapes';
import { Colors } from '../../theme/colors';

export default function QuietRoomScreen() {
  const router = useRouter();
  const {
    userName,
    userIntention,
    unplugRemainingMinutes,
    isUnplugActive,
    toggleUnplug,
  } = useSoftlyStore();
  const { activeSound, isPlayingSound, toggleSound } = useSoundscapes();
  const breathe = useBreatheEngine();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good morning';
    if (h < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const initialLetter = (userName?.trim() || 'S')[0].toUpperCase();

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
            activeOpacity={0.75}
            onPress={() => router.push('/modal/profile')}
            style={styles.profilePill}
          >
            <View style={styles.avatarMini}>
              <Text style={styles.avatarMiniText}>{initialLetter}</Text>
            </View>
            <Text style={styles.profilePillText}>{userName || 'Profile'}</Text>
          </TouchableOpacity>
        </View>

        {/* Cohesive Editorial Greeting */}
        <View style={styles.greeting}>
          <View style={styles.intentionRow}>
            <Sparkles size={11} color={Colors.coral.deep} />
            <Text style={styles.greetingTag}>{userIntention || 'Stillness & Stress Relief'}</Text>
          </View>
          <View style={styles.greetingTitleRow}>
            <Text style={styles.greetingText}>{getGreeting()}, </Text>
            <Text style={styles.greetingName}>{userName || 'Friend'}</Text>
          </View>
          <Text style={styles.greetingSub}>Your space is calm and ready.</Text>
        </View>

        {/* Pattern Selector / Live Stats Dock */}
        <View style={styles.topControlWrap}>
          {!breathe.isActive ? (
            <PatternSelector />
          ) : (
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
        </View>

        {/* Breathing Circle Hero Centerpiece */}
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

        {/* Ambient quick player */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => toggleSound(activeSound || 'Rain on Cedar')}
          style={styles.audioCard}
        >
          <View style={[styles.audioIcon, isPlayingSound && styles.audioIconActive]}>
            <Volume2 size={16} color={isPlayingSound ? Colors.coral.deep : Colors.stone.body} strokeWidth={2.2} />
          </View>
          <View style={styles.audioInfo}>
            <Text style={styles.audioName}>{activeSound || 'Rain on Cedar'}</Text>
            <Text style={styles.audioSub}>
              {isPlayingSound ? 'Playing soothing ambient sound' : 'Tap to play ambient sound'}
            </Text>
          </View>
          <View style={[styles.audioBtn, isPlayingSound && styles.audioBtnActive]}>
            {isPlayingSound ? (
              <Pause size={13} color="#FFFFFF" strokeWidth={2.4} />
            ) : (
              <Play size={13} color={Colors.stone.ink} strokeWidth={2.4} style={{ marginLeft: 2 }} />
            )}
          </View>
        </TouchableOpacity>

        {/* Unplug window card */}
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={toggleUnplug}
          style={styles.unplugCard}
        >
          <View style={styles.unplugIcon}>
            <Coffee size={16} color={Colors.sage.deep} strokeWidth={2.2} />
          </View>
          <View style={styles.unplugInfo}>
            <Text style={styles.unplugTitle}>Unplug Window</Text>
            <Text style={styles.unplugSub}>
              {isUnplugActive
                ? `Next mindful pause in ${unplugRemainingMinutes} min`
                : 'Pause paused — tap to resume'}
            </Text>
          </View>
          <View style={[styles.unplugBadge, isUnplugActive && styles.unplugBadgeActive]}>
            <Text style={[styles.unplugBadgeText, isUnplugActive && styles.unplugBadgeTextActive]}>
              {isUnplugActive ? 'Active' : 'Off'}
            </Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.cream.canvas },
  scroll: { paddingHorizontal: 20, paddingTop: 4, paddingBottom: 110 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#86efac',
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.stone.muted,
  },
  profilePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 99,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 1,
  },
  avatarMini: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.coral.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarMiniText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.coral.deep,
  },
  profilePillText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: Colors.stone.ink,
  },
  greeting: { marginBottom: 12 },
  intentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  greetingTag: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.stone.muted,
  },
  greetingTitleRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    flexWrap: 'wrap',
    marginTop: 2,
  },
  greetingText: {
    fontSize: 27,
    fontWeight: '300',
    color: Colors.stone.ink,
    letterSpacing: -0.4,
  },
  greetingName: {
    fontSize: 27,
    fontWeight: '500',
    color: Colors.coral.deep,
    letterSpacing: -0.4,
  },
  greetingSub: {
    fontSize: 12.5,
    color: Colors.stone.muted,
    marginTop: 3,
    fontWeight: '500',
  },
  
  topControlWrap: {
    minHeight: 52,
    justifyContent: 'center',
  },
  sessionStats: {
    flexDirection: 'row',
    backgroundColor: Colors.coral.background,
    borderRadius: 18,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderWidth: 1,
    borderColor: Colors.coral.accent,
  },
  stat: { alignItems: 'center' },
  statLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.8, color: Colors.coral.deep },
  statValue: { fontSize: 16, fontWeight: '700', color: Colors.stone.ink, marginTop: 1 },
  statDivider: { width: 1, height: 20, backgroundColor: Colors.coral.accent },
  
  audioCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
    gap: 12,
  },
  audioIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: '#F4F2EE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioIconActive: {
    backgroundColor: Colors.coral.background,
  },
  audioInfo: { flex: 1 },
  audioName: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.stone.ink,
  },
  audioSub: {
    fontSize: 11,
    color: Colors.stone.muted,
    marginTop: 1,
    fontWeight: '500',
  },
  audioBtn: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#F0EEEA',
    alignItems: 'center',
    justifyContent: 'center',
  },
  audioBtnActive: {
    backgroundColor: Colors.coral.deep,
  },
  
  unplugCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 14,
    borderWidth: 1,
    borderColor: '#E2DFDA',
    shadowColor: '#1C1917',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 3,
    elevation: 1,
    gap: 12,
  },
  unplugIcon: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: Colors.sage.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  unplugInfo: { flex: 1 },
  unplugTitle: {
    fontSize: 13.5,
    fontWeight: '700',
    color: Colors.stone.ink,
  },
  unplugSub: {
    fontSize: 11,
    color: Colors.stone.muted,
    marginTop: 1,
    fontWeight: '500',
  },
  unplugBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 99,
    backgroundColor: '#F0EEEA',
  },
  unplugBadgeActive: {
    backgroundColor: Colors.sage.background,
    borderWidth: 1,
    borderColor: '#DCE8DC',
  },
  unplugBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.stone.muted,
  },
  unplugBadgeTextActive: {
    color: Colors.sage.deep,
    fontWeight: '700',
  },
});
