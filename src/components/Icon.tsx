/**
 * Line icon set (24×24 grid, stroke = currentColor) matching the Figma icons.
 *
 * @format
 */

import { memo } from 'react';
import { SvgXml } from 'react-native-svg';

const P = (d: string) => `<path d="${d}"/>`;
const C = (cx: number, cy: number, r: number) =>
  `<circle cx="${cx}" cy="${cy}" r="${r}"/>`;
const R = (x: number, y: number, w: number, h: number, rx = 2) =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}"/>`;

const ICONS = {
  home: P('M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z'),
  history: C(12, 12, 9) + P('M12 7v5l3 2'),
  scan: P(
    'M3 8V5a2 2 0 0 1 2-2h3M16 3h3a2 2 0 0 1 2 2v3M21 16v3a2 2 0 0 1-2 2h-3M8 21H5a2 2 0 0 1-2-2v-3M7 12h10',
  ),
  bell: P('M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0'),
  user: P('M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2') + C(12, 7, 4),
  help: C(12, 12, 10) + P('M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'),
  send: P('M7 17L17 7M8 7h9v9'),
  receive: P('M17 7L7 17M16 17H7V8'),
  card: R(2, 5, 20, 14) + P('M2 10h20M6 15h4'),
  chevR: P('M9 18l6-6-6-6'),
  back: P('M15 18l-6-6 6-6'),
  chevD: P('M6 9l6 6 6-6'),
  plus: P('M12 5v14M5 12h14'),
  check: P('M20 6L9 17l-5-5'),
  x: P('M18 6L6 18M6 6l12 12'),
  search: C(11, 11, 7) + P('M21 21l-4.35-4.35'),
  lock: R(4, 11, 16, 10) + P('M8 11V7a4 4 0 0 1 8 0v4'),
  mail: R(2, 4, 20, 16) + P('M22 7l-10 6L2 7'),
  phone: R(6, 2, 12, 20, 3) + P('M11 18h2'),
  eye: P('M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z') + C(12, 12, 3),
  fp: P(
    'M12 11v3M8.5 12a3.5 3.5 0 0 1 7 0v1.5a9 9 0 0 1-1.2 4.5M5.5 10.5a6.5 6.5 0 0 1 13 0V13M6 16a14 14 0 0 0 .5-3.5M9.5 15.5a12 12 0 0 1-1.5 5M12 17.5V21M17.5 17a10 10 0 0 1-1 3M7 5.2A8.9 8.9 0 0 1 12 3.5a8.9 8.9 0 0 1 5 1.7',
  ),
  shield: P('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z') + P('M9 12l2 2 4-4'),
  globe:
    C(12, 12, 10) +
    P('M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'),
  trend: P('M23 6l-9.5 9.5-5-5L1 18M17 6h6v6'),
  zap: P('M13 2L3 14h9l-1 8 10-12h-9l1-8z'),
  bank: P('M3 21h18M3 10h18M5 6.5L12 3l7 3.5M5 10v11M19 10v11M9 14v3M12 14v3M15 14v3'),
  laptop: R(4, 4, 16, 11, 1.5) + P('M2 19h20'),
  logout: P('M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9'),
  edit: P('M12 20h9M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z'),
  users:
    P('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75') +
    C(9, 7, 4),
  chat: P(
    'M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8z',
  ),
  file: P('M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M16 13H8M16 17H8M10 9H8'),
  download: P('M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3'),
  sun:
    C(12, 12, 4.5) +
    P('M12 1.5v2M12 20.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1.5 12h2M20.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4'),
  moon: P('M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z'),
  key: C(7.5, 15.5, 4.5) + P('M10.7 12.3L21 2M16 7l3 3M19 4l2 2'),
  chart: P('M3 3v18h18M8 17v-4M13 17V8M18 17v-7'),
  copy: R(9, 9, 13, 13) + P('M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'),
  share: P('M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13'),
  camera:
    P('M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z') +
    C(12, 13, 4),
  more: P('M5 12h.01M12 12h.01M19 12h.01'),
  alert: C(12, 12, 10) + P('M12 8v4M12 16h.01'),
  info: C(12, 12, 10) + P('M12 16v-4M12 8h.01'),
  trash: P('M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2'),
  arrow: P('M5 12h14M12 5l7 7-7 7'),
  refresh: P('M23 4v6h-6M20.49 15a9 9 0 1 1-2.12-9.36L23 10'),
  gift: P(
    'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z',
  ),
  swap: P('M17 1l4 4-4 4M3 11V9a4 4 0 0 1 4-4h14M7 23l-4-4 4-4M21 13v2a4 4 0 0 1-4 4H3'),
  del: P('M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2zM18 9l-6 6M12 9l6 6'),
  idcard: R(2, 5, 20, 14) + C(8, 12, 2.5) + P('M14 10h4M14 14h4'),
  passport: R(5, 2, 14, 20) + C(12, 10, 3) + P('M9 17h6'),
  smile: C(12, 12, 10) + P('M8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01'),
  mobile: R(6, 2, 12, 20, 3) + P('M11 18h2'),
  bolt: P('M13 2L3 14h9l-1 8 10-12h-9l1-8z'),
  sliders: P('M4 21v-7M4 10V3M12 21v-9M12 8V3M20 21v-5M20 12V3M1 14h6M9 8h6M17 16h6'),
  image: R(3, 3, 18, 18) + C(8.5, 8.5, 1.5) + P('M21 15l-5-5L5 21'),
  external: P('M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3'),
  qr:
    R(3, 3, 7, 7, 1) +
    R(14, 3, 7, 7, 1) +
    R(3, 14, 7, 7, 1) +
    P('M14 14h3v3h-3zM20 14v.01M14 20h.01M17 17h4v4h-4'),
} as const;

export type IconName = keyof typeof ICONS;

type Props = {
  name: IconName;
  size?: number;
  color: string;
  strokeWidth?: number;
};

function Icon({ name, size = 22, color, strokeWidth = 2 }: Props) {
  const sw = name === 'more' ? 3.2 : strokeWidth;
  const xml = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round">${ICONS[name]}</svg>`;
  return <SvgXml xml={xml} width={size} height={size} color={color} />;
}

export default memo(Icon);
