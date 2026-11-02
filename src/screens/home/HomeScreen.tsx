/**
 * Home (Figma 218:8535).
 *
 * @format
 */

import { useState } from 'react';
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import Avatar from '../../components/Avatar';
import { Card, SectionHeader, TransactionRow } from '../../components/Blocks';
import Icon, { type IconName } from '../../components/Icon';
import Screen from '../../components/Screen';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { RECIPIENTS, TRANSACTIONS, USER } from '../../data/mock';
import type { RootStackParamList } from '../../navigation/types';
import type { ThemeColors } from '../../theme';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { layout } from '../../theme/layout';

type Nav = NativeStackNavigationProp<RootStackParamList>;

export default function HomeScreen() {
  const s = useThemedStyles(makeStyles);
  const { colors, t } = usePreferences();
  const navigation = useNavigation<Nav>();
  const { width } = useWindowDimensions();
  const bannerW = width - 40;
  const [slide, setSlide] = useState(0);

  const actions: { icon: IconName; label: string; onPress: () => void }[] = [
    { icon: 'send', label: t('Send', 'Envoyer'), onPress: () => navigation.navigate('SendRecipient') },
    { icon: 'receive', label: t('Receive', 'Recevoir'), onPress: () => navigation.navigate('ReceiveMoney') },
    { icon: 'scan', label: t('Scan', 'Scanner'), onPress: () => navigation.navigate('QrScanner') },
    { icon: 'card', label: t('Methods', 'Moyens'), onPress: () => navigation.navigate('PaymentMethods') },
  ];

  const slides = [
    {
      badge: t('NEW · 8 COUNTRIES', 'NOUVEAU · 8 PAYS'),
      title: t('Send money across West Africa', 'Envoyez de l’argent en Afrique de l’Ouest'),
      sub: t('Mobile money or bank, between 8 UEMOA countries', 'Mobile money ou banque, entre 8 pays de l’UEMOA'),
      cta: t('Send now', 'Envoyer'),
      onPress: () => navigation.navigate('SendRecipient'),
    },
    {
      badge: t('SAME CURRENCY', 'MÊME MONNAIE'),
      title: t('No exchange rate, ever', 'Jamais de taux de change'),
      sub: t('XOF to XOF, one clear fee', 'De XOF à XOF, des frais clairs'),
      cta: t('Send now', 'Envoyer'),
      onPress: () => navigation.navigate('SendRecipient'),
    },
    {
      badge: t('REFER & EARN', 'PARRAINAGE'),
      title: t('Give 2,000 XOF, get 2,000 XOF', 'Offrez 2 000 XOF, recevez 2 000 XOF'),
      sub: t('For every friend you invite', 'Pour chaque ami invité'),
      cta: t('Invite', 'Inviter'),
      onPress: () => navigation.navigate('ReferEarn'),
    },
  ];

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setSlide(Math.round(e.nativeEvent.contentOffset.x / (bannerW + 12)));

  return (
    <Screen
      tabs
      contentStyle={s.content}
      header={
        <View style={s.header}>
          <View>
            <Text style={s.hello}>{t('Hello,', 'Bonjour,')}</Text>
            <Text style={s.name}>{USER.firstName}</Text>
          </View>
          <Pressable style={s.helpBtn} onPress={() => navigation.navigate('Support')} accessibilityLabel="Support">
            <Icon name="help" size={22} color={colors.primary} />
          </Pressable>
        </View>
      }
    >
      {/* Promo banner carousel */}
      <ScrollView
        horizontal
        snapToInterval={bannerW + 12}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        contentContainerStyle={layout.gap12}
      >
        {slides.map((b, i) => (
          <View key={i} style={[s.banner, { width: bannerW }]}>
            <Svg style={StyleSheet.absoluteFill} width={bannerW} height={200}>
              <Defs>
                <LinearGradient id={`g${i}`} x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#0A8F2E" />
                  <Stop offset="1" stopColor="#013D11" />
                </LinearGradient>
              </Defs>
              <Rect width={bannerW} height={200} rx={24} fill={`url(#g${i})`} />
              <Circle cx={bannerW - 40} cy={30} r={90} fill="rgba(255,255,255,0.06)" />
              <Circle cx={bannerW - 10} cy={180} r={60} fill="rgba(255,255,255,0.05)" />
            </Svg>
            <View style={s.bannerArt}>
              <View style={s.phone}>
                <View style={s.coinEur}>
                  <Text style={[s.coinText, s.coinSmall]}>XOF</Text>
                </View>
                <View style={s.coinCfa}>
                  <Text style={[s.coinText, s.coinTextCfa]}>CFA</Text>
                </View>
              </View>
            </View>
            <View style={s.bannerBody}>
              <View style={s.badge}>
                <Text style={s.badgeText}>{b.badge}</Text>
              </View>
              <Text style={s.bannerTitle}>{b.title}</Text>
              <Text style={s.bannerSub}>{b.sub}</Text>
              <Pressable style={s.cta} onPress={b.onPress}>
                <Text style={s.ctaText}>{b.cta}</Text>
                <Icon name="arrow" size={16} color="#2B1D00" strokeWidth={2.4} />
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
      <View style={s.dots}>
        {slides.map((_, i) => (
          <View key={i} style={[s.dot, i === slide && s.dotOn]} />
        ))}
      </View>

      {/* Refer & earn */}
      <Pressable style={s.refer} onPress={() => navigation.navigate('ReferEarn')}>
        <View style={s.referIcon}>
          <Text style={s.referEmoji}>🎁</Text>
        </View>
        <View style={layout.flex1}>
          <Text style={s.referTitle}>{t('Refer & earn', 'Parrainez et gagnez')}</Text>
          <Text style={s.referSub}>
            {t('Give 2,000 XOF, get 2,000 XOF for every friend', 'Offrez 2 000 XOF, recevez 2 000 XOF par ami')}
          </Text>
        </View>
        <Icon name="chevR" size={18} color={colors.textMuted} />
      </Pressable>

      {/* Quick actions */}
      <View style={s.actions}>
        {actions.map(a => (
          <Pressable key={a.label} style={s.action} onPress={a.onPress}>
            <View style={s.actionIcon}>
              <Icon name={a.icon} size={20} color={colors.primary} />
            </View>
            <Text style={s.actionLabel} numberOfLines={1}>
              {a.label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Send again */}
      <SectionHeader
        title={t('Send again', 'Envoyer à nouveau')}
        action={t('See all', 'Tout voir')}
        onAction={() => navigation.navigate('Recipients')}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.people}>
        <Pressable style={s.person} onPress={() => navigation.navigate('SendRecipient')}>
          <View style={s.newCircle}>
            <Icon name="plus" size={22} color={colors.primary} />
          </View>
          <Text style={s.personName}>{t('New', 'Nouveau')}</Text>
        </Pressable>
        {RECIPIENTS.map(r => (
          <Pressable key={r.id} style={s.person} onPress={() => navigation.navigate('SendAmount', { recipientId: r.id })}>
            <Avatar initials={r.initials} tone={r.tone} size={56} />
            <Text style={s.personName}>{r.short}</Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Recent activity */}
      <SectionHeader
        title={t('Recent activity', 'Activité récente')}
        action={t('See all', 'Tout voir')}
        onAction={() => navigation.navigate('Main', { screen: 'History' })}
      />
      <Card>
        {TRANSACTIONS.slice(0, 3).map((tx, i) => (
          <TransactionRow key={tx.id} tx={tx} last={i === 2} onPress={() => navigation.navigate('Main', { screen: 'History' })} />
        ))}
      </Card>
    </Screen>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    content: { paddingTop: 16 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 12,
    },
    hello: { color: c.textMuted, fontSize: 14 },
    name: { color: c.text, fontSize: 28, fontWeight: '700' },
    helpBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      alignItems: 'center',
      justifyContent: 'center',
    },
    banner: { height: 200, borderRadius: 24, overflow: 'hidden' },
    bannerBody: { flex: 1, padding: 20, justifyContent: 'center', maxWidth: '68%' },
    badge: {
      alignSelf: 'flex-start',
      backgroundColor: 'rgba(255,255,255,0.16)',
      borderRadius: 999,
      paddingHorizontal: 10,
      paddingVertical: 4,
      marginBottom: 10,
    },
    badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '600' },
    bannerTitle: { color: '#FFFFFF', fontSize: 21, fontWeight: '700', lineHeight: 26 },
    bannerSub: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 6 },
    cta: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      alignSelf: 'flex-start',
      backgroundColor: '#EEC352',
      borderRadius: 999,
      paddingHorizontal: 16,
      height: 36,
      marginTop: 14,
    },
    ctaText: { color: '#2B1D00', fontWeight: '700', fontSize: 13 },
    bannerArt: { position: 'absolute', right: 18, top: 0, bottom: 0, justifyContent: 'center' },
    phone: {
      width: 74,
      height: 130,
      borderRadius: 16,
      borderWidth: 3,
      borderColor: 'rgba(255,255,255,0.55)',
      backgroundColor: 'rgba(255,255,255,0.1)',
      transform: [{ rotate: '8deg' }],
    },
    coinEur: {
      position: 'absolute',
      left: -18,
      top: 18,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#0A8F2E',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    coinCfa: {
      position: 'absolute',
      right: -16,
      bottom: 18,
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: '#EEC352',
      borderWidth: 2,
      borderColor: '#FFFFFF',
      alignItems: 'center',
      justifyContent: 'center',
    },
    coinText: { color: '#FFFFFF', fontWeight: '800', fontSize: 16 },
    coinSmall: { fontSize: 11 },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 12 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.border },
    dotOn: { width: 18, backgroundColor: c.primary },
    refer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      backgroundColor: c.accentTint,
      borderRadius: 16,
      padding: 14,
      marginTop: 16,
    },
    referIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(201,153,43,0.22)',
      alignItems: 'center',
      justifyContent: 'center',
    },
    referTitle: { color: c.text, fontSize: 15, fontWeight: '600' },
    referSub: { color: c.textMuted, fontSize: 13, marginTop: 2 },
    actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
    action: {
      flex: 1,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      borderRadius: 18,
      paddingVertical: 14,
      paddingHorizontal: 4,
      alignItems: 'center',
      gap: 8,
    },
    actionIcon: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: c.primaryTintStrong,
      alignItems: 'center',
      justifyContent: 'center',
    },
    actionLabel: { color: c.text, fontSize: 12, fontWeight: '600' },
    people: { gap: 14 },
    person: { alignItems: 'center', gap: 6, width: 60 },
    newCircle: {
      width: 56,
      height: 56,
      borderRadius: 28,
      borderWidth: 1.5,
      borderStyle: 'dashed',
      borderColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    personName: { color: c.text, fontSize: 12, fontWeight: '500' },
    coinTextCfa: { color: '#2B1D00', fontSize: 11 },
    referEmoji: { fontSize: 20 },
  });
