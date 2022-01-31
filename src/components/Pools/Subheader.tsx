import React from 'react'
import { useTranslation } from 'react-i18next'
import { useHistory, useParams } from 'react-router'
import { Tabs } from '@material-ui/core'
import { checkFeature } from 'src/components/common/Feature/utils'
import CreatePoolPopup from 'src/components/Popups/CreatePoolPopup'
import StyledTab from '../common/StyledTab'

const categories = {
  private: 0,
  shared: 1,
  'my-pools': 2,
  create: 3,
}

const tabs: Array<keyof typeof categories> = [
  'private',
  'shared',
  'my-pools',
  'create',
]

const Subheader = () => {
  const { t } = useTranslation('pools')
  const history = useHistory()
  const { category = 'shared' } = useParams<{
    category?: keyof typeof categories
  }>()
  const showCreatPoolPopup = category === 'create'

  const switchTab = (tab: keyof typeof categories) =>
    history.push(`/pools/${tab}`)

  // eslint-disable-next-line @typescript-eslint/ban-types
  const handleSwitchTab = (e: React.ChangeEvent<{}>, index: number) => {
    if (index !== categories[category]) {
      switchTab(tabs[index])
    }
  }

  const goBack = () => {
    if (history.length > 1) {
      history.goBack()
    } else {
      switchTab('shared')
    }
  }

  return (
    <>
      <Tabs
        value={categories[category]}
        indicatorColor="primary"
        textColor="primary"
        onChange={handleSwitchTab}
        aria-label="Pool tabs"
      >
        <StyledTab label={t('tabs.private')} />
        <StyledTab label={t('tabs.shared')} />
        <StyledTab label={t('tabs.my-pools')} />
        <StyledTab
          label={t('tabs.create')}
          disabled={!checkFeature('create-pool')}
        />
      </Tabs>
      <CreatePoolPopup
        isOpen={showCreatPoolPopup && checkFeature('create-pool')}
        onClose={goBack}
      />
    </>
  )
}

export default Subheader
