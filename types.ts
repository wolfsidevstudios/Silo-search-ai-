export interface QuickLink {
  title: string;
  uri: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  channelTitle: string;
  videoUrl: string;
  description?: string;
}

export interface Flashcard {
  question: string;
  answer: string;
}

export interface QuizItem {
  question: string;
  options: string[];
  correctAnswer: string; // The text of the correct option
}

export interface SearchResult {
  summary:string;
  quickLinks: QuickLink[];
  videos?: YouTubeVideo[];
  isStudyQuery?: boolean;
  flashcards?: Flashcard[];
  quiz?: QuizItem[];
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
  provider?: string;
}

export interface SearchInputSettings {
  isLarge: boolean;
  isGlossy: boolean;
}

export interface SearchSettings {
  useWebSearch: boolean;
  model: 'gemini-2.5-flash' | 's1-mini';
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

export interface AIPlaceResult {
  name: string;
  address: string;
  rating?: string;
  website?: string;
  description?: string;
}

export interface MapSearchResult {
  places: AIPlaceResult[];
  locationName: string;
  boundingBox: [number, number, number, number]; // minLon, minLat, maxLon, maxLat
}

export interface Activity {
  time: string;
  description: string;
  location?: string;
}

export interface DayPlan {
  day: number;
  title: string;
  activities: Activity[];
}

export interface TravelPlan {
  destination: string;
  duration: string;
  budget: string;
  flightDetails: {
    advice: string;
  };
  accommodation: {
    type: string;
    suggestions: string[];
  };
  itinerary: DayPlan[];
  packingList: string[];
  localTips: string[];
  mapBoundingBox: [number, number, number, number]; // minLon, minLat, maxLon, maxLat
}

export interface Product {
  name: string;
  summary: string;
  price: string;
  buyUrl: string;
  imageUrl: string;
}

export interface ShoppingResult {
  overallSummary: string;
  products: Product[];
}

export interface PexelsPhotoSource {
  original: string;
  large2x: string;
  large: string;
  medium: string;
  small: string;
  portrait: string;
  landscape: string;
  tiny: string;
}

export interface PexelsPhoto {
  id: number;
  width: number;
  height: number;
  url: string;
  photographer: string;
  photographer_url: string;
  photographer_id: number;
  avg_color: string;
  src: PexelsPhotoSource;
  alt: string;
}

export interface PexelsVideoFile {
    id: number;
    quality: 'hd' | 'sd' | 'hls';
    file_type: string;
    width: number;
    height: number;
    link: string;
}

export interface PexelsVideoPicture {
    id: number;
    picture: string;
    nr: number;
}

export interface PexelsVideo {
    id: number;
    width: number;
    height: number;
    url: string;
    image: string; // Thumbnail
    duration: number;
    user: {
        id: number;
        name: string;
        url: string;
    };
    video_files: PexelsVideoFile[];
    video_pictures: PexelsVideoPicture[];
}

export type PexelsMedia = (PexelsPhoto & { type: 'Photo' }) | (PexelsVideo & { type: 'Video' });

export interface PexelsResult {
  media: PexelsMedia[];
  summary: string;
  mediaType: 'photo' | 'video';
}

export interface VideoIdeaSummary {
    title: string;
    description: string;
    virality_score: number;
}

export interface RelatedVideo {
    title: string;
    reason: string;
}

export interface VideoIdeaDetail {
    script: string;
    titles: string[];
    description: string;
    tags: string[];
    hashtags: string[];
    inspiration: string[];
    related_videos: RelatedVideo[];
}

export interface CreatorIdeasResult {
    topic: string;
    platform: string;
    ideas: VideoIdeaSummary[];
}

export interface NewsArticle {
    source: { name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
}

export interface StockQuote {
    '01. symbol': string;
    '05. price': string;
    '09. change': string;
    '10. change percent': string;
}

export interface ProductHuntThumbnail {
    url: string;
}

export interface ProductHuntPost {
    id: string;
    name: string;
    tagline: string;
    url: string;
    votesCount: number;
    thumbnail: ProductHuntThumbnail;
}

export interface TikTokVideo {
    id: string;
    webVideoUrl: string;
    authorNickname: string;
    text: string;
    coverUrl: string;
    musicName: string;
}

export interface ResearchSection {
  title: string;
  content: string; // Can be markdown
}

export interface DeepResearchResult {
  title: string;
  introduction: string;
  sections: ResearchSection[];
  conclusion: string;
  keyTakeaways: string[];
  sources: QuickLink[];
}

export interface FileRecord {
  id: number;
  name: string;
  type: string;
  size: number;
  content: Blob;
  createdAt: Date;
}

export interface NoteRecord {
  id: number;
  title: string;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SummarizationSource {
  id: number;
  name: string;
  type: 'file' | 'note';
}

export interface Space {
  id: number;
  name: string;
  systemInstruction: string;
  dataSources: { type: 'file' | 'note'; id: number; name: string }[];
  websites: string[];
  createdAt: Date;
}

export type AiCreativeTool = 'design' | 'docs' | 'code';
