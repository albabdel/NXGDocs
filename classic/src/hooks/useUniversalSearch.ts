import { useState, useEffect, useMemo } from 'react';
import Fuse from 'fuse.js';
import { SearchRecord, WEIGHTS } from '../utils/search-types';

const SEARCH_INDEX_URL = '/search-index.json';

export function useUniversalSearch() {
    const [index, setIndex] = useState<SearchRecord[]>([]);
    const [fuse, setFuse] = useState<Fuse<SearchRecord> | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadIndex() {
            setIsLoading(true);
            try {
                const res = await fetch(SEARCH_INDEX_URL);
                const data = await res.json();
                setIndex(data);

                const fuseInstance = new Fuse(data, {
                    keys: [
                        { name: 'title', weight: 0.4 },
                        { name: 'sectionTitle', weight: 0.3 },
                        { name: 'tags', weight: 0.2 },
                        { name: 'content', weight: 0.1 },
                    ],
                    includeScore: true,
                    threshold: 0.4,
                });
                setFuse(fuseInstance);
            } catch (error) {
                console.error('Failed to load search index:', error);
            } finally {
                setIsLoading(false);
            }
        }

        loadIndex();
    }, []);

    const search = (query: string) => {
        if (!fuse || !query.trim()) return [];

        // 1. Run Fuse Search
        const results = fuse.search(query);

        // 2. Custom Rescoring
        const rescored = results.map(result => {
            const record = result.item;
            const typeWeight = WEIGHTS[record.type] || 1.0;

            // Fuse score: 0 is best, 1 is worst. Invert for logic.
            const baseScore = 1 - (result.score || 0);

            // Boost based on type
            const finalScore = baseScore * typeWeight;

            return { ...result, finalScore };
        });

        // 3. Sort by Final Score
        rescored.sort((a, b) => b.finalScore - a.finalScore);

        // 4. Diversify / Grouping (Simple Top 10 for now)
        return rescored.slice(0, 10).map(r => r.item);
    };

    return { search, isLoading };
}
