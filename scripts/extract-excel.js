const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'T.C.xlsx');
const outputDir = path.join(__dirname, '..', '.planning', 'test-cases');

const sheets = ['DC09', 'reports'];

const workbook = XLSX.readFile(inputFile);

for (const sheetName of sheets) {
  const worksheet = workbook.Sheets[sheetName];
  if (!worksheet) {
    console.error(`Sheet "${sheetName}" not found`);
    continue;
  }
  
  const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
  
  if (jsonData.length === 0) {
    console.log(`Sheet "${sheetName}" is empty`);
    continue;
  }
  
  const headers = jsonData[0];
  const rows = jsonData.slice(1).map(row => {
    const obj = {};
    headers.forEach((header, i) => {
      obj[header] = row[i] !== undefined ? row[i] : null;
    });
    return obj;
  });
  
  const outputPath = path.join(outputDir, `${sheetName}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(rows, null, 2));
  console.log(`Extracted ${rows.length} rows from "${sheetName}" to ${outputPath}`);
}
