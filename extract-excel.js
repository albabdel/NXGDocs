const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const inputFile = 'C:/Users/abdel/.gemini/antigravity/scratch/nxgen-docs/T.C.xlsx';
const outputFile = path.join(__dirname, '.planning/test-cases/critical-regression.json');

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFile);
  const worksheet = workbook.getWorksheet('CRITICAL REGRESSION');

  if (!worksheet) {
    console.error('Sheet "CRITICAL REGRESSION" not found');
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
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
