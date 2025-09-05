export interface QuickLink {
  title: string;
  uri: string;
}

export interface SearchResult {
  summary: string;
  quickLinks: QuickLink[];
}