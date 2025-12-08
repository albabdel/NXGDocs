const fs = require('fs');
console.log('Module paths:', module.paths);
try {
    const pdf = require('pdf-parse');
    let dataBuffer = fs.readFileSync('../GCXONE_Article_List.pdf');
    pdf(dataBuffer).then(function (data) {
        console.log(data.text);
    });
} catch (e) {
    console.error('Error:', e);
}
