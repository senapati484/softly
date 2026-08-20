import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Wind,
  BookOpen,
  Moon,
  Heart,
  Volume2,
  Check,
} from 'lucide-react-native';
import { Colors } from '../theme/colors';
import { GrainTexture } from '../components/ui/GrainTexture';
import { useSoftlyStore } from '../store/useSoftlyStore';

interface IntentionOption {
  id: string;
  title: string;
  desc: string;
  accentBg: string;
  accentText: string;
}

const INTENTIONS: IntentionOption[] = [
  {
    id: 'Stillness & Stress Relief',
    title: 'Stillness & Stress Relief',
    desc: 'Take unhurried moments to pause, decompress, and reset.',
    accentBg: Colors.coral.background,
    accentText: Colors.coral.deep,
  },
  {
    id: 'Daily Breathwork',
    title: 'Daily Breathwork',
    desc: 'Structured breathing exercises for instant calm and nervous system balance.',
    accentBg: Colors.sage.background,
    accentText: Colors.sage.deep,
  },
  {
    id: 'Mindful Journaling',
    title: 'Mindful Journaling',
    desc: 'Slow daily notes, inspirational pebbles, and gratitude tracking.',
    accentBg: Colors.lavender.background,
    accentText: Colors.lavender.deep,
  },
  {
    id: 'Restful Sleep',
    title: 'Restful Sleep',
    desc: 'Evening dusk shift, screen-free detox, and night sanctuary rituals.',
    accentBg: '#EFEBF5',
    accentText: '#5A4E7A',
  },
];

function renderIntentionIcon(id: string, color: string) {
  switch (id) {
    case 'Stillness & Stress Relief':
      return <Heart size={18} color={color} />;
    case 'Daily Breathwork':
      return <Wind size={18} color={color} />;
    case 'Mindful Journaling':
      return <BookOpen size={18} color={color} />;
    case 'Restful Sleep':
      return <Moon size={18} color={color} />;
    default:
      return <Sparkles size={18} color={color} />;
  }
}

const DAILY_GOALS = [5, 10, 15, 20];

