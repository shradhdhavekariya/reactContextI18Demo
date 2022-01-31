export const wrap = <T>(value?: T | undefined): [] | [T] => {
  if (typeof value === 'undefined') {
    return []
  }

  return [value]
}
