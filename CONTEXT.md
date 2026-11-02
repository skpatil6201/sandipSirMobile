# Djawei — Project Context

> Single source of truth for this project's requirements, decisions and history.
> **AI assistants: read this file first, and add a dated entry to the History section after every work session.**

_Last updated: 1 November 2026_

---

## 1. What Djawei is

A mobile money-transfer app (Android + iOS) that lets people **send and receive money between the 8 UEMOA countries**:

| Code | Country | Dial |
| --- | --- | --- |
| CI | Côte d'Ivoire | +225 |
| SN | Senegal / Sénégal | +221 |
| BJ | Benin / Bénin | +229 |
| TG | Togo | +228 |
| BF | Burkina Faso | +226 |
| ML | Mali | +223 |
| NE | Niger | +227 |
| GW | Guinea-Bissau / Guinée-Bissau | +245 |

- Single currency: **XOF (CFA franc)**. There is **no exchange rate** anywhere in the app.
- **No wallet**: money goes from the sender's mobile money / bank / card straight to the recipient's mobile-money or bank account.
- Brand: green `#036F1A`, gold `#C9992B`, black. Name "DJAWEI", tagline "Rapide et Fiable".

## 2. Requirements (from the owner)

1. Build the app in **React Native** (StyleSheet styling) for **Android and iOS**.
2. Recreate **every screen from the Figma file** with **static/demo data**.
3. Every screen in **English and French**, with **light and dark** theme.
4. **Backend = Firebase**, which the owner sets up. The app must not include Firebase yet.
5. Countries: only the 8 UEMOA countries; send and receive between each other. (Earlier versions targeted Europe → Africa; that was dropped on 1 Nov 2026.)
6. Payments: mobile money (Orange, MTN, Moov, Wave), bank account, card (Visa, Mastercard, GIM-UEMOA).
7. Receiving accounts: bank or mobile money only, 8 UEMOA countries, XOF, numbers masked to last digits, brand names never translated.
8. When app screens change, **update the Figma file** to match.
9. Do **not commit** to git unless asked.

## 3. Locations

| What | Where |
| --- | --- |
| This project | `~/Desktop/TEJAS/African Place/New.. DJAWEI` |
| Old project (reference only, had Firebase) | `~/Desktop/TEJAS/African Place/AfricanPay. .. Old` |
| Figma file | https://www.figma.com/design/1JkwvUBekbUpG82NSc1foY/Frountend-Movika (page "Screens") |
| Setup guide (Claude Doc) | https://claude.ai/artifact/3poZFGinih2jhNp6saG7Dd |
| Setup guide PDF | `Djawei-Third-Party-Services-Setup-Guide.pdf` in this folder |

## 4. Tech stack

- React Native **0.87**, React 19.2, TypeScript
- `@react-navigation/native`, `native-stack`, `bottom-tabs` (v7)
- `react-native-svg` (all icons + home banner), `react-native-qrcode-svg` (My QR)
- `react-native-safe-area-context`, `react-native-screens`
- `@react-native-async-storage/async-storage` (theme + language preference)
- Removed on purpose: Firebase, Google Sign-In, vision-camera (QR scanner is a placeholder).
- App name/bundle: **Djawei**, Android package and iOS bundle id `com.djawei`.
- RN 0.87 quirk: `react-native-svg` imports `@react-native/assets-registry/registry`; this is redirected in `metro.config.js` and `jest.config.js` to `react-native/src/asset-registry.js`.

Run:

```sh
npm install
cd ios && bundle exec pod install && cd ..
npm run ios      # or npm run android
npm test         # smoke test that opens all 57 screens
```

## 5. Code structure

