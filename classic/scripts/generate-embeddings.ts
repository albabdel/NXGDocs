import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenerativeAI } from '@google/generative-ai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const EMBEDDING_MODEL = 'gemini-embedding-001';
const BATCH_SIZE = 5;
const DELAY_MS = 500;

interface SearchRecord {
  id: string;
  title: string;
  content: string;
  excerpt?: string;
  type?: string;
}

interface EmbeddingRecord {
  id: string;
  embedding: number[];
  contentHash: string;
}

interface EmbeddingsIndex {
  version: string;
  generated: string;
  model: string;
  dimension: number;
  records: EmbeddingRecord[];
}

function simpleHash(text: string): string {
  let hash = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16);
}

async function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateEmbedding(
  genAI: GoogleGenerativeAI,
  text: string
): Promise<number[]> {
  const model = genAI.getGenerativeModel({ model: EMBEDDING_MODEL });
  
  const truncatedText = text.slice(0, 2000);
  
  const result = await model.embedContent(truncatedText);
  return Array.from(result.embedding.values);
}

async function generateEmbeddings(
  apiKey: string,
  records: SearchRecord[]
): Promise<EmbeddingRecord[]> {
  const genAI = new GoogleGenerativeAI(apiKey);
  const embeddings: EmbeddingRecord[] = [];
  
  console.log(`Generating embeddings for ${records.length} records...`);
  
  for (let i = 0; i < records.length; i += BATCH_SIZE) {
    const batch = records.slice(i, i + BATCH_SIZE);
    const batchNum = Math.floor(i / BATCH_SIZE) + 1;
    const totalBatches = Math.ceil(records.length / BATCH_SIZE);
    
    console.log(`Processing batch ${batchNum}/${totalBatches}...`);
    
    const batchResults = await Promise.all(
      batch.map(async (record) => {
        try {
          const contentForEmbedding = record.content || record.excerpt || record.title;
          const embedding = await generateEmbedding(genAI, contentForEmbedding);
          
          return {
            id: record.id,
            embedding,
            contentHash: simpleHash(contentForEmbedding.slice(0, 500)),
          };
        } catch (error) {
          console.error(`Failed to generate embedding for ${record.id}:`, error);
          return null;
        }
      })
    );
    
    for (const result of batchResults) {
      if (result) {
        embeddings.push(result);
      }
    }
    
    if (i + BATCH_SIZE < records.length) {
      await sleep(DELAY_MS);
    }
  }
  
  return embeddings;
}

async function main(): Promise<void> {
  const apiKey = process.env.VITE_GEMINI_API_KEY;
  
  if (!apiKey) {
    console.error('VITE_GEMINI_API_KEY environment variable is required');
    console.error('Set it in your .env file or pass it when running the script:');
    console.error('  VITE_GEMINI_API_KEY=your_key npm run generate:embeddings');
    process.exit(1);
  }
  
  const searchIndexPath = path.resolve(__dirname, '../static/search-index.json');
  const embeddingsOutputPath = path.resolve(__dirname, '../static/embeddings-index.json');
  
  if (!fs.existsSync(searchIndexPath)) {
    console.error('Search index not found at:', searchIndexPath);
    console.error('Run npm run build first to generate the search index.');
    process.exit(1);
  }
  
  console.log('Loading search index...');
  const searchIndexContent = fs.readFileSync(searchIndexPath, 'utf-8');
  const records: SearchRecord[] = JSON.parse(searchIndexContent);
  
  console.log(`Found ${records.length} records in search index`);
  
  const embeddings = await generateEmbeddings(apiKey, records);
  
  console.log(`Generated ${embeddings.length} embeddings`);
  
  const index: EmbeddingsIndex = {
    version: '1.0.0',
    generated: new Date().toISOString(),
    model: EMBEDDING_MODEL,
    dimension: 768,
    records: embeddings,
  };
  
  fs.writeFileSync(embeddingsOutputPath, JSON.stringify(index));
  
  const stats = fs.statSync(embeddingsOutputPath);
  const sizeKB = Math.round(stats.size / 1024);
  
  console.log(`\nEmbeddings index generated successfully!`);
  console.log(`Output: ${embeddingsOutputPath}`);
  console.log(`Size: ${sizeKB} KB`);
  console.log(`Records: ${embeddings.length}`);
}

main().catch((error) => {
  console.error('Failed to generate embeddings:', error);
  process.exit(1);
});
