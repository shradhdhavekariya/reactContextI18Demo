export const download = async (name: string, url: string) => {
  const response = await fetch(url)
  const blob = await response.blob()

  const objectUrl = window.URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = objectUrl
  a.download = name
  a.target = '_blank'
  a.click()
  a.remove()
}
