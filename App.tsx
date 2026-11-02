/**
 * Djawei — React Native app (static UI build, EN/FR, light/dark).
 *
 * Firebase is not wired yet: all data comes from src/data/mock.ts.
 *
 * @format
 */

import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppDataProvider } from './src/context/AppDataContext';
import { PreferencesProvider } from './src/context/PreferencesContext';
import RootNavigator from './src/navigation/RootNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <PreferencesProvider>
        <AppDataProvider>
          <RootNavigator />
        </AppDataProvider>
      </PreferencesProvider>
    </SafeAreaProvider>
  );
}
