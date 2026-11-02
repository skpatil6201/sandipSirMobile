/**
 * App-wide appearance and language preferences.
 *
 * @format
 */

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { useColorScheme } from 'react-native';
import {
  loadStoredPreferences,
  saveLanguage,
  saveThemeMode,
} from '../services/preferencesStorage';
import { darkColors, lightColors, type ThemeColors } from '../theme';
import type { Language, ThemeMode } from '../types/preferences';

export type { Language, ThemeMode, ThemeColors };

type PreferencesValue = {
  ready: boolean;
  themeMode: ThemeMode;
  setThemeMode: (mode: ThemeMode) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  isDark: boolean;
  colors: ThemeColors;
  t: (en: string, fr: string) => string;
};

const PreferencesContext = createContext<PreferencesValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const [themeMode, setThemeModeState] = useState<ThemeMode>('system');
  const [language, setLanguageState] = useState<Language>('en');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let mounted = true;
    loadStoredPreferences().then(stored => {
      if (!mounted) {
        return;
      }
      if (stored.themeMode) {
        setThemeModeState(stored.themeMode);
      }
      if (stored.language) {
        setLanguageState(stored.language);
      }
      setReady(true);
    });
    return () => {
      mounted = false;
    };
  }, []);

  const isDark =
    themeMode === 'system' ? systemScheme === 'dark' : themeMode === 'dark';
  const colors = isDark ? darkColors : lightColors;

  const setThemeMode = useCallback((mode: ThemeMode) => {
    setThemeModeState(mode);
    saveThemeMode(mode);
  }, []);

  const setLanguage = useCallback((next: Language) => {
    setLanguageState(next);
    saveLanguage(next);
  }, []);

  const t = useCallback(
    (en: string, fr: string) => (language === 'fr' ? fr : en),
    [language],
  );

  const value = useMemo<PreferencesValue>(
    () => ({
      ready,
      themeMode,
      setThemeMode,
      language,
      setLanguage,
      isDark,
      colors,
      t,
    }),
    [ready, themeMode, setThemeMode, language, setLanguage, isDark, colors, t],
  );

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences(): PreferencesValue {
  const value = useContext(PreferencesContext);
  if (!value) {
    throw new Error('usePreferences must be used inside a PreferencesProvider');
  }
  return value;
}

export function useTheme() {
  const { colors, isDark, themeMode, setThemeMode } = usePreferences();
  return { colors, isDark, themeMode, setThemeMode };
}

export function useI18n() {
  const { t, language, setLanguage } = usePreferences();
  return { t, language, setLanguage };
}

export function useThemedStyles<T>(factory: (colors: ThemeColors) => T): T {
  const { colors } = usePreferences();
  return useMemo(() => factory(colors), [factory, colors]);
}
