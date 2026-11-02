/**
 * Route names and params for every screen.
 *
 * @format
 */

import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { PaymentMethodKey } from '../data/mock';

export type TabParamList = {
  Home: undefined;
  History: undefined;
  ScanTab: undefined;
  Notifications: undefined;
  Profile: undefined;
};

/** Transfer draft passed through the send flow. */
export type TransferParams = {
  recipientId: string;
  amount: number;
  method: PaymentMethodKey;
};

export type RootStackParamList = {
  // Welcome & sign in
  Splash: undefined;
  Onboarding: undefined;
  Login: undefined;
  Signup: undefined;
  Otp: undefined;
  PhoneNumber: undefined;
  PhoneCode: undefined;
  ForgotPassword: undefined;
  CheckEmail: undefined;
  NewPassword: undefined;
  PasswordUpdated: undefined;
  // App unlock
  UnlockFingerprint: undefined;
  UnlockPin: undefined;
  // KYC
  KycPersonal: undefined;
  KycDocument: undefined;
  KycSelfie: undefined;
  // Main
  Main: NavigatorScreenParams<TabParamList> | undefined;
  Recipients: undefined;
  Support: undefined;
  // Send money
  SendRecipient: undefined;
  SendAmount: { recipientId: string };
  SendPayment: { recipientId: string; amount: number };
  SendReview: TransferParams;
  TransferSent: TransferParams;
  ScannedRecipient: { hasAccount: boolean };
  // Payment redirect
  SecureGateway: TransferParams;
  BankApp: TransferParams;
  CardVerification: TransferParams;
  PaymentResult: TransferParams & { success: boolean };
  // QR & receive
  MyQr: undefined;
  QrScanner: undefined;
  ScannedAccount: undefined;
  PaymentMethods: undefined;
  ReceiveMoney: undefined;
  // Receiving accounts
  ReceivingAccounts: undefined;
  AddAccountType: undefined;
  AddBankDetails: { countryCode: string };
  AddMobileDetails: { countryCode: string };
  AddAccountReview: { type: 'bank' | 'mobile'; countryCode: string; provider: string };
  AccountAdded: { provider: string; countryCode: string };
  // Profile & settings
  PersonalDetails: undefined;
  SavedRecipients: undefined;
  TransferLimits: undefined;
  ChangePassword: undefined;
  TrustedDevices: undefined;
  TransactionAlerts: undefined;
  HelpCentre: undefined;
  HelpArticle: undefined;
  LiveChat: undefined;
  ContactSupport: undefined;
  Terms: undefined;
  Privacy: undefined;
  ReferEarn: undefined;
};

export type ScreenProps<T extends keyof RootStackParamList> = NativeStackScreenProps<
  RootStackParamList,
  T
>;

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
