import { useTranslation } from 'react-i18next'
import HeaderActions from 'src/components/common/HeaderActions'
import Layout from 'src/components/common/Layout'
import Pools from 'src/components/Pools'
import Subheader from 'src/components/Pools/Subheader'

const PoolsPage = () => {
  const { t } = useTranslation('pools')

  return (
    <Layout
      header={t('header')}
      subheader={<Subheader />}
      scrollable
      headerActions={<HeaderActions wallet passport />}
    >
      <Pools />
    </Layout>
  )
}

export default PoolsPage
