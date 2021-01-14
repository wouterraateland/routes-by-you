export const identity = (x) => x;
export const noop = () => {};
export const constant = (x) => () => x;
export const compose = (...args) => (x) => args.reduceRight((v, f) => f(v), x);
export const pipe = (...args) => (x) => args.reduce((v, f) => f(v), x);
export const is = (x) => (y) => x === y;
export const isNull = (x) => x === null;
export const isNotNull = (x) => x !== null;
export const isJust = (x) => x !== null && x !== undefined;
export const isNothing = (x) => x === null || x === undefined;
export const maybe = (f, g) => (v) => (isNothing(v) ? f() : g(v));
export const not = (x) => !x;
export const map = (f) => (x) => f(x);
export const neg = (f) => (x) => !f(x);
export const and = (f, g) => (x) => f(x) && g(x);
export const or = (f, g) => (x) => f(x) || g(x);
export const toPair = (v) => [v, v];
export const fst = (f) => ([x, y]) => [f(x), y];
export const snd = (g) => ([x, y]) => [x, g(y)];
export const bimap = (f, g) => ([x, y]) => [f(x), g(y)];

export const either = (f, g) => {
  try {
    return f();
  } catch (error) {
    return g();
  }
};

export const log = (x) => {
  console.log(x);
  return x;
};
