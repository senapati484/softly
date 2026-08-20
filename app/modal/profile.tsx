import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Switch,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  X,
  User,
  Heart,
  Wind,
  BookOpen,
  Moon,
  Clock,
  Volume2,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Bell,
  Sun,
  Coffee,
} from 'lucide-react-native';
import { Colors } from '../../theme/colors';
import { GrainTexture } from '../../components/ui/GrainTexture';
import { useSoftlyStore } from '../../store/useSoftlyStore';

const INTENTIONS = [
  'Stillness & Stress Relief',
  'Daily Breathwork',
  'Mindful Journaling',
  'Restful Sleep',
];

const DAILY_GOALS = [3, 5, 10, 15, 20, 30];

const SOUND_OPTIONS = [
  'Rain on Cedar',
  'Forest Wind',
  'Old Library',
  'Pure Silence',
];

const MORNING_TIMES = [
  '5:30 AM',
  '6:00 AM',
  '6:30 AM',
  '7:00 AM',
  '7:30 AM',
  '8:00 AM',
  '8:30 AM',
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
];

const UNPLUG_INTERVALS = [20, 30, 45, 60, 90, 120];

const NIGHT_TIMES = [
  '8:00 PM',
  '8:30 PM',
  '9:00 PM',
  '9:30 PM',
  '10:00 PM',
  '10:30 PM',
  '11:00 PM',
  '11:30 PM',
  '12:00 AM',
  '12:30 AM',
  '1:00 AM',
];

