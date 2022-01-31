const toFixed = (num: number) => {
  if (Math.abs(num) < 1.0) {
    const e = parseInt(num.toString().split('e-')[1], 10)
    if (e) {
      const newNum = num * 10 ** (e - 1)
      return `0.${new Array(e).join('0')}${newNum.toString().substring(2)}`
    }
  } else {
    let e = parseInt(num.toString().split('+')[1], 10)
    if (e > 20) {
      e -= 20
      const newNum = num / 10 ** e
      return newNum + new Array(e + 1).join('0')
    }
  }

  return num
}

export default toFixed
