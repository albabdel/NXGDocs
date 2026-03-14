#!/usr/bin/env node
'use strict';

const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

const primaryKeywords = [
  'monitoring station software',
  'remote monitoring platform',
  'video surveillance management',
  'tower site monitoring',
  'alarm monitoring system',
  'security operations center',
  'NOC software',
  'B2B monitoring SaaS',
];

const secondaryKeywords = [
  'IP camera management',
  'video analytics platform',
  'alarm queue management',
  'multi-site monitoring',
  'device monitoring dashboard',
  'environmental monitoring',
  'access control integration',
  'VMS integration',
];

const industryKeywords = [
  'telecom tower monitoring',
  'critical infrastructure monitoring',
  'retail security monitoring',
  'bank branch monitoring',
  'smart building monitoring',
];

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "NXGEN Technology AG",
  "url": "https://nxgen.tech",
  "logo": "https://nxgen.tech/logo.png",
  "description": "Enterprise monitoring station software for video surveillance, alarm management, and remote site monitoring. B2B SaaS platform for security operations centers and NOC teams.",
  "sameAs": [
    "https://www.linkedin.com/company/nxgen-technology-ag",
    "https://twitter.com/nxgentech"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "sales",
    "availableLanguage": ["English", "German"]
  },
  "address": {
    "@type": "PostalAddress",
    "addressCountry": "CH"
  }
};

const softwareApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "NXGEN Monitoring Platform",
  "applicationCategory": "SecurityApplication",
  "operatingSystem": "Web-based (SaaS)",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
    "description": "Contact for enterprise pricing"
  },
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.8",
    "ratingCount": "150"
  },
  "description": "Enterprise monitoring station software for video surveillance management, alarm monitoring, and multi-site remote monitoring. Trusted by security operations centers, NOC teams, and telecom tower operators worldwide.",
  "softwareVersion": "2024.1",
  "releaseNotes": "Enhanced video analytics, improved alarm queue management, and new integration capabilities.",
  "screenshot": "https://nxgen.tech/screenshots/dashboard.png",
  "featureList": [
    "Video surveillance management",
    "Alarm queue management",
    "Multi-site monitoring",
    "IP camera management",
    "Environmental monitoring",
    "Access control integration",
    "VMS integration",
    "Mobile operator apps",
    "Real-time alerts",
    "Customizable dashboards"
  ],
  "applicationSubCategory": "Monitoring Software",
  "operatingSystem": "Any (Web-based)",
  "browserRequirements": "Requires JavaScript. Requires HTML5 video support.",
  "softwareHelp": {
    "@type": "CreativeWork",
    "url": "https://docs.nxgen.tech"
  },
  "author": {
    "@type": "Organization",
    "name": "NXGEN Technology AG"
  },
  "publisher": {
    "@type": "Organization",
    "name": "NXGEN Technology AG"
  }
};

const seoDefaults = {
  _id: 'seo-defaults',
  _type: 'seoDefaults',
  defaultMetaTitleTemplate: '{title} | NXGEN Technology AG',
  defaultMetaDescription: 'NXGEN Technology AG provides enterprise monitoring station software for video surveillance management, alarm monitoring, and remote multi-site monitoring. Trusted by security operations centers and NOC teams worldwide.',
  defaultKeywords: [
    'monitoring software',
    'surveillance platform',
    'security monitoring',
    'enterprise software',
  ],
  primaryKeywords,
  secondaryKeywords,
  industryKeywords,
  siteName: 'NXGEN Technology AG',
  siteUrl: 'https://docs.nxgen.tech',
  twitterSite: '@nxgentech',
  locale: 'en_US',
  organizationSchema: JSON.stringify(organizationSchema, null, 2),
  softwareApplicationSchema: JSON.stringify(softwareApplicationSchema, null, 2),
  robotsTxt: `# Custom robots directives
Sitemap: https://docs.nxgen.tech/sitemap.xml`,
};

async function seedSeoDefaults() {
  console.log('🌱 Seeding SEO defaults to Sanity...\n');
  console.log('📡 Project: fjjuacab');
  console.log('📡 Dataset: production\n');

  try {
    await client.createOrReplace(seoDefaults);
    console.log('✓ Created SEO defaults singleton document\n');
  } catch (err) {
    console.error('✗ Error creating SEO defaults:', err.message);
    process.exit(1);
  }

  console.log('📊 SEO Configuration Summary:\n');
  console.log(`  Primary Keywords: ${primaryKeywords.length}`);
  primaryKeywords.forEach(kw => console.log(`    - ${kw}`));
  
  console.log(`\n  Secondary Keywords: ${secondaryKeywords.length}`);
  secondaryKeywords.forEach(kw => console.log(`    - ${kw}`));
  
  console.log(`\n  Industry Keywords: ${industryKeywords.length}`);
  industryKeywords.forEach(kw => console.log(`    - ${kw}`));

  console.log('\n📝 Structured Data Schemas:');
  console.log('  - Organization (JSON-LD)');
  console.log('  - SoftwareApplication (JSON-LD)');

  console.log('\n✅ Seed complete!');
  console.log('\n🌐 Visit your studio at: https://nxgen-docs.sanity.studio/');
  console.log('📄 Edit SEO defaults at: https://nxgen-docs.sanity.studio/desk/seo-defaults');
}

seedSeoDefaults().catch(console.error);
