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

const tagGroups = [
  {
    _id: 'tag-group-device-manufacturers',
    name: 'Device Manufacturers',
    description: 'Manufacturers of cameras, sensors, and other monitoring devices',
    allowMultiple: true,
    required: false,
    order: 1,
  },
  {
    _id: 'tag-group-device-types',
    name: 'Device Types',
    description: 'Categories of monitoring devices and equipment',
    allowMultiple: true,
    required: false,
    order: 2,
  },
  {
    _id: 'tag-group-alert-categories',
    name: 'Alert Categories',
    description: 'Types of alerts and alarm classifications',
    allowMultiple: true,
    required: false,
    order: 3,
  },
  {
    _id: 'tag-group-integration-types',
    name: 'Integration Types',
    description: 'External systems, protocols, and integration methods',
    allowMultiple: true,
    required: false,
    order: 4,
  },
  {
    _id: 'tag-group-industries',
    name: 'Industries Served',
    description: 'Industry sectors served by NXGEN monitoring solutions',
    allowMultiple: true,
    required: false,
    order: 5,
  },
  {
    _id: 'tag-group-compliance',
    name: 'Compliance Standards',
    description: 'Regulatory and compliance frameworks supported',
    allowMultiple: true,
    required: false,
    order: 6,
  },
  {
    _id: 'tag-group-user-roles',
    name: 'User Roles',
    description: 'User role categories within the platform',
    allowMultiple: false,
    required: false,
    order: 7,
  },
  {
    _id: 'tag-group-content-types',
    name: 'Content Types',
    description: 'Documentation and content classification',
    allowMultiple: true,
    required: false,
    order: 8,
  },
];

