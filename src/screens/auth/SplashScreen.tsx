/**
 * Splash — brand screen, auto-advances to onboarding.
 *
 * @format
 */

import { useEffect } from 'react';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Logo from '../../components/Logo';
import { usePreferences } from '../../context/PreferencesContext';
import type { ScreenProps } from '../../navigation/types';

export default function SplashScreen({ navigation }: ScreenProps<'Splash'>) {
  const { t, colors } = usePreferences();
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const id = setTimeout(() => navigation.replace('Onboarding'), 1800);
    return () => clearTimeout(id);
  }, [navigation]);

  return (
    <View style={[s.root, { backgroundColor: colors.primaryDark, paddingBottom: insets.bottom + 40 }]}>
      <StatusBar barStyle="light-content" />
      <View style={s.center}>
        <View style={s.markWrap}>
          <Logo size={84} />
        </View>
        <Text style={s.brand}>DJAWEI</Text>
        <Text style={[s.tagline, s.taglineGold]}>Rapide et Fiable</Text>
      </View>
      <Text style={s.title}>{t('Send money across West Africa, instantly', 'Envoyez de l’argent en Afrique de l’Ouest, instantanément')}</Text>
      <Text style={s.sub}>
        {t(
          'Mobile money & bank transfers in 8 UEMOA countries',
          'Virements sécurisés entre banques et vers les comptes mobile money',
        )}
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, alignItems: 'center', paddingHorizontal: 32 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 6 },
  markWrap: {
    width: 120,
    height: 120,
    borderRadius: 36,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  brand: { color: '#FFFFFF', fontSize: 34, fontWeight: '800', letterSpacing: 4 },
  tagline: { fontSize: 14, fontWeight: '600', letterSpacing: 1 },
  title: { color: '#FFFFFF', fontSize: 20, fontWeight: '700', textAlign: 'center' },
  sub: { color: 'rgba(255,255,255,0.75)', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 20 },
  taglineGold: { color: '#EEC352' },
});
