/**
 * Production-ready color system for bento-style mobile app.
 * Follows strict color distribution: Background 82%, Primary 8%, Secondary 6%, Tertiary 4%
 */

import { Platform } from 'react-native';

// Accent Colors (Locked)
export const AccentColors = {
  primary: '#0084D1',
  secondary: '#05DF72',
  tertiary: '#FFBA00',
} as const;

// Primary Scale (Actions, Focus, Links)
export const PrimaryScale = {
  50: '#E6F4FB',
  100: '#CDE9F7',
  200: '#9BD3EF',
  300: '#69BDE7',
  400: '#37A7DF',
  500: '#0084D1',
  600: '#0069A7',
  700: '#004F7D',
  800: '#003453',
  900: '#001A29',
} as const;

// Secondary Scale (Success, Positive, Gains)
export const SecondaryScale = {
  50: '#E6FDF1',
  100: '#CCFBE3',
  200: '#99F7C7',
  300: '#66F3AB',
  400: '#33EF8F',
  500: '#05DF72',
  600: '#04B85C',
  700: '#039146',
  800: '#026A30',
  900: '#01431A',
} as const;

// Tertiary Scale (Warning, Alerts, Attention)
export const TertiaryScale = {
  50: '#FFF7E6',
  100: '#FFEFCC',
  200: '#FFDF99',
  300: '#FFCF66',
  400: '#FFBF33',
  500: '#FFBA00',
  600: '#CC9500',
  700: '#997000',
  800: '#664A00',
  900: '#332500',
} as const;

// Light Theme
export const LightTheme = {
  background: '#F8FAFC',
  surface: '#FFFFFF',
  surfaceHover: '#F1F5F9',
  surfaceNested: '#F1F5F9',
  border: '#E5E7EB',
  divider: '#EEF2F7',
  text: {
    primary: '#0F172A',
    secondary: '#475569',
    muted: '#94A3B8',
  },
} as const;

// Dark Theme
export const DarkTheme = {
  background: '#0B0B0C',
  surface: '#121214',
  surfaceHover: '#1A1A1D',
  surfaceNested: '#1A1A1D',
  border: '#1F1F23',
  divider: '#2A2A2F',
  text: {
    primary: '#F8FAFC',
    secondary: '#A1A1AA',
    muted: '#71717A',
  },
} as const;

// Combined Colors Export (Legacy Support)
export const Colors = {
  light: {
    text: LightTheme.text.primary,
    background: LightTheme.background,
    tint: AccentColors.primary,
    icon: LightTheme.text.secondary,
    tabIconDefault: LightTheme.text.secondary,
    tabIconSelected: AccentColors.primary,
    surface: LightTheme.surface,
    surfaceHover: LightTheme.surfaceHover,
    border: LightTheme.border,
    divider: LightTheme.divider,
    textSecondary: LightTheme.text.secondary,
    textMuted: LightTheme.text.muted,
    primary: AccentColors.primary,
    secondary: AccentColors.secondary,
    tertiary: AccentColors.tertiary,
  },
  dark: {
    text: DarkTheme.text.primary,
    background: DarkTheme.background,
    tint: AccentColors.primary,
    icon: DarkTheme.text.secondary,
    tabIconDefault: DarkTheme.text.secondary,
    tabIconSelected: AccentColors.primary,
    surface: DarkTheme.surface,
    surfaceHover: DarkTheme.surfaceHover,
    border: DarkTheme.border,
    divider: DarkTheme.divider,
    textSecondary: DarkTheme.text.secondary,
    textMuted: DarkTheme.text.muted,
    primary: AccentColors.primary,
    secondary: AccentColors.secondary,
    tertiary: AccentColors.tertiary,
  },
  primary: PrimaryScale,
  secondary: SecondaryScale,
  tertiary: TertiaryScale,
} as const;

export const Fonts = Platform.select({
  ios: {
    sans: 'system-ui',
    serif: 'ui-serif',
    rounded: 'ui-rounded',
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});

// Type exports
export type ThemeMode = 'light' | 'dark';
export type AccentColor = keyof typeof AccentColors;
export type ColorScale = '50' | '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
