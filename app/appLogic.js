const lib = require('./../utils/lib');

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
const filterOperation = lib.pipe(
  mapItemsIntoArrays,
  secondFilter,
  thirdFilter,
  fourthFilter
);

module.exports = filterOperation;