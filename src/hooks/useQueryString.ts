import { useLocation } from 'react-router-dom'

const useQueryString = () => {
  const query = new URLSearchParams(useLocation().search)
  return Array.from(query.keys()).reduce(
    (acc, key) => ({
      ...acc,
      [key]: query.get(key),
    }),
    {} as Record<string, string | null>,
  )
}

export default useQueryString
