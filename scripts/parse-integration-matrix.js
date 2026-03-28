const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'Integration_Matrix_PROD (3).xlsx');
const outputPath = path.join(__dirname, 'integration-matrix.json');

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);
  
  const sheetName = 'Integration Matrix New';
  const worksheet = workbook.getWorksheet(sheetName);

  if (!worksheet) {
    console.error(`Sheet "${sheetName}" not found. Available sheets:`, workbook.worksheets.map(ws => ws.name));
    process.exit(1);
  }

  const rawData = [];
  worksheet.eachRow((row) => {
    const rowData = [];
    row.eachCell({ includeEmpty: true }, (cell) => {
      rowData[cell.col - 1] = cell.value;
    });
    rawData.push(rowData);
  });

  function normalizeValue(value) {
    if (value === null || value === undefined || value === '') return null;
    const str = String(value).trim().toLowerCase();
    if (str === 'supported' || str === 'yes') return 'Supported';
    if (str === 'not supported' || str === 'no') return 'Not Supported';
    if (str === 'partially supported') return 'Partially Supported';
    if (str === 'n/a' || str === 'na') return 'N/A';
    if (str === 'plan in future' || str === 'under development' || str === 'under developement') return 'Plan in Future';
    return String(value).trim();
  }

  function extractUrls(text) {
    if (!text) return [];
    const urlRegex = /https?:\/\/[^\s\n\]]+/g;
    const matches = text.match(urlRegex) || [];
    return matches.map(url => {
      let cleanUrl = url;
      if (cleanUrl.includes('[…')) {
        cleanUrl = cleanUrl.split('[…')[0];
      }
      if (cleanUrl.endsWith('…')) {
        cleanUrl = cleanUrl.slice(0, -1);
      }
      return cleanUrl.trim();
    }).filter(url => url.length > 10);
  }

  function cleanText(text) {
    if (!text) return null;
    return String(text).trim().replace(/\n+/g, ' ').replace(/\s+/g, ' ');
  }

  const devices = rawData.slice(2).map((row, index) => {
    const manufacturer = row[0];
    const brand = row[1];
    const deviceType = row[2];
    
    if (!manufacturer || String(manufacturer).trim() === 'Manufacturer Name') return null;

    return {
      manufacturer: cleanText(manufacturer),
      brand: cleanText(brand),
      deviceType: cleanText(deviceType),
      gcxReady: normalizeValue(row[3]),
      cloudMode: {
        discovery: normalizeValue(row[4]),
        live: normalizeValue(row[5]),
        playback: normalizeValue(row[6]),
        timeline: normalizeValue(row[7]),
        events: normalizeValue(row[8]),
        armDisarm: normalizeValue(row[9]),
        genesisAudio: normalizeValue(row[10]),
        ptz: normalizeValue(row[11]),
        io: normalizeValue(row[12]),
        eventAck: normalizeValue(row[13]),
        playAudio: normalizeValue(row[14]),
        timeSync: normalizeValue(row[15])
      },
      localMode: {
        live: normalizeValue(row[16]),
        playback: normalizeValue(row[17]),
        sdkAudio: normalizeValue(row[18]),
        ptz: normalizeValue(row[19]),
        io: normalizeValue(row[20]),
        timeline: normalizeValue(row[21])
      },
      deviceHealth: {
        pollFromCloud: normalizeValue(row[22]),
        heartbeat: normalizeValue(row[23]),
        mobileApp: normalizeValue(row[24])
      },
      cameraHealth: {
        basic: normalizeValue(row[25]),
        basicPlus: normalizeValue(row[26]),
        advanced: normalizeValue(row[27])
      },
      timelapse: {
        support: normalizeValue(row[28]),
        differentiation: cleanText(row[29]),
        highResSupport: normalizeValue(row[30]),
        clipExport: normalizeValue(row[31])
      },
      connectivity: {
        integrationProtocol: cleanText(row[32]),
        eventIntegrationMethod: cleanText(row[33]),
        videoStreaming: cleanText(row[34]),
        loginSecurity: cleanText(row[35]),
        customerPorts: cleanText(row[36]),
        genesisPorts: cleanText(row[37])
      },
      documents: {
        helpManuals: extractUrls(row[38]),
        helpdesk: extractUrls(row[39])
      },
      comments: {
        notes: cleanText(row[40]),
        currentIssues: cleanText(row[41]),
        dependencies: cleanText(row[42]),
        commonIssues: cleanText(row[43])
      },
      architecture: {
        singleton: cleanText(row[45]),
        api: cleanText(row[46]),
        action: cleanText(row[47])
      }
    };
  }).filter(device => device !== null && device.manufacturer);

  fs.writeFileSync(outputPath, JSON.stringify(devices, null, 2));

  console.log(`\nExtracted ${devices.length} devices to ${outputPath}\n`);

  const summary = {};
  devices.forEach(device => {
    const key = `${device.manufacturer} | ${device.deviceType}`;
    if (!summary[key]) summary[key] = 0;
    summary[key]++;
  });

  console.log('Summary by Manufacturer and Device Type:');
  console.log('='.repeat(50));
  const manufacturers = {};
  devices.forEach(device => {
    if (!manufacturers[device.manufacturer]) {
      manufacturers[device.manufacturer] = {};
    }
    if (!manufacturers[device.manufacturer][device.deviceType]) {
      manufacturers[device.manufacturer][device.deviceType] = 0;
    }
    manufacturers[device.manufacturer][device.deviceType]++;
  });

  Object.entries(manufacturers).sort().forEach(([manufacturer, types]) => {
    const total = Object.values(types).reduce((a, b) => a + b, 0);
    console.log(`\n${manufacturer} (${total} devices):`);
    Object.entries(types).sort().forEach(([type, count]) => {
      console.log(`  - ${type}: ${count}`);
    });
  });

  console.log(`\n${'='.repeat(50)}`);
  console.log(`Total devices: ${devices.length}`);
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
