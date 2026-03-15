const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'T.C.xlsx');
const outputDir = path.join(__dirname, '..', '.planning', 'test-cases');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const workbook = XLSX.readFile(excelPath);

console.log('Available sheets:', workbook.SheetNames);

function sheetToJson(sheetName, outputPath) {
  const sheet = workbook.Sheets[sheetName];
  if (!sheet) {
    console.error(`Sheet "${sheetName}" not found`);
    return;
  }
  
  const data = XLSX.utils.sheet_to_json(sheet, { defval: '' });
  console.log(`\nSheet: ${sheetName}`);
  console.log(`Rows: ${data.length}`);
  if (data.length > 0) {
    console.log(`Columns: ${Object.keys(data[0]).join(', ')}`);
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
  console.log(`Saved: ${outputPath}`);
}

sheetToJson(
  'permission and role2',
  path.join(outputDir, 'permission-role2.json')
);

sheetToJson(
  'permission and role (1',
  path.join(outputDir, 'permission-role1.json')
);

console.log('\nExtraction complete!');
