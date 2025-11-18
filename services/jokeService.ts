export async function fetchDailyJoke(): Promise<string | null> {
    try {
        const response = await fetch('https://icanhazdadjoke.com/', {
            headers: {
                'Accept': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error('Failed to fetch joke.');
        }
        const data = await response.json();
        return data.joke;
    } catch (error) {
        console.error("Error fetching daily joke:", error);
        return "Why don't scientists trust atoms? Because they make up everything!"; // Fallback joke
    }
}