const SOUND_OPTIONS = [
  { name: 'Rain on Cedar', desc: 'Gentle raindrops on wood' },
  { name: 'Forest Wind', desc: 'Mountain pine breeze' },
  { name: 'Old Library', desc: 'Warm clock ticking & quiet pages' },
  { name: 'Pure Silence', desc: 'No background audio' },
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { completeOnboarding } = useSoftlyStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [name, setName] = useState('');
  const [selectedIntention, setSelectedIntention] = useState('Stillness & Stress Relief');
  const [selectedGoal, setSelectedGoal] = useState(10);
  const [selectedSound, setSelectedSound] = useState('Rain on Cedar');

  const triggerHaptic = () => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    } catch {
      // ignore
    }
  };

  const handleNext = () => {
    triggerHaptic();
    if (step === 1) {
      if (!name.trim()) return;
      setStep(2);
    } else if (step === 2) {
      setStep(3);
    } else if (step === 3) {
      completeOnboarding({
        userName: name.trim() || 'Friend',
        userIntention: selectedIntention,
        dailyGoalMinutes: selectedGoal,
        preferredSound: selectedSound === 'Pure Silence' ? '' : selectedSound,
      });
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // ignore
      }
      router.replace('/(tabs)');
    }
  };

  const handleBack = () => {
    triggerHaptic();
    if (step > 1) {
      setStep((prev) => (prev - 1) as 1 | 2);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <GrainTexture />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Top Progress & Branding */}
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <View style={styles.brandDot} />
              <Text style={styles.brandText}>softly</Text>
            </View>

            <View style={styles.progressPills}>
              {[1, 2, 3].map((s) => (
                <View
                  key={s}
                  style={[
                    styles.progressDot,
                    step === s && styles.progressDotActive,
                    step > s && styles.progressDotCompleted,
                  ]}
                />
              ))}
            </View>
          </View>

          {/* STEP 1: Name & Identity */}
          {step === 1 && (
            <View style={styles.stepContainer}>
              <View style={styles.badgePill}>
                <Sparkles size={13} color={Colors.coral.deep} />
                <Text style={styles.badgePillText}>Welcome to your sanctuary</Text>
              </View>

              <Text style={styles.title}>A quiet space away from the rush.</Text>
              <Text style={styles.subtitle}>
                Softly is built for intentional pauses and slow living. What should we call you?
              </Text>

              <View style={styles.inputWrapper}>
                <Text style={styles.inputLabel}>YOUR NAME OR NICKNAME</Text>
                <TextInput
                  value={name}
                  onChangeText={setName}
                  placeholder="e.g. Elena, Alex..."
                  placeholderTextColor={Colors.stone.muted}
                  style={styles.textInput}
                  autoCapitalize="words"
                  autoCorrect={false}
                  autoFocus
                  returnKeyType="next"
                  onSubmitEditing={() => {
                    if (name.trim()) handleNext();
                  }}
                />
              </View>

              <View style={styles.privacyNote}>
                <Text style={styles.privacyText}>
                  🔒 Stored safely and privately on your device only.
                </Text>
              </View>
            </View>
          )}

          {/* STEP 2: Intention */}
          {step === 2 && (
            <View style={styles.stepContainer}>
              <View style={styles.badgePill}>
                <Sparkles size={13} color={Colors.sage.deep} />
                <Text style={styles.badgePillText}>Daily Practice</Text>
              </View>

              <Text style={styles.title}>What is your main intention, {name}?</Text>
              <Text style={styles.subtitle}>
                We will tune your gentle rituals and daily pebble around this focus.
              </Text>

              <View style={styles.optionsList}>
                {INTENTIONS.map((item) => {
                  const isSelected = selectedIntention === item.id;
                  return (
                    <TouchableOpacity
                      key={item.id}
                      activeOpacity={0.7}
                      onPress={() => {
                        triggerHaptic();
                        setSelectedIntention(item.id);
                      }}
                      style={[
                        styles.intentionCard,
                        isSelected && styles.intentionCardSelected,
                      ]}
                    >
                      <View
                        style={[
                          styles.intentionIconWrap,
                          { backgroundColor: item.accentBg },
                        ]}
                      >
                        {renderIntentionIcon(item.id, item.accentText)}
                      </View>
                      <View style={styles.intentionTextWrap}>
                        <Text
                          style={[
                            styles.intentionTitle,
                            isSelected && { color: Colors.stone.ink, fontWeight: '700' },
                          ]}
                        >
                          {item.title}
                        </Text>
                        <Text style={styles.intentionDesc}>{item.desc}</Text>
                      </View>
                      <View
                        style={[
                          styles.radioCircle,
                          isSelected && styles.radioCircleActive,
                        ]}
                      >
                        {isSelected && <View style={styles.radioDot} />}
                      </View>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          )}

          {/* STEP 3: Rhythm & Ambient Noise */}
          {step === 3 && (
            <View style={styles.stepContainer}>
              <View style={styles.badgePill}>
                <Sparkles size={13} color={Colors.lavender.deep} />
                <Text style={styles.badgePillText}>Your Rhythm</Text>
              </View>

              <Text style={styles.title}>Set your gentle daily pace.</Text>
              <Text style={styles.subtitle}>
                Small pauses compound into deep peace. You can adjust these anytime.
              </Text>

              {/* Goal Selector */}
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionLabel}>DAILY MINDFULNESS TIME</Text>
                <View style={styles.goalRow}>
                  {DAILY_GOALS.map((mins) => {
                    const isSelected = selectedGoal === mins;
                    return (
                      <TouchableOpacity
                        key={mins}
                        activeOpacity={0.7}
                        onPress={() => {
                          triggerHaptic();
                          setSelectedGoal(mins);
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

              {/* Ambient Sound Selector */}
              <View style={styles.sectionBlock}>
                <View style={styles.sectionHeaderRow}>
                  <Volume2 size={15} color={Colors.stone.body} />
                  <Text style={styles.sectionLabel}>DEFAULT AMBIENT SOUND</Text>
                </View>

                <View style={styles.soundGrid}>
                  {SOUND_OPTIONS.map((snd) => {
                    const isSelected = selectedSound === snd.name;
                    return (
                      <TouchableOpacity
                        key={snd.name}
                        activeOpacity={0.7}
                        onPress={() => {
                          triggerHaptic();
                          setSelectedSound(snd.name);
                        }}
                        style={[
                          styles.soundCard,
                          isSelected && styles.soundCardSelected,
                        ]}
                      >
                        <View style={styles.soundCardTop}>
                          <Text
                            style={[
                              styles.soundName,
                              isSelected && { color: Colors.stone.ink, fontWeight: '700' },
                            ]}
                          >
                            {snd.name}
                          </Text>
                          {isSelected && (
                            <View style={styles.checkPill}>
                              <Check size={12} color="#FFFFFF" strokeWidth={3} />
                            </View>
                          )}
                        </View>
                        <Text style={styles.soundDesc}>{snd.desc}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Bottom CTA Actions */}
        <View style={styles.bottomBar}>
          {step > 1 ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleBack}
              style={styles.backButton}
            >
              <ArrowLeft size={18} color={Colors.stone.ink} />
            </TouchableOpacity>
          ) : (
            <View style={{ width: 44 }} />
          )}

          <TouchableOpacity
            activeOpacity={0.8}
            onPress={handleNext}
            disabled={step === 1 && !name.trim()}
            style={[
              styles.continueButton,
              step === 1 && !name.trim() && styles.continueButtonDisabled,
            ]}
          >
            <Text style={styles.continueButtonText}>
              {step === 3 ? 'Enter Sanctuary' : 'Continue'}
            </Text>
            <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.4} />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.cream.canvas,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 28,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  brandDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    backgroundColor: Colors.coral.active,
  },
  brandText: {
    fontSize: 17,
    fontWeight: '600',
    color: Colors.stone.ink,
    letterSpacing: 0.5,
  },
  progressPills: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  progressDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(214, 211, 208, 0.6)',
  },
  progressDotActive: {
    width: 22,
    backgroundColor: Colors.stone.ink,
  },
  progressDotCompleted: {
    backgroundColor: Colors.sage.deep,
  },
  stepContainer: {
    gap: 12,
  },
  badgePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
    paddingHorizontal: 11,
    paddingVertical: 5,
    borderRadius: 99,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  badgePillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.stone.body,
  },
  title: {
    fontSize: 27,
    fontWeight: '300',
    color: Colors.stone.ink,
    lineHeight: 34,
    marginTop: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.stone.body,
    lineHeight: 21,
    marginBottom: 12,
  },
  inputWrapper: {
    marginTop: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.7)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.stone.muted,
    marginBottom: 8,
  },
  textInput: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.stone.ink,
    paddingVertical: 4,
  },
  privacyNote: {
    marginTop: 12,
    alignItems: 'center',
  },
  privacyText: {
    fontSize: 11.5,
    color: Colors.stone.muted,
  },
  optionsList: {
    gap: 12,
    marginTop: 6,
  },
  intentionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    gap: 14,
  },
  intentionCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.stone.ink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.07,
    shadowRadius: 10,
    elevation: 3,
  },
  intentionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intentionTextWrap: {
    flex: 1,
  },
  intentionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.stone.ink,
    marginBottom: 2,
  },
  intentionDesc: {
    fontSize: 12,
    color: Colors.stone.body,
    lineHeight: 16,
  },
  radioCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: Colors.stone.muted,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    borderColor: Colors.stone.ink,
    backgroundColor: Colors.stone.ink,
  },
  radioDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFFFFF',
  },
  sectionBlock: {
    marginTop: 8,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.8,
    color: Colors.stone.muted,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 10,
  },
  goalRow: {
    flexDirection: 'row',
    gap: 10,
  },
  goalPill: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  goalPillSelected: {
    backgroundColor: Colors.stone.ink,
    borderColor: Colors.stone.ink,
  },
  goalPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.stone.ink,
  },
  goalPillTextSelected: {
    color: '#FFFFFF',
  },
  soundGrid: {
    gap: 8,
  },
  soundCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
  },
  soundCardSelected: {
    backgroundColor: '#FFFFFF',
    borderColor: Colors.stone.ink,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  soundCardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  soundName: {
    fontSize: 13.5,
    fontWeight: '600',
    color: Colors.stone.ink,
  },
  soundDesc: {
    fontSize: 11.5,
    color: Colors.stone.muted,
  },
  checkPill: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.stone.ink,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 16 : 24,
    backgroundColor: Colors.cream.canvas,
    borderTopWidth: 1,
    borderTopColor: 'rgba(231, 229, 228, 0.7)',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: 'rgba(214, 211, 208, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueButton: {
    flex: 1,
    marginLeft: 14,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.stone.ink,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 4,
  },
  continueButtonDisabled: {
    opacity: 0.45,
  },
  continueButtonText: {
    fontSize: 14.5,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
