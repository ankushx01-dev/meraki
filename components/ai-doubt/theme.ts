export type ThemeMode = "dark" | "light";

export const MERAKI_AI_THEME_KEY = "meraki_ai_theme_v1";
export const MERAKI_AI_THEME_EVENT = "meraki-ai-theme-change";

export function isThemeMode(value: unknown): value is ThemeMode {
  return value === "dark" || value === "light";
}
