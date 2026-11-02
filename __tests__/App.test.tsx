/**
 * Smoke test: renders the app and opens every screen with demo params.
 *
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '../App';
import { navigationRef } from '../src/navigation/RootNavigator';
import type { RootStackParamList } from '../src/navigation/types';

jest.mock('react-native-safe-area-context', () =>
  require('react-native-safe-area-context/jest/mock').default,
);
jest.useFakeTimers();

const T = { recipientId: 'r1', amount: 120, method: 'auto' as const };

const ROUTES: Array<[keyof RootStackParamList, object | undefined]> = [
  ['Onboarding', undefined], ['Login', undefined], ['Signup', undefined], ['Otp', undefined],
  ['PhoneNumber', undefined], ['PhoneCode', undefined], ['ForgotPassword', undefined],
  ['CheckEmail', undefined], ['NewPassword', undefined], ['PasswordUpdated', undefined],
  ['UnlockFingerprint', undefined], ['UnlockPin', undefined],
  ['KycPersonal', undefined], ['KycDocument', undefined], ['KycSelfie', undefined],
  ['Main', { screen: 'Home' }], ['Main', { screen: 'History' }], ['Main', { screen: 'Notifications' }],
  ['Main', { screen: 'Profile' }], ['Recipients', undefined], ['Support', undefined],
  ['SendRecipient', undefined], ['SendAmount', { recipientId: 'r2' }], ['SendPayment', { recipientId: 'r1', amount: 120 }],
  ['SendReview', T], ['TransferSent', T], ['ScannedRecipient', { hasAccount: true }], ['ScannedRecipient', { hasAccount: false }],
  ['SecureGateway', T], ['BankApp', T], ['CardVerification', T],
  ['PaymentResult', { ...T, success: true }], ['PaymentResult', { ...T, success: false }],
  ['MyQr', undefined], ['QrScanner', undefined], ['ScannedAccount', undefined], ['PaymentMethods', undefined], ['ReceiveMoney', undefined],
  ['ReceivingAccounts', undefined], ['AddAccountType', undefined], ['AddBankDetails', { countryCode: 'SN' }],
  ['AddMobileDetails', { countryCode: 'CI' }], ['AddAccountReview', { type: 'mobile', countryCode: 'CI', provider: 'Orange Money' }],
  ['AccountAdded', { provider: 'Orange Money', countryCode: 'CI' }],
  ['PersonalDetails', undefined], ['SavedRecipients', undefined], ['TransferLimits', undefined], ['ChangePassword', undefined],
  ['TrustedDevices', undefined], ['TransactionAlerts', undefined], ['HelpCentre', undefined], ['HelpArticle', undefined],
  ['LiveChat', undefined], ['ContactSupport', undefined], ['Terms', undefined], ['Privacy', undefined], ['ReferEarn', undefined],
];

test('every screen renders', async () => {
  let root: ReactTestRenderer.ReactTestRenderer | undefined;
  await ReactTestRenderer.act(async () => {
    root = ReactTestRenderer.create(<App />);
  });
  for (const [name, params] of ROUTES) {
    await ReactTestRenderer.act(async () => {
      (navigationRef.navigate as (n: string, p?: object) => void)(name, params);
    });
    expect(navigationRef.getCurrentRoute()?.name).toBe(
      name === 'Main' ? (params as { screen: string }).screen : name,
    );
  }
  await ReactTestRenderer.act(async () => root?.unmount());
}, 60000);
