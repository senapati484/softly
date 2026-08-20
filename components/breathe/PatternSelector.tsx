import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { BreathePattern, useSoftlyStore } from '../../store/useSoftlyStore';
import { Colors } from '../../theme/colors';

interface PatternOption {
  id: BreathePattern;
  name: string;
  sub: string;
}

const OPTIONS: PatternOption[] = [
  { id: '4-7-8', name: '4-7-8 Relax', sub: 'Sleep & Anxiety' },
  { id: 'box', name: 'Box 4-4', sub: 'Mental Reset' },
  { id: 'gentle', name: 'Gentle 3-3', sub: 'Quick Centering' },
];

export function PatternSelector() {
  const { breathePattern, setBreathePattern } = useSoftlyStore();

  return (
    <View style={styles.container}>
      {OPTIONS.map((opt) => {
        const selected = breathePattern === opt.id;
        return (
          <TouchableOpacity
            key={opt.id}
            onPress={() => setBreathePattern(opt.id)}
            style={[styles.option, selected && styles.optionSelected]}
          >
            <Text style={[styles.name, selected && styles.nameSelected]}>{opt.name}</Text>
            <Text style={styles.sub}>{opt.sub}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(168,162,158,0.2)',
    borderRadius: 16,
    padding: 4,
    gap: 4,
  },
  option: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionSelected: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  name: { fontSize: 11, fontWeight: '600', color: Colors.stone.muted },
  nameSelected: { color: Colors.stone.ink },
  sub: { fontSize: 10, color: Colors.stone.muted, marginTop: 1 },
});
