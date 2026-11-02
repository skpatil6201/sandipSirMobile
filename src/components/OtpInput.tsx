/**
 * Code boxes (OTP / card verification / PIN preview) backed by a hidden input.
 *
 * @format
 */

import { useRef, type ComponentRef } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { useThemedStyles } from '../context/PreferencesContext';
import type { ThemeColors } from '../theme';

type Props = {
  length?: number;
  value: string;
  onChange: (v: string) => void;
  autoFocus?: boolean;
};

export default function OtpInput({ length = 6, value, onChange, autoFocus }: Props) {
  const s = useThemedStyles(makeStyles);
  const ref = useRef<ComponentRef<typeof TextInput>>(null);
  return (
    <Pressable onPress={() => ref.current?.focus()} style={s.row}>
      {Array.from({ length }).map((_, i) => {
        const ch = value[i];
        const active = i === value.length;
        return (
          <View key={i} style={[s.box, ch ? s.filled : null, active && s.active]}>
            <Text style={s.digit}>{ch ?? ''}</Text>
          </View>
        );
      })}
      <TextInput
        ref={ref}
        value={value}
        onChangeText={v => onChange(v.replace(/\D/g, '').slice(0, length))}
        keyboardType="number-pad"
        maxLength={length}
        autoFocus={autoFocus}
        style={s.hidden}
        textContentType="oneTimeCode"
      />
    </Pressable>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    row: { flexDirection: 'row', gap: 8, justifyContent: 'center' },
    box: {
      flex: 1,
      maxWidth: 52,
      height: 58,
      borderRadius: 14,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
      alignItems: 'center',
      justifyContent: 'center',
    },
    filled: { borderColor: c.text },
    active: { borderColor: c.primary },
    digit: { color: c.text, fontSize: 22, fontWeight: '700' },
    hidden: { position: 'absolute', opacity: 0, width: 1, height: 1 },
  });
