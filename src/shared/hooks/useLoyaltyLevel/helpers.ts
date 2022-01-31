import match from 'conditional-expression'

export const getLoyaltyLevel = (
  smtBalance: number,
  smtExchangeRate: number,
  pooledTokenBalance: number,
): number => {
  if (pooledTokenBalance > 0) {
    if (smtBalance > 1000000) return 3

    const percentage =
      ((smtBalance * smtExchangeRate) / pooledTokenBalance) * 100

    return match(percentage)
      .lessThan(1)
      .then(0)
      .lessThan(5)
      .then(1)
      .lessThan(10)
      .then(2)
      .else(3)
  }

  return 0
}
