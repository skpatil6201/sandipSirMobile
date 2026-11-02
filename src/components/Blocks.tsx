/**
 * Small shared building blocks used across screens.
 *
 * @format
 */

import type { ReactNode } from 'react';
import {
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { usePreferences, useThemedStyles } from '../context/PreferencesContext';
import type { Transaction, TxStatus } from '../data/mock';
import { typography, type ThemeColors } from '../theme';
import { layout } from '../theme/layout';
import { xof } from '../utils/format';
import Icon, { type IconName } from './Icon';

/* ---------- Card ---------- */

export function Card({
  children,
  style,
  padded = true,
}: {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  padded?: boolean;
}) {
  const s = useThemedStyles(makeStyles);
  return <View style={[s.card, padded && s.cardPad, style]}>{children}</View>;
}

/* ---------- Icon circle ---------- */

export type Tone = 'green' | 'gold' | 'danger' | 'muted';

export function IconCircle({
  name,
  tone = 'green',
  size = 40,
  iconSize,
}: {
  name: IconName;
  tone?: Tone;
  size?: number;
  iconSize?: number;
}) {
  const { colors } = usePreferences();
  const bg = {
    green: colors.primaryTintStrong,
    gold: colors.accentTintStrong,
    danger: 'rgba(214,69,69,0.14)',
    muted: colors.surfaceMuted,
  }[tone];
  const fg = {
    green: colors.primary,
    gold: colors.accentDark,
    danger: colors.danger,
    muted: colors.textMuted,
  }[tone];
  return (
    <View
      style={[
        layout.center,
        { width: size, height: size, borderRadius: size / 2, backgroundColor: bg },
      ]}
    >
      <Icon name={name} size={iconSize ?? Math.round(size / 2)} color={fg} />
    </View>
  );
}

/* ---------- Titles ---------- */

export function PageTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.pageTitle}>
      <Text style={s.h1}>{title}</Text>
      {subtitle ? <Text style={s.lead}>{subtitle}</Text> : null}
    </View>
  );
}

export function SectionHeader({
  title,
  action,
  onAction,
  caps,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
  caps?: boolean;
}) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={s.sectionHeader}>
      <Text style={caps ? s.caps : s.sectionTitle}>{title}</Text>
      {action ? (
        <Pressable onPress={onAction} hitSlop={8}>
          <Text style={s.link}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function StepHeader({ step, total }: { step: number; total: number }) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  return (
    <View style={s.step}>
      <Text style={s.stepLabel}>
        {t(`Step ${step} of ${total}`, `Étape ${step} sur ${total}`)}
      </Text>
      <View style={s.stepTrack}>
        {Array.from({ length: total }).map((_, i) => (
          <View key={i} style={[s.stepSeg, i < step && s.stepSegOn]} />
        ))}
      </View>
    </View>
  );
}

/* ---------- Rows ---------- */

export function ListRow({
  icon,
  tone = 'green',
  leading,
  title,
  subtitle,
  value,
  onPress,
  chevron = true,
  danger,
  right,
  last,
}: {
  icon?: IconName;
  tone?: Tone;
  leading?: ReactNode;
  title: string;
  subtitle?: string;
  value?: string;
  onPress?: () => void;
  chevron?: boolean;
  danger?: boolean;
  right?: ReactNode;
  last?: boolean;
}) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [s.row, !last && s.rowDivider, pressed && s.pressed]}
    >
      {leading ??
        (icon ? <IconCircle name={icon} tone={danger ? 'danger' : tone} size={36} /> : null)}
      <View style={s.flex}>
        <Text style={[s.rowTitle, danger && { color: colors.danger }]} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={s.rowSub} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {value ? <Text style={s.rowValue}>{value}</Text> : null}
      {right}
      {onPress && chevron && !right ? (
        <Icon name="chevR" size={18} color={colors.textMuted} />
      ) : null}
    </Pressable>
  );
}

