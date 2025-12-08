const fs = require('fs');
const path = require('path');

// Define all expected routes based on docusaurus config
const validRoutes = new Set();

// Function to scan markdown files and build valid routes
function scanDocsDirectory(dir, routePrefix = '/docs') {
    const files = fs.readdirSync(dir);

    files.forEach(file => {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            scanDocsDirectory(fullPath, `${routePrefix}/${file}`);
        } else if (file.endsWith('.md') || file.endsWith('.mdx')) {
            const route = file === 'index.md' || file === 'index.mdx'
                ? routePrefix
                : `${routePrefix}/${file.replace(/\.(md|mdx)$/, '')}`;
            validRoutes.add(route);
        }
    });
}

// Scan all docs directories
const docsDirectories = [
    { path: './docs', prefix: '/docs' },
    { path: './docs-admin', prefix: '/admin' },
    { path: './docs-manager', prefix: '/manager' },
    { path: './docs-operator', prefix: '/operator' },
    { path: './docs-operator-minimal', prefix: '/operator-minimal' },
    { path: './docs-internal', prefix: '/internal' }
];

docsDirectories.forEach(({ path: dirPath, prefix }) => {
    if (fs.existsSync(dirPath)) {
        scanDocsDirectory(dirPath, prefix);
    }
});

// Extract links from role landing pages
const linkPattern = /link:\s*['"]([^'"]+)['"]/g;
const rolePagesDir = './src/pages/roles';
const brokenLinks = [];
const allLinks = [];

if (fs.existsSync(rolePagesDir)) {
    const roleFiles = fs.readdirSync(rolePagesDir);

    roleFiles.forEach(file => {
        if (file.endsWith('.tsx')) {
            const filePath = path.join(rolePagesDir, file);
            const content = fs.readFileSync(filePath, 'utf8');

            let match;
            while ((match = linkPattern.exec(content)) !== null) {
                const link = match[1];
                allLinks.push({ file, link });

                if (!validRoutes.has(link) && !link.startsWith('http')) {
                    brokenLinks.push({ file, link });
                }
            }
        }
    });
}

// Report results
console.log('\n=== Link Validation Report ===\n');
console.log(`Total valid routes found: ${validRoutes.size}`);
console.log(`Total links checked: ${allLinks.length}`);
console.log(`Broken links found: ${brokenLinks.length}\n`);

if (brokenLinks.length > 0) {
    console.log('BROKEN LINKS:\n');
    brokenLinks.forEach(({ file, link }) => {
        console.log(`❌ ${file}: ${link}`);
    });
    process.exit(1);
} else {
    console.log('✅ All links are valid!\n');
}

// Output valid routes for reference
console.log('\nValid Routes Sample (first 20):');
Array.from(validRoutes).slice(0, 20).forEach(route => {
    console.log(`  - ${route}`);
});
