const fs = require('fs');
const path = require('path');

const configPath = path.join(__dirname, '..', 'classic', 'docusaurus.config.ts');

// Read the file
let config = fs.readFileSync(configPath, 'utf8');

// Check if already added
if (config.includes('Breakthroughs')) {
  console.log('✅ Breakthroughs already in navigation');
  process.exit(0);
}

// Add Breakthroughs to navbar items (after Documentation, before RoleSwitcher)
const navbarAddition = `        {
          type: 'doc',
          docId: 'breakthroughs/index',
          position: 'left',
          label: '🌟 Breakthroughs',
        },`;

config = config.replace(
  /(\{\s*type: 'docSidebar',\s*sidebarId: 'tutorialSidebar',\s*position: 'left',\s*label: 'Documentation',\s*\},)\s*(\{\s*type: 'custom-RoleSwitcher',)/,
  `$1\n${navbarAddition}\n        $2`
);

// Add to Quick Links dropdown
const quickLinkAddition = `            {
              label: '🌟 Breakthroughs',
              to: '/docs/breakthroughs',
            },`;

config = config.replace(
  /(\{\s*label: 'Getting Started',\s*to: '\/docs\/getting-started',\s*\},)/,
  `${quickLinkAddition}\n            $1`
);

// Add to footer
const footerAddition = `            {
              label: 'Breakthroughs',
              to: '/docs/breakthroughs',
            },`;

config = config.replace(
  /(title: 'Documentation',\s*items: \[\s*)(\{\s*label: 'Getting Started',)/,
  `$1${footerAddition}\n            $2`
);

// Write back
fs.writeFileSync(configPath, config, 'utf8');

console.log('✅ Added Breakthroughs to:');
console.log('   - Main navigation (after Documentation)');
console.log('   - Quick Links dropdown');
console.log('   - Footer');
