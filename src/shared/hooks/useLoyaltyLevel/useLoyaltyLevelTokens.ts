import { useMemo } from 'react'
import { combineLatest, of } from 'rxjs'
import { map } from 'rxjs/operators'
import balanceOf$ from 'src/shared/observables/balanceOf'
import exchangeRateOf$ from 'src/shared/observables/exchangeRateOf'
import contractOf$ from 'src/shared/observables/contractOf'
import { AssetToken, NativeToken } from 'src/shared/types/tokens'
import { VSMT_TOKEN } from 'src/shared/consts'
import { AllowanceStatus } from 'src/shared/enums'
import { ZERO } from 'src/shared/utils/big-helpers'
import allowanceOf$, {
  allowanceStatusOf$,
} from 'src/shared/observables/allowanceOf'
import useArrayInjector from '../useArrayInjector'
import useAssetTokens from '../useAssetTokens'
import useUserAccount from '../useUserAccount'

const useLoyaltyLevelTokens = (selectedAddress: string) => {
  const userAccount = useUserAccount(selectedAddress)

  const { allTokens: allNativeTokens, loading } = useAssetTokens()

  const fullTokens = useArrayInjector<AssetToken>(
    useMemo(
      () => ({
        exchangeRate: exchangeRateOf$(0),
        balance: balanceOf$(userAccount?.address),
        userBalances: (token) =>
          combineLatest([
            userAccount?.address
              ? balanceOf$(userAccount?.address)(token)
              : of(ZERO),
            exchangeRateOf$(0)(token),
          ]).pipe(
            map(([balance, exchangeRate]) => ({
              native: balance?.toNumber(),
              usd: balance?.times(exchangeRate || 0).toNumber() || 0,
            })),
          ),
        contract: contractOf$(),
        cpkAllowance: allowanceOf$(
          userAccount?.address,
          userAccount?.cpkAddress,
        ),
        allowanceStatus: allowanceStatusOf$(
          userAccount?.address,
          userAccount?.cpkAddress,
        ),
      }),
      [userAccount?.cpkAddress, userAccount?.address],
    ),
    useMemo(
      () =>
        [...allNativeTokens, VSMT_TOKEN as NativeToken].map((token) => ({
          ...token,
          exchangeRate: 0,
          allowanceStatus: AllowanceStatus.NOT_AVAILABLE,
          userBalances: { native: 0, usd: 0 },
        })),
      [allNativeTokens],
    ),
  )

  return {
    tokens: fullTokens.filter(
      (token) => token.allowanceStatus !== AllowanceStatus.NOT_AVAILABLE,
    ),
    loading,
  }
}

export default useLoyaltyLevelTokens
