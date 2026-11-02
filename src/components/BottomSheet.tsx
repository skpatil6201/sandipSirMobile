/**
 * Simple bottom sheet built on Modal.
 *
 * @format
 */

import type { ReactNode } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useThemedStyles } from '../context/PreferencesContext';
import { typography, type ThemeColors } from '../theme';

type Props = {
  visible: boolean;
  onClose: () => void;
  title?: string;
  subtitle?: string;
  children: ReactNode;
  maxHeight?: number | `${number}%`;
};

export default function BottomSheet({
  visible,
  onClose,
  title,
  subtitle,
  children,
  maxHeight = '85%',
}: Props) {
  const s = useThemedStyles(makeStyles);
  const insets = useSafeAreaInsets();
  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={s.root}>
        <Pressable style={s.overlay} onPress={onClose} />
        <View style={[s.sheet, { maxHeight, paddingBottom: Math.max(insets.bottom, 16) }]}>
          <View style={s.handle} />
          {title ? <Text style={s.title}>{title}</Text> : null}
          {subtitle ? <Text style={s.subtitle}>{subtitle}</Text> : null}
          <ScrollView
            bounces={false}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={s.body}
          >
            {children}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, justifyContent: 'flex-end' },
    overlay: { ...StyleSheet.absoluteFill, backgroundColor: c.overlay },
    sheet: {
      backgroundColor: c.surface,
      borderTopLeftRadius: 28,
      borderTopRightRadius: 28,
      paddingHorizontal: 20,
      paddingTop: 10,
    },
    handle: {
      alignSelf: 'center',
      width: 40,
      height: 5,
      borderRadius: 3,
      backgroundColor: c.border,
      marginBottom: 14,
    },
    title: { color: c.text, ...typography.heading },
    subtitle: { color: c.textMuted, fontSize: 13, marginTop: 4 },
    body: { paddingTop: 12, gap: 10 },
  });