const tags = {
  deviceManufacturers: [
    { name: 'Hikvision', description: 'Leading video surveillance manufacturer', color: { hex: '#E53935', alpha: 1 }, icon: '📷' },
    { name: 'Dahua', description: 'Video surveillance and security solutions', color: { hex: '#1976D2', alpha: 1 }, icon: '📷' },
    { name: 'Axis', description: 'Swedish network camera manufacturer', color: { hex: '#FFD600', alpha: 1 }, icon: '📷' },
    { name: 'Hanwha', description: 'South Korean security camera manufacturer', color: { hex: '#43A047', alpha: 1 }, icon: '📷' },
    { name: 'Milestone', description: 'Video management software (VMS) provider', color: { hex: '#8E24AA', alpha: 1 }, icon: '🎬' },
    { name: 'Axxon', description: 'Video surveillance software and hardware', color: { hex: '#FF6F00', alpha: 1 }, icon: '🎬' },
    { name: 'Teltonika', description: 'IoT and networking equipment manufacturer', color: { hex: '#00897B', alpha: 1 }, icon: '🔧' },
    { name: 'Avigilon', description: 'Video surveillance and access control', color: { hex: '#E65100', alpha: 1 }, icon: '📷' },
    { name: 'Ajax', description: 'Wireless security systems', color: { hex: '#5C6BC0', alpha: 1 }, icon: '🔒' },
    { name: 'Ganz', description: 'Security cameras and surveillance equipment', color: { hex: '#7B1FA2', alpha: 1 }, icon: '📷' },
    { name: 'ADPRO', description: 'Intrusion detection and video transmission', color: { hex: '#C62828', alpha: 1 }, icon: '🔒' },
    { name: 'Heitel', description: 'Digital video recording systems', color: { hex: '#00695C', alpha: 1 }, icon: '💾' },
    { name: 'Camect', description: 'AI-powered video surveillance hub', color: { hex: '#6A1B9A', alpha: 1 }, icon: '🤖' },
    { name: 'Reconeyez', description: 'Wireless video verification systems', color: { hex: '#283593', alpha: 1 }, icon: '📷' },
    { name: 'InnoVi', description: 'AI video analytics solutions', color: { hex: '#AD1457', alpha: 1 }, icon: '🤖' },
    { name: 'EagleEye', description: 'Cloud video surveillance platform', color: { hex: '#2E7D32', alpha: 1 }, icon: '☁️' },
    { name: 'Uniview', description: 'Network video surveillance products', color: { hex: '#F57C00', alpha: 1 }, icon: '📷' },
  ],
  deviceTypes: [
    { name: 'IP Camera', description: 'Network-connected video camera', color: { hex: '#3B82F6', alpha: 1 }, icon: '📷' },
    { name: 'PTZ Camera', description: 'Pan-tilt-zoom camera with remote control', color: { hex: '#10B981', alpha: 1 }, icon: '📷' },
    { name: 'NVR', description: 'Network Video Recorder', color: { hex: '#8B5CF6', alpha: 1 }, icon: '💾' },
    { name: 'DVR', description: 'Digital Video Recorder', color: { hex: '#F59E0B', alpha: 1 }, icon: '💾' },
    { name: 'Sensor', description: 'General sensor device', color: { hex: '#06B6D4', alpha: 1 }, icon: '📡' },
    { name: 'Gateway', description: 'IoT gateway device', color: { hex: '#EC4899', alpha: 1 }, icon: '🔌' },
    { name: 'Controller', description: 'Device controller unit', color: { hex: '#84CC16', alpha: 1 }, icon: '🎮' },
    { name: 'Router', description: 'Network routing device', color: { hex: '#F97316', alpha: 1 }, icon: '🌐' },
    { name: 'UPS', description: 'Uninterruptible Power Supply', color: { hex: '#EF4444', alpha: 1 }, icon: '🔋' },
    { name: 'Environmental Sensor', description: 'Temperature, humidity, and environmental monitors', color: { hex: '#14B8A6', alpha: 1 }, icon: '🌡️' },
    { name: 'Access Control', description: 'Door access and entry systems', color: { hex: '#6366F1', alpha: 1 }, icon: '🔐' },
    { name: 'Intrusion Panel', description: 'Intrusion detection and alarm panel', color: { hex: '#DC2626', alpha: 1 }, icon: '🚨' },
  ],
  alertCategories: [
    { name: 'Video Loss', description: 'Video signal loss or camera disconnection', color: { hex: '#EF4444', alpha: 1 }, icon: '⚠️' },
    { name: 'Motion Detection', description: 'Motion detected in monitored area', color: { hex: '#F59E0B', alpha: 1 }, icon: '👁️' },
    { name: 'Device Offline', description: 'Device not responding or unreachable', color: { hex: '#DC2626', alpha: 1 }, icon: '🔌' },
    { name: 'Temperature Alert', description: 'Temperature threshold exceeded', color: { hex: '#F97316', alpha: 1 }, icon: '🌡️' },
    { name: 'Network Issue', description: 'Network connectivity or performance problem', color: { hex: '#8B5CF6', alpha: 1 }, icon: '🌐' },
    { name: 'Power Failure', description: 'Power loss or UPS battery critical', color: { hex: '#EF4444', alpha: 1 }, icon: '⚡' },
    { name: 'Tamper Detection', description: 'Device tampering or physical interference', color: { hex: '#B91C1C', alpha: 1 }, icon: '🔧' },
    { name: 'Storage Warning', description: 'Storage capacity or performance issue', color: { hex: '#F59E0B', alpha: 1 }, icon: '💾' },
    { name: 'Login Alert', description: 'Authentication or access events', color: { hex: '#6366F1', alpha: 1 }, icon: '🔑' },
    { name: 'System Error', description: 'Platform or system-level errors', color: { hex: '#DC2626', alpha: 1 }, icon: '❌' },
  ],
  integrationTypes: [
    { name: 'VMS', description: 'Video Management System integration', color: { hex: '#3B82F6', alpha: 1 }, icon: '🎬' },
    { name: 'PSIM', description: 'Physical Security Information Management', color: { hex: '#8B5CF6', alpha: 1 }, icon: '🏢' },
    { name: 'SIEM', description: 'Security Information and Event Management', color: { hex: '#EF4444', alpha: 1 }, icon: '🔒' },
    { name: 'CRM', description: 'Customer Relationship Management', color: { hex: '#10B981', alpha: 1 }, icon: '👥' },
    { name: 'Ticketing', description: 'Ticket and incident management systems', color: { hex: '#F59E0B', alpha: 1 }, icon: '🎫' },
    { name: 'Email', description: 'Email notification integration', color: { hex: '#06B6D4', alpha: 1 }, icon: '📧' },
    { name: 'SMS', description: 'SMS text message notifications', color: { hex: '#84CC16', alpha: 1 }, icon: '📱' },
    { name: 'Push', description: 'Mobile push notifications', color: { hex: '#EC4899', alpha: 1 }, icon: '🔔' },
    { name: 'Webhook', description: 'HTTP webhook integrations', color: { hex: '#6366F1', alpha: 1 }, icon: '🔗' },
    { name: 'MQTT', description: 'MQTT IoT protocol', color: { hex: '#F97316', alpha: 1 }, icon: '📡' },
    { name: 'ONVIF', description: 'ONVIF video protocol standard', color: { hex: '#14B8A6', alpha: 1 }, icon: '📷' },
    { name: 'RTSP', description: 'Real-Time Streaming Protocol', color: { hex: '#A855F7', alpha: 1 }, icon: '🎥' },
    { name: 'Modbus', description: 'Modbus industrial protocol', color: { hex: '#0D9488', alpha: 1 }, icon: '🏭' },
  ],
  industries: [
    { name: 'Telecommunications', description: 'Telecom towers and network infrastructure', color: { hex: '#3B82F6', alpha: 1 }, icon: '📡' },
    { name: 'Security', description: 'Security monitoring and surveillance', color: { hex: '#EF4444', alpha: 1 }, icon: '🔒' },
    { name: 'Critical Infrastructure', description: 'Essential services infrastructure', color: { hex: '#DC2626', alpha: 1 }, icon: '🏭' },
    { name: 'Retail', description: 'Retail stores and chains', color: { hex: '#F59E0B', alpha: 1 }, icon: '🛒' },
    { name: 'Banking', description: 'Banks and financial institutions', color: { hex: '#10B981', alpha: 1 }, icon: '🏦' },
    { name: 'Healthcare', description: 'Hospitals and healthcare facilities', color: { hex: '#EC4899', alpha: 1 }, icon: '🏥' },
    { name: 'Transportation', description: 'Transit and transportation infrastructure', color: { hex: '#8B5CF6', alpha: 1 }, icon: '🚗' },
    { name: 'Manufacturing', description: 'Manufacturing plants and facilities', color: { hex: '#06B6D4', alpha: 1 }, icon: '🏭' },
    { name: 'Government', description: 'Government agencies and facilities', color: { hex: '#6366F1', alpha: 1 }, icon: '🏛️' },
    { name: 'Energy', description: 'Energy and utility companies', color: { hex: '#F97316', alpha: 1 }, icon: '⚡' },
    { name: 'Smart Buildings', description: 'Intelligent building management', color: { hex: '#14B8A6', alpha: 1 }, icon: '🏢' },
  ],
  compliance: [
    { name: 'GDPR', description: 'General Data Protection Regulation', color: { hex: '#3B82F6', alpha: 1 }, icon: '🇪🇺' },
    { name: 'SOC2', description: 'SOC 2 Type II compliance', color: { hex: '#10B981', alpha: 1 }, icon: '✅' },
    { name: 'ISO 27001', description: 'ISO/IEC 27001 information security', color: { hex: '#8B5CF6', alpha: 1 }, icon: '📜' },
    { name: 'PCI-DSS', description: 'Payment Card Industry Data Security Standard', color: { hex: '#EF4444', alpha: 1 }, icon: '💳' },
    { name: 'HIPAA', description: 'Health Insurance Portability and Accountability Act', color: { hex: '#EC4899', alpha: 1 }, icon: '🏥' },
    { name: 'NERC CIP', description: 'North American Electric Reliability Corp Critical Infrastructure Protection', color: { hex: '#F59E0B', alpha: 1 }, icon: '⚡' },
  ],
  userRoles: [
    { name: 'Administrator', description: 'Full system access and configuration', color: { hex: '#EF4444', alpha: 1 }, icon: '👑' },
    { name: 'Manager', description: 'Team and station management', color: { hex: '#F59E0B', alpha: 1 }, icon: '👔' },
    { name: 'Operator', description: 'Daily monitoring and incident response', color: { hex: '#3B82F6', alpha: 1 }, icon: '👤' },
    { name: 'Viewer', description: 'Read-only access to dashboards', color: { hex: '#10B981', alpha: 1 }, icon: '👁️' },
  ],
  contentTypes: [
    { name: 'Tutorial', description: 'Step-by-step how-to guides', color: { hex: '#3B82F6', alpha: 1 }, icon: '📚' },
    { name: 'Reference', description: 'Technical reference documentation', color: { hex: '#8B5CF6', alpha: 1 }, icon: '📖' },
    { name: 'Best Practice', description: 'Recommended approaches and guidelines', color: { hex: '#10B981', alpha: 1 }, icon: '⭐' },
    { name: 'Troubleshooting', description: 'Problem diagnosis and solutions', color: { hex: '#EF4444', alpha: 1 }, icon: '🔧' },
    { name: 'Integration Guide', description: 'External system integration docs', color: { hex: '#06B6D4', alpha: 1 }, icon: '🔗' },
    { name: 'API Reference', description: 'API documentation and examples', color: { hex: '#F59E0B', alpha: 1 }, icon: '💻' },
    { name: 'Release Note', description: 'Product release announcements', color: { hex: '#EC4899', alpha: 1 }, icon: '🚀' },
    { name: 'Video', description: 'Video tutorials and demos', color: { hex: '#84CC16', alpha: 1 }, icon: '🎬' },
  ],
};

