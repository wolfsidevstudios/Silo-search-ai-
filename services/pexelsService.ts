import type { PexelsResult, PexelsPhoto, PexelsVideo, PexelsMedia } from '../types';

const API_BASE_URL = 'https://api.pexels.com/v1';

export async function fetchPexelsMedia(
  query: string,
  apiKey: string,
  mediaType: 'photo' | 'video'
): Promise<{ media: PexelsMedia[], mediaType: 'photo' | 'video' }> {
  if (!apiKey) {
    throw new Error("Pexels API key is missing.");
  }

  const endpoint = mediaType === 'video' 
    ? `/videos/search?query=${encodeURIComponent(query)}` 
    : `/search?query=${encodeURIComponent(query)}`;
  
  const url = `${API_BASE_URL}${endpoint}&per_page=30`;

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': apiKey,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Pexels API error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();

    const media: PexelsMedia[] = (mediaType === 'video' ? data.videos : data.photos).map((item: PexelsPhoto | PexelsVideo) => ({
        ...item,
        type: mediaType === 'video' ? 'Video' : 'Photo'
    }));
    
    return { media, mediaType };

  } catch (error) {
    console.error("Error fetching from Pexels API:", error);
    throw new Error("Failed to get a valid response from the Pexels API.");
  }
}


export const downloadMedia = async (media: PexelsMedia) => {
    let url: string;
    let filename: string;
    
    if (media.type === 'Photo') {
        url = media.src.original;
        filename = `pexels-${media.photographer.toLowerCase().replace(/\s/g, '-')}-${media.id}.jpeg`;
    } else { // Video
        const bestVideo = media.video_files.find(f => f.quality === 'hd') || media.video_files[0];
        url = bestVideo.link;
        filename = `pexels-${media.user.name.toLowerCase().replace(/\s/g, '-')}-${media.id}.mp4`;
    }

    try {
        // Fetch the media as a blob. Using a proxy is often needed for client-side cross-origin downloads.
        // For simplicity here, we try a direct fetch. If it fails due to CORS, the fallback will trigger.
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok.');
        
        const blob = await response.blob();
        const objectUrl = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = objectUrl;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
        console.error("Download failed, likely due to CORS policy. Opening in new tab as fallback.", error);
        // Fallback for when direct fetch is blocked by CORS: open the link in a new tab.
        // The browser might then handle the download if the server sends the correct headers.
        window.open(url, '_blank');
    }
};