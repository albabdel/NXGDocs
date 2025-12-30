const fs = require('fs');
const path = require('path');

const homepagePath = path.join(__dirname, '..', 'classic', 'src', 'pages', 'index.tsx');

// Read the file
let homepage = fs.readFileSync(homepagePath, 'utf8');

// Check if already added
if (homepage.includes('Breakthroughs')) {
  console.log('✅ Breakthroughs already on homepage');
  process.exit(0);
}

// Add import for BreakthroughGrid at the top
const breakthroughImport = `import { BreakthroughGrid } from '../components/breakthroughs';`;

// Find the imports section and add our import
homepage = homepage.replace(
  /(import QuickLink from '\.\.\/components\/QuickLink';)/,
  `$1\n${breakthroughImport}`
);

// Add Breakthroughs section HTML (right after hero, before Quick Start)
const breakthroughsSection = `
                    {/* 🌟 Breakthroughs Section */}
                    <motion.section
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="mt-16"
                    >
                        <div className="text-center mb-12">
                            <div className="inline-block">
                                <h2 className="text-4xl font-bold text-[#E8B058] mb-2">
                                    🌟 10 Breakthroughs That Redefine Security
                                </h2>
                                <p className="text-xl mt-3" style={{ color: 'var(--ifm-color-content-secondary)' }}>
                                    Discover the innovations that make NXGEN the industry's most advanced platform
                                </p>
                            </div>
                        </div>
                        <div className="mb-8">
                            <BreakthroughGrid />
                        </div>
                        <div className="text-center mt-8">
                            <Link
                                to="/docs/breakthroughs"
                                className="inline-flex items-center px-6 py-3 text-base font-medium rounded-lg text-white bg-[#E8B058] hover:bg-[#d19d4a] transition-colors duration-200"
                            >
                                Explore All Breakthroughs →
                            </Link>
                        </div>
                    </motion.section>
`;

// Find the Quick Start section and insert before it
homepage = homepage.replace(
  /(\/\* Quick Start \*\/\s*<motion\.section)/,
  `${breakthroughsSection}\n\n                    $1`
);

// Write back
fs.writeFileSync(homepagePath, homepage, 'utf8');

console.log('✅ Added Breakthroughs showcase to homepage');
console.log('   - Imported BreakthroughGrid component');
console.log('   - Added showcase section with all 10 breakthroughs');
console.log('   - Added "Explore All" CTA button');
