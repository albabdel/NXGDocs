import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DOCS_DIR = path.join(__dirname, '../docs');
const OUTPUT_FILE = path.join(__dirname, '../static/search-index.json');
const BUILD_OUTPUT_FILE = path.join(__dirname, '../build/search-index.json');

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
function inferType(filePath, docsDir) {
    const relativePath = path.relative(docsDir, filePath);
    const topLevelDir = relativePath.split(path.sep)[0];

    if (topLevelDir.includes('api')) return 'API';
    if (topLevelDir.includes('guide')) return 'GUIDE';
    if (topLevelDir.includes('blog')) return 'BLOG';

    // Default to 'DOC' for everything else
    return 'DOC';
}

// Helper to strip markdown (very basic)
function stripMarkdown(text) {
    return text
        .replace(/<!--[\s\S]*?-->/g, '') // remove HTML comments
        .replace(/#+\s/g, '')
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
        .replace(/`{3}[\s\S]*?`{3}/g, '')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/\*\*/g, '')
        .replace(/\*/g, '')
        .replace(/\n/g, ' ')
        .trim();
}

function buildDescription(data, markdownBody) {
    if (data.description) {
        return String(data.description).replace(/<!--[\s\S]*?-->/g, '').trim();
    }

    const bodyWithoutComments = markdownBody.replace(/<!--[\s\S]*?-->/g, '');
    const paragraphs = bodyWithoutComments.split(/\n\s*\n/).map(p => stripMarkdown(p).trim()).filter(Boolean);
    const firstParagraph = paragraphs[0] || stripMarkdown(bodyWithoutComments);
    const maxLength = 240;
    if (firstParagraph.length <= maxLength) {
        return firstParagraph;
    }
    return `${firstParagraph.slice(0, maxLength).trim()}...`;
}

// Helper to get document hierarchy (breadcrumbs)
function getHierarchy(filePath, docTitle, docsDir) {
    const relativePath = path.relative(docsDir, filePath);
    const parts = relativePath.split(path.sep); // Split by OS-specific separator
    const hierarchy = [];

    let currentPath = docsDir;
    for (let i = 0; i < parts.length - 1; i++) { // Exclude the file itself
        currentPath = path.join(currentPath, parts[i]);
        const categoryFilePath = path.join(currentPath, '_category_.json');

        let categoryName = parts[i]
            .replace(/[-\s_]+/g, ' ') // Replace hyphens/underscores with spaces
            .replace(/\b\w/g, l => l.toUpperCase()); // Capitalize first letter of each word

        if (fs.existsSync(categoryFilePath)) {
            try {
                const categoryConfig = JSON.parse(fs.readFileSync(categoryFilePath, 'utf8'));
                if (categoryConfig.label) {
                    categoryName = categoryConfig.label;
                }
            } catch (e) {
                console.warn(`Could not parse _category_.json in ${currentPath}:`, e.message);
            }
        }
        hierarchy.push(categoryName);
    }
    hierarchy.push(docTitle); // Add the document's own title

    return hierarchy;
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

        // Strip numeric prefixes (e.g., "01-", "02-") from path segments
        // Docusaurus removes these by default for cleaner URLs
        const cleanedPath = relativePath
            .replace(/\\/g, '/')
            .replace(/\.mdx?$/, '')
            .split('/')
            .map(segment => segment.replace(/^\d+-/, '')) // Remove leading digits and dash
            .join('/');

        const urlPath = '/docs/' + cleanedPath;

        // Split by H2 (##) to create sections
        const sections = markdownBody.split(/^##\s/m);
        const description = buildDescription(data, markdownBody);

        sections.forEach((section, index) => {
            const lines = section.split('\n');
            const sectionTitle = index === 0 ? 'Introduction' : lines[0].trim();
            const sectionContent = stripMarkdown(lines.slice(index === 0 ? 0 : 1).join(' ')).slice(0, 300); // Snippet

            if (!sectionContent && index !== 0) return;

            const normalizedTags = Array.from(new Set((data.tags || []).map(tag => tag.toLowerCase())));

            records.push({
                id: `${urlPath}#${index}`,
                url: index === 0 ? urlPath : `${urlPath}#${sectionTitle.toLowerCase().replace(/\s+/g, '-')}`,
                type: inferType(filePath, DOCS_DIR),
                title: data.title || path.basename(filePath, path.extname(filePath)),
                sectionTitle: sectionTitle,
                description,
                content: sectionContent,
                tags: normalizedTags,
                hierarchy: getHierarchy(filePath, data.title || path.basename(filePath, path.extname(filePath)), DOCS_DIR),
                weight: data.weight || 1.0 // Default weight is 1.0
            });
        });
    });

    // Ensure static dir exists
    const staticDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(staticDir)) {
        fs.mkdirSync(staticDir, { recursive: true });
    }

    const payload = JSON.stringify(records, null, 2);

    fs.writeFileSync(OUTPUT_FILE, payload);
    console.log(`Search index generated with ${records.length} records at ${OUTPUT_FILE}`);

    // Also write into build output (useful when running after docusaurus build)
    const buildDir = path.dirname(BUILD_OUTPUT_FILE);
    if (fs.existsSync(buildDir)) {
        fs.writeFileSync(BUILD_OUTPUT_FILE, payload);
        console.log(`Search index also written to ${BUILD_OUTPUT_FILE}`);
    }
}

generateIndex();
