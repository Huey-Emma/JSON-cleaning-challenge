const {
  map,
  complement,
  filter,
  includes,
  flip,
  nth,
  len,
  eq,
  entries,
  of,
  fromEntries,
  pipe,
  partial,
  isObject,
  ifElse,
  when,
  unless,
} = require('./../utils/lib');

const charsToRemove = ['', 'N/A', '-'];

// Predicates
const isArrayOfPairs = pipe(partial(nth, 0), Array.isArray);

const lenIs1 = pipe(len, partial(eq, 1));

const valueOfLenOneArr = when(pipe(len, partial(eq, 1)), partial(nth, 0));

const unlessIsArray = unless(Array.isArray, of);

// Map object values into array for consistent operations across items
const mapItemsIntoArrays = partial(
  map,
  ifElse(isObject, entries, unlessIsArray)
);

//  filter logic
const filterLogicOne = partial(
  map,
  unless(
    lenIs1,
    partial(filter, pipe(partial(flip(complement(includes)), charsToRemove)))
  )
);

//  filter logic
const filterLogicTwo = partial(
  map,
  when(
    isArrayOfPairs,
    partial(
      filter,
      pipe(partial(nth, 1), partial(flip(complement(includes)), charsToRemove))
    )
  )
);

//  filter logic
const filterLogicThree = partial(
  map,
  ifElse(isArrayOfPairs, fromEntries, valueOfLenOneArr)
);

// Filter compose function
const customFilterOperation = pipe(
  mapItemsIntoArrays,
  filterLogicOne,
  filterLogicTwo,
  filterLogicThree
);

module.exports = customFilterOperation;
