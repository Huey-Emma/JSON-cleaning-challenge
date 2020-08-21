const https = require('https');
const fs = require('fs');
const path = require('path');
const { promisify } = require('util');

const {
  zip,
  map,
  omit,
  values,
  keys,
  filter,
  fromEntries,
  partial,
  complement,
  includes,
  flip,
  when,
  pipe,
  ifElse,
  isObject,
} = require('./utils/lib.js');

const charsToRemove = ['', 'N/A', '-'];

// Filter unwanted characters from array
const filterArray = partial(
  filter,
  partial(flip(complement(includes)), charsToRemove)
);

const whenArrayFilterArray = when(Array.isArray, filterArray);

// Filter unwanted characters from object
const filterObject = partial(flip(omit), charsToRemove);

const customFilterOperation = partial(
  map,
  ifElse(isObject, filterObject, whenArrayFilterArray)
);

const zipIntoObject = pipe(zip, fromEntries);

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

    //Initial filter
    const initFilter = omit(data, charsToRemove);

    // Extract valid keys
    const validKeys = keys(initFilter);

    // Extract object values
    const unsortedValues = values(initFilter);

    // Filter operation
    const finalFilter = customFilterOperation(unsortedValues);

    // Zip valid keys with filtered values and make into object
    const filteredObject = zipIntoObject(validKeys, finalFilter);

    // Write to file
    (async function () {
      try {
        await writeFile(
          path.join(__dirname, './data.json'),
          JSON.stringify(filteredObject)
        );
      } catch (e) {
        console.error(e);
      }
    })();
  });
};

https.get(options, callback).end();
