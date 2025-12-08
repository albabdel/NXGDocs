const axios = require('axios');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const PAYLOAD_URL = process.env.PAYLOAD_URL || 'http://localhost:4000';
const API_TOKEN = process.env.PAYLOAD_API_TOKEN;
const TARGET_DIR = path.resolve(__dirname, '../classic/docs'); // Targeting Docusaurus docs folder directly

if (!API_TOKEN) {
    console.error('Error: PAYLOAD_API_TOKEN is not defined in .env file');
    console.error('You can generate an API token in Payload Admin -> Settings -> API Tokens');
    process.exit(1);
}

const api = axios.create({
    baseURL: PAYLOAD_URL,
    headers: {
        Authorization: `Bearer ${API_TOKEN}`,
    },
});

async function fetchCategories() {
    try {
        const response = await api.get('/api/categories', {
            params: {
                sort: 'order',
                limit: 100,
            },
        });
        return response.data.docs || [];
    } catch (error) {
        console.error('Error fetching categories:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return [];
    }
}

async function fetchArticles() {
    try {
        const response = await api.get('/api/documentation-articles', {
            params: {
                depth: 2, // Populate relationships
                limit: 1000, // Adjust limit as needed
            },
        });
        return response.data.docs || [];
    } catch (error) {
        console.error('Error fetching articles:', error.message);
        if (error.response) {
            console.error('Response status:', error.response.status);
            console.error('Response data:', error.response.data);
        }
        return [];
    }
}

function createCategoryFile(dirPath, category) {
    const categoryData = {
        label: category.name,
        position: category.order || 0,
        link: {
            type: 'generated-index',
            description: category.description || `Documentation for ${category.name}`,
        },
    };

    fs.writeFileSync(
        path.join(dirPath, '_category_.json'),
        JSON.stringify(categoryData, null, 2)
    );
}

function convertRichTextToMarkdown(richText) {
    // Payload uses Lexical JSON format for rich text
    // This is a basic converter - you may need to enhance it
    if (!richText || !Array.isArray(richText.root.children)) {
        return '';
    }

    let markdown = '';
    
    function processNode(node) {
        if (node.type === 'paragraph') {
            if (node.children) {
                let text = '';
                for (const child of node.children) {
                    if (child.type === 'text') {
                        let content = child.text || '';
                        if (child.format & 1) content = `**${content}**`; // bold
                        if (child.format & 2) content = `*${content}*`; // italic
                        text += content;
                    } else if (child.type === 'link') {
                        const linkText = child.children?.[0]?.text || '';
                        const url = child.url || '';
                        text += `[${linkText}](${url})`;
                    }
                }
                markdown += text + '\n\n';
            }
        } else if (node.type === 'heading') {
            const level = node.tag || 'h1';
            const headingLevel = parseInt(level.replace('h', '')) || 1;
            const text = node.children?.[0]?.text || '';
            markdown += '#'.repeat(headingLevel) + ' ' + text + '\n\n';
        } else if (node.type === 'list') {
            const listType = node.listType === 'number' ? 'ordered' : 'unordered';
            if (node.children) {
                for (const item of node.children) {
                    if (item.children) {
                        const itemText = item.children.map(c => c.text || '').join('');
                        markdown += '- ' + itemText + '\n';
                    }
                }
                markdown += '\n';
            }
        }
    }

    // Process root children
    for (const child of richText.root.children) {
        processNode(child);
    }

    return markdown.trim();
}

function generateFrontmatter(article) {
    const frontmatter = [
        '---',
        `title: "${(article.title || '').replace(/"/g, '\\"')}"`,
        `description: "${((article.description || '').replace(/"/g, '\\"'))}"`,
        `slug: /${article.slug || ''}`,
    ];

    if (article.tags && Array.isArray(article.tags)) {
        frontmatter.push(`tags: [${article.tags.map(t => `"${t}"`).join(', ')}]`);
    }

    if (article.category && typeof article.category === 'object') {
        frontmatter.push(`sidebar_category: "${article.category.slug || ''}"`);
    }

    frontmatter.push('---');
    return frontmatter.join('\n');
}

async function sync() {
    console.log('Starting Payload -> Docusaurus Sync...');
    console.log(`Payload URL: ${PAYLOAD_URL}`);
    console.log(`Target directory: ${TARGET_DIR}`);

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
        categoryMap[category.id] = categorySlug;
    }

    // 3. Generate Articles
    for (const article of articles) {
        const categoryData = article.category;
        let categorySlug = 'uncategorized';

        if (categoryData) {
            // Handle both populated object or ID
            if (typeof categoryData === 'object' && categoryData.slug) {
                categorySlug = categoryData.slug;
            } else if (categoryMap[categoryData]) {
                categorySlug = categoryMap[categoryData];
            }
        }

        const targetDir = path.join(TARGET_DIR, categorySlug);
        if (!fs.existsSync(targetDir)) {
            fs.mkdirSync(targetDir, { recursive: true });
        }

        // Convert rich text to markdown
        const content = article.content 
            ? convertRichTextToMarkdown(article.content)
            : '';

        const fullContent = generateFrontmatter(article) + '\n\n' + content;
        const fileName = `${article.slug || 'untitled'}.mdx`;

        fs.writeFileSync(path.join(targetDir, fileName), fullContent);
        console.log(`Generated: ${categorySlug}/${fileName}`);
    }

    console.log('Sync completed successfully!');
}

sync().catch(error => {
    console.error('Sync failed:', error);
    process.exit(1);
});
