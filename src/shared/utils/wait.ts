const wait = async (milliseconds = 0) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds))

export default wait
