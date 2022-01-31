import { ethers } from 'ethers'
import { NodeStyleEventEmitter } from 'rxjs/internal/observable/fromEvent'
import EventEmitter from 'events'

interface Yoti {
  destroy: () => void
}
declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider &
      NodeStyleEventEmitter &
      EventEmitter & {
        selectedAddress?: string | null
        enable: () => string[]
        isConnected: () => boolean
      }
    Yoti: {
      Share: {
        init: (arg: unknown) => Yoti
      }
    }
    ENV?: Record<string, string>
  }
}
