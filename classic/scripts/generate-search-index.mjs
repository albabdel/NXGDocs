import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(__dirname, '../static/search-index.json');

// Helper to recursively get files
function getFiles(dir) {
    const subdirs = fs.readdirSync(dir);
    const files = subdirs.map((subdir) => {
        const res = path.resolve(dir, subdir);
        return fs.statSync(res).isDirectory() ? getFiles(res) : res;
    });
    return files.reduce((a, f) => a.concat(f), []);
}

// Helper to infer type from path
function inferType(filePath) {
    if (filePath.includes('api')) return 'API_ENDPOINT';
    if (filePath.includes('release-notes')) return 'RELEASE_NOTE';
    if (filePath.includes('faq') || filePath.includes('troubleshooting')) return 'FAQ';
    return 'DOC_PAGE';
}

// Helper to strip markdown (very basic)
function stripMarkdown(text) {
    return text
        .replace(/#+\s/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`{3}[\s\S]*?`{3}/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/\n/g, ' ')
        .trim();
}

function generateIndex() {
    console.log('Generating search index...');

    if (!fs.existsSync(DOCS_DIR)) {
        console.error(`Docs directory not found at ${DOCS_DIR}`);
        return;
    }

    const files = getFiles(DOCS_DIR).filter(f => f.endsWith('.md') || f.endsWith('.mdx'));
    const records = [];

    files.forEach((filePath) => {
        const content = fs.readFileSync(filePath, 'utf8');
        const { data, content: markdownBody } = matter(content);

        // Relative path for URL
        const relativePath = path.relative(DOCS_DIR, filePath);
        const urlPath = '/docs/' + relativePath.replace(/\\/g, '/').replace(/\.mdx?$/, '');

        // Split by H2 (##) to create sections
        const sections = markdownBody.split(/^##\s/m);

        sections.forEach((section, index) => {
            const lines = section.split('\n');
            const sectionTitle = index === 0 ? 'Introduction' : lines[0].trim();
            const sectionContent = stripMarkdown(lines.slice(index === 0 ? 0 : 1).join(' ')).slice(0, 300); // Snippet

            if (!sectionContent && index !== 0) return;

            records.push({
                id: `${urlPath}#${index}`,
                url: index === 0 ? urlPath : `${urlPath}#${sectionTitle.toLowerCase().replace(/\s+/g, '-')}`,
                type: inferType(filePath),
                title: data.title || path.basename(filePath, path.extname(filePath)),
                sectionTitle: sectionTitle,
                content: sectionContent,
                tags: data.tags || [],
                hierarchy: [data.title || 'Docs']
            });
        });
    });

    // Ensure static dir exists
    const staticDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
    }

    fs.writeFileSync(OUTPUT_FILE, JSON.stringify(records, null, 2));
    console.log(`Search index generated with ${records.length} records at ${OUTPUT_FILE}`);
}

generateIndex();
