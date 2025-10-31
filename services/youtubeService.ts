import type { YouTubeVideo } from '../types';

export async function fetchYouTubeVideos(query: string, apiKey: string): Promise<YouTubeVideo[]> {
  if (!apiKey) {
    console.warn("YouTube API key is missing. Skipping video search.");
    return [];
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&key=${apiKey}&type=video&maxResults=12`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${errorData.error.message}`);
    }
    
    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high.url,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id.videoId}`,
    }));

    return videos;

  } catch (error) {
    console.error("Error fetching from YouTube API:", error);
    // Return empty array to not break the UI
    return [];
  }
}

export async function fetchTrendingYouTubeVideos(apiKey: string): Promise<YouTubeVideo[]> {
  if (!apiKey) {
    console.warn("YouTube API key is missing. Skipping trending videos search.");
    return [];
  }

  const endpoint = `https://www.googleapis.com/youtube/v3/videos?part=snippet&chart=mostPopular&regionCode=US&maxResults=11&key=${apiKey}`;

  try {
    const response = await fetch(endpoint);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`YouTube API error: ${errorData.error.message}`);
    }
    
    const data = await response.json();
    
    if (!data.items) {
      return [];
    }

    const videos: YouTubeVideo[] = data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
      channelTitle: item.snippet.channelTitle,
      videoUrl: `https://www.youtube.com/watch?v=${item.id}`,
    }));

    return videos;

  } catch (error) {
    console.error("Error fetching trending YouTube videos:", error);
    return [];
  }
}
