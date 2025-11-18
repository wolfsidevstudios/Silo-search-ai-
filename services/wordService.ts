interface WordData {
    word: string;
    definition: string;
}

export async function fetchWordOfTheDay(): Promise<WordData | null> {
    try {
        const wordResponse = await fetch('https://random-word-api.herokuapp.com/word');
        if (!wordResponse.ok) throw new Error('Failed to fetch random word.');
        const wordData = await wordResponse.json();
        const word = wordData[0];

        const definitionResponse = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        if (!definitionResponse.ok) {
            // If definition not found, we can retry, but for now just return null
             console.warn(`No definition found for "${word}"`);
             return null;
        }
        const definitionData = await definitionResponse.json();
        
        const definition = definitionData[0]?.meanings[0]?.definitions[0]?.definition;

        if (word && definition) {
            return { word, definition };
        }
        return null;

    } catch (error) {
        console.error("Error fetching word of the day:", error);
        return null;
    }
}
