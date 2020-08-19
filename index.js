const https = require('https');
const fs = require('fs');
const path = require('path');

const lib = require('./utils/lib.js');
const { pipe } = require('./utils/lib.js');

// Predicates
const isArrayOfPairs = lib.pipe(
  lib.partial(lib.nth, 0),
  Array.isArray
);

const lenIs1 = lib.pipe(lib.len, lib.partial(lib.eq, 1));

const valueOfLenOneArr = lib.when(
  lib.pipe(lib.len, lib.partial(lib.eq, 1)),
  lib.partial(lib.nth, 0)
);

const unlessIsArray = lib.unless(Array.isArray, lib.of);

// Map object values into array for consistent operations across items
const mapItemsIntoArrays = lib.partial(
  lib.map,
  lib.ifElse(lib.isObject, lib.entries, unlessIsArray)
);

// Second filter logic
const secondFilter = lib.partial(
  lib.map,
  lib.unless(
    lenIs1,
    lib.partial(lib.filter, i =>
      lib.complement(lib.includes)(i, ['', 'N/A', '-'])
    )
  )
);

// Third filter logic
const thirdFilter = lib.partial(
  lib.map,
  lib.when(
    isArrayOfPairs,
    lib.partial(
      lib.filter,
      lib.pipe(
        lib.partial(lib.nth, 1),
        lib.partial(lib.flip(lib.complement(lib.includes)), [
          '',
          'N/A',
          '-',
        ])
      )
    )
  )
);

// Fourth filter logic
const fourthFilter = lib.partial(
  lib.map,
  lib.ifElse(isArrayOfPairs, lib.fromEntries, valueOfLenOneArr)
);

// Filter compose function
const filterUnsortedValues = lib.pipe(
  mapItemsIntoArrays,
  secondFilter,
  thirdFilter,
  fourthFilter
);

// Write to file synchronously
const writeFileSync = (filePath, data) => {
  fs.writeFileSync(filePath, data);
};

const genFile = lib.partial(
  writeFileSync,
  path.join(__dirname, './data.json')
);

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
    const data = lib.pipe(Buffer.concat, String, JSON.parse)(body);

    //First filter logic
    const firstFilter = lib.omit(data, ['', 'N/A', '-']);

    // Extract valid keys
    const validKeys = lib.keys(firstFilter);

    // Extract object values
    const unsortedValues = lib.values(firstFilter);

    // Filter operation
    const finalFilter = filterUnsortedValues(unsortedValues);

    // Zip valid keys with filtered values and make into object
    const filteredObject = lib.pipe(lib.zip, lib.fromEntries)(
      validKeys,
      finalFilter
    );

    // Write to file
    genFile(JSON.stringify(filteredObject));
  });
};

https.get(options, callback).end();
