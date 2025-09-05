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

export interface StickerInstance {
  id: string; // unique instance id
  stickerId: string; // key from sticker library
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