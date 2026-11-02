/**
 * Shared one-off layout and spacing styles.
 *
 * @format
 */

import { StyleSheet } from 'react-native';

export const layout = StyleSheet.create({
  flex1: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  stretch: { alignSelf: 'stretch' },
  gap10: { gap: 10 },
  gap12: { gap: 12 },
  mt6: { marginTop: 6 },
  mt8: { marginTop: 8 },
  mt12: { marginTop: 12 },
  mt14: { marginTop: 14 },
  mt16: { marginTop: 16 },
  mt18: { marginTop: 18 },
  mb20: { marginBottom: 20 },
  pt16: { paddingTop: 16 },
});
