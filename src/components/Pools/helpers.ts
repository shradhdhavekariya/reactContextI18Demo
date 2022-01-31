import match from 'conditional-expression'
import { AbstractToken } from 'src/shared/types/tokens'

const SharedPoolsFilter = {
  finalized: true,
  tokensCount_gt: 1,
  active: true,
}

const PrivatePoolsFilter = {
  finalized: false,
  crp: false,
  tokensCount_gt: 1,
  active: true,
}

const UserPoolsFilter = (account: string) => ({
  holders_contains: [account],
  tokensCount_gt: 1,
  active: true,
})

export const getCategoryFilter = (category = 'shared', account = '') =>
  match(category)
    .equals('private')
    .then(PrivatePoolsFilter)
    .equals('my-pools')
    .then(UserPoolsFilter(account))
    .equals('create')
    .then(UserPoolsFilter(account))
    .else(SharedPoolsFilter)

export const getAssetFilter = <T extends AbstractToken = AbstractToken>(
  poolTokens: T[],
  assets: string[],
) => poolTokens.filter((token) => assets.includes(token.address.toLowerCase()))
