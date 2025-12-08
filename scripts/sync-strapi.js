const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const STRAPI_URL = process.env.STRAPI_URL || 'http://localhost:1337';
const API_TOKEN = process.env.STRAPI_API_TOKEN;
const TARGET_DIR = path.resolve(__dirname, '../classic/docs'); // Targeting Docusaurus docs folder directly

if (!API_TOKEN) {
    console.error('Error: STRAPI_API_TOKEN is not defined in .env file');
    process.exit(1);
}

const api = axios.create({
    baseURL: STRAPI_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
    },
});

async function fetchCategories() {
    try {
        const response = await api.get('/api/categories', {
            params: {
                sort: 'order:asc',
                pagination: { limit: 100 },
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        return [];
    }
}

async function fetchArticles() {
    try {
        const response = await api.get('/api/documentation-articles', {
            params: {
                populate: '*',
                pagination: { limit: 1000 }, // Adjust limit as needed
            },
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        return [];
    }
}

function createCategoryFile(dirPath, category) {
    const categoryData = {
        label: category.name,
        position: category.order,
        link: {
            type: 'generated-index',
            description: `Documentation for ${category.name}`,
        },
    };

    fs.writeFileSync(
        path.join(dirPath, '_category_.json'),
        JSON.stringify(categoryData, null, 2)
    );
}

function generateFrontmatter(article) {
    const frontmatter = [
        '---',
        `title: "${article.title.replace(/"/g, '\\"')}"`,
        `description: "${(article.description || '').replace(/"/g, '\\"')}"`,
        `slug: /${article.slug}`,
    ];

    if (article.tags) {
        // Assuming tags is a string or array, adjust based on actual Strapi response structure
        // For now, simple handling if it's a simple text field or relation
    }

    frontmatter.push('---');
    return frontmatter.join('\n');
}

async function sync() {
    console.log('Starting Strapi -> Docusaurus Sync...');

    // 1. Fetch Data
    const categories = await fetchCategories();
    const articles = await fetchArticles();

    console.log(`Found ${categories.length} categories and ${articles.length} articles.`);

    // 2. Create Directory Structure
    if (!fs.existsSync(TARGET_DIR)) {
        fs.mkdirSync(TARGET_DIR, { recursive: true });
    }

    // Map category IDs to slugs for easy lookup
    const categoryMap = {};

    for (const category of categories) {
        const categorySlug = category.slug;
        const categoryPath = path.join(TARGET_DIR, categorySlug);

        if (!fs.existsSync(categoryPath)) {
            fs.mkdirSync(categoryPath, { recursive: true });
        }

        createCategoryFile(categoryPath, category);
        categoryMap[category.documentId] = categorySlug; // Use documentId or id depending on Strapi version
        categoryMap[category.id] = categorySlug; // Fallback
    }

    // 3. Generate Articles
    for (const article of articles) {
        const categoryData = article.category;
        let categorySlug = 'uncategorized';

        if (categoryData) {
            // Handle both populated object or ID
            categorySlug = categoryData.slug || categoryMap[categoryData.documentId] || categoryMap[categoryData.id] || 'uncategorized';
        }

        const targetDir = path.join(TARGET_DIR, categorySlug);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        const content = generateFrontmatter(article) + '\n\n' + (article.content || '');
        const fileName = `${article.slug}.mdx`;

        fs.writeFileSync(path.join(targetDir, fileName), content);
        console.log(`Generated: ${categorySlug}/${fileName}`);
    }

    console.log('Sync completed successfully!');
}

sync();
