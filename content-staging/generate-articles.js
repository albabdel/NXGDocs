const fs = require('fs');
const path = require('path');
const DOCUMENTATION_STRUCTURE = require('./documentation-structure.js');

function generateArticle(category, article) {
  const tags = [
    `role:${article.role}`,
    'category:configuration',
    `difficulty:${article.difficulty}`,
    'platform:GCXONE'
  ];

  if (article.device) {
    tags.push(`device:${article.device}`);
  }
  if (article.feature) {
    tags.push(`feature:${article.feature}`);
  }

  const frontmatter = `---
title: "${article.title}"
description: "Complete guide for ${article.title}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
sidebar_position: ${article.position || 1}
last_updated: ${new Date().toISOString().split('T')[0]}
---

# ${article.title}

## Overview

[Placeholder: Brief overview of ${article.title}]

## Prerequisites

[Placeholder: List any prerequisites]

## Key Concepts

[Placeholder: Explain key concepts]

## Step-by-Step Guide

### Step 1: [First Step]

[Placeholder: Detailed instructions]

### Step 2: [Second Step]

[Placeholder: Detailed instructions]

### Step 3: [Third Step]

[Placeholder: Detailed instructions]

## Common Issues

[Placeholder: List common issues and solutions]

## Best Practices

[Placeholder: List best practices]

## Related Articles

[Placeholder: Link to related articles]

- [Related Article 1](#)
- [Related Article 2](#)
- [Related Article 3](#)

## Need Help?

If you're experiencing issues, check our [Troubleshooting Guide](/docs/troubleshooting) or [contact support](/docs/support).
`;

  return frontmatter;
}

function createArticleFiles() {
  const docsDir = path.join(__dirname, 'docs');

  if (!fs.existsSync(docsDir)) {
    fs.mkdirSync(docsDir, { recursive: true });
  }

  let totalArticles = 0;
  const sectionStats = {};

  for (const [categorySlug, categoryData] of Object.entries(DOCUMENTATION_STRUCTURE)) {
    const categoryDir = path.join(docsDir, categorySlug);

    if (!fs.existsSync(categoryDir)) {
      fs.mkdirSync(categoryDir, { recursive: true });
    }

    const categoryMeta = {
      label: categoryData.title,
      position: categoryData.position || 1,
      link: {
        type: 'generated-index',
        description: `Complete documentation for ${categoryData.title}`
      }
    };

    fs.writeFileSync(
      path.join(categoryDir, '_category_.json'),
      JSON.stringify(categoryMeta, null, 2)
    );

    let sectionCount = 0;
    categoryData.articles.forEach((article, index) => {
      article.position = index + 1;
      const content = generateArticle(categorySlug, article);
      const filename = `${article.slug}.md`;

      fs.writeFileSync(
        path.join(categoryDir, filename),
        content
      );

      console.log(`✓ Created: ${categorySlug}/${filename}`);
      totalArticles++;
      sectionCount++;
    });

    sectionStats[categoryData.title] = sectionCount;
  }

  console.log(`\n${'='.repeat(60)}`);
  console.log(`✅ ARTICLE GENERATION COMPLETE!`);
  console.log(`${'='.repeat(60)}\n`);
  console.log(`Total Articles Generated: ${totalArticles}\n`);
  console.log(`Section Breakdown:`);
  console.log(`${'='.repeat(60)}`);
  
  for (const [section, count] of Object.entries(sectionStats)) {
    console.log(`  ${section.padEnd(40)} ${count.toString().padStart(3)} articles`);
  }
  
  console.log(`${'='.repeat(60)}`);
  console.log(`\n📁 Location: ${docsDir}`);
  console.log(`\n🎯 Next Steps:`);
  console.log(`  1. Review generated articles`);
  console.log(`  2. Create article templates`);
  console.log(`  3. Generate sidebar configuration`);
  console.log(`  4. Add placeholder images`);
}

createArticleFiles();
