#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: 'fjjuacab',
  dataset: 'production',
  apiVersion: '2025-02-06',
  token: 'sk6UtQrIiszU0whyrdZeIcc2bQiyKivrm4FQVDCukFHw3PuHa8QLrqCaemoMuIqCkMYpi47P1j6Uoiceo3V3PBagrqAMm867RlT8hG0dLc17kIJPa89WAbxH394p2poRxCrcwFWoQmuNV80lC9zBp19sZp1gXngErxnYYZbEkQUeZe3Z4YZN',
  useCdn: false,
});

const SUPPORT_STATUS_MAP = {
  'Supported': 'full',
  'Partially Supported': 'partial',
  'Not Supported': 'none',
  'N/A': 'none',
  'Plan in Future': 'development',
  'Not Supported by Device': 'none',
};

const DEVICE_TYPE_MAP = {
  'NVR': 'nvr',
  'Camera': 'camera',
  'IP Camera': 'camera',
  'PTZ CAM': 'camera',
  'PIR CAM': 'camera',
  'PIR Cam': 'camera',
  'IPC': 'camera',
  'VMS': 'vms',
  'P2P Cloud VMS': 'vms',
  'Cloud VMS': 'vms',
  'AI Cloud': 'vms',
  'Gateway': 'gateway',
  'IoT': 'gateway',
  'IOT': 'gateway',
  'Router': 'gateway',
  'Sensor': 'sensor',
  'Access Control': 'access',
  'Intrusion': 'intrusion',
  'Audio': 'audio',
  'AI BOX': 'other',
  'Cloud NVR': 'nvr',
  'SIP Twillio': 'audio',
  'hik': 'other',
  'Not supported': 'other',
  'IOT battery Mgmt': 'gateway',
  'IOT Mining': 'gateway',
  'IOT Air Horn': 'other',
  'NVR/IP Camera': 'nvr',
};

function transformSupportStatus(value) {
  if (value === null || value === undefined) return 'none';
  const status = SUPPORT_STATUS_MAP[value];
  if (status) return status;
  if (typeof value === 'string' && value.includes('Not Supported')) return 'none';
  return 'none';
}

function mapDeviceType(deviceType) {
  if (!deviceType) return 'other';
  const mapped = DEVICE_TYPE_MAP[deviceType];
  return mapped || 'other';
}

function generateSlug(manufacturer, brand, deviceType) {
  const parts = [manufacturer, brand, deviceType].filter(Boolean);
  const slug = parts
    .join('-')
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');
  return slug;
}

function transformCloudMode(cloudMode) {
  if (!cloudMode) return null;
  return {
    _type: 'cloudModeFeatures',
    discovery: transformSupportStatus(cloudMode.discovery),
    live: transformSupportStatus(cloudMode.live),
    playback: transformSupportStatus(cloudMode.playback),
    timeline: transformSupportStatus(cloudMode.timeline),
    events: transformSupportStatus(cloudMode.events),
    armDisarm: transformSupportStatus(cloudMode.armDisarm),
    genesisAudio: transformSupportStatus(cloudMode.genesisAudio),
    ptz: transformSupportStatus(cloudMode.ptz),
    io: transformSupportStatus(cloudMode.io),
    eventAck: transformSupportStatus(cloudMode.eventAck),
    playAudio: transformSupportStatus(cloudMode.playAudio),
    timeSync: transformSupportStatus(cloudMode.timeSync),
  };
}

function transformLocalMode(localMode) {
  if (!localMode) return null;
  return {
    _type: 'localModeFeatures',
    live: transformSupportStatus(localMode.live),
    playback: transformSupportStatus(localMode.playback),
    sdkAudio: transformSupportStatus(localMode.sdkAudio),
    ptz: transformSupportStatus(localMode.ptz),
    io: transformSupportStatus(localMode.io),
    timeline: transformSupportStatus(localMode.timeline),
  };
}

function transformDeviceHealth(deviceHealth) {
  if (!deviceHealth) return null;
  return {
    _type: 'deviceHealthFeatures',
    pollFromCloud: transformSupportStatus(deviceHealth.pollFromCloud),
    heartbeat: transformSupportStatus(deviceHealth.heartbeat),
    mobileApp: transformSupportStatus(deviceHealth.mobileApp),
  };
}

