interface IResourcesDocsCoreConcepts {
  passport: string
  passportLinkingYourWallet: string
  swaps: string
  poolsAddLiquidity: string
  vouchers: string
}

interface IResourcesGettingStarted {
  faq: string
  limitations: string
  getCrypto: string
  proxy: string
  proxyTokensExplanation: string
}

interface IResourcesDocsTerms {
  tos: string
  privacy: string
}

interface IResourcesDocs {
  coreConcepts: IResourcesDocsCoreConcepts
  general: string
  gettingStarted: IResourcesGettingStarted
  terms: IResourcesDocsTerms
  token: IResourcesToken
}

interface IResourcesToken {
  smt: IResourcesSMT
}

interface IResourcesSMT {
  general: string
  smtReleaseSchedule: string
}

interface IResourcesSocials {
  discord: string
  github: string
  twitter: string
}
export interface IResources {
  origin: string
  docs: IResourcesDocs
  socials: IResourcesSocials
  metamask: string
  iconsCdn: string
}