function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

async function createTag(name, description, color, icon, groupId) {
  const slug = createSlug(name);
  const tagId = `tag-${slug}`;
  
  const tag = {
    _id: tagId,
    _type: 'tag',
    name,
    slug: { _type: 'slug', current: slug },
    description,
    color,
    icon,
    category: 'custom',
    featured: false,
    usageCount: 0,
    metadata: {
      createdBy: 'seed-script',
      createdAt: new Date().toISOString(),
    },
  };

  try {
    await client.createOrReplace(tag);
    console.log(`  ✓ Created tag: ${name}`);
    return tagId;
  } catch (err) {
    console.error(`  ✗ Error creating tag ${name}:`, err.message);
    return null;
  }
}

async function createTagGroup(group) {
  const doc = {
    _id: group._id,
    _type: 'tagGroup',
    name: group.name,
    description: group.description,
    allowMultiple: group.allowMultiple,
    required: group.required,
    order: group.order,
  };

  try {
    await client.createOrReplace(doc);
    console.log(`✓ Created tag group: ${group.name}`);
    return group._id;
  } catch (err) {
    console.error(`✗ Error creating tag group ${group.name}:`, err.message);
    return null;
  }
}

async function updateTagGroupWithTags(groupId, tagIds) {
  try {
    const tagsRefs = tagIds
      .filter(id => id !== null)
      .map(id => ({
        _type: 'reference',
        _ref: id,
        _key: `ref-${id}`,
      }));

    await client
      .patch(groupId)
      .set({ tags: tagsRefs, tagCount: tagsRefs.length })
      .commit();
    
    return true;
  } catch (err) {
    console.error(`  ✗ Error updating tag group:`, err.message);
    return false;
  }
}

