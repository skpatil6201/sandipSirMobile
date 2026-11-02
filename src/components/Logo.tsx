/**
 * Djawei brand mark — the green & gold "D" emblem.
 *
 * `variant="full"` renders the complete lockup (emblem, wordmark and the
 * "Rapide et Fiable" tagline). Its wordmark is black, so only use it on light
 * backgrounds. The emblem alone works on light and dark backgrounds.
 *
 * @format
 */

import { Image, StyleSheet } from 'react-native';

const MARK = require('../assets/djawei-mark.png');
const FULL = require('../assets/djawei-logo.png');

// Intrinsic aspect ratio of djawei-logo.png (width / height).
const FULL_ASPECT = 1140 / 1000;

type Props = {
  /** Emblem: width & height. Full lockup: width. */
  size?: number;
  variant?: 'mark' | 'full';
};

function Logo({ size = 72, variant = 'mark' }: Props) {
  if (variant === 'full') {
    return (
      <Image
        source={FULL}
        style={[styles.image, { width: size, height: size / FULL_ASPECT }]}
        accessibilityLabel="Djawei"
      />
    );
  }
  return (
    <Image
      source={MARK}
      style={[styles.image, { width: size, height: size }]}
      accessibilityLabel="Djawei"
    />
  );
}

const styles = StyleSheet.create({
  image: {
    resizeMode: 'contain',
  },
});

export default Logo;
