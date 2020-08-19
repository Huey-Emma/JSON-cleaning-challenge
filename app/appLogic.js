const lib = require('./../utils/lib');

const charsToRemove = ['', 'N/A', '-'];

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

//  filter logic
const filterLogicOne = lib.partial(
  lib.map,
  lib.unless(
    lenIs1,
    lib.partial(
      lib.filter,
      lib.pipe(
        lib.partial(
          lib.flip(lib.complement(lib.includes)),
          charsToRemove
        )
      )
    )
  )
);

//  filter logic
const filterLogicTwo = lib.partial(
  lib.map,
  lib.when(
    isArrayOfPairs,
    lib.partial(
      lib.filter,
      lib.pipe(
        lib.partial(lib.nth, 1),
        lib.partial(
          lib.flip(lib.complement(lib.includes)),
          charsToRemove
        )
      )
    )
  )
);

//  filter logic
const filterLogicThree = lib.partial(
  lib.map,
  lib.ifElse(isArrayOfPairs, lib.fromEntries, valueOfLenOneArr)
);

// Filter compose function
const customFilterOperation = lib.pipe(
  mapItemsIntoArrays,
  filterLogicOne,
  filterLogicTwo,
  filterLogicThree
);

module.exports = customFilterOperation;
