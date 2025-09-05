
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
  theme: 'classic' | 'mint' | 'peach' | 'mono' | 'ocean' | 'sunset' | 'forest' | 'neon' | 'candy';
  font: 'fredoka' | 'serif' | 'mono' | 'pacifico' | 'bungee' | 'press-start' | 'caveat';
  size: number; // in rem
  thickness: number; // in px
  animation: 'none' | 'pulse' | 'float';
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