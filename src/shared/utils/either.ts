const either = <T>(callback: () => T, fail: T) => {
  try {
    return callback()
  } catch {
    return fail
  }
}

export default either
