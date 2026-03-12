const fs = require('fs');
const path = require('path');
const mammoth = require('mammoth');
const { createClient } = require('@sanity/client');
const { JSDOM } = require('jsdom');
const { nanoid } = require('nanoid');

const DOCX_DIR = path.join(__dirname, '../../Zoho WorkDrive (8)');

const ONLY_PROCESS = [
  'Eagle Eye.v.1.docx',
  'Milestone_GCX-ONE_v.1.docx'
];

const projectId = process.env.SANITY_PROJECT_ID || 'fjjuacab';
const dataset = process.env.SANITY_DATASET || 'production';
const apiToken = process.env.SANITY_API_TOKEN;

if (!apiToken) {
  console.error('[!] ERROR: SANITY_API_TOKEN environment variable is required.');
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  apiVersion: '2025-02-06',
  useCdn: false,
  token: apiToken,
});

async function uploadImageToSanity(base64Data, mimeType, altText = '') {
  try {
    const buffer = Buffer.from(base64Data, 'base64');
    const ext = mimeType.split('/')[1] || 'png';
    const filename = `image-${nanoid(8)}.${ext}`;
    
    const asset = await client.assets.upload('image', buffer, {
      filename: filename,
    });
    
    return {
      _type: 'image',
      _key: nanoid(8),
      asset: {
        _type: 'reference',
        _ref: asset._id,
      },
      alt: altText,
    };
  } catch (err) {
    console.error(`[ERROR] Failed to upload image: ${err.message}`);
    return null;
  }
}

function htmlToPortableText(html, uploadedImages) {
  const dom = new JSDOM(html);
  const document = dom.window.document;
  const blocks = [];
  let imageIndex = 0;
  
  function getMarksFromElement(el) {
    const marks = [];
    let current = el;
    while (current && current !== document.body) {
      const tag = current.tagName?.toLowerCase();
      if (tag === 'strong' || tag === 'b') {
        if (!marks.includes('strong')) marks.push('strong');
      } else if (tag === 'em' || tag === 'i') {
        if (!marks.includes('em')) marks.push('em');
      } else if (tag === 'code') {
        if (!marks.includes('code')) marks.push('code');
      } else if (tag === 'u') {
        if (!marks.includes('underline')) marks.push('underline');
      }
      current = current.parentElement;
    }
    return marks;
  }
  
  function processNode(node, currentBlock = null, inheritedMarks = []) {
    if (node.nodeType === 3) {
      const text = node.textContent;
      if (!text) return currentBlock;
      
      if (!currentBlock) {
        currentBlock = {
          _type: 'block',
          _key: nanoid(8),
          style: 'normal',
          markDefs: [],
          children: []
        };
        blocks.push(currentBlock);
      }
      
      const marks = [...inheritedMarks, ...getMarksFromElement(node.parentElement)];
      currentBlock.children.push({
        _type: 'span',
        _key: nanoid(8),
        text: text,
        marks: marks
      });
      return currentBlock;
    }
    
    if (node.nodeType !== 1) return currentBlock;
    
    const tag = node.tagName.toLowerCase();
    const marks = [...inheritedMarks, ...getMarksFromElement(node)];
    
    if (tag === 'img') {
      const src = node.getAttribute('src') || '';
      
      if (src.startsWith('data:image') && uploadedImages.length > imageIndex) {
        const imageData = uploadedImages[imageIndex];
        if (imageData) {
          blocks.push(imageData);
        }
        imageIndex++;
        return null;
      }
      return currentBlock;
    }
    
    if (tag === 'p' || tag === 'div') {
      const newBlock = {
        _type: 'block',
        _key: nanoid(8),
        style: 'normal',
        markDefs: [],
        children: []
      };
      
      for (const child of node.childNodes) {
        processNode(child, newBlock, marks);
      }
      
      if (newBlock.children.length > 0) {
        blocks.push(newBlock);
      }
      return null;
    }
    
    if (tag.match(/^h[1-6]$/)) {
      const level = parseInt(tag.replace('h', ''));
      const style = level === 1 ? 'h2' : level === 2 ? 'h3' : level === 3 ? 'h4' : 'normal';
      
      const newBlock = {
        _type: 'block',
        _key: nanoid(8),
        style: style,
        markDefs: [],
        children: []
      };
      
      for (const child of node.childNodes) {
        processNode(child, newBlock, marks);
      }
      
      if (newBlock.children.length > 0) {
        blocks.push(newBlock);
      }
      return null;
    }
    
    if (tag === 'ul' || tag === 'ol') {
      const items = node.querySelectorAll(':scope > li');
      for (const li of items) {
        const listItem = {
          _type: 'block',
          _key: nanoid(8),
          style: tag === 'ul' ? 'bullet' : 'number',
          markDefs: [],
          children: []
        };
        
        for (const child of li.childNodes) {
          processNode(child, listItem, marks);
        }
        
        if (listItem.children.length > 0) {
          blocks.push(listItem);
        }
      }
      return null;
    }
    
    if (tag === 'br') {
      return currentBlock;
    }
    
    if (tag === 'pre') {
      const codeBlock = {
        _type: 'code',
        _key: nanoid(8),
        code: node.textContent || '',
        language: 'text'
      };
      blocks.push(codeBlock);
      return null;
    }
    
    if (tag === 'table') {
      const rows = node.querySelectorAll('tr');
      if (rows.length === 0) return null;
      
      const tableBlock = {
        _type: 'table',
        _key: nanoid(8),
        rows: []
      };
      
      for (const row of rows) {
        const cells = row.querySelectorAll('td, th');
        const rowData = {
          _key: nanoid(8),
          cells: []
        };
        for (const cell of cells) {
          rowData.cells.push({
            _key: nanoid(8),
            content: cell.textContent || ''
          });
        }
        if (rowData.cells.length > 0) {
          tableBlock.rows.push(rowData);
        }
      }
      
      if (tableBlock.rows.length > 0) {
        blocks.push(tableBlock);
      }
      return null;
    }
    
    for (const child of node.childNodes) {
      currentBlock = processNode(child, currentBlock, marks);
    }
    
    return currentBlock;
  }
  
  processNode(document.body, null, []);
  return blocks;
}

