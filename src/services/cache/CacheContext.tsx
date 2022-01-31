import React, { useEffect, useState, createContext, useContext } from 'react'
import omit from 'lodash/omit'
import { Obj } from 'src/shared/types'

export type Cache = Obj

export interface ContextValue {
  cache: Cache
  pending: Record<string, () => unknown>
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  set: (key: string, resolver: () => Promise<any>) => void
}

const createCacheProvider = (context: React.Context<ContextValue>) => ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [pending, setPending] = useState<Cache>({})
  const [cache, setCache] = useState<Cache>({})

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const set = async (key: string, resolver: () => Promise<any>) => {
    if (!pending[key]) {
      setPending((prevPending) => ({ ...prevPending, [key]: resolver }))
    }
  }

  useEffect(() => {
    const pendingKeys = Object.keys(pending)

    if (pendingKeys.length) {
      pendingKeys.forEach((key) => {
        pending[key]().then(
          (value: unknown) => {
            setPending((prevPending) => omit({ ...prevPending }, [key]))
            setCache((prevCache) => ({
              ...prevCache,
              [key]: {
                value,
                error: null,
              },
            }))
          },
          (error: unknown) => {
            setPending((prevPending) => omit({ ...prevPending }, [key]))
            setCache((prevCache) => ({
              ...prevCache,
              [key]: {
                value: null,
                error,
              },
            }))
          },
        )
      })
    }
  }, [pending])

  return (
    <context.Provider value={{ cache, pending, set }}>
      {children}
    </context.Provider>
  )
}

const useCache = (
  context: React.Context<ContextValue>,
  key: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resolver: () => Promise<any>,
) => {
  const { cache, pending, set } = useContext(context)

  useEffect(() => {
    if (!cache[key] && !pending[key]) {
      set(key, resolver)
    }
  }, [cache, key, pending, resolver, set])

  const refresh = () => set(key, resolver)

  const { value, error } = cache[key] || {}

  return {
    value,
    error,
    loading: !!pending[key],
    refresh,
  }
}

const createCache = () => {
  const context = createContext<ContextValue>({
    cache: {},
    pending: {},
    set: () => {},
  })

  const provider = createCacheProvider(context)

  return {
    context,
    provider,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    useCache: (key: string, resolver: () => Promise<any>) =>
      useCache(context, key, resolver),
  }
}

export default createCache
