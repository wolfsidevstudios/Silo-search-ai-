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
  style: 'horizontal' | 'stacked';
  theme: 'classic' | 'mint' | 'peach' | 'mono';
  font: 'fredoka' | 'serif' | 'mono';
  size: number; // in rem
}