export default function ProfileModal() {
  const router = useRouter();
  const {
    userName,
    userIntention,
    dailyGoalMinutes,
    preferredSound,
    hapticsEnabled,
    notifications,
    streak,
    peaceStats,
    reflections,
    updateProfile,
    updateNotifications,
    setHapticsEnabled,
    resetOnboarding,
  } = useSoftlyStore();

  const [name, setName] = useState(userName || '');
  const [intention, setIntention] = useState(userIntention || 'Stillness & Stress Relief');
  const [goal, setGoal] = useState(dailyGoalMinutes || 10);
  const [sound, setSound] = useState(preferredSound || 'Rain on Cedar');
  const [haptics, setHaptics] = useState(hapticsEnabled);

  // Notification time states
  const [morningPebble, setMorningPebble] = useState(notifications?.morningPebblePrompt ?? true);
  const [morningTime, setMorningTime] = useState(notifications?.morningTime ?? '8:30 AM');
  const [unplugActive, setUnplugActive] = useState(notifications?.unplugReminders ?? true);
  const [unplugInterval, setUnplugInterval] = useState(notifications?.unplugIntervalMinutes ?? 60);
  const [nightWindDown, setNightWindDown] = useState(notifications?.nightWindDown ?? true);
  const [nightTime, setNightTime] = useState(notifications?.nightTime ?? '10:00 PM');

  const triggerHaptic = () => {
    if (haptics) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
    }
  };

  const handleSave = () => {
    updateProfile({
      userName: name.trim() || 'Friend',
      userIntention: intention,
      dailyGoalMinutes: goal,
      preferredSound: sound === 'Pure Silence' ? '' : sound,
    });
    updateNotifications({
      morningPebblePrompt: morningPebble,
      morningTime: morningTime,
      unplugReminders: unplugActive,
      unplugIntervalMinutes: unplugInterval,
      nightWindDown: nightWindDown,
      nightTime: nightTime,
    });
    setHapticsEnabled(haptics);
    if (haptics) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // ignore
      }
    }
    router.back();
  };

  const handleReset = () => {
    Alert.alert(
      'Reset Profile & Onboarding',
      'This will clear your profile setup and replay the onboarding wizard on next launch. Your reflections will be kept safe.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          style: 'destructive',
          onPress: () => {
            resetOnboarding();
            router.replace('/onboarding');
          },
        },
      ]
    );
  };

  const initialLetter = (name.trim() || 'S')[0].toUpperCase();

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <GrainTexture />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTag}>Personal Sanctuary</Text>
          <Text style={styles.title}>Your Profile</Text>
        </View>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => router.back()}
          style={styles.closeBtn}
        >
          <X size={18} color={Colors.stone.ink} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* User Card */}
        <View style={styles.avatarCard}>
          <View style={styles.avatarCircle}>
            <Text style={styles.avatarLetter}>{initialLetter}</Text>
          </View>
          <View style={styles.avatarInfo}>
            <Text style={styles.avatarName}>{name.trim() || 'Mindful Soul'}</Text>
            <View style={styles.intentionPill}>
              <Sparkles size={11} color={Colors.coral.deep} />
              <Text style={styles.intentionPillText}>{intention}</Text>
            </View>
            <View style={styles.privateRow}>
              <ShieldCheck size={12} color={Colors.stone.muted} />
              <Text style={styles.privateText}>100% Local Device Storage</Text>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🌿</Text>
            <Text style={styles.statValue}>{streak.current}d</Text>
            <Text style={styles.statLabel}>Active Streak</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>⏱️</Text>
            <Text style={styles.statValue}>{peaceStats.totalBreathingMinutes}m</Text>
            <Text style={styles.statLabel}>Breathwork</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>📖</Text>
            <Text style={styles.statValue}>{reflections.length}</Text>
            <Text style={styles.statLabel}>Notes Written</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statEmoji}>🛡️</Text>
            <Text style={styles.statValue}>{peaceStats.estimatedSavedHours}h</Text>
            <Text style={styles.statLabel}>Peace Saved</Text>
          </View>
        </View>

        {/* Edit Name */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>YOUR NAME</Text>
          <View style={styles.inputCard}>
            <User size={16} color={Colors.stone.muted} style={{ marginRight: 8 }} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your name"
              placeholderTextColor={Colors.stone.muted}
              style={styles.textInput}
              autoCapitalize="words"
            />
          </View>
        </View>

        {/* Edit Intention */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>CORE FOCUS & INTENTION</Text>
          <View style={styles.intentionsList}>
            {INTENTIONS.map((item) => {
              const isSelected = intention === item;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.7}
                  onPress={() => {
                    triggerHaptic();
                    setIntention(item);
                  }}
                  style={[
                    styles.intentionRow,
                    isSelected && styles.intentionRowSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.intentionRowText,
                      isSelected && styles.intentionRowTextSelected,
                    ]}
                  >
                    {item}
                  </Text>
                  {isSelected && <Check size={16} color={Colors.stone.ink} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Daily Goal */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Clock size={14} color={Colors.stone.body} />
            <Text style={styles.sectionTitle}>DAILY MINDFULNESS GOAL</Text>
          </View>
          <View style={styles.goalRow}>
            {DAILY_GOALS.map((mins) => {
              const isSelected = goal === mins;
              return (
                <TouchableOpacity
                  key={mins}
                  activeOpacity={0.7}
                  onPress={() => {
                    triggerHaptic();
                    setGoal(mins);
                  }}
                  style={[
                    styles.goalPill,
                    isSelected && styles.goalPillSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.goalPillText,
                      isSelected && styles.goalPillTextSelected,
                    ]}
                  >
                    {mins} min
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Default Soundscape */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Volume2 size={14} color={Colors.stone.body} />
            <Text style={styles.sectionTitle}>DEFAULT AMBIENT SOUNDSCAPE</Text>
          </View>
          <View style={styles.soundList}>
            {SOUND_OPTIONS.map((snd) => {
              const isSelected = sound === snd;
              return (
                <TouchableOpacity
                  key={snd}
                  activeOpacity={0.7}
                  onPress={() => {
                    triggerHaptic();
                    setSound(snd);
                  }}
                  style={[
                    styles.soundRow,
                    isSelected && styles.soundRowSelected,
                  ]}
                >
                  <Text
                    style={[
                      styles.soundRowText,
                      isSelected && styles.soundRowTextSelected,
                    ]}
                  >
                    {snd}
                  </Text>
                  {isSelected && <Check size={16} color={Colors.stone.ink} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ============================================================ */}
        {/* QUIET NOTIFICATIONS & TIMING SETTINGS                        */}
        {/* ============================================================ */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Bell size={14} color={Colors.coral.deep} />
            <Text style={styles.sectionTitle}>QUIET NOTIFICATIONS & SCHEDULE</Text>
          </View>

          <View style={styles.notifCard}>
            {/* Morning Pebble Prompt */}
            <View style={styles.notifRow}>
              <View style={styles.notifInfo}>
                <View style={styles.notifLabelRow}>
                  <Sun size={13} color={Colors.stone.body} />
                  <Text style={styles.notifTitle}>Morning Pebble Reminder</Text>
                </View>
                <Text style={styles.notifDesc}>
                  Daily morning reflection prompt ({morningTime})
                </Text>
              </View>
              <Switch
                value={morningPebble}
                onValueChange={(val) => {
                  triggerHaptic();
                  setMorningPebble(val);
                }}
                trackColor={{ false: '#E7E5E4', true: Colors.stone.ink }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Morning Time Chips */}
            {morningPebble && (
              <View style={styles.timeSelectorRow}>
                <Text style={styles.timeSelectorLabel}>Morning time:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeChips}>
                  {MORNING_TIMES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => {
                        triggerHaptic();
                        setMorningTime(t);
                      }}
                      style={[
                        styles.timeChip,
                        morningTime === t && styles.timeChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          morningTime === t && styles.timeChipTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.divider} />

            {/* Unplug Windows */}
            <View style={styles.notifRow}>
              <View style={styles.notifInfo}>
                <View style={styles.notifLabelRow}>
                  <Coffee size={13} color={Colors.stone.body} />
                  <Text style={styles.notifTitle}>Unplug Screen Breaks</Text>
                </View>
                <Text style={styles.notifDesc}>
                  Gentle invitation to step away from screens
                </Text>
              </View>
              <Switch
                value={unplugActive}
                onValueChange={(val) => {
                  triggerHaptic();
                  setUnplugActive(val);
                }}
                trackColor={{ false: '#E7E5E4', true: Colors.stone.ink }}
                thumbColor="#FFFFFF"
              />
            </View>

            {unplugActive && (
              <View style={styles.timeSelectorRow}>
                <Text style={styles.timeSelectorLabel}>Pause interval:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeChips}>
                  {UNPLUG_INTERVALS.map((mins) => (
                    <TouchableOpacity
                      key={mins}
                      onPress={() => {
                        triggerHaptic();
                        setUnplugInterval(mins);
                      }}
                      style={[
                        styles.timeChip,
                        unplugInterval === mins && styles.timeChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          unplugInterval === mins && styles.timeChipTextActive,
                        ]}
                      >
                        {mins}m
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <View style={styles.divider} />

            {/* Night Wind-down */}
            <View style={styles.notifRow}>
              <View style={styles.notifInfo}>
                <View style={styles.notifLabelRow}>
                  <Moon size={13} color={Colors.stone.body} />
                  <Text style={styles.notifTitle}>Night Sanctuary Wind-Down</Text>
                </View>
                <Text style={styles.notifDesc}>
                  Warm amber transition prompt ({nightTime})
                </Text>
              </View>
              <Switch
                value={nightWindDown}
                onValueChange={(val) => {
                  triggerHaptic();
                  setNightWindDown(val);
                }}
                trackColor={{ false: '#E7E5E4', true: Colors.stone.ink }}
                thumbColor="#FFFFFF"
              />
            </View>

            {/* Night Time Chips */}
            {nightWindDown && (
              <View style={styles.timeSelectorRow}>
                <Text style={styles.timeSelectorLabel}>Bedtime:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeChips}>
                  {NIGHT_TIMES.map((t) => (
                    <TouchableOpacity
                      key={t}
                      onPress={() => {
                        triggerHaptic();
                        setNightTime(t);
                      }}
                      style={[
                        styles.timeChip,
                        nightTime === t && styles.timeChipActive,
                      ]}
                    >
                      <Text
                        style={[
                          styles.timeChipText,
                          nightTime === t && styles.timeChipTextActive,
                        ]}
                      >
                        {t}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            {/* Quiet Pledge */}
            <View style={styles.pledgeRow}>
              <ShieldCheck size={12} color={Colors.sage.deep} />
              <Text style={styles.pledgeText}>
                No urgency sounds or red badges. Ever.
              </Text>
            </View>
          </View>
        </View>

        {/* Tactile Haptics Toggle */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>TACTILE EXPERIENCE</Text>
          <View style={styles.toggleCard}>
            <View style={styles.toggleInfo}>
              <Text style={styles.toggleTitle}>Haptic Touch Feedback</Text>
              <Text style={styles.toggleDesc}>
                Subtle vibrations during breathing rhythm and interactions
              </Text>
            </View>
            <Switch
              value={haptics}
              onValueChange={(val) => {
                triggerHaptic();
                setHaptics(val);
              }}
              trackColor={{ false: '#E7E5E4', true: Colors.stone.ink }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Reset / Replay */}
        <View style={styles.dangerSection}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleReset}
            style={styles.resetBtn}
          >
            <RotateCcw size={14} color={Colors.coral.deep} />
            <Text style={styles.resetBtnText}>Replay Onboarding / Setup</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Save Action */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={handleSave}
          style={styles.saveBtn}
        >
          <Text style={styles.saveBtnText}>Save Preferences</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.cream.canvas,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(231, 229, 228, 0.6)',
  },
  headerTag: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    color: Colors.stone.muted,
  },
  title: {
    fontSize: 24,
    fontWeight: '300',
    color: Colors.stone.ink,
    marginTop: 2,
  },
  closeBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 100,
    gap: 20,
  },
  avatarCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 22,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    gap: 14,
  },
  avatarCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.coral.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 178, 0.6)',
  },
  avatarLetter: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.coral.deep,
  },
  avatarInfo: {
    flex: 1,
    gap: 3,
  },
  avatarName: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.stone.ink,
  },
  intentionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  intentionPillText: {
    fontSize: 11.5,
    color: Colors.stone.body,
    fontWeight: '500',
  },
  privateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  privateText: {
    fontSize: 10.5,
    color: Colors.stone.muted,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 10,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  statEmoji: {
    fontSize: 16,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.stone.ink,
  },
  statLabel: {
    fontSize: 9.5,
    color: Colors.stone.muted,
    marginTop: 2,
  },
  section: {
    gap: 8,
  },
  sectionTitle: {
    fontSize: 10.5,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.stone.muted,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  inputCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.7)',
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    color: Colors.stone.ink,
  },
  intentionsList: {
    gap: 8,
  },
  intentionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  intentionRowSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.stone.ink,
  },
  intentionRowText: {
    fontSize: 13,
    color: Colors.stone.body,
    fontWeight: '500',
  },
  intentionRowTextSelected: {
    color: Colors.stone.ink,
    fontWeight: '600',
  },
  goalRow: {
    flexDirection: 'row',
    gap: 8,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  goalPillSelected: {
    backgroundColor: Colors.stone.ink,
    borderColor: Colors.stone.ink,
  },
  goalPillText: {
    fontSize: 12.5,
    fontWeight: '600',
    color: Colors.stone.ink,
  },
  goalPillTextSelected: {
    color: '#FFFFFF',
  },
  soundList: {
    gap: 8,
  },
  soundRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  soundRowSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.stone.ink,
  },
  soundRowText: {
    fontSize: 13,
    color: Colors.stone.body,
    fontWeight: '500',
  },
  soundRowTextSelected: {
    color: Colors.stone.ink,
    fontWeight: '600',
  },

  // Notification Card
  notifCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 18,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    gap: 12,
  },
  notifRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notifInfo: {
    flex: 1,
    marginRight: 12,
  },
  notifLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 2,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.stone.ink,
  },
  notifDesc: {
    fontSize: 11,
    color: Colors.stone.muted,
  },
  timeSelectorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 2,
  },
  timeSelectorLabel: {
    fontSize: 11.5,
    color: Colors.stone.body,
    fontWeight: '500',
    marginRight: 8,
  },
  timeChips: {
    flexDirection: 'row',
    gap: 6,
  },
  timeChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(214, 211, 208, 0.35)',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  timeChipActive: {
    backgroundColor: Colors.stone.ink,
    borderColor: Colors.stone.ink,
  },
  timeChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.stone.body,
  },
  timeChipTextActive: {
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(231, 229, 228, 0.7)',
  },
  pledgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.sage.background,
    padding: 8,
    borderRadius: 12,
    marginTop: 4,
  },
  pledgeText: {
    fontSize: 10.5,
    color: Colors.stone.body,
    fontWeight: '500',
  },

  toggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  toggleInfo: {
    flex: 1,
    marginRight: 10,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.stone.ink,
    marginBottom: 2,
  },
  toggleDesc: {
    fontSize: 11,
    color: Colors.stone.muted,
  },
  dangerSection: {
    alignItems: 'center',
    marginTop: 8,
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 228, 225, 0.5)',
    borderWidth: 1,
    borderColor: 'rgba(255, 183, 178, 0.4)',
  },
  resetBtnText: {
    fontSize: 11.5,
    fontWeight: '600',
    color: Colors.coral.deep,
  },
  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 32 : 18,
    backgroundColor: Colors.cream.canvas,
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 229, 228, 0.7)',
  },
  saveBtn: {
    backgroundColor: Colors.stone.ink,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  saveBtnText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
