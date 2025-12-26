const fs = require('fs');
const path = require('path');

// Content templates based on article types
const templates = {
  'admin-configuration': {
    sections: ['Prerequisites', 'Step-by-Step Guide', 'Configuration Settings', 'Verification', 'Best Practices', 'Troubleshooting'],
    content: {
      prerequisites: 'Administrative access to both the device and GCXONE platform.\nDevice firmware should be up to date.\nNetwork connectivity between device and GCXONE.',
      stepByStep: 'Access the device web interface.\nNavigate to configuration settings.\nConfigure required parameters.\nSave and apply settings.',
      verification: 'Verify device appears in GCXONE dashboard.\nCheck device status indicators.\nTest basic functionality.',
      bestPractices: 'Use strong passwords for device access.\nRegularly update device firmware.\nDocument configuration changes.',
      troubleshooting: 'Check network connectivity if device is offline.\nVerify credentials if authentication fails.\nReview device logs for error messages.'
    }
  },
  'operator-view': {
    sections: ['Overview', 'Dashboard Access', 'Key Features', 'Daily Operations', 'Monitoring Tasks', 'Quick Actions'],
    content: {
      overview: 'This guide covers the operator interface and daily monitoring tasks.',
      dashboard: 'Access the operator dashboard from the main GCXONE interface.\nReview active alarms and device status.',
      features: 'Live video monitoring\nAlarm acknowledgment\nEvent history review\nBasic device control',
      operations: 'Monitor incoming alarms\nVerify alarm conditions\nTake appropriate actions\nDocument incidents',
      monitoring: 'Check device health status\nReview system notifications\nMonitor video feeds\nTrack response times'
    }
  },
  'troubleshooting': {
    sections: ['Common Issues', 'Diagnostic Steps', 'Solutions', 'Prevention', 'When to Escalate'],
    content: {
      issues: 'Connection timeouts\nAuthentication failures\nConfiguration errors\nPerformance issues',
      diagnostic: 'Check network connectivity\nVerify device status\nReview system logs\nTest basic functions',
      solutions: 'Restart affected services\nUpdate configuration\nCheck firewall settings\nVerify credentials',
      prevention: 'Regular system maintenance\nMonitor system health\nKeep firmware updated\nDocument known issues'
    }
  },
  'overview': {
    sections: ['Introduction', 'Key Features', 'Supported Models', 'Integration Benefits', 'Getting Started'],
    content: {
      introduction: 'This device integrates seamlessly with the GCXONE platform to provide comprehensive security monitoring.',
      features: 'Real-time alarm monitoring\nVideo streaming capabilities\nRemote configuration\nEvent management\nHealth monitoring',
      models: 'Multiple device models supported\nVarious firmware versions compatible\nScalable deployment options',
      benefits: 'Centralized monitoring\nReduced response times\nImproved security coverage\nStreamlined operations',
      gettingStarted: 'Review system requirements\nPlan device placement\nPrepare network configuration\nContact support if needed'
    }
  }
};

// Device-specific information
const deviceInfo = {
  hikvision: { brand: 'Hikvision', type: 'IP Camera', protocol: 'ISAPI' },
  dahua: { brand: 'Dahua', type: 'IP Camera', protocol: 'HTTP API' },
  axis: { brand: 'Axis', type: 'IP Camera', protocol: 'VAPIX' },
  milestone: { brand: 'Milestone', type: 'VMS', protocol: 'MIP SDK' },
  avigilon: { brand: 'Avigilon', type: 'Camera System', protocol: 'SDK' },
  camect: { brand: 'Camect', type: 'AI Camera Hub', protocol: 'REST API' },
  reconeyez: { brand: 'Reconeyez', type: 'Perimeter Security', protocol: 'TCP/IP' },
  teltonika: { brand: 'Teltonika', type: 'Router', protocol: 'SNMP' },
  adpro: { brand: 'ADPRO', type: 'Intrusion System', protocol: 'TCP/IP' },
  hanwha: { brand: 'Hanwha', type: 'IP Camera', protocol: 'SUNAPI' },
  heitel: { brand: 'Heitel', type: 'Perimeter System', protocol: 'TCP/IP' },
  innovi: { brand: 'InnoVi', type: 'Analytics Platform', protocol: 'REST API' },
  axxon: { brand: 'Axxon', type: 'VMS', protocol: 'SDK' }
};

