/* eslint-disable no-console, @typescript-eslint/no-var-requires */
const { config: dotEnvConfig } = require('dotenv')
const SentryCli = require('@sentry/cli')

const packageJSON = require('../package.json')

dotEnvConfig()

async function createReleaseAndUpload() {
  const release = `${packageJSON.name}@${packageJSON.version}`

  if (!process.env.SENTRY_AUTH_TOKEN) {
    console.warn('SENTRY_AUTH_TOKEN is not set. Will skip Sentry release')
    return
  }

  const cli = new SentryCli()

  try {
    await cli.releases.new(release)
    await cli.releases.uploadSourceMaps(release, {
      include: ['build/static/js'],
      urlPrefix: '~/static/js',
      rewrite: false,
    })
    await cli.releases.finalize(release)
  } catch (e) {
    console.error('Source maps uploading failed:', e)
  }
}

createReleaseAndUpload()
