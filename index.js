const https = require('https');
const fs = require('fs');
const path = require('path');

const {
  zip,
  omit,
  values,
  keys,
  fromEntries,
  pipe,
  partial,
} = require('./utils/lib.js');
const customFilterOperation = require('./app/appLogic');

// Write to file synchronously
const writeFileSync = (filePath, data) => {
  fs.writeFileSync(filePath, data);
};

const genFile = partial(writeFileSync, path.join(__dirname, './data.json'));

const options = {
  host: 'coderbyte.com',
  path: '/api/challenges/json/json-cleaning',
};

const callback = response => {
  const body = [];

  response.on('data', chunk => {
    body.push(chunk);
  });

  response.on('end', () => {
    const data = pipe(Buffer.concat, String, JSON.parse)(body);

    //First filter
    const initFilter = omit(data, ['', 'N/A', '-']);

    // Extract valid keys
    const validKeys = keys(initFilter);

    // Extract object values
    const unsortedValues = values(initFilter);

    // Filter operation
    const finalFilter = customFilterOperation(unsortedValues);

    // Zip valid keys with filtered values and make into object
    const filteredObject = pipe(zip, fromEntries)(validKeys, finalFilter);

    // Write to file
    genFile(JSON.stringify(filteredObject));
  });
};

https.get(options, callback).end();
