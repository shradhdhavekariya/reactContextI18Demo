import config from 'src/environment'

export const checkFeature = (feature: string) =>
  config.rawFeatures.includes(feature)

export const ifFeature = <T, F = undefined>(
  feature: string,
  content: T,
  fallback: F,
) => (checkFeature(feature) ? content : fallback)