function transformCameraHealth(cameraHealth) {
  if (!cameraHealth) return null;
  return {
    _type: 'cameraHealthFeatures',
    basic: transformSupportStatus(cameraHealth.basic),
    basicPlus: transformSupportStatus(cameraHealth.basicPlus),
    advanced: transformSupportStatus(cameraHealth.advanced),
  };
}

function transformTimelapse(timelapse) {
  if (!timelapse) return null;
  return {
    _type: 'timelapseFeatures',
    support: transformSupportStatus(timelapse.support),
    differentiation: timelapse.differentiation,
    highResSupport: transformSupportStatus(timelapse.highResSupport),
    clipExport: transformSupportStatus(timelapse.clipExport),
  };
}

function transformConnectivity(connectivity) {
  if (!connectivity) return null;
  return {
    _type: 'connectivityInfo',
    integrationProtocol: connectivity.integrationProtocol,
    eventIntegrationMethod: connectivity.eventIntegrationMethod,
    videoStreaming: connectivity.videoStreaming,
    loginSecurity: connectivity.loginSecurity,
    customerPorts: connectivity.customerPorts,
    genesisPorts: connectivity.genesisPorts,
  };
}

function transformComments(comments) {
  if (!comments) return null;
  return {
    _type: 'commentsInfo',
    notes: comments.notes,
    currentIssues: comments.currentIssues,
    dependencies: comments.dependencies,
    commonIssues: comments.commonIssues,
  };
}

function transformArchitecture(architecture) {
  if (!architecture) return null;
  return {
    _type: 'architectureInfo',
    singleton: architecture.singleton,
    api: architecture.api,
    action: architecture.action,
  };
}

function mapToDeviceIntegration(device) {
  const manufacturer = device.manufacturer || 'Unknown';
  const brand = device.brand;
  const deviceType = device.deviceType || 'other';
  const slug = generateSlug(manufacturer, brand, deviceType);

  const title = brand
    ? `${manufacturer} ${brand}`
    : manufacturer;

  return {
    _type: 'deviceIntegration',
    title: title,
    slug: { _type: 'slug', current: slug },
    manufacturer: manufacturer,
    brand: brand,
    deviceType: mapDeviceType(deviceType),
    originalDeviceType: deviceType,
    gcxReady: transformSupportStatus(device.gcxReady),
    status: 'published',
    cloudMode: transformCloudMode(device.cloudMode),
    localMode: transformLocalMode(device.localMode),
    deviceHealth: transformDeviceHealth(device.deviceHealth),
    cameraHealth: transformCameraHealth(device.cameraHealth),
    timelapse: transformTimelapse(device.timelapse),
    connectivity: transformConnectivity(device.connectivity),
    comments: transformComments(device.comments),
    architecture: transformArchitecture(device.architecture),
    helpManuals: device.documents?.helpManuals || [],
    helpdesk: device.documents?.helpdesk || [],
  };
}

async function seedDeviceIntegrations() {
  console.log('Seeding device integrations to Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');

  const jsonPath = path.join(__dirname, 'integration-matrix.json');
  const jsonData = fs.readFileSync(jsonPath, 'utf8');
  const devices = JSON.parse(jsonData);

  console.log(`Found ${devices.length} devices in integration-matrix.json\n`);

  let created = 0;
  let updated = 0;
  let errors = 0;

  for (const device of devices) {
    try {
      const doc = mapToDeviceIntegration(device);
      const slug = doc.slug.current;

      const existing = await client.fetch(
        `*[_type == "deviceIntegration" && slug.current == $slug][0]._id`,
        { slug }
      );

      if (existing) {
        doc._id = existing;
        await client.patch(existing).set(doc).commit();
        console.log(`Updated: ${doc.title} (${slug})`);
        updated++;
      } else {
        doc._id = `device-integration-${slug}`;
        await client.create(doc);
        console.log(`Created: ${doc.title} (${slug})`);
        created++;
      }
    } catch (err) {
      console.error(`Error processing ${device.manufacturer}:`, err.message);
      errors++;
    }
  }

  console.log('\n--- Summary ---');
  console.log(`Total devices: ${devices.length}`);
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Errors: ${errors}`);
  console.log('\nSeeding complete!');
  console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
}

seedDeviceIntegrations().catch(console.error);
