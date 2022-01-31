// eslint-disable-next-line @typescript-eslint/no-explicit-any,@typescript-eslint/ban-types
export const compose = (...functions: Function[]) => (value: any) =>
  functions.reduceRight((acc, fn) => fn(acc), value)
