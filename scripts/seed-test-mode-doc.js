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

const today = new Date().toISOString().slice(0, 10);

function createBlock(key, style, text, listItem = null, level = null) {
  const block = {
    _type: 'block',
    _key: key,
    style: style,
    children: [
      {
        _type: 'span',
        _key: `${key}-span`,
        text: text,
        marks: []
      }
    ],
    markDefs: []
  };
  if (listItem) {
    block.listItem = listItem;
    block.level = level || 1;
  }
  return block;
}

const doc = {
  _id: 'doc-alarm-test-mode',
  _type: 'doc',
  title: 'Test Mode Guide',
  slug: { _type: 'slug', current: 'alarm-management/test-mode' },
  description: 'Comprehensive guide to using Test Mode in GCXONE for alarm simulation, training, system verification, and commissioning without affecting production alerts.',
  targetAudience: ['admin', 'operator'],
  status: 'published',
  lastUpdated: today,
  category: 'alarm-management',
  body: [
    createBlock('tm-h1', 'h2', 'What is Test Mode'),
    createBlock('tm-p1', 'normal', 'Test Mode is a specialized operational state in GCXONE that allows administrators and operators to simulate alarms and verify system configurations without triggering real production notifications. This feature is essential for training new operators, testing alarm routing rules, commissioning new equipment, and validating system integrations.'),
    createBlock('tm-p2', 'normal', 'When Test Mode is active, the platform clearly identifies test alarms and suppresses external notifications, ensuring that testing activities do not impact real-world monitoring operations or cause unnecessary escalations to external parties.'),
    
    createBlock('tm-h2', 'h2', 'When to Use Test Mode'),
    createBlock('tm-p3', 'normal', 'Test Mode should be enabled in the following scenarios:'),
    createBlock('tm-li1', 'normal', 'Commissioning new sites or equipment - Verify alarm routing before going live', 'bullet', 1),
    createBlock('tm-li2', 'normal', 'Operator training sessions - Practice alarm handling without consequences', 'bullet', 1),
    createBlock('tm-li3', 'normal', 'Testing notification configurations - Validate email, SMS, and voice settings', 'bullet', 1),
    createBlock('tm-li4', 'normal', 'Verifying escalation rules - Ensure alarms route to correct recipients', 'bullet', 1),
    createBlock('tm-li5', 'normal', 'Integration testing - Validate webhook and API integrations', 'bullet', 1),
    createBlock('tm-li6', 'normal', 'System health checks - Periodic verification of alarm infrastructure', 'bullet', 1),
    createBlock('tm-li7', 'normal', 'After configuration changes - Validate new settings work correctly', 'bullet', 1),
    createBlock('tm-p4', 'normal', 'Test Mode is not intended for routine monitoring or production use. Always disable Test Mode after completing testing activities to ensure normal alarm processing resumes.'),
    
    createBlock('tm-h3', 'h2', 'How to Enable Test Mode'),
    createBlock('tm-p5', 'normal', 'Follow these steps to enable Test Mode:'),
    createBlock('tm-li8', 'normal', 'Navigate to Admin > System Settings > Test Mode', 'number', 1),
    createBlock('tm-li9', 'normal', 'Click the Enable Test Mode toggle', 'number', 2),
    createBlock('tm-li10', 'normal', 'Select the scope: All Sites, Specific Regions, or Individual Sites', 'number', 3),
    createBlock('tm-li11', 'normal', 'Set an optional expiration time (recommended to prevent leaving Test Mode enabled)', 'number', 4),
    createBlock('tm-li12', 'normal', 'Add a reason for the test session (appears in audit logs)', 'number', 5),
    createBlock('tm-li13', 'normal', 'Click Apply to activate Test Mode', 'number', 6),
    createBlock('tm-p6', 'normal', 'The system displays a prominent banner indicating Test Mode is active. This banner remains visible to all operators until Test Mode is disabled.'),
    
    createBlock('tm-h4', 'h2', 'Test Mode Behavior Differences'),
    createBlock('tm-p7', 'normal', 'When Test Mode is active, the following behavioral changes occur:'),
    createBlock('tm-h5', 'h3', 'Alarm Generation'),
    createBlock('tm-li14', 'normal', 'All alarms generated within the test scope are marked with a TEST indicator', 'bullet', 1),
    createBlock('tm-li15', 'normal', 'Test alarms use the same priority levels as production alarms', 'bullet', 1),
    createBlock('tm-li16', 'normal', 'Alarm timestamps and metadata are preserved for analysis', 'bullet', 1),
    createBlock('tm-h6', 'h3', 'Notification Suppression'),
    createBlock('tm-li17', 'normal', 'Email notifications are suppressed by default', 'bullet', 1),
    createBlock('tm-li18', 'normal', 'SMS notifications are suppressed', 'bullet', 1),
    createBlock('tm-li19', 'normal', 'Voice call notifications are suppressed', 'bullet', 1),
    createBlock('tm-li20', 'normal', 'In-app notifications still display for operators to practice response', 'bullet', 1),
    createBlock('tm-li21', 'normal', 'Webhook notifications can be optionally enabled for integration testing', 'bullet', 1),
    createBlock('tm-h7', 'h3', 'Dashboard and Reporting'),
    createBlock('tm-li22', 'normal', 'Test alarms appear in dashboards with visual test indicators', 'bullet', 1),
    createBlock('tm-li23', 'normal', 'Reports include a Test Mode flag for easy filtering', 'bullet', 1),
    createBlock('tm-li24', 'normal', 'Historical reports exclude test alarms by default', 'bullet', 1),
    createBlock('tm-li25', 'normal', 'Audit logs record all test mode activities', 'bullet', 1),
    createBlock('tm-h8', 'h3', 'Alarm Acknowledgment'),
    createBlock('tm-li26', 'normal', 'Operators can acknowledge test alarms to practice workflows', 'bullet', 1),
    createBlock('tm-li27', 'normal', 'Escalation timers continue to run for training purposes', 'bullet', 1),
    createBlock('tm-li28', 'normal', 'Acknowledge actions are logged but do not trigger external notifications', 'bullet', 1),
    
    createBlock('tm-h9', 'h2', 'Best Practices'),
    createBlock('tm-p8', 'normal', 'Follow these best practices when using Test Mode:'),
    createBlock('tm-li29', 'normal', 'Always set an expiration time - This prevents accidentally leaving Test Mode enabled', 'bullet', 1),
    createBlock('tm-li30', 'normal', 'Document your testing activities - Add detailed notes for audit purposes', 'bullet', 1),
    createBlock('tm-li31', 'normal', 'Notify your team - Inform operators when Test Mode will be active', 'bullet', 1),
    createBlock('tm-li32', 'normal', 'Use appropriate scope - Test only the sites or regions you need to verify', 'bullet', 1),
    createBlock('tm-li33', 'normal', 'Test during low-activity periods - Avoid testing during peak monitoring times', 'bullet', 1),
    createBlock('tm-li34', 'normal', 'Verify results before exiting - Confirm all tests completed successfully', 'bullet', 1),
    createBlock('tm-li35', 'normal', 'Review audit logs - Document test outcomes for compliance records', 'bullet', 1),
    createBlock('tm-li36', 'normal', 'Create test scenarios - Prepare standardized test cases for consistent validation', 'bullet', 1),
    createBlock('tm-li37', 'normal', 'Train new operators - Use Test Mode for hands-on training sessions', 'bullet', 1),
    createBlock('tm-li38', 'normal', 'Validate after updates - Test after system updates or configuration changes', 'bullet', 1),
    
    createBlock('tm-h10', 'h2', 'Exiting Test Mode'),
    createBlock('tm-p9', 'normal', 'To exit Test Mode and resume normal operations:'),
    createBlock('tm-li39', 'normal', 'Navigate to Admin > System Settings > Test Mode', 'number', 1),
    createBlock('tm-li40', 'normal', 'Click Disable Test Mode', 'number', 2),
    createBlock('tm-li41', 'normal', 'Confirm the action in the dialog', 'number', 3),
    createBlock('tm-li42', 'normal', 'Review the test summary if prompted', 'number', 4),
    createBlock('tm-p10', 'normal', 'Upon exiting Test Mode:'),
    createBlock('tm-li43', 'normal', 'All active test alarms are automatically cleared', 'bullet', 1),
    createBlock('tm-li44', 'normal', 'The Test Mode banner is removed from all dashboards', 'bullet', 1),
    createBlock('tm-li45', 'normal', 'Normal alarm processing and notifications resume immediately', 'bullet', 1),
    createBlock('tm-li46', 'normal', 'Test session details are preserved in audit logs', 'bullet', 1),
    createBlock('tm-p11', 'normal', 'If an expiration time was set, Test Mode will automatically disable at the specified time. You will receive a notification when automatic expiration occurs.'),
  ]
};

