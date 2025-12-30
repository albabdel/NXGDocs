const fs = require('fs').promises;
const path = require('path');
const { PDFParse } = require('pdf-parse');

const BROCHOURS_DIR = path.join(__dirname, '..', 'Brochours');
const OUTPUT_DIR = path.join(__dirname, '..', 'extracted-breakthroughs');

const breakthroughs = [
  'Bulkimport',
  'Custom View',
  'Genie',
  'Healthcheck',
  'MarketPlace',
  'NOVA99x',
  'Pulse View',
  'Time Sync',
  'Tower Guard',
  'Zen mode'
];

async function extractPDF(pdfPath) {
  try {
    const dataBuffer = await fs.readFile(pdfPath);
    const parser = new PDFParse({ data: dataBuffer });
    const result = await parser.getText();

    return {
      text: result.text,
      numPages: result.total, // total page count
      pages: result.pages, // individual page data
      info: {},
      metadata: {}
    };
  } catch (error) {
    console.error(`Error extracting ${pdfPath}:`, error);
    return null;
  }
}

function analyzeContent(text, breakthroughName) {
  const lines = text.split('\n').filter(line => line.trim());

  const analysis = {
    name: breakthroughName,
    totalLines: lines.length,
    sections: [],
    keyPhrases: [],
    features: [],
    benefits: []
  };

  // Extract key sections - looking for common patterns
  const sectionHeaders = lines.filter(line =>
    line.length < 50 &&
    (line.match(/^[A-Z][A-Za-z\s]{3,}$/) ||
     line.match(/^[0-9]+\./))
  );

  analysis.sections = sectionHeaders.slice(0, 10); // Top 10 potential sections

  // Look for feature indicators
  const featureKeywords = ['feature', 'capability', 'function', 'enables', 'allows', 'provides'];
  analysis.features = lines.filter(line =>
    featureKeywords.some(keyword => line.toLowerCase().includes(keyword))
  ).slice(0, 5);

  // Look for benefit indicators
  const benefitKeywords = ['benefit', 'advantage', 'improve', 'reduce', 'increase', 'save', 'faster'];
  analysis.benefits = lines.filter(line =>
    benefitKeywords.some(keyword => line.toLowerCase().includes(keyword))
  ).slice(0, 5);

  return analysis;
}

async function processAllPDFs() {
  console.log('🌟 Starting Breakthrough PDF Extraction...\n');

  // Ensure output directory exists
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
  } catch (error) {
    // Directory might already exist
  }

  const results = [];

  for (const breakthrough of breakthroughs) {
    console.log(`📄 Processing: ${breakthrough}...`);

    const pdfPath = path.join(BROCHOURS_DIR, `${breakthrough}.pdf`);
    const extracted = await extractPDF(pdfPath);

    if (extracted) {
      const analysis = analyzeContent(extracted.text, breakthrough);

      const result = {
        breakthrough,
        numPages: extracted.numPages,
        analysis,
        fullText: extracted.text,
        extractedAt: new Date().toISOString()
      };

      results.push(result);

      // Save individual breakthrough extraction
      const outputPath = path.join(OUTPUT_DIR, `${breakthrough.toLowerCase().replace(/\s+/g, '-')}.json`);
      await fs.writeFile(outputPath, JSON.stringify(result, null, 2));

      console.log(`   ✅ Extracted ${extracted.numPages} pages`);
      console.log(`   📊 Found ${analysis.sections.length} sections, ${analysis.features.length} features, ${analysis.benefits.length} benefits\n`);
    } else {
      console.log(`   ❌ Failed to extract\n`);
    }
  }

  // Save combined summary
  const summary = {
    totalBreakthroughs: results.length,
    extractedAt: new Date().toISOString(),
    breakthroughs: results.map(r => ({
      name: r.breakthrough,
      pages: r.numPages,
      sectionsFound: r.analysis.sections.length,
      featuresFound: r.analysis.features.length,
      benefitsFound: r.analysis.benefits.length
    }))
  };

  await fs.writeFile(
    path.join(OUTPUT_DIR, 'extraction-summary.json'),
    JSON.stringify(summary, null, 2)
  );

  console.log('🎉 Extraction Complete!');
  console.log(`📁 Output saved to: ${OUTPUT_DIR}`);
  console.log(`\n📊 Summary:`);
  console.log(`   - Total breakthroughs processed: ${summary.totalBreakthroughs}`);
  console.log(`   - Total pages extracted: ${results.reduce((sum, r) => sum + r.numPages, 0)}`);

  return summary;
}

// Run the extraction
processAllPDFs().catch(console.error);
