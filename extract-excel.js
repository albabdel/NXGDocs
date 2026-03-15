const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = 'C:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/T.C.xlsx';
const outputFile = path.join(__dirname, '.planning/test-cases/critical-regression.json');

const workbook = XLSX.readFile(inputFile);
const worksheet = workbook.Sheets['CRITICAL REGRESSION'];

const rawData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

const headers = rawData[0];
const rows = rawData.slice(1);

const result = rows.map((row, index) => {
  const obj = { _rowIndex: index + 2 };
  headers.forEach((header, colIndex) => {
    const key = header || `column_${colIndex}`;
    obj[key] = row[colIndex] !== undefined ? row[colIndex] : null;
  });
  return obj;
});

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(outputFile, JSON.stringify(result, null, 2));

console.log(`Extracted ${result.length} rows to ${outputFile}`);
