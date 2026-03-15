import { GoogleGenerativeAI } from '@google/generative-ai';

const EMBEDDING_MODEL = 'gemini-embedding-001';
const EMBEDDING_DIMENSION = 768;

let genAI: GoogleGenerativeAI | null = null;
let embeddingModel: ReturnType<GoogleGenerativeAI['getGenerativeModel']> | null = null;

function getEmbeddingModel() {
  if (!genAPI) {
    const apiKey = (typeof import.meta !== 'undefined' && (import.meta as any).env)
      ? (import.meta as any).env.VITE_GEMINI_API_KEY
      : (typeof process !== 'undefined' ? process.env?.VITE_GEMINI_API_KEY : null);
    
    if (!apiKey) {
      console.warn('VITE_GEMINI_API_KEY not configured. AI search features disabled.');
      return null;
    }
    
    genAI = new GoogleGenerativeAI(apiKey);
  }
  
  if (!embeddingModel) {
    embeddingModel = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  }
  
  return embeddingModel;
}

export interface EmbeddingResult {
  id: string;
  embedding: number[];
  contentHash: string;
}

export interface EmbeddingsIndex {
  version: string;
  generated: string;
  model: string;
  dimension: number;
  records: EmbeddingResult[];
}

export async function generateEmbedding(text: string): Promise<number[]> {
  const model = getEmbeddingModel();
  if (!model) {
    throw new Error('Embedding model not available');
  }
  
  const truncatedText = text.slice(0, 2000);
  
  try {
    const result = await model.embedContent(truncatedText);
    return Array.from(result.embedding.values);
  } catch (error) {
    console.error('Failed to generate embedding:', error);
    throw error;
  }
}

export async function generateEmbeddingsBatch(
  texts: string[],
  batchSize: number = 5,
  delayMs: number = 200
): Promise<number[][]> {
  const embeddings: number[][] = [];
  
  for (let i = 0; i < texts.length; i += batchSize) {
    const batch = texts.slice(i, i + batchSize);
    const batchEmbeddings = await Promise.all(
      batch.map(text => generateEmbedding(text).catch(() => null))
    );
    
    for (const emb of batchEmbeddings) {
      if (emb) {
        embeddings.push(emb);
      } else {
        embeddings.push(new Array(EMBEDDING_DIMENSION).fill(0));
      }
    }
    
    if (i + batchSize < texts.length && delayMs > 0) {
      await new Promise(resolve => setTimeout(resolve, delayMs));
    }
  }
  
  return embeddings;
}

export function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) {
    console.warn('Embedding dimension mismatch');
    return 0;
  }
  
  const dotProduct = a.reduce((sum, val, i) => sum + val * b[i], 0);
  const magnitudeA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  const magnitudeB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
  
  if (magnitudeA === 0 || magnitudeB === 0) {
    return 0;
  }
  
  return dotProduct / (magnitudeA * magnitudeB);
}

export function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

let genAPI: GoogleGenerativeAI | null = null;

export function hashContent(content: string): string {
  return simpleHash(content.slice(0, 500));
}

let embeddingsCache: Map<string, number[]> = new Map();
const MAX_CACHE_SIZE = 100;

export async function getQueryEmbedding(query: string): Promise<number[] | null> {
  const cacheKey = query.trim().toLowerCase().slice(0, 100);
  
  if (embeddingsCache.has(cacheKey)) {
    return embeddingsCache.get(cacheKey)!;
  }
  
  try {
    const embedding = await generateEmbedding(query);
    
    embeddingsCache.set(cacheKey, embedding);
    
    if (embeddingsCache.size > MAX_CACHE_SIZE) {
      const firstKey = embeddingsCache.keys().next().value;
      if (firstKey) {
        embeddingsCache.delete(firstKey);
      }
    }
    
    return embedding;
  } catch (error) {
    console.error('Failed to get query embedding:', error);
    return null;
  }
}

export function clearEmbeddingCache(): void {
  embeddingsCache.clear();
}

let loadedIndex: EmbeddingsIndex | null = null;

export async function loadEmbeddingsIndex(): Promise<EmbeddingsIndex | null> {
  if (loadedIndex) {
    return loadedIndex;
  }
  
  try {
    const response = await fetch('/embeddings-index.json');
    if (!response.ok) {
      console.warn('Embeddings index not found. Run npm run generate:embeddings first.');
      return null;
    }
    
    loadedIndex = await response.json();
    return loadedIndex;
  } catch (error) {
    console.error('Failed to load embeddings index:', error);
    return null;
  }
}

export function getEmbeddingForRecord(id: string, index: EmbeddingsIndex): number[] | null {
  const record = index.records.find(r => r.id === id);
  return record?.embedding || null;
}

export function findSimilarRecords(
  queryEmbedding: number[],
  index: EmbeddingsIndex,
  topK: number = 10,
  minScore: number = 0.3
): Array<{ id: string; score: number }> {
  const scores: Array<{ id: string; score: number }> = [];
  
  for (const record of index.records) {
    const score = cosineSimilarity(queryEmbedding, record.embedding);
    if (score >= minScore) {
      scores.push({ id: record.id, score });
    }
  }
  
  scores.sort((a, b) => b.score - a.score);
  
  return scores.slice(0, topK);
}

export { EMBEDDING_DIMENSION };
