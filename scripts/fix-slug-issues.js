const https = require('https');

const projectId = 'fjjuacab';
const dataset = 'production';
const token = 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: `${projectId}.api.sanity.io`,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve({ raw: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function fixSlug(slug) {
  if (!slug) return slug;
  let fixed = slug;
  fixed = fixed.toLowerCase();
  fixed = fixed.replace(/\s+/g, '-');
  fixed = fixed.replace(/&/g, '-');
  fixed = fixed.replace(/--+/g, '-');
  fixed = fixed.replace(/[^a-z0-9\-\/]/g, '');
  fixed = fixed.replace(/--+/g, '-');
  return fixed;
}

function hasSlugIssue(slug) {
  if (!slug) return false;
  if (/[A-Z]/.test(slug)) return true;
  if (/[\s&]/.test(slug)) return true;
  if (slug.includes('--')) return true;
  if (/[^a-z0-9\-\/]/.test(slug)) return true;
  return false;
}

async function main() {
  console.log('=== FIXING ALL SLUG FORMAT ISSUES ===\n');

  const query = encodeURIComponent(`*[_type in ["doc", "gettingStartedPage", "article", "integration", "deviceProfile", "monitoringStation"]] {
    _id,
    _type,
    title,
    "slug": slug.current
  }`);
  
  const result = await makeRequest('GET', `/v2021-10-21/data/query/${dataset}?query=${query}`);
  const docs = result.result || [];

  const docsNeedingFix = docs.filter(d => d.slug && hasSlugIssue(d.slug) && !d._id.startsWith('drafts.'));

  console.log(`Found ${docs.length} total documents`);
  console.log(`Found ${docsNeedingFix.length} documents with slug issues\n`);

  if (docsNeedingFix.length === 0) {
    console.log('No slug issues found!');
    return;
  }

  console.log('Documents needing fix:');
  docsNeedingFix.forEach(d => {
    const fixed = fixSlug(d.slug);
    console.log(`  ${d.slug} -> ${fixed}`);
  });

  console.log('\n--- Applying fixes ---\n');

  const mutations = docsNeedingFix.map(d => {
    const fixedSlug = fixSlug(d.slug);
    return {
      id: d._id,
      patch: {
        set: { 'slug.current': fixedSlug }
      }
    };
  });

  const transaction = {
    mutations: mutations.map(m => ({
      patch: {
        id: m.id,
        set: { 'slug.current': fixSlug(docsNeedingFix.find(d => d._id === m.id).slug) }
      }
    }))
  };

  const updateResult = await makeRequest('POST', `/v2021-10-21/data/mutate/${dataset}`, transaction);

  if (updateResult.results) {
    console.log(`Successfully updated ${updateResult.results.length} documents`);
    updateResult.results.forEach((r, i) => {
      console.log(`  ${docsNeedingFix[i].slug} -> ${fixSlug(docsNeedingFix[i].slug)}`);
    });
  } else {
    console.log('Update result:', JSON.stringify(updateResult, null, 2));
  }

  console.log('\n=== Verifying fixes ===\n');
  
  const verifyResult = await makeRequest('GET', `/v2021-10-21/data/query/${dataset}?query=${query}`);
  const verifyDocs = verifyResult.result || [];
  const remainingIssues = verifyDocs.filter(d => d.slug && hasSlugIssue(d.slug) && !d._id.startsWith('drafts.'));
  
  if (remainingIssues.length === 0) {
    console.log('All slug issues have been fixed!');
  } else {
    console.log(`Remaining issues: ${remainingIssues.length}`);
    remainingIssues.forEach(d => console.log(`  - ${d.slug}`));
  }
}

main().catch(console.error);
