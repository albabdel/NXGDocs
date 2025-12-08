import { useState, useEffect } from 'react';
import Fuse from 'fuse.js';
import { SearchRecord, WEIGHTS } from '../utils/search-types';

const SEARCH_INDEX_URL = '/search-index.json';

export function useUniversalSearch() {
    const [index, setIndex] = useState<SearchRecord[]>([]);
    const [fuse, setFuse] = useState<Fuse<SearchRecord> | null>(null);
    const [allTags, setAllTags] = useState<Set<string>>(new Set());
    const [tagMap, setTagMap] = useState<Map<string, SearchRecord[]>>(new Map());
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        async function loadIndex() {
            setIsLoading(true);
            try {
                const res = await fetch(SEARCH_INDEX_URL);
                const data: SearchRecord[] = await res.json();
                setIndex(data);

                // Extract all unique tags and build tag map
                const tags = new Set<string>();
                const tMap = new Map<string, SearchRecord[]>();

                data.forEach(item => {
                    item.tags?.forEach(tag => {
                        const tagLower = tag.toLowerCase();
                        tags.add(tagLower);

                        if (!tMap.has(tagLower)) {
                            tMap.set(tagLower, []);
                        }
                        tMap.get(tagLower)?.push(item);
                    });
                });

                setAllTags(tags);
                setTagMap(tMap);

                const fuseInstance = new Fuse<SearchRecord>(data, {
                    keys: [
                        { name: 'title', weight: 0.3 },
                        { name: 'sectionTitle', weight: 0.2 },
                        { name: 'content', weight: 0.3 },
                        { name: 'tags', weight: 0.2 },
                    ],
                    includeScore: true,
                    threshold: 0.5, // More lenient threshold for better recall
                    ignoreLocation: true, // Don't care where in the text the match is
                    minMatchCharLength: 2,
                    shouldSort: true,
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

    const search = (query: string, typeFilter?: string): SearchRecord[] => {
        if (!query.trim()) return [];

        const cleanedQuery = query.trim().toLowerCase();

        // Split query into words for multi-word matching (e.g., "bulk import" -> ["bulk", "import"])
        const queryWords = cleanedQuery.split(/\s+/);

        // Also create combined version without spaces (e.g., "bulkimport")
        const combinedQuery = queryWords.join('');

        // Find all matching tags (partial matching)
        const matchingTags = new Set<string>();

        allTags.forEach(tag => {
            // Check if tag contains the full query
            if (tag.includes(cleanedQuery)) {
                matchingTags.add(tag);
            }

            // Check if tag contains the combined query (no spaces)
            if (combinedQuery !== cleanedQuery && tag.includes(combinedQuery)) {
                matchingTags.add(tag);
            }

            // Check if tag contains any individual word
            queryWords.forEach(word => {
                if (word.length >= 2 && tag.includes(word)) {
                    matchingTags.add(tag);
                }
            });
        });

        // Collect all articles with matching tags and score them
        const articleScores = new Map<string, { record: SearchRecord; score: number; matchedTags: string[] }>();

        matchingTags.forEach(tag => {
            const records = tagMap.get(tag) || [];
            records.forEach(record => {
                const existing = articleScores.get(record.id);

                // Calculate match quality score
                let tagScore = 0;

                // Exact match with query
                if (tag === cleanedQuery) {
                    tagScore = 10;
                }
                // Exact match with combined query
                else if (tag === combinedQuery) {
                    tagScore = 9;
                }
                // Tag starts with query
                else if (tag.startsWith(cleanedQuery)) {
                    tagScore = 7;
                }
                // Tag starts with combined query
                else if (combinedQuery !== cleanedQuery && tag.startsWith(combinedQuery)) {
                    tagScore = 6;
                }
                // Tag contains query
                else if (tag.includes(cleanedQuery)) {
                    tagScore = 4;
                }
                // Tag contains combined query
                else if (combinedQuery !== cleanedQuery && tag.includes(combinedQuery)) {
                    tagScore = 3;
                }
                // Tag contains individual words
                else {
                    tagScore = 1;
                }

                if (existing) {
                    existing.score += tagScore;
                    existing.matchedTags.push(tag);
                } else {
                    articleScores.set(record.id, {
                        record,
                        score: tagScore * (record.weight || 1.0) * (WEIGHTS[record.type] || 1.0),
                        matchedTags: [tag]
                    });
                }
            });
        });

        // PART 2: Fuse.js fuzzy search for title/content matching
        // This ensures results are found even when query doesn't match tags
        if (fuse) {
            const fuseResults = fuse.search(query);
            fuseResults.slice(0, 30).forEach((result) => {
                const record = result.item;
                // Convert Fuse score (0=perfect, 1=worst) to our scoring (higher=better)
                const fuseScore = (1 - (result.score || 0)) * 8;

                const existing = articleScores.get(record.id);
                if (existing) {
                    // Boost existing tag matches with Fuse match
                    existing.score += fuseScore * 0.5;
                } else {
                    // Add new result from Fuse.js (not found via tags)
                    articleScores.set(record.id, {
                        record,
                        score: fuseScore * (record.weight || 1.0) * (WEIGHTS[record.type] || 1.0),
                        matchedTags: []
                    });
                }
            });
        }

        // Convert to array and sort by score
        let results = Array.from(articleScores.values())
            .sort((a, b) => b.score - a.score)
            .map(item => item.record);

        // Filter by type if requested
        if (typeFilter) {
            results = results.filter(r => r.type === typeFilter);
        }

        // Group by base URL to avoid duplicates
        const groupedResults = new Map<string, SearchRecord>();
        results.forEach(result => {
            const baseUrl = result.url.split('#')[0];
            if (!groupedResults.has(baseUrl)) {
                groupedResults.set(baseUrl, result);
            }
        });

        return Array.from(groupedResults.values()).slice(0, 30);
    };

    const getRelatedByTags = (tags: string[], limit = 5): SearchRecord[] => {
        if (!tags || tags.length === 0) return [];

        const relatedSet = new Map<string, number>();

        tags.forEach(tag => {
            const tagRecords = tagMap.get(tag.toLowerCase()) || [];
            tagRecords.forEach(record => {
                const currentScore = relatedSet.get(record.id) || 0;
                relatedSet.set(record.id, currentScore + 1);
            });
        });

        return Array.from(relatedSet.entries())
            .sort((a, b) => b[1] - a[1])
            .slice(0, limit)
            .map(([id]) => index.find(r => r.id === id))
            .filter((r): r is SearchRecord => r !== undefined);
    };

    const getAllTags = (): string[] => {
        return Array.from(allTags).sort();
    };

    const getPopularTags = (limit = 10): Array<{ tag: string; count: number }> => {
        const tagCounts = Array.from(tagMap.entries()).map(([tag, records]) => ({
            tag,
            count: records.length
        }));

        return tagCounts
            .sort((a, b) => b.count - a.count)
            .slice(0, limit);
    };

    return {
        search,
        getRelatedByTags,
        getAllTags,
        getPopularTags,
        isLoading
    };
}
