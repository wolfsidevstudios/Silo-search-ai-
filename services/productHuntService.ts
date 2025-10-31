import type { ProductHuntPost } from '../types';

const PRODUCT_HUNT_API_KEY = 'fe9Bb7hdCYSMzIahpuT69NTcicvzSWxFEP7E-2O4854';
const PRODUCT_HUNT_API_URL = 'https://api.producthunt.com/v2/api/graphql';

const GET_TRENDING_PRODUCTS_QUERY = `
query {
  posts(order: VOTES, first: 6) {
    edges {
      node {
        id
        name
        tagline
        url
        votesCount
        thumbnail {
          url
        }
      }
    }
  }
}
`;

export async function fetchTrendingProducts(): Promise<ProductHuntPost[]> {
    try {
        const response = await fetch(PRODUCT_HUNT_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${PRODUCT_HUNT_API_KEY}`,
            },
            body: JSON.stringify({ query: GET_TRENDING_PRODUCTS_QUERY }),
        });

        if (!response.ok) {
            console.error("Product Hunt API request failed with status:", response.status);
            return [];
        }

        const data = await response.json();
        
        if (data.errors) {
            console.error("Product Hunt API returned errors:", data.errors);
            return [];
        }

        const posts = data.data.posts.edges.map((edge: any) => edge.node);
        return posts.filter((post: any): post is ProductHuntPost => post && post.thumbnail); // Ensure thumbnail exists
    } catch (error) {
        console.error("Error fetching from Product Hunt:", error);
        return [];
    }
}
