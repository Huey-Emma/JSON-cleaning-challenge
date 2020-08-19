const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

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

// Promisify Write to file method
const writeFile = promisify(fs.writeFile);

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
    writeFile(
      path.join(__dirname, './data.json'),
      JSON.stringify(filteredObject)
    ).catch(console.error);
  });
};

https.get(options, callback).end();
