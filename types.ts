export interface QuickLink {
  title: string;
  uri: string;
}

export interface SearchResult {
  summary: string;
  quickLinks: QuickLink[];
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ClockSettings {
  style: 'horizontal' | 'stacked' | 'diagonal';
  theme: 'classic' | 'mint' | 'peach' | 'mono' | 'ocean' | 'sunset' | 'forest' | 'neon' | 'candy';
  font: 'fredoka' | 'serif' | 'mono' | 'pacifico' | 'bungee' | 'press-start' | 'caveat';
  size: number; // in rem
  thickness: number; // in px
}