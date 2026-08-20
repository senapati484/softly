import React from 'react';
import { View, Text, StyleSheet, ViewProps } from 'react-native';
import { Colors } from '../../theme/colors';

interface CardProps extends ViewProps {
  variant?: 'cream' | 'sage' | 'coral' | 'lavender' | 'white';
  children: React.ReactNode;
}

export function Card({ variant = 'white', style, children, ...props }: CardProps) {
  const bgColor = {
    sage: Colors.sage.background,
    coral: Colors.coral.background,
    lavender: Colors.lavender.background,
    cream: Colors.cream.card,
    white: '#FFFFFF',
  }[variant];

  return (
    <View style={[styles.card, { backgroundColor: bgColor }, style]} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(214,211,208,0.5)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
});