```
App.tsx                         SafeArea → Preferences → AppData → RootNavigator
src/theme/index.ts              light/dark colours, spacing, radius, typography (from Figma)
src/theme/layout.ts             shared small styles (mt12, flex1, …)
src/context/PreferencesContext  theme + language; t('English','Français'); useThemedStyles
src/context/AppDataContext      in-memory state: senderCountry, receiving accounts, trusted devices
src/services/preferencesStorage AsyncStorage wrapper with in-memory fallback
src/data/mock.ts                ALL demo data (user, countries, recipients, transactions,
                                payment methods, notifications, accounts, devices, onboarding,
                                feeFor()) — replace with Firestore later
src/utils/format.ts             xof(n, lang, {sign}) → "75,000 XOF" / "75 000 XOF"; num()
src/components/                 Icon, Screen, AppButton, AppTextInput, Blocks (cards, rows,
                                pills, segmented, radio, result hero…), Avatar, AppDialog,
                                BottomSheet, OtpInput, LinkLine, Logo
src/navigation/types.ts         every route + params
src/navigation/RootNavigator    one native stack + "Main" tabs; exports navigationRef
src/navigation/TabBar.tsx       Figma "Nav bar v2": floating bar, raised centre Scan button
src/screens/…                   auth, unlock, kyc, home, history, send, pay, qr,
                                receiving, profile
__tests__/App.test.tsx          renders the app and navigates to every screen
```

Conventions:
- Text is always `t('English', 'Français')`; brand names are never translated.
- Colours only from theme tokens via `useThemedStyles(makeStyles)`; no inline styles (lint rule).
- Amounts always through `xof()`. Demo fee = `feeFor(amount)` = 1% (min 100 XOF).

## 6. Screens (57 routes) and main flows

- **Welcome & sign in:** Splash → Onboarding (3) → Sign up → OTP → KYC; Login; Google → Phone number → Phone code; Forgot password → Check email → New password → Password updated.
- **App unlock:** Fingerprint (→ success), PIN keypad.
- **KYC:** Personal details → Identity document → Selfie → "Submitted" pop-up.
- **Tabs:** Home, History (+ transaction sheet), Scan (opens scanner), Notifications, Profile.
- **Home extras:** Recipients, Support, Refer & earn card, quick actions (Send, Receive, Scan, Methods).
- **Send:** Recipient (with **"Sending from" country picker** + add-recipient sheet) → Amount (XOF) → Payment method (Auto, Mobile money, Bank, Card) → Review (route, fee, total) → redirect pop-up → **CinetPay mobile-money checkout** / **Bank app (Ecobank)** / **Card 3-D Secure** → Processing → Payment successful / failed → Transfer sent.
- **QR:** My QR code, QR scanner (placeholder + demo buttons), Scanned account, Scanned recipient (with / without receiving account).
- **Receive:** Receive money (default account or "add one"), Payment methods.
- **Receiving accounts:** list / empty / options sheet / remove confirm; Add: type & country (+ country picker) → bank or mobile-money details → review → added.
- **Profile:** preferences (Light/Dark, EN/FR), Personal details, Saved recipients, Transfer limits, Change password, Trusted devices (remove + sign-out-all pop-ups), Transaction alerts, Help centre, Help article, Live chat, Contact support, Terms, Privacy, Refer & earn, Sign out confirm → Unlock.

Demo user: **Aminata Diallo**, Abidjan, Côte d'Ivoire, +225 07 12 34 56 78, referral code AMINATA25.
Demo limits: 2,000,000 XOF/month unverified, 10,000,000 XOF after KYC (placeholders).

## 7. Figma file notes

- File key `1JkwvUBekbUpG82NSc1foY`, page **Screens**. Sections exist in English, French (`FR · …`) and French dark (`FR · Sombre · …`). There is no English dark section.
- English section ids: Welcome 1:2615 · Unlock 229:15200 · KYC 1:2616 · Home 229:15201 · Main tabs 1:2617 · Send 1:2618 · QR 1:2619 · Payment 218:4153 · Receiving 254:4241 · Profile 229:15202 · Nav bar component 218:8065.
- French: 5:1031, 229:15295, 5:1425, 229:15296, 5:1516, 5:1841, 5:2175, 218:4680, 256:17893, 229:15297.
- French dark: 17:72961, 229:15390, 17:72962, 229:15391, 17:72963, 17:72964, 17:72965, 218:5202, 256:18727, 229:15392.
- How edits are made: Figma MCP hit the free-plan limit, so changes are made with Plugin-API scripts typed into the **Figma desktop DevTools console** (Help → Troubleshooting → Toggle Web App Developer Tools). Results are stored on `window` and read back with `copy(...)` + clipboard.
- SEPA and TerraPay option rows are **hidden, not deleted** (restorable).

## 8. Third-party services plan (backend, to be set up by owner)

Full guide: Claude Doc / PDF above. Summary:

