export interface QuickLink {
  title: string;
  uri: string;
}

export interface SearchResult {
  summary:string;
  quickLinks: QuickLink[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface CustomSticker {
  id: string; // unique custom sticker id
  name: string;
  imageData: string; // base64 data URL
}

export interface StickerInstance {
  id: string; // unique instance id
  stickerId: string; // key from sticker library (emoji) OR a custom sticker id
  x: number; // percentage
  y: number; // percentage
  size: number; // in rem
}

export interface ClockSettings {
  style: 'horizontal' | 'stacked' | 'diagonal';
  theme: 'classic' | 'mint' | 'peach' | 'mono' | 'ocean' | 'sunset' | 'forest' | 'neon' | 'candy' | 'liquid-glass' | 'espresso' | 'cherry' | 'lavender' | 'gold' | 'ruby' | 'sapphire' | 'emerald' | 'graphite' | 'coral' | 'sky';
  font: 'fredoka' | 'serif' | 'mono' | 'pacifico' | 'bungee' | 'press-start' | 'caveat' | 'lobster' | 'anton' | 'oswald' | 'playfair' | 'orbitron' | 'vt323' | 'bebas' | 'dancing' | 'satisfy' | 'elite';
  size: number; // in rem
  thickness: number; // in px
  animation: 'none' | 'pulse' | 'float';
  format: '12h' | '24h';
}

export type TemperatureUnit = 'celsius' | 'fahrenheit';

export type WidgetType = 'note' | 'weather';

export interface WidgetInstance {
  id: string;
  widgetType: WidgetType;
  x: number; // percentage
  y: number; // percentage
  data?: { [key: string]: any };
}

export interface UserProfile {
  name: string;
  email: string;
  picture: string;
}

export interface SearchInputSettings {
  isLarge: boolean;
  isGlossy: boolean;
}

export interface SearchSettings {
  useWebSearch: boolean;
  model: 'gemini-2.5-flash';
}

export interface AccessibilitySettings {
  uiFontSize: number; // percentage
  highContrast: boolean;
}

export interface LanguageSettings {
  uiLanguage: 'en';
  searchRegion: 'auto' | 'US' | 'WW';
}

export interface NotificationSettings {
  featureUpdates: boolean;
  collaborationInvites: boolean;
}

export interface DeveloperSettings {
  showApiLogger: boolean;
}

export interface AnalyticsSettings {
  enabled: boolean;
}
