const http = require('http');

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/admin',
  method: 'GET',
  headers: {
    'Cookie': 'admin_resource_access=true'
  }
};

const req = http.request(options, (res) => {
  console.log("Status Code:", res.statusCode);
  console.log("Headers:", res.headers);
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });
  res.on('end', () => {
    console.log("Response Body:", data.substring(0, 500));
  });
});

req.on('error', (e) => {
  console.error(`Problem with request: ${e.message}`);
});

req.end();
