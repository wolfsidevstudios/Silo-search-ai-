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
