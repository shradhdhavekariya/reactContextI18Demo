import Layout from 'src/components/common/Layout'
import Content from 'src/components/common/Content'
import PassportDetails from 'src/components/Passport/PassportDetails'
import MyAddresses from 'src/components/Passport/MyAddresses'
import { useTranslation } from 'react-i18next'
import HeaderActions from 'src/components/common/HeaderActions'
import AlertPanel from 'src/components/common/AlertPanel'

const Passport = () => {
  const { t } = useTranslation('passport')

  return (
    <Layout
      header={t('header')}
      headerActions={<HeaderActions wallet addLiquidity passport />}
    >
      <Content bg="background">
        <AlertPanel promptSignIn />
        <PassportDetails />
        <MyAddresses />
      </Content>
    </Layout>
  )
}

export default Passport
