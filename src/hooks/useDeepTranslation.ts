import { useCallback } from 'react'
import { useTranslation, UseTranslationOptions } from 'react-i18next'

const useDeepTranslation = (
  ns: string,
  chain?: string[],
  options?: UseTranslationOptions,
) => {
  const { t: nativeT, ...rest } = useTranslation(ns, options)

  const t = useCallback(
    (key: string) =>
      chain?.length ? nativeT(`${chain?.join('.')}.${key}`) : nativeT(key),
    [nativeT, chain],
  )
  return { t, ...rest }
}

export default useDeepTranslation
