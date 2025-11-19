import type { GithubProfile } from '../types';

const API_BASE_URL = 'https://api.github.com';

// Fix: Completed the implementation of the githubFetch function.
async function githubFetch(endpoint: string, token: string): Promise<any> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/vnd.github.v3+json',
        },
    });

    if (!response.ok) {
        throw new Error(`GitHub API request failed: ${response.statusText}`);
    }
    return response.json();
}

// Fix: Added the missing fetchUserProfile function and exported it.
export async function fetchUserProfile(token: string): Promise<GithubProfile> {
    const data = await githubFetch('/user', token);
    return {
        login: data.login,
        name: data.name,
        avatar_url: data.avatar_url,
        email: data.email,
    };
}