async function seedTagsAndGroups() {
  console.log('🌱 Seeding tags and tag groups to Sanity...\n');
  console.log('📡 Project: fjjuacab');
  console.log('📡 Dataset: production\n');

  console.log('📁 Creating tag groups...\n');
  
  for (const group of tagGroups) {
    await createTagGroup(group);
  }

  console.log('\n🏷️  Creating tags...\n');

  console.log('Device Manufacturers:');
  const manufacturerTagIds = [];
  for (const tag of tags.deviceManufacturers) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    manufacturerTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-device-manufacturers', manufacturerTagIds);

  console.log('\nDevice Types:');
  const deviceTypeTagIds = [];
  for (const tag of tags.deviceTypes) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    deviceTypeTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-device-types', deviceTypeTagIds);

  console.log('\nAlert Categories:');
  const alertTagIds = [];
  for (const tag of tags.alertCategories) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    alertTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-alert-categories', alertTagIds);

  console.log('\nIntegration Types:');
  const integrationTagIds = [];
  for (const tag of tags.integrationTypes) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    integrationTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-integration-types', integrationTagIds);

  console.log('\nIndustries Served:');
  const industryTagIds = [];
  for (const tag of tags.industries) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    industryTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-industries', industryTagIds);

  console.log('\nCompliance Standards:');
  const complianceTagIds = [];
  for (const tag of tags.compliance) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    complianceTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-compliance', complianceTagIds);

  console.log('\nUser Roles:');
  const roleTagIds = [];
  for (const tag of tags.userRoles) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    roleTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-user-roles', roleTagIds);

  console.log('\nContent Types:');
  const contentTagIds = [];
  for (const tag of tags.contentTypes) {
    const id = await createTag(tag.name, tag.description, tag.color, tag.icon);
    contentTagIds.push(id);
  }
  await updateTagGroupWithTags('tag-group-content-types', contentTagIds);

  console.log('\n✅ Seed complete!');
  console.log('\n🌐 Visit your studio at: https://nxgen-docs.sanity.studio/');
}

seedTagsAndGroups().catch(console.error);
