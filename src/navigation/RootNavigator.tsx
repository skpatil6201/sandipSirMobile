/**
 * App navigation: one native stack holding every screen, with the five main
 * tabs (custom floating nav bar) nested under "Main".
 *
 * @format
 */

import { createBottomTabNavigator, type BottomTabBarProps } from '@react-navigation/bottom-tabs';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
  createNavigationContainerRef,
  type Theme,
} from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { usePreferences } from '../context/PreferencesContext';
import TabBar from './TabBar';
import type { RootStackParamList, TabParamList } from './types';

import SplashScreen from '../screens/auth/SplashScreen';
import OnboardingScreen from '../screens/auth/OnboardingScreen';
import LoginScreen from '../screens/auth/LoginScreen';
import SignupScreen from '../screens/auth/SignupScreen';
import OtpScreen from '../screens/auth/OtpScreen';
import { PhoneCodeScreen, PhoneNumberScreen } from '../screens/auth/PhoneScreens';
import {
  CheckEmailScreen,
  ForgotPasswordScreen,
  NewPasswordScreen,
  PasswordUpdatedScreen,
} from '../screens/auth/PasswordResetScreens';
import { UnlockFingerprintScreen, UnlockPinScreen } from '../screens/unlock/UnlockScreens';
import { KycDocumentScreen, KycPersonalScreen, KycSelfieScreen } from '../screens/kyc/KycScreens';
import HomeScreen from '../screens/home/HomeScreen';
import { NotificationsScreen, RecipientsScreen, SupportScreen } from '../screens/home/HomeExtraScreens';
import HistoryScreen from '../screens/history/HistoryScreen';
import {
  ScannedRecipientScreen,
  SendAmountScreen,
  SendPaymentScreen,
  SendRecipientScreen,
  SendReviewScreen,
  TransferSentScreen,
} from '../screens/send/SendScreens';
import {
  BankAppScreen,
  CardVerificationScreen,
  PaymentResultScreen,
  SecureGatewayScreen,
} from '../screens/pay/PaymentScreens';
import {
  MyQrScreen,
  PaymentMethodsScreen,
  QrScannerScreen,
  ReceiveMoneyScreen,
  ScannedAccountScreen,
} from '../screens/qr/QrScreens';
import {
  AccountAddedScreen,
  AddAccountReviewScreen,
  AddAccountTypeScreen,
  AddBankDetailsScreen,
  AddMobileDetailsScreen,
  ReceivingAccountsScreen,
} from '../screens/receiving/ReceivingScreens';
import ProfileScreen from '../screens/profile/ProfileScreen';
import {
  ChangePasswordScreen,
  PersonalDetailsScreen,
  ReferEarnScreen,
  SavedRecipientsScreen,
  TransactionAlertsScreen,
  TransferLimitsScreen,
  TrustedDevicesScreen,
} from '../screens/profile/SettingsScreens';
import {
  ContactSupportScreen,
  HelpArticleScreen,
  HelpCentreScreen,
  LiveChatScreen,
  PrivacyScreen,
  TermsScreen,
} from '../screens/profile/HelpScreens';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Navigate from outside React components (e.g. Firebase auth listeners). */
export const navigationRef = createNavigationContainerRef<RootStackParamList>();
const Tab = createBottomTabNavigator<TabParamList>();

/** Placeholder for the centre Scan tab (the bar opens the scanner instead). */
function ScanPlaceholder() {
  return <View />;
}

function renderTabBar(props: BottomTabBarProps) {
  return <TabBar {...props} />;
}

