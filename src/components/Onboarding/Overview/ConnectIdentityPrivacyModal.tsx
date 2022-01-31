import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import Checkbox from '@material-ui/core/Checkbox'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import styled from 'styled-components'
import { Button, Box, Link, Heading } from 'rimble-ui'
import Dialog from 'src/components/common/Dialog'
import config from 'src/environment'
import api from 'src/services/api'
import { useUserId } from 'src/state/hooks'

const { terms, gettingStarted } = config.resources.docs

const CheckboxMarkupItem = styled(FormControlLabel)`
  margin-bottom: 15px;
`

interface ConnectIdentityPrivacyModalProps {
  onClose: () => void
  onNext: () => void
}

const ConnectIdentityPrivacyModal = ({
  onNext,
  onClose,
}: ConnectIdentityPrivacyModalProps) => {
  const { t } = useTranslation(['onboarding'])
  const [clickCounts, setClickCounts] = useState(0)
  const userId = useUserId()

  const firstCheckboxLabel = (
    <span>
      {t('connectIdentityPrivacy.1')}&nbsp;
      <Link
        href={terms.tos}
        color="primary"
        hoverColor="dark-gray"
        fontSize={2}
        fontWeight={3}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        {t('connectIdentityPrivacy.terms')}
      </Link>
      .
    </span>
  )

  const secondCheckboxLabel = (
    <span>
      {t('connectIdentityPrivacy.2')}&nbsp;
      <Link
        href={gettingStarted.limitations}
        color="primary"
        hoverColor="dark-gray"
        fontSize={2}
        fontWeight={3}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        {t('connectIdentityPrivacy.notUserPerson')}
      </Link>
    </span>
  )

  const thirdCheckboxLabel = (
    <span>
      {t('connectIdentityPrivacy.3Front')}&nbsp;
      <Link
        href={terms.privacy}
        color="primary"
        hoverColor="dark-gray"
        fontSize={2}
        fontWeight={3}
        style={{ textDecoration: 'underline' }}
        target="_blank"
      >
        {t('connectIdentityPrivacy.privacy')}
      </Link>
      &nbsp;and&nbsp;
      {t('connectIdentityPrivacy.3Back')}
    </span>
  )

  const changeCheckbox = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (evt.target.checked) {
      setClickCounts(clickCounts + 1)
    } else {
      setClickCounts(clickCounts - 1)
    }
  }

  const connect = async () => {
    if (userId) {
      const exists = await api.addLog(userId)

      if (exists) {
        onNext()
      }
    }
  }

  return (
    <Dialog isOpen onClose={onClose} width={['100%', '630px']}>
      <Box m="15px">
        <Heading.h2 mt={0}>{t('connectIdentityPrivacy.header')}</Heading.h2>
        <CheckboxMarkupItem
          control={<Checkbox color="primary" onChange={changeCheckbox} />}
          label={firstCheckboxLabel}
        />
        <CheckboxMarkupItem
          control={<Checkbox color="primary" onChange={changeCheckbox} />}
          label={secondCheckboxLabel}
        />
        <CheckboxMarkupItem
          control={<Checkbox color="primary" onChange={changeCheckbox} />}
          label={thirdCheckboxLabel}
        />

        <Button
          size="medium"
          px={3}
          mt="10px"
          width="100%"
          color="primary"
          onClick={connect}
          disabled={clickCounts < 3}
        >
          {t('connectIdentityPrivacy.connect')}
        </Button>
      </Box>
    </Dialog>
  )
}

export default ConnectIdentityPrivacyModal