1. **Licence:** BCEAO approval (Instruction n°001-01-2024) or an approved partner; AML policy; CENTIF; per-country data authority.
2. **Firebase (Blaze):** Auth (phone, email, Google, Apple), Firestore, Cloud Functions (all money logic), Secret Manager, App Check, FCM.
3. **KYC/AML:** Sumsub, Veriff, Onfido or Smile ID.
4. **Mobile money collect + payout:** CinetPay (main), PayDunya (backup); keep an XOF float; daily reconciliation.
5. **Bank transfers:** partner bank; later BCEAO **PI-SPI** instant network.
6. **Cards:** through CinetPay (Visa, Mastercard, GIM-UEMOA, 3-D Secure).
7. **Messaging:** Firebase SMS / Twilio, Brevo/SendGrid email, FCM push, Crisp chat, optional WhatsApp.
8. **Stores:** Apple $99/yr, Google $25 once, Sign in with Apple required on iOS.

Not needed any more: Stripe, TrueLayer/Tink, SEPA, EU licence, TerraPay, FX feed.

## 9. Status

Done:
- [x] Native scaffold (copied from old project, renamed to Djawei, Firebase stripped)
- [x] All Figma screens built with static data, EN/FR, light/dark
- [x] Converted to 8-country UEMOA, XOF only
- [x] TypeScript, ESLint and the all-screens Jest test pass
- [x] Figma updated to match (EN, FR, FR dark)
- [x] Third-party setup guide (doc + PDF)

Not done / next:
- [ ] Run on a real device / simulator and fix visual differences from Figma
- [ ] Add Firebase (`@react-native-firebase/*`, config files, Auth, Firestore)
- [ ] Replace `src/data/mock.ts` and `AppDataContext` with Firestore + Cloud Functions
- [ ] Real QR scanner (camera library) and real QR payloads
- [ ] Integrate KYC SDK, CinetPay, bank / PI-SPI
- [ ] Real fees, limits and referral amounts (current ones are placeholders)
- [ ] Sign in with Apple button
- [ ] App icons and splash assets for stores

## 10. History

| Date | What happened |
| --- | --- |
| Oct 2026 | Figma design work in "Frountend-Movika": receiving-account screens, prototype links, French + French dark versions, nav bar on all tab screens, scrolling, trusted-device pop-ups, forgot-password flow, wallet screens removed, Refer & earn, success pop-ups. |
| Oct 2026 | Old project (AfricanPay, with Firebase) got receiving accounts, forgot password, Refer & earn, personal details, change password, trusted devices. Owner then decided to start a fresh project. |
| 31 Oct 2026 | New project created in "New.. DJAWEI": native folders copied from old project and renamed (Movika → Djawei, `com.djawei`), Firebase / Google Sign-In / camera removed. All Figma screens built with static data, EN/FR, light/dark, floating nav bar. Typecheck, lint, bundle and all-screens test passed. |
| 31 Oct 2026 | Inline-style lint warnings cleaned up (shared `src/theme/layout.ts`). |
| 1 Nov 2026 | Researched third-party services; created setup guide (Claude Doc + PDF). Explained Step 1 in Marathi on request. |
| 1 Nov 2026 | **Scope changed to the 8 UEMOA countries only (XOF, no Europe).** App converted: XOF everywhere, "Sending from" country picker, payment methods = mobile money / bank / card, CinetPay checkout, Ecobank bank approval, demo user moved to Abidjan, all texts EN/FR updated. Guide + PDF rewritten for BCEAO, CinetPay, PI-SPI. |
| 1 Nov 2026 | Figma updated to match: 697 text layers changed across 50 screens × 3 versions (EN, FR, FR dark); SEPA/TerraPay rows hidden; "Sending from" line added; checkout PIN reduced to 4 boxes. |
| 1 Nov 2026 | This CONTEXT.md created. |

---

### Rules for AI assistants working on this project

1. Read this file before changing anything; update the History table and Status when done.
2. Keep EN and FR in sync for every text change, and keep light/dark working.
3. If a screen changes in code, update the same screen in Figma (EN, FR, FR dark), and vice versa.
4. Only the 8 UEMOA countries and XOF. Never re-add EUR, SEPA, TerraPay or exchange rates unless the owner asks.
5. No Firebase code until the owner asks. Keep demo data in `src/data/mock.ts`.
6. Run `tsc`, `eslint` and `npm test` before finishing. Don't commit unless asked.