function MainTabs() {
  return (
    <Tab.Navigator screenOptions={{ headerShown: false }} tabBar={renderTabBar}>
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
      <Tab.Screen name="ScanTab" component={ScanPlaceholder} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function RootNavigator() {
  const { isDark, colors } = usePreferences();
  const base = isDark ? DarkTheme : DefaultTheme;
  const theme: Theme = {
    ...base,
    colors: {
      ...base.colors,
      primary: colors.primary,
      background: colors.background,
      card: colors.surface,
      text: colors.text,
      border: colors.border,
    },
  };

  return (
    <NavigationContainer ref={navigationRef} theme={theme}>
      <Stack.Navigator
        initialRouteName="Splash"
        screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}
      >
        {/* Welcome & sign in */}
        <Stack.Screen name="Splash" component={SplashScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Signup" component={SignupScreen} />
        <Stack.Screen name="Otp" component={OtpScreen} />
        <Stack.Screen name="PhoneNumber" component={PhoneNumberScreen} />
        <Stack.Screen name="PhoneCode" component={PhoneCodeScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen name="CheckEmail" component={CheckEmailScreen} />
        <Stack.Screen name="NewPassword" component={NewPasswordScreen} />
        <Stack.Screen name="PasswordUpdated" component={PasswordUpdatedScreen} options={{ gestureEnabled: false }} />

        {/* App unlock */}
        <Stack.Screen name="UnlockFingerprint" component={UnlockFingerprintScreen} options={{ animation: 'fade' }} />
        <Stack.Screen name="UnlockPin" component={UnlockPinScreen} />

        {/* KYC */}
        <Stack.Screen name="KycPersonal" component={KycPersonalScreen} />
        <Stack.Screen name="KycDocument" component={KycDocumentScreen} />
        <Stack.Screen name="KycSelfie" component={KycSelfieScreen} />

        {/* Main */}
        <Stack.Screen name="Main" component={MainTabs} options={{ animation: 'fade' }} />
        <Stack.Screen name="Recipients" component={RecipientsScreen} />
        <Stack.Screen name="Support" component={SupportScreen} />

        {/* Send money */}
        <Stack.Screen name="SendRecipient" component={SendRecipientScreen} />
        <Stack.Screen name="SendAmount" component={SendAmountScreen} />
        <Stack.Screen name="SendPayment" component={SendPaymentScreen} />
        <Stack.Screen name="SendReview" component={SendReviewScreen} />
        <Stack.Screen name="TransferSent" component={TransferSentScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="ScannedRecipient" component={ScannedRecipientScreen} />

        {/* Payment redirect & result */}
        <Stack.Screen name="SecureGateway" component={SecureGatewayScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="BankApp" component={BankAppScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="CardVerification" component={CardVerificationScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="PaymentResult" component={PaymentResultScreen} options={{ gestureEnabled: false }} />

        {/* QR, payment methods & receive */}
        <Stack.Screen name="MyQr" component={MyQrScreen} />
        <Stack.Screen name="QrScanner" component={QrScannerScreen} options={{ animation: 'slide_from_bottom' }} />
        <Stack.Screen name="ScannedAccount" component={ScannedAccountScreen} />
        <Stack.Screen name="PaymentMethods" component={PaymentMethodsScreen} />
        <Stack.Screen name="ReceiveMoney" component={ReceiveMoneyScreen} />

        {/* Receiving accounts */}
        <Stack.Screen name="ReceivingAccounts" component={ReceivingAccountsScreen} />
        <Stack.Screen name="AddAccountType" component={AddAccountTypeScreen} />
        <Stack.Screen name="AddBankDetails" component={AddBankDetailsScreen} />
        <Stack.Screen name="AddMobileDetails" component={AddMobileDetailsScreen} />
        <Stack.Screen name="AddAccountReview" component={AddAccountReviewScreen} />
        <Stack.Screen name="AccountAdded" component={AccountAddedScreen} options={{ gestureEnabled: false }} />

        {/* Profile & settings */}
        <Stack.Screen name="PersonalDetails" component={PersonalDetailsScreen} />
        <Stack.Screen name="SavedRecipients" component={SavedRecipientsScreen} />
        <Stack.Screen name="TransferLimits" component={TransferLimitsScreen} />
        <Stack.Screen name="ChangePassword" component={ChangePasswordScreen} />
        <Stack.Screen name="TrustedDevices" component={TrustedDevicesScreen} />
        <Stack.Screen name="TransactionAlerts" component={TransactionAlertsScreen} />
        <Stack.Screen name="HelpCentre" component={HelpCentreScreen} />
        <Stack.Screen name="HelpArticle" component={HelpArticleScreen} />
        <Stack.Screen name="LiveChat" component={LiveChatScreen} />
        <Stack.Screen name="ContactSupport" component={ContactSupportScreen} />
        <Stack.Screen name="Terms" component={TermsScreen} />
        <Stack.Screen name="Privacy" component={PrivacyScreen} />
        <Stack.Screen name="ReferEarn" component={ReferEarnScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
