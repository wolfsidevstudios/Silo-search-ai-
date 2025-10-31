import type { ProductHuntPost } from '../types';

const PRODUCT_HUNT_API_KEY = 'fe9Bb7hdCYSMzIahpuT69NTcicvzSWxFEP7E-2O4854';
const PRODUCT_HUNT_API_URL = 'https://api.producthunt.com/v2/api/products';

export async function fetchTrendingProducts(): Promise<ProductHuntPost[]> {
    try {
        const response = await fetch(PRODUCT_HUNT_API_URL, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${PRODUCT_HUNT_API_KEY}`,
            },
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

        // Assuming the response has a "products" key with an array of products
        const products: any[] = data.products || [];

        // The old implementation fetched 6 products, so we'll slice to match
        // We also assume the product objects match the ProductHuntPost type, including thumbnail and votesCount
        return products
            .slice(0, 6)
            .filter((post: any): post is ProductHuntPost => post && post.thumbnail && post.thumbnail.url);
    } catch (error) {
        console.error("Error fetching from Product Hunt:", error);
        return [];
    }
}
