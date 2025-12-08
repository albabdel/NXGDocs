/**
 * Strapi Content Types Setup Script
 * Run this with: node scripts/setup-content-types.js
 *
 * This script creates the Documentation Article and Category content types programmatically
 */

const fs = require('fs');
const path = require('path');

// Documentation Article Schema
const documentationArticleSchema = {
  kind: 'collectionType',
  collectionName: 'documentation_articles',
  info: {
    singularName: 'documentation-article',
    pluralName: 'documentation-articles',
    displayName: 'Documentation Article',
    description: 'Technical documentation articles'
  },
  options: {
    draftAndPublish: true,
  },
  pluginOptions: {},
  attributes: {
    title: {
      type: 'string',
      required: true,
      maxLength: 255
    },
    slug: {
      type: 'uid',
      targetField: 'title',
      required: true
    },
    description: {
      type: 'text',
      maxLength: 500
    },
    content: {
      type: 'richtext',
      required: true
    },
    role: {
      type: 'enumeration',
      enum: ['admin', 'operator', 'installer', 'manager', 'all'],
      default: 'all'
    },
    device_type: {
      type: 'enumeration',
      enum: [
        'hikvision',
        'dahua',
        'adpro',
        'milestone',
        'hanwha',
        'axis',
        'axxon',
        'camect',
        'teltonika',
        'gcxone_audio',
        'avigilon',
        'innovi',
        'reconeyez',
        'heitel',
        'other',
        'none'
      ],
      default: 'none'
    },
    difficulty: {
      type: 'enumeration',
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner'
    },
    platform: {
      type: 'enumeration',
      enum: ['gcxone', 'talos', 'both'],
      default: 'both'
    },
    order: {
      type: 'integer',
      default: 0
    },
    last_updated: {
      type: 'datetime'
    },
    version: {
      type: 'string',
      default: '1.0'
    },
    tags: {
      type: 'json'
    },
    category: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::category.category',
      inversedBy: 'documentation_articles'
    },
    featured_image: {
      type: 'media',
      multiple: false,
      required: false,
      allowedTypes: ['images']
    },
    screenshots: {
      type: 'media',
      multiple: true,
      required: false,
      allowedTypes: ['images']
    }
  }
};

// Category Schema
const categorySchema = {
  kind: 'collectionType',
  collectionName: 'categories',
  info: {
    singularName: 'category',
    pluralName: 'categories',
    displayName: 'Category',
    description: 'Documentation categories'
  },
  options: {
    draftAndPublish: false,
  },
  pluginOptions: {},
  attributes: {
    name: {
      type: 'string',
      required: true
    },
    slug: {
      type: 'uid',
      targetField: 'name',
      required: true
    },
    description: {
      type: 'text'
    },
    icon: {
      type: 'string',
      default: '📁'
    },
    order: {
      type: 'integer',
      default: 0
    },
    parent: {
      type: 'relation',
      relation: 'manyToOne',
      target: 'api::category.category',
      inversedBy: 'children'
    },
    children: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::category.category',
      mappedBy: 'parent'
    },
    documentation_articles: {
      type: 'relation',
      relation: 'oneToMany',
      target: 'api::documentation-article.documentation-article',
      mappedBy: 'category'
    }
  }
};

// Create directory structure and schema files
function createContentType(name, schema) {
  const apiPath = path.join(__dirname, '..', 'src', 'api', name);
  const contentTypesPath = path.join(apiPath, 'content-types', name);

  // Create directories
  if (!fs.existsSync(contentTypesPath)) {
    fs.mkdirSync(contentTypesPath, { recursive: true });
  }

  // Write schema.json
  const schemaPath = path.join(contentTypesPath, 'schema.json');
  fs.writeFileSync(schemaPath, JSON.stringify(schema, null, 2));

  console.log(`✓ Created content type: ${name}`);
  console.log(`  Location: ${schemaPath}`);
}

// Main execution
console.log('🚀 Setting up Strapi content types...\n');

try {
  // Create Category first (no dependencies)
  createContentType('category', categorySchema);

  // Create Documentation Article (depends on Category)
  createContentType('documentation-article', documentationArticleSchema);

  console.log('\n✅ Content types created successfully!');
  console.log('\n📋 Next steps:');
  console.log('1. Restart Strapi server:');
  console.log('   cd c:/nxgen-docs/strapi-cms');
  console.log('   npm run develop');
  console.log('2. Strapi will detect the new content types and build them automatically');
  console.log('3. Check http://localhost:1337/admin to verify');

} catch (error) {
  console.error('❌ Error creating content types:', error.message);
  process.exit(1);
}
