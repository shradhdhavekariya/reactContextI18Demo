import { useMemo } from 'react'
import { BehaviorSubject } from 'rxjs'
import useObservable from 'src/shared/hooks/useObservable'
import config from 'src/environment'
import { NetworkMap, EVMNetwork } from '../consts'

const { defaultChainId } = config

export const networkId$ = new BehaviorSubject<number>(defaultChainId)

export const useNetworkId = () => useObservable(networkId$) ?? defaultChainId

export const useNetwork = () => {
  const networkId = useNetworkId()

  return useMemo(
    () =>
      NetworkMap.get(networkId) ||
      (NetworkMap.get(defaultChainId) as EVMNetwork),
    [networkId],
  )
}
