import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useMemo,
  useState,
} from 'react'
import { useAccount } from 'src/shared/web3'
import useAsyncState from 'src/hooks/useAsyncState'

interface WalletContextType {
  userUsdBalance: {
    nativeTokens: number
    poolTokens: number
    totalUsdBalance: number
  }
  setNativeTokensBalance: Dispatch<SetStateAction<number>>
  setPoolTokensBalance: Dispatch<SetStateAction<number>>
  selectedAccount?: string
  setSelectedAccount?: Dispatch<SetStateAction<string | undefined>>
}

export const WalletContext = createContext<WalletContextType>({
  userUsdBalance: {
    nativeTokens: 0,
    poolTokens: 0,
    totalUsdBalance: 0,
  },
  setNativeTokensBalance: () => {},
  setPoolTokensBalance: () => {},
  selectedAccount: undefined,
  setSelectedAccount: () => {},
})

export const WalletContextProvider = ({
  children,
}: {
  children: ReactNode
}) => {
  const account = useAccount()
  const [selectedAccount, setSelectedAccount] = useState<string | undefined>(
    account,
  )
  const [nativeTokens, setNativeTokensBalance] = useAsyncState(0)
  const [poolTokens, setPoolTokensBalance] = useAsyncState(0)
  const totalUsdBalance = useMemo(() => nativeTokens + poolTokens, [
    nativeTokens,
    poolTokens,
  ])

  return (
    <WalletContext.Provider
      value={{
        userUsdBalance: {
          nativeTokens,
          poolTokens,
          totalUsdBalance,
        },
        setNativeTokensBalance,
        setPoolTokensBalance,
        selectedAccount,
        setSelectedAccount,
      }}
    >
      {children}
    </WalletContext.Provider>
  )
}