function generateContent(filePath, category, articleType) {
  const fileName = path.basename(filePath, '.md');
  const deviceName = filePath.includes('devices/') ? filePath.split('/')[1] : null;
  const device = deviceName ? deviceInfo[deviceName] : null;
  
  // Determine template based on article type
  let template = templates[articleType] || templates['overview'];
  
  // Generate title
  const title = fileName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');
  
  // Generate description
  const description = device 
    ? `${articleType.replace('-', ' ')} guide for ${device.brand} ${device.type} integration with GCXONE`
    : `Complete guide for ${title.toLowerCase()}`;
  
  // Generate tags
  const tags = [
    `category:${category}`,
    'platform:GCXONE'
  ];
  
  if (device) tags.push(`device:${deviceName}`);
  if (articleType.includes('admin')) tags.push('role:admin');
  if (articleType.includes('operator')) tags.push('role:operator');
  if (articleType.includes('installer')) tags.push('role:installer');
  
  // Build content
  let content = `---
title: "${title}"
description: "${description}"
tags:
${tags.map(tag => `  - ${tag}`).join('\n')}
sidebar_position: 1
last_updated: 2025-12-04
---

# ${title}

${device ? `Integration guide for ${device.brand} ${device.type} devices with the GCXONE platform.` : `Comprehensive guide for ${title.toLowerCase()}.`}

## Overview

${template.content.overview || template.content.introduction || 'This guide provides essential information and procedures.'}

`;

  // Add sections based on template
  template.sections.forEach((section, index) => {
    if (index === 0) return; // Skip first section as it's usually overview
    
    content += `## ${section}\n\n`;
    
    const sectionKey = section.toLowerCase().replace(/[^a-z]/g, '');
    const sectionContent = template.content[sectionKey] || template.content[Object.keys(template.content)[index]] || 'Content for this section is being developed.';
    
    if (sectionContent.includes('\n')) {
      // Multi-line content
      const lines = sectionContent.split('\n');
      lines.forEach(line => {
        if (line.trim()) {
          content += line.startsWith('-') ? `${line}\n` : `- ${line}\n`;
        }
      });
    } else {
      content += `${sectionContent}\n`;
    }
    content += '\n';
  });

  // Add device-specific information if applicable
  if (device) {
    content += `## Device Information

- **Manufacturer**: ${device.brand}
- **Device Type**: ${device.type}
- **Protocol**: ${device.protocol}
- **Integration Method**: GCXONE Configuration App

`;
  }

  // Add standard footer
  content += `## Related Documentation

- [Getting Started Guide](/docs/getting-started)
- [Troubleshooting](/docs/troubleshooting)
- [Support Resources](/docs/support)

## Need Help?

If you encounter issues during configuration, please:

1. Check the [troubleshooting guide](/docs/troubleshooting)
2. Review the [FAQ](/docs/knowledge-base/faq)
3. [Contact support](/docs/support/contact-support) for assistance
`;

  return content;
}

// Read placeholder analysis
const placeholderData = JSON.parse(fs.readFileSync('placeholder-analysis.json', 'utf8'));

console.log('=== CONTENT GENERATION STARTING ===\n');

let processed = 0;
let skipped = 0;

placeholderData.forEach(article => {
  // Skip very large files (likely already have content)
  if (article.wordCount > 500) {
    skipped++;
    return;
  }
  
  // Determine article type from filename
  let articleType = 'overview';
  if (article.path.includes('admin-configuration')) articleType = 'admin-configuration';
  else if (article.path.includes('operator-view')) articleType = 'operator-view';
  else if (article.path.includes('troubleshooting')) articleType = 'troubleshooting';
  else if (article.path.includes('installer-configuration')) articleType = 'admin-configuration';
  else if (article.path.includes('configuration')) articleType = 'admin-configuration';
  
  try {
    const newContent = generateContent(article.path, article.category, articleType);
    fs.writeFileSync(article.fullPath, newContent);
    console.log(`✅ Generated: ${article.path}`);
    processed++;
  } catch (error) {
    console.log(`❌ Failed: ${article.path} - ${error.message}`);
  }
});

console.log(`\n=== CONTENT GENERATION COMPLETE ===`);
console.log(`Processed: ${processed} articles`);
console.log(`Skipped: ${skipped} articles (already have content)`);
console.log(`Total: ${placeholderData.length} articles analyzed`);