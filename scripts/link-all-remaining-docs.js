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

const DOC_LINKS = [
    { manufacturer: 'teltonika', docSlug: 'teltonika-iot' },
    { manufacturer: 'vivotek onpremise', docSlug: 'vivotek' },
    { manufacturer: 'vivotek vortex', docSlug: 'vivotek-vortex' },
    { manufacturer: 'reconeyez', docSlug: 'reconeyez' },
    { manufacturer: 'efoy', docSlug: 'efoy' },
    { manufacturer: 'innovi', docSlug: 'innovi' },
    { manufacturer: 'davantis', docSlug: 'davantis' },
    { manufacturer: 'rosenberger', docSlug: 'rosenberger' },
    { manufacturer: 'autoaid', docSlug: 'autoaid' },
    { manufacturer: 'auraigateway', docSlug: 'auraigateway' },
    { manufacturer: 'onvif', docSlug: 'onvif' },
    { manufacturer: 'spykebox', docSlug: 'spykebox' },
    { manufacturer: 'viasys', docSlug: 'viasys-shieldbox' },
    { manufacturer: 'shieldbox', docSlug: 'viasys-shieldbox' },
    { manufacturer: 'essence', docSlug: 'essence-my-shield' },
    { manufacturer: 'miwi', docSlug: 'miwi-urmet-grundig' },
    { manufacturer: 'nxg cloud nvr', docSlug: 'nxg-cloud-nvr' },
];

async function linkAllRemainingDocs() {
    console.log('Linking all remaining device docs to integrations...\n');

    const integrations = await client.fetch(`*[_type == "deviceIntegration"]{
        _id,
        manufacturer,
        brand,
        "configArticle": documentation.configurationArticle
    }`);

    const docs = await client.fetch(`*[_type == "doc" && slug.current match "devices/*"]{
        _id,
        title,
        "slug": slug.current
    }`);

    const docBySlug = {};
    docs.forEach(d => { docBySlug[d.slug] = d; });

    let updated = 0;

    for (const link of DOC_LINKS) {
        const doc = docBySlug[`devices/${link.docSlug}`];
        if (!doc) {
            console.log(`Doc not found: devices/${link.docSlug}`);
            continue;
        }

        const matchingIntegrations = integrations.filter(i => {
            const mfr = (i.manufacturer || '').toLowerCase();
            const brand = (i.brand || '').toLowerCase();
            const searchKey = link.manufacturer.toLowerCase();
            return (mfr.includes(searchKey) || searchKey.includes(mfr) || brand.includes(searchKey));
        });

        for (const integration of matchingIntegrations) {
            if (integration.configArticle?._ref) {
                console.log(`Already linked: ${integration.manufacturer}`);
                continue;
            }

            try {
                await client.patch(integration._id)
                    .set({
                        'documentation.configurationArticle': { _type: 'reference', _ref: doc._id },
                        'documentation.helpManualUrl': `/docs/devices/${link.docSlug}`
                    })
                    .commit();
                console.log(`Linked: ${integration.manufacturer} -> ${doc.title}`);
                updated++;
            } catch (err) {
                console.error(`Error linking ${integration.manufacturer}: ${err.message}`);
            }
        }
    }

    console.log(`\n--- Summary ---`);
    console.log(`Updated: ${updated} integrations`);
}

linkAllRemainingDocs().catch(console.error);
