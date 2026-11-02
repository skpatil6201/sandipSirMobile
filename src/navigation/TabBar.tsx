/**
 * "Nav bar v2" from Figma: floating rounded bar with a raised Scan button.
 *
 * @format
 */

import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon, { type IconName } from '../components/Icon';
import { usePreferences, useThemedStyles } from '../context/PreferencesContext';
import type { ThemeColors } from '../theme';

const TABS: Record<string, { icon: IconName; en: string; fr: string }> = {
  Home: { icon: 'home', en: 'Home', fr: 'Accueil' },
  History: { icon: 'history', en: 'History', fr: 'Historique' },
  ScanTab: { icon: 'scan', en: 'Scan', fr: 'Scanner' },
  Notifications: { icon: 'bell', en: 'Notifications', fr: 'Notifications' },
  Profile: { icon: 'user', en: 'Profile', fr: 'Profil' },
};

export default function TabBar({ state, navigation }: BottomTabBarProps) {
  const s = useThemedStyles(makeStyles);
  const { colors, t } = usePreferences();
  const insets = useSafeAreaInsets();

  return (
    <View pointerEvents="box-none" style={[s.wrap, { bottom: Math.max(insets.bottom, 12) + 4 }]}>
      <View style={s.bar}>
        {state.routes.map((route, index) => {
          const meta = TABS[route.name];
          const focused = state.index === index;

          if (route.name === 'ScanTab') {
            return (
              <View key={route.key} style={s.tab}>
                <Pressable
                  onPress={() => navigation.navigate('QrScanner')}
                  style={({ pressed }) => [s.scan, pressed && { opacity: 0.9 }]}
                  accessibilityRole="button"
                  accessibilityLabel={t(meta.en, meta.fr)}
                >
                  <Icon name="scan" size={26} color="#FFFFFF" strokeWidth={2.2} />
                </Pressable>
                <Text style={s.label}>{t(meta.en, meta.fr)}</Text>
              </View>
            );
          }

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <Pressable
              key={route.key}
              onPress={onPress}
              style={s.tab}
              accessibilityRole="tab"
              accessibilityState={{ selected: focused }}
            >
              <View style={[s.indicator, focused && s.indicatorOn]}>
                <Icon
                  name={meta.icon}
                  size={22}
                  color={focused ? colors.primary : colors.textMuted}
                />
              </View>
              <Text
                numberOfLines={1}
                style={[s.label, focused && s.labelOn]}
              >
                {t(meta.en, meta.fr)}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const makeStyles = (c: ThemeColors) =>
  StyleSheet.create({
    wrap: { position: 'absolute', left: 16, right: 16 },
    bar: {
      height: 68,
      borderRadius: 34,
      backgroundColor: c.surface,
      borderWidth: 1,
      borderColor: c.border,
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 6,
      shadowColor: '#000',
      shadowOpacity: 0.1,
      shadowRadius: 18,
      shadowOffset: { width: 0, height: 8 },
      elevation: 10,
    },
    tab: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 3 },
    indicator: {
      width: 52,
      height: 30,
      borderRadius: 15,
      alignItems: 'center',
      justifyContent: 'center',
    },
    indicatorOn: { backgroundColor: c.primaryTintStrong },
    label: { fontSize: 11, fontWeight: '500', color: c.textMuted },
    labelOn: { fontWeight: '600', color: c.primary },
    scan: {
      width: 60,
      height: 60,
      borderRadius: 30,
      backgroundColor: c.primary,
      borderWidth: 4,
      borderColor: c.background,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: -34,
      shadowColor: c.primary,
      shadowOpacity: 0.35,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 6 },
      elevation: 8,
    },
  });
