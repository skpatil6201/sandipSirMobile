/**
 * Locale-aware XOF formatting (no Intl dependency).
 *
 * All transfers stay inside the 8 UEMOA countries, so every amount is in
 * XOF (CFA franc) and there is never an exchange rate.
 *
 * EN: 75,000 XOF · FR: 75 000 XOF
 *
 * @format
 */

import type { Language } from '../types/preferences';

function group(n: number, lang: Language): string {
  const int = Math.round(Math.abs(n)).toString();
  const sep = lang === 'fr' ? ' ' : ',';
  return int.replace(/\B(?=(\d{3})+(?!\d))/g, sep);
}

/** 75,000 XOF / 75 000 XOF — pass `sign` to prefix + or −. */
export function xof(
  n: number,
  lang: Language,
  opts: { sign?: boolean } = {},
): string {
  const sign = opts.sign ? (n < 0 ? '−' : '+') : n < 0 ? '−' : '';
  return `${sign}${group(n, lang)} XOF`;
}

/** Plain grouped number without currency (for inputs and chips). */
export function num(n: number, lang: Language): string {
  return group(n, lang);
}
