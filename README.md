# Djawei — React Native app (UI build)

All Figma screens (light + dark, English + French) with static demo data.
Transfers run between the 8 UEMOA countries (Côte d'Ivoire, Senegal, Benin, Togo,
Burkina Faso, Mali, Niger, Guinea-Bissau). Every amount is in XOF — no exchange rate.
There is **no backend yet** — Firebase is intentionally not installed.

## Run

```sh
npm install
cd ios && bundle install && bundle exec pod install && cd ..   # iOS only
npm run ios       # or
npm run android
npm test          # smoke test: opens every screen
```

## Where things are

| Path | What |
| --- | --- |
| `src/theme/index.ts` | Colours (light/dark), spacing, radius, type scale from Figma |
| `src/context/PreferencesContext.tsx` | Theme + language; use `t('English', 'Français')` |
| `src/context/AppDataContext.tsx` | In-memory receiving accounts & trusted devices |
| `src/data/mock.ts` | **All static data** — replace with Firestore later |
| `src/components/` | Icon set, Screen scaffold, buttons, inputs, cards, dialogs, sheets |
| `src/navigation/` | Routes (`types.ts`), stack + tabs, floating nav bar with Scan button |
| `src/screens/` | auth, unlock, kyc, home, history, send, pay, qr, receiving, profile |

Language and dark mode are switched in **Profile → Preferences**.

## Main flows

- Splash → Onboarding → Sign up → OTP → KYC (3 steps) → Home
- Login → Home · Google → Phone number → Phone code → Home · Forgot password → Check email → New password → Updated
- Send: Recipient (choose "Sending from" country) → Amount (XOF) → Payment method → Review → redirect →
  CinetPay mobile-money checkout / Bank app / Card 3-D Secure → Success → Transfer sent (or Failed)
- Scan (centre tab) → Scanned account / Scanned recipient (demo buttons)
- Receive money → Receiving accounts → Add (type & country → details → review → added)
- Profile → personal details, recipients, limits, password, trusted devices, alerts, help, chat, legal, refer & earn, sign out → unlock

## Adding Firebase later

1. `npm i @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore`
2. Add `android/app/google-services.json` and `ios/Djawei/GoogleService-Info.plist`
   (bundle id / package: `com.djawei`), plus the `com.google.gms.google-services` Gradle plugin.
3. Replace the exports in `src/data/mock.ts` / `AppDataContext` with Firestore queries and use
   `navigationRef` (in `RootNavigator.tsx`) to route on auth state.
# newMovika