export function ToggleRow({
  icon,
  title,
  subtitle,
  value,
  onChange,
  last,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  value: boolean;
  onChange: (v: boolean) => void;
  last?: boolean;
}) {
  const { colors } = usePreferences();
  return (
    <ListRow
      icon={icon}
      title={title}
      subtitle={subtitle}
      last={last}
      right={
        <Switch
          value={value}
          onValueChange={onChange}
          trackColor={{ false: colors.border, true: colors.primary }}
          thumbColor="#FFFFFF"
          ios_backgroundColor={colors.border}
        />
      }
    />
  );
}

export function SummaryRow({
  label,
  value,
  strong,
  last,
  valueColor,
  right,
}: {
  label: string;
  value?: string;
  strong?: boolean;
  last?: boolean;
  valueColor?: string;
  right?: ReactNode;
}) {
  const s = useThemedStyles(makeStyles);
  return (
    <View style={[s.sumRow, !last && s.rowDivider]}>
      <Text style={s.sumLabel}>{label}</Text>
      {right ?? (
        <Text style={[s.sumValue, strong && s.sumStrong, valueColor ? { color: valueColor } : null]}>
          {value}
        </Text>
      )}
    </View>
  );
}

/* ---------- Notes & pills ---------- */

export function InfoNote({
  text,
  icon = 'info',
  tone = 'green',
}: {
  text: string;
  icon?: IconName;
  tone?: 'green' | 'gold' | 'danger';
}) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  const bg = { green: colors.primaryTint, gold: colors.accentTint, danger: 'rgba(214,69,69,0.10)' }[tone];
  const fg = { green: colors.primary, gold: colors.accentDark, danger: colors.danger }[tone];
  return (
    <View style={[s.note, { backgroundColor: bg }]}>
      <Icon name={icon} size={18} color={fg} />
      <Text style={s.noteText}>{text}</Text>
    </View>
  );
}

export function StatusPill({ status }: { status: TxStatus }) {
  const s = useThemedStyles(makeStyles);
  const { colors, t } = usePreferences();
  const map = {
    completed: { label: t('Completed', 'Terminé'), fg: colors.success, bg: colors.successTint },
    pending: { label: t('Pending', 'En attente'), fg: colors.accentDark, bg: colors.accentTint },
    failed: { label: t('Failed', 'Échec'), fg: colors.danger, bg: 'rgba(214,69,69,0.12)' },
  }[status];
  return (
    <View style={[s.pill, { backgroundColor: map.bg }]}>
      <Text style={[s.pillText, { color: map.fg }]}>{map.label}</Text>
    </View>
  );
}

export function Badge({ label, tone = 'green' }: { label: string; tone?: 'green' | 'gold' }) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  return (
    <View
      style={[
        s.pill,
        { backgroundColor: tone === 'green' ? colors.primaryTintStrong : colors.accentTintStrong },
      ]}
    >
      <Text style={[s.pillText, { color: tone === 'green' ? colors.primary : colors.accentDark }]}>
        {label}
      </Text>
    </View>
  );
}

/* ---------- Transaction row ---------- */

export function TransactionRow({
  tx,
  onPress,
  last,
  showStatus,
}: {
  tx: Transaction;
  onPress?: () => void;
  last?: boolean;
  showStatus?: boolean;
}) {
  const s = useThemedStyles(makeStyles);
  const { colors, t, language } = usePreferences();
  const incoming = tx.amount > 0;
  return (
    <Pressable
      onPress={onPress}
      disabled={!onPress}
      style={({ pressed }) => [s.row, !last && s.rowDivider, pressed && s.pressed]}
    >
      <IconCircle
        name={tx.icon}
        tone={tx.status === 'failed' ? 'danger' : incoming ? 'gold' : 'green'}
      />
      <View style={s.flex}>
        <Text style={s.rowTitle} numberOfLines={1}>
          {t(tx.title.en, tx.title.fr)}
        </Text>
        <Text style={s.rowSub} numberOfLines={1}>
          {t(tx.subtitle.en, tx.subtitle.fr)}
        </Text>
      </View>
      <View style={s.txRight}>
        <Text style={[s.txAmount, incoming && { color: colors.success }]}>
          {xof(tx.amount, language, { sign: true })}
        </Text>
        {showStatus ? <StatusPill status={tx.status} /> : null}
      </View>
    </Pressable>
  );
}

