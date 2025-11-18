
const ELEVENLABS_API_URL = 'https://api.elevenlabs.io/v1/text-to-speech/21m00Tcm4TlvDq8ikWAM'; // Voice ID for "Rachel"

export async function fetchTTSAudio(text: string, apiKey: string): Promise<Blob> {
  if (!apiKey) {
    throw new Error("ElevenLabs API key is missing.");
  }
  
  const response = await fetch(ELEVENLABS_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text,
      model_id: "eleven_monolingual_v1",
      voice_settings: {
        stability: 0.5,
        similarity_boost: 0.5,
      },
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(`ElevenLabs API error: ${errorData.detail?.message || 'Unknown error'}`);
  }

  return response.blob();
}
