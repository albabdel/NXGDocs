const fs = require('fs');
const path = require('path');

// Simple SVG placeholder generator
function createSVGPlaceholder(width, height, text, color = '#4A90E2') {
  return `<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${color}"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="24" fill="white" text-anchor="middle" dominant-baseline="middle">
    ${text}
  </text>
</svg>`;
}

const placeholders = [
  // Device screenshots
  { name: 'device-hikvision-dashboard.svg', text: 'Hikvision Dashboard', color: '#E74C3C' },
  { name: 'device-dahua-config.svg', text: 'Dahua Configuration', color: '#3498DB' },
  { name: 'device-adpro-setup.svg', text: 'ADPRO Setup', color: '#2ECC71' },
  { name: 'device-hanwha-interface.svg', text: 'Hanwha Interface', color: '#9B59B6' },
  { name: 'device-milestone-view.svg', text: 'Milestone View', color: '#F39C12' },
  
  // Feature screenshots
  { name: 'feature-ai-analytics-config.svg', text: 'AI Analytics Config', color: '#1ABC9C' },
  { name: 'feature-ptz-control.svg', text: 'PTZ Control', color: '#E67E22' },
  { name: 'feature-live-view.svg', text: 'Live View', color: '#34495E' },
  { name: 'feature-playback.svg', text: 'Playback Interface', color: '#16A085' },
  { name: 'feature-event-clips.svg', text: 'Event Clips', color: '#C0392B' },
  
  // Dashboard screenshots
  { name: 'dashboard-GCXONE-main.svg', text: 'GCXONE Dashboard', color: '#2C3E50' },
  { name: 'dashboard-talos-alarms.svg', text: 'Talos Alarm Queue', color: '#8E44AD' },
  { name: 'dashboard-analytics.svg', text: 'Analytics Dashboard', color: '#27AE60' },
  { name: 'dashboard-reports.svg', text: 'Reports Dashboard', color: '#D35400' },
  
  // Diagrams
  { name: 'diagram-architecture.svg', text: 'System Architecture', color: '#7F8C8D' },
  { name: 'diagram-alarm-flow.svg', text: 'Alarm Flow Diagram', color: '#95A5A6' },
  { name: 'diagram-network.svg', text: 'Network Diagram', color: '#BDC3C7' },
  
  // Troubleshooting
  { name: 'troubleshooting-connection.svg', text: 'Connection Issue', color: '#E74C3C' },
  { name: 'troubleshooting-video.svg', text: 'Video Issue', color: '#C0392B' },
  { name: 'troubleshooting-login.svg', text: 'Login Issue', color: '#A93226' },
];

const imgDir = path.join(__dirname, 'static', 'img');

if (!fs.existsSync(imgDir)) {
  fs.mkdirSync(imgDir, { recursive: true });
}

console.log('Creating placeholder images...\n');

placeholders.forEach(({ name, text, color }) => {
  const svg = createSVGPlaceholder(800, 450, text, color);
  const filePath = path.join(imgDir, name);
  fs.writeFileSync(filePath, svg);
  console.log(`✓ Created: ${name}`);
});

console.log(`\n✅ Created ${placeholders.length} placeholder images`);
console.log(`📁 Location: ${imgDir}`);
console.log('\n💡 These are SVG placeholders. Replace with actual screenshots later.');
