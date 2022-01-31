export const timeLimit = <T>(asyncFn: Promise<T>, time = 10000) =>
  new Promise<T>((resolve, reject) => {
    const handle = setTimeout(() => {
      reject(new Error('timeout'))
    }, time)

    asyncFn
      .then(resolve)
      .catch(reject)
      .finally(() => clearTimeout(handle))
  })
