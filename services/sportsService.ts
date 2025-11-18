interface SportsData {
  home_team: { full_name: string };
  visitor_team: { full_name: string };
  home_team_score: number;
  visitor_team_score: number;
  status: string;
}

export async function fetchSportsScores(): Promise<SportsData[]> {
    try {
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        const dateString = yesterday.toISOString().split('T')[0];

        const response = await fetch(`https://www.balldontlie.io/api/v1/games?dates[]=${dateString}&per_page=2`);
        if (!response.ok) {
            throw new Error('Failed to fetch sports scores.');
        }
        const data = await response.json();
        
        // Filter for games that are finished to ensure scores are available
        const finishedGames = data.data.filter((game: SportsData) => game.status === 'Final');

        return finishedGames.length > 0 ? finishedGames : data.data.slice(0, 2);
    } catch (error) {
        console.error("Error fetching sports scores:", error);
        return [];
    }
}
