const equals = (a?: string | null, b?: string | null) =>
  a?.toLowerCase().replace('×', 'x') === b?.toLowerCase().replace('×', 'x')

export default equals
