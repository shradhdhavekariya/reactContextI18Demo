// eslint-disable-next-line @typescript-eslint/no-explicit-any
const asyncFlow = (...fns: ((arg: any) => Promise<any> | any)[]) => async (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  param: any,
) => fns.reduce(async (result, next) => next(await result), param)

export default asyncFlow
