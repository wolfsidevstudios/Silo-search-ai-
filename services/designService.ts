
const loadedFonts = new Set<string>();

export const loadGoogleFonts = (fonts: string[]) => {
  const uniqueFonts = fonts.filter(font => !loadedFonts.has(font) && font);
  if (uniqueFonts.length === 0) return;

  const fontFamilies = uniqueFonts.map(font => `${font.replace(/ /g, '+')}:400,700`).join('|');
  const link = document.createElement('link');
  link.href = `https://fonts.googleapis.com/css?family=${fontFamilies}&display=swap`;
  link.rel = 'stylesheet';
  
  document.head.appendChild(link);
  uniqueFonts.forEach(font => loadedFonts.add(font));
};

export const searchStreamline = async (query: string, apiKey: string): Promise<string | null> => {
    if (!apiKey) {
        console.error("Streamline API key is missing.");
        return null;
    }
    
    // Using a proxy to bypass CORS issues in a browser environment.
    // This is a common pattern for client-side API calls that don't support CORS.
    const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';
    const API_URL = `${PROXY_URL}https://api.streamlinehq.com/v3/search?query=${encodeURIComponent(query)}&family=illustrations`;

    try {
        const response = await fetch(API_URL, {
            headers: {
                'x-streamline-api-key': apiKey,
                'x-requested-with': 'XMLHttpRequest', // Required by some proxies
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Streamline API request failed with status ${response.status}:`, errorText);
            return null;
        }

        const data = await response.json();
        
        if (data && data.data && data.data.length > 0) {
            // Find the first asset that has an image_url
            const assetWithImage = data.data.find((asset: any) => asset.image_url);
            return assetWithImage?.image_url || null;
        }
        
        return null;

    } catch (error) {
        console.error("Error fetching from Streamline API:", error);
        return null;
    }
};