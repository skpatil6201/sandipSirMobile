/**
 * Onboarding · 1–3 (swipeable).
 *
 * @format
 */

import { useRef, useState } from 'react';
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AppButton from '../../components/AppButton';
import Icon from '../../components/Icon';
import { usePreferences, useThemedStyles } from '../../context/PreferencesContext';
import { ONBOARDING } from '../../data/mock';
import type { ScreenProps } from '../../navigation/types';
import { typography, type ThemeColors } from '../../theme';

export default function OnboardingScreen({ navigation }: ScreenProps<'Onboarding'>) {
  const s = useThemedStyles(makeStyles);
  const { t } = usePreferences();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);
  const list = useRef<FlatList>(null);
  const last = index === ONBOARDING.length - 1;

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  const next = () => {
    if (last) {
      navigation.navigate('Signup');
    } else {
      list.current?.scrollToIndex({ index: index + 1 });
    }
  };

  return (
    <View style={[s.root, { paddingTop: insets.top, paddingBottom: insets.bottom + 16 }]}>
      <View style={s.top}>
        {!last ? (
          <Pressable onPress={() => navigation.navigate('Login')} hitSlop={10}>
            <Text style={s.skip}>{t('Skip', 'Passer')}</Text>
          </Pressable>
        ) : null}
      </View>

      <FlatList
        ref={list}
        data={ONBOARDING}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onScroll}
        keyExtractor={(_, i) => String(i)}
        renderItem={({ item }) => (
          <View style={[s.page, { width }]}>
            <View style={s.art}>
              <View style={s.artRing}>
                <View style={s.artCore}>
                  <Icon name={item.icon} size={56} color="#FFFFFF" strokeWidth={1.8} />
                </View>
              </View>
              <View style={[s.coin, s.coinEur]}>
                <Text style={[s.coinText, s.coinSmall]}>XOF</Text>
              </View>
              <View style={[s.coin, s.coinCfa]}>
                <Text style={[s.coinText, s.coinTextCfa]}>CFA</Text>
              </View>
            </View>
            <Text style={s.title}>{t(item.title.en, item.title.fr)}</Text>
            <Text style={s.body}>{t(item.body.en, item.body.fr)}</Text>
          </View>
        )}
      />

      <View style={s.dots}>
        {ONBOARDING.map((_, i) => (
          <View
            key={i}
            style={[s.dot, i === index && s.dotOn]}
          />
        ))}
      </View>

      <View style={s.actions}>
        <AppButton
          title={last ? t('Get started', 'Commencer') : t('Next', 'Suivant')}
          onPress={next}
          iconRight="arrow"
        />
        <View style={s.signin}>
          <Text style={s.muted}>{t('Already have an account?', 'Déjà un compte ?')}</Text>
          <Pressable onPress={() => navigation.navigate('Login')} hitSlop={8}>
            <Text style={s.link}>{t('Sign in', 'Se connecter')}</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    root: { flex: 1, backgroundColor: c.background },
    top: { height: 48, alignItems: 'flex-end', justifyContent: 'center', paddingHorizontal: 24 },
    skip: { color: c.textMuted, fontWeight: '600', fontSize: 15 },
    page: { paddingHorizontal: 28, alignItems: 'center', justifyContent: 'center' },
    art: { width: 260, height: 260, alignItems: 'center', justifyContent: 'center', marginBottom: 36 },
    artRing: {
      width: 220,
      height: 220,
      borderRadius: 110,
      backgroundColor: c.primaryTint,
      alignItems: 'center',
      justifyContent: 'center',
    },
    artCore: {
      width: 132,
      height: 132,
      borderRadius: 66,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    coin: {
      position: 'absolute',
      width: 54,
      height: 54,
      borderRadius: 27,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 3,
      borderColor: c.background,
    },
    coinEur: { top: 30, right: 22, backgroundColor: c.primaryLight },
    coinCfa: { bottom: 34, left: 18, backgroundColor: '#EEC352' },
    coinText: { color: '#FFFFFF', fontWeight: '800', fontSize: 20 },
    coinSmall: { fontSize: 13 },
    title: { color: c.text, ...typography.title, fontSize: 26, lineHeight: 32, textAlign: 'center' },
    body: { color: c.textMuted, fontSize: 15, lineHeight: 22, textAlign: 'center', marginTop: 12 },
    dots: { flexDirection: 'row', justifyContent: 'center', gap: 6, marginVertical: 20 },
    dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: c.border },
    actions: { paddingHorizontal: 24, gap: 14 },
    signin: { flexDirection: 'row', justifyContent: 'center', gap: 6 },
    muted: { color: c.textMuted, fontSize: 14 },
    link: { color: c.primary, fontSize: 14, fontWeight: '700' },
    coinTextCfa: { color: '#2B1D00', fontSize: 13 },
    dotOn: { width: 18, backgroundColor: c.primary },
  });
