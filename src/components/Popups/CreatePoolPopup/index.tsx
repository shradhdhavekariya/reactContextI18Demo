import Drawer from '@material-ui/core/Drawer'
import { useTranslation } from 'react-i18next'
import { Heading, Flex, Box } from 'rimble-ui'
import styled from 'styled-components'
import { ReactComponent as CloseIconSVG } from 'src/assets/icons/Close.svg'
import Assets from './Assets'
import AdvancedPoolSettings from './AdvancedPoolSettings'
import { CreatePoolContextProvider } from './CreatePoolContext'

interface CloseIconProps {
  onClick: () => void
}

export const CreatePoolPopupContainer = styled.div`
  width: 800px;
  max-width: calc(100vw - 304px);
  flex-direction: column;
  align-items: center;
  height: 100vh;
  overflow-y: auto;
  background: ${({ theme }) => theme.colors.background};

  &::-webkit-scrollbar {
    display: none;
  }

  @media (max-width: ${({ theme }) => theme.breakpoints[0]}) {
    width: 100%;
    min-width: 100vw;
    padding-top: 48px;
  }
`

export const CloseIcon = styled.button<CloseIconProps>`
  position: absolute;
  top: 28px;
  right: 28px;
  cursor: pointer;
  background: none;
  border: none;
  padding: 0;
`

interface CreatePoolPopupProps {
  isOpen: boolean
  onClose: () => void
}

const CreatePoolPopup = ({ isOpen, onClose }: CreatePoolPopupProps) => {
  const { t } = useTranslation('pools')

  return (
    <CreatePoolContextProvider>
      <Drawer anchor="right" open={isOpen} onClose={onClose} elevation={0}>
        <CreatePoolPopupContainer>
          <Flex p={4} bg="white" position="relative">
            <Heading
              as="h3"
              fontSize={5}
              lineHeight="28px"
              fontWeight={5}
              mb={0}
              mt={0}
              color="black"
            >
              {t('createPool.title')}
            </Heading>
            <CloseIcon onClick={onClose}>
              <CloseIconSVG />
            </CloseIcon>
          </Flex>
          <Box p="20px">
            <Assets />
            <AdvancedPoolSettings />
          </Box>
        </CreatePoolPopupContainer>
      </Drawer>
    </CreatePoolContextProvider>
  )
}

export default CreatePoolPopup
