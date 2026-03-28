const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const excelPath = path.join(__dirname, '..', 'T.C.xlsx');
const outputDir = path.join(__dirname, '..', '.planning', 'test-cases');

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

async function main() {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(excelPath);

  console.log('Available sheets:', workbook.worksheets.map(ws => ws.name));

  async function sheetToJson(sheetName, outputPath) {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      console.error(`Sheet "${sheetName}" not found`);
      return;
    }
    
    const data = [];
    let headers = [];
    
    sheet.eachRow((row, rowNumber) => {
      const rowData = {};
      row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
        if (rowNumber === 1) {
          headers[colNumber - 1] = cell.value;
        } else {
          const header = headers[colNumber - 1] || `column_${colNumber}`;
          rowData[header] = cell.value !== undefined ? cell.value : '';
        }
      });
      if (rowNumber > 1) {
        data.push(rowData);
      }
    });
    
    console.log(`\nSheet: ${sheetName}`);
    console.log(`Rows: ${data.length}`);
    if (data.length > 0) {
      console.log(`Columns: ${Object.keys(data[0]).join(', ')}`);
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(data, null, 2));
    console.log(`Saved: ${outputPath}`);
  }

  await sheetToJson(
    'permission and role2',
    path.join(outputDir, 'permission-role2.json')
  );

  await sheetToJson(
    'permission and role (1',
    path.join(outputDir, 'permission-role1.json')
  );

  console.log('\nExtraction complete!');
}

main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