async function seedTestModeDoc() {
  console.log('Creating/Updating Test Mode document in Sanity...\n');
  console.log('Project: fjjuacab');
  console.log('Dataset: production\n');
  
  try {
    const existing = await client.fetch(`*[_id == $id][0]`, { id: doc._id });
    
    if (existing) {
      console.log(`Updating: ${doc.title} (${doc.slug.current})`);
      await client.createOrReplace(doc);
      console.log('Document updated successfully!');
    } else {
      console.log(`Creating: ${doc.title} (${doc.slug.current})`);
      await client.createIfNotExists(doc);
      console.log('Document created successfully!');
    }
    
    console.log('\n--- Document Details ---');
    console.log(`ID: ${doc._id}`);
    console.log(`Title: ${doc.title}`);
    console.log(`Slug: ${doc.slug.current}`);
    console.log(`Status: ${doc.status}`);
    console.log(`Target Audience: ${doc.targetAudience.join(', ')}`);
    console.log(`Body Sections: ${doc.body.filter(b => b.style && b.style.startsWith('h')).length}`);
    console.log('\nVisit your studio at: https://nxgen-docs.sanity.studio/');
    
  } catch (err) {
    console.error('Error creating document:', err.message);
    process.exit(1);
  }
}

seedTestModeDoc().catch(console.error);
