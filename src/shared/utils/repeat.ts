const repeat = async <T = unknown>(
  callback: (stop: (value?: T) => void) => T,
  timeout: number,
) =>
  new Promise<T | undefined>((resolve, reject) => {
    const timer = setInterval(() => {
      try {
        callback((value?: T) => {
          clearInterval(timer)
          resolve(value)
        })
      } catch {
        clearInterval(timer)
        reject()
      }
    }, timeout)
  })

export default repeat