function getDeviceName(filename) {
  return path.basename(filename, '.docx')
    .replace(/\s*v\.\d+/gi, '')
    .replace(/\s*\(\d+\)/g, '')
    .replace(/_v\.\d+/gi, '')
    .replace(/\.v\.\d+/gi, '')
    .replace(/_/g, ' ')
    .replace(/\s+/g, ' ')
    .replace(/[._]+$/g, '')
    .trim();
}

function generateSlug(deviceName) {
  return deviceName
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .slice(0, 200);
}

async function processDocxFile(docxPath, index, total) {
  const filename = path.basename(docxPath);
  const deviceName = getDeviceName(filename);
  const slug = generateSlug(deviceName);
  
  console.log(`\n[${index + 1}/${total}] Processing: ${filename}`);
  console.log(`    Device: ${deviceName}`);
  console.log(`    Slug: devices/${slug}`);
  
  let html;
  try {
    const result = await mammoth.convertToHtml({ path: docxPath });
    html = result.value;
  } catch (err) {
    console.error(`[ERROR] Failed to convert ${filename}: ${err.message}`);
    return null;
  }
  
  const imgMatches = html.match(/<img[^>]+src="data:image\/[^"]+"[^>]*>/g) || [];
  console.log(`    Found ${imgMatches.length} embedded images in HTML`);
  
  const uploadedImages = [];
  for (let i = 0; i < imgMatches.length; i++) {
    const match = imgMatches[i];
    const srcMatch = match.match(/src="data:image\/([^;]+);base64,([^"]+)"/);
    if (srcMatch) {
      const mimeType = `image/${srcMatch[1]}`;
      const base64Data = srcMatch[2];
      
      try {
        const sanityImage = await uploadImageToSanity(base64Data, mimeType, deviceName);
        if (sanityImage) {
          uploadedImages.push(sanityImage);
          console.log(`    [IMAGE ${i + 1}/${imgMatches.length}] Uploaded`);
        }
      } catch (err) {
        console.error(`    [IMAGE ${i + 1}/${imgMatches.length}] Failed: ${err.message}`);
        uploadedImages.push(null);
      }
    }
  }
  
  console.log(`    Uploaded ${uploadedImages.filter(i => i).length}/${imgMatches.length} images`);
  
  const blocks = htmlToPortableText(html, uploadedImages);
  const imageBlocks = blocks.filter(b => b._type === 'image');
  const textBlocks = blocks.filter(b => b._type !== 'image');
  
  console.log(`    Generated ${blocks.length} blocks (${imageBlocks.length} images, ${textBlocks.length} text)`);
  
  const docData = {
    _type: 'doc',
    title: deviceName,
    slug: {
      _type: 'slug',
      current: `devices/${slug}`,
    },
    category: 'devices',
    targetAudience: ['all'],
    body: blocks,
  };
  
  try {
    const existing = await client.fetch(
      `*[_type == "doc" && slug.current == $slug][0]`,
      { slug: `devices/${slug}` }
    );
    
    if (existing) {
      const updated = await client.patch(existing._id).set(docData).commit();
      console.log(`[UPDATED] ${deviceName} (${updated._id})`);
      return updated;
    } else {
      const created = await client.create(docData);
      console.log(`[CREATED] ${deviceName} (${created._id})`);
      return created;
    }
  } catch (err) {
    console.error(`[ERROR] Failed to save ${deviceName}: ${err.message}`);
    return null;
  }
}

async function main() {
  console.log('='.repeat(60));
  console.log('DOCX to Sanity Migration (Inline Images from Base64)');
  console.log('='.repeat(60));
  console.log(`Source: ${DOCX_DIR}`);
  console.log(`Target: Sanity (${projectId}/${dataset})`);
  console.log('='.repeat(60));
  
  if (!fs.existsSync(DOCX_DIR)) {
    console.error(`[ERROR] Directory not found: ${DOCX_DIR}`);
    process.exit(1);
  }
  
  const allFiles = fs.readdirSync(DOCX_DIR)
    .filter(f => f.endsWith('.docx'))
    .map(f => path.join(DOCX_DIR, f));
  
  const files = ONLY_PROCESS.length > 0 
    ? allFiles.filter(f => ONLY_PROCESS.includes(path.basename(f)))
    : allFiles;
  
  console.log(`Found ${files.length} DOCX files\n`);
  
  let successCount = 0;
  let failCount = 0;
  
  for (let i = 0; i < files.length; i++) {
    try {
      const result = await processDocxFile(files[i], i, files.length);
      if (result) {
        successCount++;
      } else {
        failCount++;
      }
    } catch (err) {
      console.error(`[ERROR] Unexpected error: ${err.message}`);
      failCount++;
    }
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('Migration Complete!');
  console.log(`  Success: ${successCount}`);
  console.log(`  Failed: ${failCount}`);
  console.log('='.repeat(60));
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});