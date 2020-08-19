const eq = (a, b) => a === b;
const isDefined = val => Boolean(val);

const log = ctx =>
  isDefined(ctx.log) ? ctx.log() : console.log(ctx);

const values = ctx => Object.values(ctx);
const keys = ctx => Object.keys(ctx);
const entries = ctx => Object.entries(ctx);
const of = val => [val];
const fromEntries = val => Object.fromEntries(val);

const pipe = (f, ...fns) =>
  fns.reduce((a, b) => (...c) => b(a(...c)), f);

const partial = (f, ...a) => (...b) => f.apply(null, [...a, ...b]);
const type = val => typeof val;

const both = (pred, pred2) => (...args) =>
  pred(...args) && pred2(...args);

const isObject = both(pipe(type, partial(eq, 'object')), val =>
  eq(val.constructor, Object)
);

const I = a => a;

const ifElse = (pred, istrue, isfalse) => val =>
  pred(val) ? istrue(val) : isfalse(val);

const unless = (pred, isfalse) => ifElse(pred, I, isfalse);
const when = (pred, istrue) => ifElse(pred, istrue, I);

const map = (fn, ctx) => ctx.map(fn);

const complement = pred => (...args) => !pred(...args);
const filter = (pred, ctx) => ctx.filter(pred);
const includes = (searchValue, ctx) => ctx.includes(searchValue);
const flip = f => (a, b) => f(b, a);
const nth = (pos, ctx) => ctx[pos];
const len = ctx => ctx.length;

let omit = (data, ctx = []) =>
  pipe(
    entries,
    partial(
      filter,
      pipe(partial(nth, 1), partial(flip(complement(includes)), ctx))
    ),
    fromEntries
  )(data);

const zip = (...rows) =>
  [...rows[0]].map((_, c) => rows.map(row => row[c]));

module.exports = {
  zip,
  omit,
  map,
  complement,
  filter,
  includes,
  flip,
  nth,
  len,
  eq,
  log,
  isDefined,
  values,
  keys,
  entries,
  of,
  fromEntries,
  pipe,
  partial,
  type,
  both,
  isObject,
  I,
  ifElse,
  when,
  unless,
};
