import { IResources } from 'src/shared/types/config/resources'

const resources: IResources = {
  origin: 'https://swarm.markets/',
  docs: {
    coreConcepts: {
      passport: 'https://docs.swarm.markets/core-concepts/passport',
      passportLinkingYourWallet:
        'https://docs.swarm.markets/core-concepts/passport#linking-your-wallet',
      swaps: 'https://docs.swarm.markets/core-concepts/swaps',
      poolsAddLiquidity:
        'https://docs.swarm.markets/core-concepts/pools#adding-liquidity-to-an-existing-pool',
      vouchers: 'https://docs.swarm.markets/core-concepts/vouchers',
    },
    general: 'https://docs.swarm.markets/',
    gettingStarted: {
      faq: 'https://docs.swarm.markets/getting-started/faq',
      limitations: 'https://docs.swarm.markets/getting-started/faq#limitations',
      getCrypto: 'https://docs.swarm.markets/getting-started/faq#get-crypto',
      proxy:
        'https://docs.swarm.markets/getting-started/faq#what-are-proxy-contracts-and-atomic-transactions',
      proxyTokensExplanation:
        'https://docs.swarm.markets/getting-started/faq#why-is-there-a-balance-in-my-proxy-address',
    },
    terms: {
      tos: 'https://docs.swarm.markets/about/terms/tos',
      privacy: 'https://docs.swarm.markets/about/terms/privacy',
    },
    token: {
      smt: {
        general: 'https://docs.swarm.markets/token/smt',
        smtReleaseSchedule:
          'https://docs.swarm.markets/token/smt#smt-release-schedule',
      },
    },
  },
  socials: {
    discord: 'https://discord.swarm.markets',
    twitter: 'https://twitter.com/swarmmarkets',
    github: 'https://github.com/SwarmMarkets',
  },
  metamask: 'https://metamask.io/download.html',
  iconsCdn: 'https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons',
}

export default resources