/* ---------- Segmented & chips ---------- */

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  style,
}: {
  options: { key: T; label: string; icon?: IconName }[];
  value: T;
  onChange: (v: T) => void;
  style?: StyleProp<ViewStyle>;
}) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  return (
    <View style={[s.seg, style]}>
      {options.map(o => {
        const on = o.key === value;
        return (
          <Pressable key={o.key} onPress={() => onChange(o.key)} style={[s.segItem, on && s.segOn]}>
            {o.icon ? (
              <Icon name={o.icon} size={16} color={on ? colors.primary : colors.textMuted} />
            ) : null}
            <Text style={[s.segText, on && s.segTextOn]}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Chip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const s = useThemedStyles(makeStyles);
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipOn]}>
      <Text style={[s.chipText, active && s.chipTextOn]}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Radio card ---------- */

export function RadioCard({
  icon,
  title,
  subtitle,
  caption,
  selected,
  onPress,
  leading,
}: {
  icon?: IconName;
  title: string;
  subtitle?: string;
  caption?: string;
  selected: boolean;
  onPress: () => void;
  leading?: ReactNode;
}) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  return (
    <Pressable onPress={onPress} style={[s.radioCard, selected && s.radioCardOn]}>
      {leading ?? (icon ? <IconCircle name={icon} size={40} /> : null)}
      <View style={s.flex}>
        <Text style={s.rowTitle}>{title}</Text>
        {subtitle ? <Text style={s.rowSub}>{subtitle}</Text> : null}
        {caption ? <Text style={s.caption}>{caption}</Text> : null}
      </View>
      <View style={[s.radio, selected && { borderColor: colors.primary }]}>
        {selected ? <View style={s.radioDot} /> : null}
      </View>
    </Pressable>
  );
}

/* ---------- Checkbox ---------- */

export function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  const s = useThemedStyles(makeStyles);
  return (
    <Pressable style={s.checkRow} onPress={() => onChange(!checked)}>
      <View style={[s.checkbox, checked && s.checkboxOn]}>
        {checked ? <Icon name="check" size={14} color="#FFFFFF" strokeWidth={3} /> : null}
      </View>
      <Text style={s.checkLabel}>{label}</Text>
    </Pressable>
  );
}

/* ---------- Result hero (success / failure pages) ---------- */

export function ResultHero({
  tone = 'success',
  icon,
  title,
  message,
}: {
  tone?: 'success' | 'danger' | 'info';
  icon?: IconName;
  title: string;
  message?: string;
}) {
  const s = useThemedStyles(makeStyles);
  const { colors } = usePreferences();
  const fg = tone === 'success' ? colors.primary : tone === 'danger' ? colors.danger : colors.accentDark;
  const bg =
    tone === 'success' ? colors.primaryTintStrong : tone === 'danger' ? 'rgba(214,69,69,0.14)' : colors.accentTintStrong;
  return (
    <View style={s.hero}>
      <View style={[s.heroRing, { backgroundColor: bg }]}>
        <View style={[s.heroCore, { backgroundColor: fg }]}>
          <Icon
            name={icon ?? (tone === 'danger' ? 'x' : 'check')}
            size={34}
            color="#FFFFFF"
            strokeWidth={3}
          />
        </View>
      </View>
      <Text style={s.heroTitle}>{title}</Text>
      {message ? <Text style={s.heroMsg}>{message}</Text> : null}
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    flex: { flex: 1 },
    pressed: { opacity: 0.7 },
    card: {
      backgroundColor: c.surface,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.border,
    },
    cardPad: { paddingHorizontal: 16 },
    pageTitle: { gap: 8, marginTop: 8, marginBottom: 20 },
    h1: { color: c.text, ...typography.title },
    lead: { color: c.textMuted, fontSize: 15, lineHeight: 22 },
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 24,
      marginBottom: 12,
    },
    sectionTitle: { color: c.text, fontSize: 17, fontWeight: '600' },
    caps: { color: c.textMuted, fontSize: 12, fontWeight: '700', letterSpacing: 0.8 },
    link: { color: c.primary, fontSize: 13, fontWeight: '600' },
    step: { gap: 8, marginBottom: 16 },
    stepLabel: { color: c.textMuted, fontSize: 13, fontWeight: '600' },
    stepTrack: { flexDirection: 'row', gap: 6 },
    stepSeg: { flex: 1, height: 4, borderRadius: 2, backgroundColor: c.border },
    stepSegOn: { backgroundColor: c.primary },
    row: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 13,
      minHeight: 64,
    },
    rowDivider: { borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: c.border },
    rowTitle: { color: c.text, fontSize: 15, fontWeight: '600' },
    rowSub: { color: c.textMuted, fontSize: 12, marginTop: 2, lineHeight: 16 },
    rowValue: { color: c.textMuted, fontSize: 13, fontWeight: '500' },
    caption: { color: c.textMuted, fontSize: 11, marginTop: 3 },
    txRight: { alignItems: 'flex-end', gap: 4 },
    txAmount: { color: c.text, fontSize: 14, fontWeight: '600' },
    sumRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 13,
      gap: 12,
    },
    sumLabel: { color: c.textMuted, fontSize: 14 },
    sumValue: { color: c.text, fontSize: 14, fontWeight: '600', flexShrink: 1, textAlign: 'right' },
    sumStrong: { fontSize: 16, fontWeight: '700', color: c.primary },
    note: {
      flexDirection: 'row',
      gap: 10,
      padding: 14,
      borderRadius: 14,
      alignItems: 'flex-start',
    },
    noteText: { flex: 1, color: c.text, fontSize: 13, lineHeight: 19 },
    pill: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      alignSelf: 'flex-start',
    },
    pillText: { fontSize: 11, fontWeight: '600' },
    seg: {
      flexDirection: 'row',
      backgroundColor: c.surfaceMuted,
      borderRadius: 12,
      padding: 4,
      gap: 4,
    },
    segItem: {
      flex: 1,
      height: 38,
      borderRadius: 9,
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'row',
      gap: 6,
    },
    segOn: {
      backgroundColor: c.surface,
      shadowColor: '#000',
      shadowOpacity: 0.08,
      shadowRadius: 4,
      shadowOffset: { width: 0, height: 1 },
      elevation: 1,
    },
    segText: { color: c.textMuted, fontSize: 13, fontWeight: '600' },
    segTextOn: { color: c.primary },
    chip: {
      paddingHorizontal: 14,
      height: 34,
      borderRadius: 17,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.surface,
      justifyContent: 'center',
    },
    chipOn: { backgroundColor: c.primary, borderColor: c.primary },
    chipText: { color: c.text, fontSize: 13, fontWeight: '600' },
    chipTextOn: { color: '#FFFFFF' },
    radioCard: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      padding: 14,
      borderRadius: 18,
      borderWidth: 1.5,
      borderColor: c.border,
      backgroundColor: c.surface,
    },
    radioCardOn: { borderColor: c.primary, backgroundColor: c.primaryTint },
    radio: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary },
    checkRow: { flexDirection: 'row', gap: 10, alignItems: 'center', paddingVertical: 6 },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 2,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    checkboxOn: { backgroundColor: c.primary, borderColor: c.primary },
    checkLabel: { flex: 1, color: c.text, fontSize: 13, lineHeight: 18 },
    hero: { alignItems: 'center', gap: 10, paddingVertical: 24 },
    heroRing: {
      width: 104,
      height: 104,
      borderRadius: 52,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    heroCore: {
      width: 72,
      height: 72,
      borderRadius: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroTitle: { color: c.text, ...typography.title, textAlign: 'center' },
    heroMsg: {
      color: c.textMuted,
      fontSize: 15,
      lineHeight: 22,
      textAlign: 'center',
      paddingHorizontal: 12,
    },
  });
