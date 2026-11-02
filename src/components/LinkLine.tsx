/**
 * "Question? Action" line, e.g. "Already have an account? Sign in".
 *
 * @format
 */

import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useThemedStyles } from '../context/PreferencesContext';
import type { ThemeColors } from '../theme';

export default function LinkLine({
  text,
  action,
  onPress,
}: {
  text: string;
  action: string;
  onPress: () => void;
}) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.row}>
      <Text style={s.text}>{text}</Text>
      <Pressable onPress={onPress} hitSlop={8}>
        <Text style={s.link}>{action}</Text>
      </Pressable>
    </View>
  );
}

export function OrDivider({ label }: { label: string }) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.or}>
      <View style={s.line} />
      <Text style={s.text}>{label}</Text>
      <View style={s.line} />
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'center', gap: 6, paddingVertical: 6, flexWrap: 'wrap' },
    text: { color: c.textMuted, fontSize: 14 },
    link: { color: c.primary, fontSize: 14, fontWeight: '700' },
    or: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 4 },
    line: { flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: c.border },
  });
