import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import onboardingEN from './locales/en/onboarding.json'
import modalsEN from './locales/en/modals.json'
import navigationEN from './locales/en/navigation.json'
import passportEN from './locales/en/passport.json'
import poolsEN from './locales/en/pools.json'
import swapEN from './locales/en/swap.json'
import walletEN from './locales/en/wallet.json'
import poolDetailsEN from './locales/en/poolDetails.json'
import liquidityModalsEN from './locales/en/liquidity-modals.json'
import transactionEN from './locales/en/transaction.json'
import alertsEN from './locales/en/alerts.json'
import vouchersEN from './locales/en/vouchers.json'
import errorsEN from './locales/en/errors.json'
import commonEN from './locales/en/common.json'
import popupsEN from './locales/en/popups.json'

const resources = {
  en: {
    onboarding: onboardingEN,
    modals: modalsEN,
    navigation: navigationEN,
    swap: swapEN,
    passport: passportEN,
    pools: poolsEN,
    poolDetails: poolDetailsEN,
    popups: popupsEN,
    wallet: walletEN,
    liquidityModals: liquidityModalsEN,
    transaction: transactionEN,
    alerts: alertsEN,
    vouchers: vouchersEN,
    errors: errorsEN,
    common: commonEN,
  },
}

i18n.use(initReactI18next).init({
  resources,
  lng: 'en',
  interpolation: {
    escapeValue: false,
  },
})

export default i18n
