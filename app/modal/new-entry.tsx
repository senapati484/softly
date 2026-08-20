import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { X, Sparkles, Check } from 'lucide-react-native';
import { useSoftlyStore, MoodTag } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

const MOODS: MoodTag[] = ['Peaceful', 'Grounded', 'Reflective', 'Restful', 'Gentle'];

export default function NewEntryModal() {
  const router = useRouter();
  const { addReflection, hapticsEnabled } = useSoftlyStore();
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodTag>('Peaceful');

  const triggerHaptic = () => {
    if (hapticsEnabled) {
      try {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      } catch {
        // ignore
      }
    }
  };

  const handleSave = () => {
    if (!notes.trim()) return;
    if (hapticsEnabled) {
      try {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      } catch {
        // ignore
      }
    }
    addReflection(notes.trim(), selectedMood);
    router.back();
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.root}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.topTag}>Micro-Journal</Text>
            <Text style={styles.title}>New Slow Note</Text>
          </View>
          <TouchableOpacity
            onPress={() => router.back()}
            activeOpacity={0.7}
            style={styles.closeBtn}
          >
            <X size={18} color={Colors.stone.ink} />
          </TouchableOpacity>
        </View>

        {/* Prompt */}
        <View style={styles.promptCard}>
          <View style={styles.promptHeader}>
            <Sparkles size={13} color={Colors.sage.deep} />
            <Text style={styles.promptTitle}> Today's Gentle Prompt</Text>
          </View>
          <Text style={styles.promptText}>
            What was one quiet moment of stillness that made you pause today?
          </Text>
        </View>

        {/* Mood Selector */}
        <View style={styles.moodSection}>
          <Text style={styles.moodLabel}>TONE OF MIND</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRow}>
            {MOODS.map((mood) => {
              const isSelected = selectedMood === mood;
              return (
                <TouchableOpacity
                  key={mood}
                  activeOpacity={0.75}
                  onPress={() => {
                    triggerHaptic();
                    setSelectedMood(mood);
                  }}
                  style={[styles.moodPill, isSelected && styles.moodPillActive]}
                >
                  <Text style={[styles.moodPillText, isSelected && styles.moodPillTextActive]}>
                    {mood}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Input */}
        <View style={styles.inputSection}>
          <Text style={styles.moodLabel}>YOUR REFLECTION</Text>
          <TextInput
            multiline
            numberOfLines={6}
            value={notes}
            onChangeText={setNotes}
            placeholder="Write freely… No likes, no edits, just your honest thought."
            placeholderTextColor={Colors.stone.muted}
            textAlignVertical="top"
            style={styles.input}
          />
        </View>

        {/* Save button */}
        <TouchableOpacity
          onPress={handleSave}
          disabled={!notes.trim()}
          activeOpacity={0.8}
          style={[styles.saveBtn, !notes.trim() && styles.saveBtnDisabled]}
        >
          <Check size={16} color={notes.trim() ? '#FFFFFF' : Colors.stone.muted} strokeWidth={2.4} />
          <Text style={[styles.saveBtnText, !notes.trim() && styles.saveBtnTextDisabled]}>
            {' '}Save to Sanctuary
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.cream.canvas },
  scroll: { padding: 24, paddingTop: 32 },
  topBar: { flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24 },
  topTag: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.stone.muted },
  title: { fontSize: 26, fontWeight: '300', color: Colors.stone.ink, marginTop: 2 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2DFDA', alignItems: 'center', justifyContent: 'center' },
  promptCard: {
    backgroundColor: Colors.sage.background, padding: 16, borderRadius: 18,
    borderWidth: 1, borderColor: '#DCE8DC', marginBottom: 20, gap: 6,
  },
  promptHeader: { flexDirection: 'row', alignItems: 'center' },
  promptTitle: { fontSize: 11, fontWeight: '700', color: Colors.sage.deep },
  promptText: { fontSize: 13, color: Colors.stone.ink, fontStyle: 'italic', lineHeight: 19 },
  moodSection: { marginBottom: 20 },
  moodLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.stone.muted, marginBottom: 10 },
  moodRow: { gap: 8 },
  moodPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 99, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2DFDA' },
  moodPillActive: { backgroundColor: Colors.stone.ink, borderColor: Colors.stone.ink },
  moodPillText: { fontSize: 12, fontWeight: '500', color: Colors.stone.body },
  moodPillTextActive: { color: '#FFFFFF', fontWeight: '700' },
  inputSection: { marginBottom: 24 },
  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1, borderColor: '#E2DFDA',
    borderRadius: 18, padding: 16,
    fontSize: 13.5, color: Colors.stone.ink,
    minHeight: 140, lineHeight: 20,
    shadowColor: '#1C1917', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 3, elevation: 1,
    fontWeight: '400',
  },
  saveBtn: {
    backgroundColor: Colors.stone.ink,
    paddingVertical: 15, borderRadius: 24,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#1C1917', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  saveBtnDisabled: { backgroundColor: '#E7E5E4' },
  saveBtnText: { fontSize: 14.5, fontWeight: '700', color: '#FFFFFF' },
  saveBtnTextDisabled: { color: Colors.stone.muted },
});
