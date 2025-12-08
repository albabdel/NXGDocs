const http = require('http');
const crypto = require('crypto');

const password = 'admin123';
const hash = crypto.createHash('sha256').update(password).digest('hex');

const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/files',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + hash
    }
};

console.log('Testing Admin API connection...');

const req = http.request(options, (res) => {
    console.log(`STATUS: ${res.statusCode}`);
    console.log(`HEADERS: ${JSON.stringify(res.headers)}`);

    let data = '';
    res.on('data', (chunk) => {
        data += chunk;
    });

    res.on('end', () => {
        console.log('BODY LENGTH:', data.length);
        if (res.statusCode === 200) {
            try {
                const json = JSON.parse(data);
                console.log('JSON PARSED OK. Item count:', json.length);
                if (json.length > 0) {
                    console.log('First item:', JSON.stringify(json[0]));
                }
            } catch (e) {
                console.error('JSON PARSE ERROR:', e.message);
                console.log('RAW BODY START:', data.substring(0, 100));
            }
        } else {
            console.log('ERROR BODY:', data);
        }
    });
});

req.on('error', (e) => {
    console.error(`PROBLEM WITH REQUEST: ${e.message}`);
});

req.end();
