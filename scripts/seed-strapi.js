const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const DOCS_DIR = path.resolve(__dirname, '../classic/docs');

if (!API_TOKEN) {
    console.error('Error: STRAPI_API_TOKEN is not defined in .env file');
    process.exit(1);
}

const api = axios.create({
    baseURL: STRAPI_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

// Helper to parse frontmatter
function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) return { data: {}, content: content };

    const frontmatterRaw = match[1];
    const data = {};
    const lines = frontmatterRaw.split('\n');

    for (const line of lines) {
        const colonIndex = line.indexOf(':');
        if (colonIndex !== -1) {
            const key = line.slice(0, colonIndex).trim();
            let value = line.slice(colonIndex + 1).trim();
            // Remove quotes if present
            if (value.startsWith('"') && value.endsWith('"')) {
                value = value.slice(1, -1);
            }
            if (value.startsWith("'") && value.endsWith("'")) {
                value = value.slice(1, -1);
            }
            data[key] = value;
        }
    }

    const body = content.replace(match[0], '').trim();
    return { data, content: body };
}

// Find existing entry by slug
async function findEntry(endpoint, slug) {
    try {
        const response = await api.get(endpoint, {
            params: {
                filters: {
                    slug: {
                        $eq: slug,
                    },
                },
            },
        });
        if (response.data.data && response.data.data.length > 0) {
            return response.data.data[0];
        }
        return null;
    } catch (error) {
        console.error(`Error finding entry ${slug} in ${endpoint}:`, error.message);
        return null;
    }
}

async function createOrUpdateCategory(name, slug, description, order, parentId = null) {
    const existing = await findEntry('/api/categories', slug);
    const payload = {
        data: {
            name,
            slug,
            description,
            order: parseInt(order) || 0,
            parent: parentId
        }
    };

    try {
        if (existing) {
            console.log(`Updating category: ${name} (${slug})`);
            await api.put(`/api/categories/${existing.documentId}`, payload);
            return existing.documentId;
        } else {
            console.log(`Creating category: ${name} (${slug})`);
            const res = await api.post('/api/categories', payload);
            return res.data.data.documentId;
        }
    } catch (error) {
        console.error(`Failed to save category ${name}:`, JSON.stringify(error.response?.data || error.message, null, 2));
        return null;
    }
}

async function createOrUpdateArticle(frontmatter, content, categoryId) {
    const slug = frontmatter.slug || frontmatter.id; // Fallback
    if (!slug) {
        console.warn('Skipping article without slug:', frontmatter.title);
        return;
    }

    // Try to map fields
    const payload = {
        data: {
            title: frontmatter.title || 'Untitled',
            slug: slug.replace(/^\//, ''), // Remove leading slash for consistency
            description: frontmatter.description || '',
            content: content,
            order: parseInt(frontmatter.sidebar_position) || 0,
            category: categoryId,
            // Map other fields if possible, set defaults
            role: 'all',
            device_type: 'none',
            difficulty: 'beginner',
            platform: 'both'
        }
    };

    const existing = await findEntry('/api/documentation-articles', payload.data.slug);

    try {
        if (existing) {
            console.log(`Updating article: ${payload.data.title} (${payload.data.slug})`);
            await api.put(`/api/documentation-articles/${existing.documentId}`, payload);
        } else {
            console.log(`Creating article: ${payload.data.title} (${payload.data.slug})`);
            await api.post('/api/documentation-articles', payload);
        }
    } catch (error) {
        console.error(`Failed to save article ${payload.data.title}:`, JSON.stringify(error.response?.data || error.message, null, 2));
    }
}

async function processDirectory(dirPath, parentCategoryId = null) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    // Derive a unique slug base from the directory path relative to DOCS_DIR
    const relativePath = path.relative(DOCS_DIR, dirPath);
    // Replace OS separator with dash, handling root correctly (empty relativePath)
    const slugBase = relativePath ? relativePath.split(path.sep).join('-').toLowerCase() : '';

    // First look for _category_.json to establish the category context for this directory
    let currentCategoryId = parentCategoryId;

    const categoryFile = entries.find(e => e.name === '_category_.json');

    if (categoryFile) {
        const catContent = fs.readFileSync(path.join(dirPath, '_category_.json'), 'utf8');
        try {
            const catData = JSON.parse(catContent);
            const slug = slugBase || catData.label.toLowerCase().replace(/\s+/g, '-');

            currentCategoryId = await createOrUpdateCategory(
                catData.label || path.basename(dirPath),
                slug,
                catData.link?.description || '',
                catData.position,
                parentCategoryId
            );
        } catch (e) {
            console.error(`Error parsing ${path.join(dirPath, '_category_.json')}:`, e.message);
        }
    } else if (parentCategoryId === null && dirPath !== DOCS_DIR) {
        // Implicit category
        const dirName = path.basename(dirPath);
        currentCategoryId = await createOrUpdateCategory(
            dirName,
            slugBase,
            'Implicit category',
            0,
            parentCategoryId
        );
    }

    // Process Files
    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
            await processDirectory(fullPath, currentCategoryId);
        } else if (entry.name.endsWith('.md') || entry.name.endsWith('.mdx')) {
            const contentRaw = fs.readFileSync(fullPath, 'utf8');
            const { data, content } = parseFrontmatter(contentRaw);

            // Generate slug if missing
            if (!data.slug) {
                const fileRelative = path.relative(DOCS_DIR, fullPath).replace(/\.mdx?$/, '');
                data.slug = fileRelative.split(path.sep).join('-').toLowerCase();
            }

            await createOrUpdateArticle(data, content, currentCategoryId);
        }
    }
}

async function seed() {
    console.log('Starting Strapi Seed...');
    if (!fs.existsSync(DOCS_DIR)) {
        console.error('Docs directory not found:', DOCS_DIR);
        return;
    }

    await processDirectory(DOCS_DIR);
    console.log('Seeding completed!');
}

seed();
