/**
 * Device-local preference storage.
 *
 * Falls back to an in-memory map when AsyncStorage's native module is not
 * linked (for example on a dev build produced before the dependency was
 * added), so the app still runs until the next native rebuild.
 *
 * @format
 */

import type { Language, ThemeMode } from '../types/preferences';

const THEME_KEY = '@djawei/theme';
const LANGUAGE_KEY = '@djawei/language';

type Store = {
  getItem: (key: string) => Promise<string | null>;
  setItem: (key: string, value: string) => Promise<unknown>;
};

let store: Store | null | undefined;
const memory: Record<string, string> = {};

function getStore(): Store | null {
  if (store !== undefined) {
    return store;
  }
  try {
    const mod = require('@react-native-async-storage/async-storage');
    store = (mod?.default ?? mod) as Store;
  } catch {
    store = null;
  }
  return store;
}

export type StoredPreferences = {
  themeMode?: ThemeMode;
  language?: Language;
};

export async function loadStoredPreferences(): Promise<StoredPreferences> {
  const result: StoredPreferences = {};
  try {
    const active = getStore();
    const theme = active
      ? await active.getItem(THEME_KEY)
      : memory[THEME_KEY] ?? null;
    const language = active
      ? await active.getItem(LANGUAGE_KEY)
      : memory[LANGUAGE_KEY] ?? null;

    if (theme === 'system' || theme === 'light' || theme === 'dark') {
      result.themeMode = theme;
    }
    if (language === 'en' || language === 'fr') {
      result.language = language;
    }
  } catch {
    // Ignore storage failures: defaults are used.
  }
  return result;
}

async function save(key: string, value: string) {
  memory[key] = value;
  try {
    await getStore()?.setItem(key, value);
  } catch {
    // Keep the in-memory value; persistence resumes after a native rebuild.
  }
}

export function saveThemeMode(mode: ThemeMode) {
  save(THEME_KEY, mode);
}

export function saveLanguage(language: Language) {
  save(LANGUAGE_KEY, language);
}

/** Read any small device-local value (same fallback as preferences). */
export async function readLocalValue(key: string): Promise<string | null> {
  try {
    const active = getStore();
    return active ? await active.getItem(key) : memory[key] ?? null;
  } catch {
    return memory[key] ?? null;
  }
}

/** Persist any small device-local value (same fallback as preferences). */
export async function writeLocalValue(key: string, value: string) {
  memory[key] = value;
  try {
    await getStore()?.setItem(key, value);
  } catch {
    // Memory copy is kept for this session.
  }
}
