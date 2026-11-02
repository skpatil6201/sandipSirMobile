/**
 * Standard screen scaffold: safe area, header with back button, scroll body
 * and an optional pinned footer (primary actions).
 *
 * @format
 */

import { useNavigation } from '@react-navigation/native';
import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { usePreferences, useThemedStyles } from '../context/PreferencesContext';
import { spacing, typography, type ThemeColors } from '../theme';
import Icon from './Icon';

/** Height reserved under tab screens for the floating nav bar. */
export const TAB_BAR_SPACE = 120;

type Props = {
  title?: string;
  /** Show the back button (default true when a title is given). */
  back?: boolean;
  onBack?: () => void;
  right?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  scroll?: boolean;
  /** Leave room for the floating tab bar. */
  tabs?: boolean;
  contentStyle?: StyleProp<ViewStyle>;
  /** Custom header replacing the default one. */
  header?: ReactNode;
};

export default function Screen({
  title,
  back,
  onBack,
  right,
  children,
  footer,
  scroll = true,
  tabs,
  contentStyle,
  header,
}: Props) {
  const styles = useThemedStyles(makeStyles);
  const { colors, isDark } = usePreferences();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const showBack = back ?? title !== undefined;

  const headerNode =
    header ??
    (title !== undefined || right ? (
      <View style={styles.header}>
        <View style={styles.side}>
          {showBack ? (
            <Pressable
              onPress={onBack ?? (() => navigation.goBack())}
              style={styles.backBtn}
              hitSlop={8}
              accessibilityRole="button"
              accessibilityLabel="Back"
            >
              <Icon name="back" size={22} color={colors.text} strokeWidth={2.4} />
            </Pressable>
          ) : null}
        </View>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        <View style={[styles.side, styles.sideRight]}>{right}</View>
      </View>
    ) : null);

  const bottomPad = tabs ? TAB_BAR_SPACE + insets.bottom : spacing.xl;

  const body = scroll ? (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={[
        styles.content,
        { paddingBottom: footer ? spacing.lg : bottomPad },
        contentStyle,
      ]}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.flex, styles.content, contentStyle]}>{children}</View>
  );

  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
      {headerNode}
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {body}
        {footer ? (
          <View
            style={[
              styles.footer,
              { paddingBottom: Math.max(insets.bottom, spacing.md) },
            ]}
          >
            {footer}
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    flex: { flex: 1 },
    header: {
      height: 56,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 20,
    },
    side: { width: 56, flexDirection: 'row' },
    sideRight: { justifyContent: 'flex-end' },
    title: {
      flex: 1,
      textAlign: 'center',
      color: c.text,
      ...typography.navTitle,
    },
    backBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: { paddingHorizontal: 20, paddingTop: spacing.sm },
    footer: {
      paddingHorizontal: 20,
      paddingTop: spacing.sm,
      gap: spacing.sm,
      backgroundColor: c.background,
    },
  });
