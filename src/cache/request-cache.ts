import createCache from 'src/services/cache/CacheContext'

const { useCache, provider } = createCache()

const useRequestCache = (url: string, init?: RequestInit | undefined) =>
  useCache(url, async () => {
    const res = await fetch(url, init)
    return res.json()
  })

export { useRequestCache, provider as RequestCacheProvider }
