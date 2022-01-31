import { useReadyState } from 'src/shared/web3'
import { useEffect, useCallback } from 'react'
import { Widget } from '@maticnetwork/wallet-widget'
import config from 'src/environment'
import { isMainnet } from 'src/shared/utils/config'

const { defaultChainId } = config

const widget = new Widget({
  target: '',
  appName: 'swarmpolygonbridge',
  autoShowTime: 0,
  position: 'center',
  height: 630,
  width: 540,
  overlay: true,
  network: isMainnet(defaultChainId) ? 'mainnet' : 'testnet',
})

let ready: Promise<void> | boolean = false

export const bridgeableChainIds = [1, 5]

export const bridgeableTokens = ['dai', 'usdc', 'weth', 'wbtc']

export const usePolygonBridge = () => {
  const readyState = useReadyState()

  useEffect(() => {
    if (readyState && !ready) {
      ready = widget.create()
    }
  }, [readyState])

  return useCallback(() => {
    if (ready === true) {
      widget.show()
    } else if (ready instanceof Promise) {
      ready.then(() => widget.show())
    }
    return widget
  }, [])
}
