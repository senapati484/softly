import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, ScrollView, StyleSheet,
} from 'react-native';
import { useRouter } from 'expo-router';
import { X, Sparkles, Check } from 'lucide-react-native';
import { useSoftlyStore, MoodTag } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

const MOODS: MoodTag[] = ['Peaceful', 'Grounded', 'Reflective', 'Restful', 'Gentle'];

export default function NewEntryModal() {
  const router = useRouter();
  const { addReflection } = useSoftlyStore();
  const [notes, setNotes] = useState('');
  const [selectedMood, setSelectedMood] = useState<MoodTag>('Peaceful');

  const handleSave = () => {
    if (!notes.trim()) return;
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

        {/* Mood */}
        <View style={styles.moodSection}>
          <Text style={styles.moodLabel}>TONE OF MIND</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.moodRow}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood}
                onPress={() => setSelectedMood(mood)}
                style={[styles.moodPill, selectedMood === mood && styles.moodPillActive]}
              >
                <Text style={[styles.moodPillText, selectedMood === mood && styles.moodPillTextActive]}>
                  {mood}
                </Text>
              </TouchableOpacity>
            ))}
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
          <Check size={16} color={notes.trim() ? Colors.cream.canvas : Colors.stone.muted} />
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
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#F3F2F0', alignItems: 'center', justifyContent: 'center' },
  promptCard: {
    backgroundColor: Colors.sage.background, padding: 16, borderRadius: 18,
    borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)', marginBottom: 20, gap: 6,
  },
  promptHeader: { flexDirection: 'row', alignItems: 'center' },
  promptTitle: { fontSize: 11, fontWeight: '600', color: Colors.stone.body },
  promptText: { fontSize: 12, color: Colors.stone.body, fontStyle: 'italic', lineHeight: 18 },
  moodSection: { marginBottom: 20 },
  moodLabel: { fontSize: 11, fontWeight: '700', letterSpacing: 0.8, textTransform: 'uppercase', color: Colors.stone.muted, marginBottom: 10 },
  moodRow: { gap: 8 },
  moodPill: { paddingHorizontal: 14, paddingVertical: 6, borderRadius: 99, backgroundColor: 'rgba(255,255,255,0.85)', borderWidth: 1, borderColor: 'rgba(214,211,208,0.6)' },
  moodPillActive: { backgroundColor: Colors.coral.accent, borderColor: Colors.coral.accent },
  moodPillText: { fontSize: 12, fontWeight: '500', color: Colors.stone.body },
  moodPillTextActive: { color: Colors.stone.ink },
  inputSection: { marginBottom: 24 },
  input: {
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderWidth: 1, borderColor: 'rgba(214,211,208,0.7)',
    borderRadius: 18, padding: 16,
    fontSize: 13, color: Colors.stone.ink,
    minHeight: 140, lineHeight: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1,
  },
  saveBtn: {
    backgroundColor: Colors.stone.ink,
    paddingVertical: 16, borderRadius: 18,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 6, elevation: 3,
  },
  saveBtnDisabled: { backgroundColor: '#D6D3D1' },
  saveBtnText: { fontSize: 14, fontWeight: '600', color: Colors.cream.canvas },
  saveBtnTextDisabled: { color: Colors.stone.muted },
});
