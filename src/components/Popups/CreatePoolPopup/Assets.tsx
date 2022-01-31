import { useContext, useCallback } from 'react'
import { Button, Card, Heading, Loader, Text } from 'rimble-ui'
import { useTranslation } from 'react-i18next'
import { FieldArray, useField } from 'formik'
import { big } from 'src/shared/utils/big-helpers'
import equals from 'src/shared/utils/string/equals'
import Divider from 'src/components/common/Divider'
import AssetItem from './AssetItem'
import { CreatePoolContext } from './CreatePoolContext'
import { NewPoolAsset } from './types'

const Assets = () => {
  const { t } = useTranslation('pools')
  const { addToken, totalWeight, getTokenById } = useContext(CreatePoolContext)
  const [field, meta, helper] = useField<NewPoolAsset[]>({ name: 'assets' })

  const loading = field.value.length === 0

  const error = typeof meta.error === 'string' ? meta.error : null

  const handleAssetItemChange = useCallback(
    (index: number) => (newAsset: NewPoolAsset) => {
      const currentAsset = field.value[index]

      if (
        newAsset.amount &&
        newAsset.weight &&
        (Number(currentAsset.amount) !== Number(newAsset.amount) ||
          Number(currentAsset.weight) !== Number(newAsset.weight) ||
          !equals(currentAsset.id, newAsset.id))
      ) {
        const baseAsset = equals(currentAsset.id, newAsset.id)
          ? newAsset
          : currentAsset

        const newAllValue = big(baseAsset.amount || 0)
          .times(getTokenById(baseAsset.id)?.exchangeRate || 0)
          .times(totalWeight)
          .div(baseAsset.weight || 1)

        helper.setValue(
          field.value.map((asset, idx) => {
            const realAsset = idx === index ? newAsset : asset
            const assetToken = getTokenById(realAsset.id)

            return {
              ...realAsset,
              amount:
                assetToken?.exchangeRate && realAsset.weight
                  ? newAllValue
                      .times(realAsset.weight)
                      .div(totalWeight || 1)
                      .div(assetToken?.exchangeRate || 1)
                      .toString()
                  : realAsset.amount,
            }
          }),
        )
      }
    },
    [field.value, getTokenById, helper, totalWeight],
  )

  return (
    <Card
      p="20px"
      borderRadius={1}
      boxShadow={4}
      border="0"
      display="flex"
      flexDirection="column"
      width="100%"
      height="fit-content"
    >
      <Heading
        fontSize={3}
        lineHeight="20px"
        fontWeight={4}
        mb={2}
        mt={0}
        color="grey"
      >
        {t('createPool.assets.title')}
      </Heading>
      <Divider mt="16px" mb="0" />
      <FieldArray
        {...field}
        render={({ remove }) => (
          <>
            {loading ? (
              <Loader mx="auto" mt={3} />
            ) : (
              field.value.map((item, index) => (
                <AssetItem
                  key={item.id}
                  index={index}
                  showRemoveButton={field.value.length > 2}
                  onRemove={() => remove(index)}
                  onChange={handleAssetItemChange(index)}
                />
              ))
            )}
            <Text.span px={2} mt={3} color="danger">
              {error}
            </Text.span>
            {field.value.length < 5 && (
              <Button
                onClick={addToken}
                size="medium"
                px={3}
                width="fit-content"
                color="primary"
                icon="Add"
                mt={3}
                disabled={loading}
              >
                {t('createPool.assets.addToken')}
              </Button>
            )}
          </>
        )}
      />
    </Card>
  )
}

export default Assets
