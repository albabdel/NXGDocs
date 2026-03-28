const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, '..', 'T.C.xlsx');
const outputDir = path.join(__dirname, '..', '.planning', 'test-cases');

const sheets = ['DC09', 'reports'];

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(inputFile);

  for (const sheetName of sheets) {
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      console.error(`Sheet "${sheetName}" not found`);
      continue;
    }
    
    const jsonData = [];
    let headers = [];
    
    worksheet.eachRow((row, rowNumber) => {
      const rowData = [];
      row.eachCell({ includeEmpty: true }, (cell) => {
        rowData[cell.col - 1] = cell.value;
      });
      
      if (rowNumber === 1) {
        headers = rowData;
      } else {
        const obj = {};
        headers.forEach((header, i) => {
          obj[header] = rowData[i] !== undefined ? rowData[i] : null;
        });
        jsonData.push(obj);
      }
    });
    
    if (jsonData.length === 0) {
      console.log(`Sheet "${sheetName}" is empty`);
      continue;
    }
    
    const outputPath = path.join(outputDir, `${sheetName}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2));
    console.log(`Extracted ${jsonData.length} rows from "${sheetName}" to ${outputPath}`);
  }
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
