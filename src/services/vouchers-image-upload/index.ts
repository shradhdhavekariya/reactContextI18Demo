import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity'
import { fromCognitoIdentityPool } from '@aws-sdk/credential-provider-cognito-identity'

import newGuid from 'src/shared/utils/new-guid'

const BUCKET_NAME = 'quickbuy-voucher-assets'
const REGION = 'eu-central-1'
const IDENTITY_POOL_ID = 'eu-central-1:cf284560-0af9-4ff9-b496-6b73210c175e'

const s3 = new S3Client({
  region: REGION,
  credentials: fromCognitoIdentityPool({
    client: new CognitoIdentityClient({ region: REGION }),
    identityPoolId: IDENTITY_POOL_ID,
  }),
})

const upload = async (file: File): Promise<string> => {
  try {
    const guid = newGuid()
    const extension = file.name.split('.').splice(-1)[0].toLowerCase()
    const fileKey = `${guid}.${extension}`
    const uploadResponse = await s3.send(
      new PutObjectCommand({
        Bucket: BUCKET_NAME,
        Key: fileKey,
        Body: file,
      }),
    )

    if (uploadResponse.$metadata.httpStatusCode === 200) {
      return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${fileKey}`
    }
    return ''
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('An error occurred while uploading image', error)
    return ''
  }
}

export default upload
