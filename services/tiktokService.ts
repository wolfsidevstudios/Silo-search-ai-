import type { TikTokVideo } from '../types';

const ACTOR_ID = 'quacker/tiktok-scraper';

// Helper function to sleep
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function fetchTrendingTikTokVideos(apiKey: string): Promise<TikTokVideo[]> {
  if (!apiKey) {
    console.warn("Apify API key is missing. Skipping TikTok search.");
    return [];
  }

  // 1. Start the actor run
  const runResponse = await fetch(`https://api.apify.com/v2/acts/${ACTOR_ID.replace('/', '~')}/runs?token=${apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'TRENDING', resultsPerPage: 20 }),
  });

  if (!runResponse.ok) {
    throw new Error(`Failed to start Apify actor. Status: ${runResponse.status}`);
  }

  const runData = await runResponse.json();
  const runId = runData.data.id;

  // 2. Poll for run completion (with a timeout)
  let runDetails;
  const maxAttempts = 20; // 20 attempts * 5s = 100s timeout
  for (let i = 0; i < maxAttempts; i++) {
    await sleep(5000); // Poll every 5 seconds
    const statusResponse = await fetch(`https://api.apify.com/v2/actor-runs/${runId}?token=${apiKey}`);
    if (!statusResponse.ok) {
        console.error(`Failed to get actor run status. Status: ${statusResponse.status}`);
        continue;
    }
    runDetails = await statusResponse.json();
    if (runDetails.data.status === 'SUCCEEDED') {
      break;
    }
    if (['FAILED', 'TIMED-OUT', 'ABORTED'].includes(runDetails.data.status)) {
        throw new Error(`Apify actor run failed with status: ${runDetails.data.status}`);
    }
    if (i === maxAttempts - 1) {
        throw new Error(`Apify actor run timed out after 100 seconds.`);
    }
  }

  // 3. Fetch dataset items
  const datasetId = runDetails.data.defaultDatasetId;
  const itemsResponse = await fetch(`https://api.apify.com/v2/datasets/${datasetId}/items?token=${apiKey}&clean=true&format=json`);

  if (!itemsResponse.ok) {
      throw new Error(`Failed to fetch dataset items. Status: ${itemsResponse.status}`);
  }

  const items = await itemsResponse.json();
  
  // 4. Map to our type, ensuring all required fields are present
  return items.map((item: any): TikTokVideo | null => {
      if (item.id && item.webVideoUrl && item.authorMeta?.nickName && item.text && item.covers?.origin && item.musicMeta?.musicName) {
          return {
              id: item.id,
              webVideoUrl: item.webVideoUrl,
              authorNickname: item.authorMeta.nickName,
              text: item.text,
              coverUrl: item.covers.origin,
              musicName: item.musicMeta.musicName,
          }
      }
      return null;
  }).filter((v): v is TikTokVideo => v !== null);
}