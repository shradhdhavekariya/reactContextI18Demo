import { useMemo } from 'react'
import { Props as ReactSelectProps } from 'react-select'
import {
  ETHEREUM_NETWORK,
  onboard,
  switchNetwork,
  useNetworkId,
} from 'src/shared/web3'
import { NetworkId } from 'src/shared/types/config'
import { usePolygonBridge } from 'src/services/polygon-bridge'
import { isPolygon } from 'src/shared/utils/config'
import { propEquals } from 'src/shared/utils/collection/filters'
import usePopupState from 'src/shared/hooks/usePopupState'
import PolygonInfoPopup, {
  POLYGON_INFO_LOCAL_STORAGE_KEY,
} from 'src/components/Popups/PolygonInfoPopup'
import useLocalStorage from 'src/hooks/useLocalStorage'
import { commonEVMNetworks } from 'src/shared/consts'
import { DropdownIndicator, StyledSelect } from './StyledSelect'
import { Menu } from './Menu'
import { SingleValue } from './SingleValues'
import { INetworkOption, networkOptions, Option } from './NetworkOptions'

const NetworkSelect = ({ ...props }: ReactSelectProps) => {
  const networkId = useNetworkId()
  const openBridge = usePolygonBridge()
  const polygonInfoPopup = usePopupState()
  const [dontShowAgain] = useLocalStorage(
    POLYGON_INFO_LOCAL_STORAGE_KEY,
    (val) => !!val,
  )

  const selectedNetworkOption = useMemo(
    () =>
      networkOptions.find(
        propEquals('label', isPolygon(networkId) ? 'Polygon' : 'Ethereum'),
      ),
    [networkId],
  )

  const handleSwitchNetwork = async (network: NetworkId | 'Bridge') => {
    if (network === 'Bridge') {
      openBridge()
      return
    }

    if (network) {
      const { wallet } = onboard.getState()
      await switchNetwork(wallet, network.toString(16) as ETHEREUM_NETWORK)
      const params = commonEVMNetworks.find(propEquals('networkId', network))

      if (params?.networkId) {
        if (!dontShowAgain && isPolygon(params.networkId)) {
          await polygonInfoPopup.prompt()
        }
        await switchNetwork(
          wallet,
          params.networkId.toString() as ETHEREUM_NETWORK,
        )
      }
    }
  }

  const onChange = async (selection: INetworkOption | null) => {
    if (selection) {
      await handleSwitchNetwork(selection.value)
    }
  }

  return (
    <>
      <StyledSelect
        {...props}
        value={selectedNetworkOption}
        options={networkOptions}
        onChange={onChange}
        placeholder="Select Network"
        isSearchable={false}
        className="Select"
        classNamePrefix="Dropdown"
        components={{
          Menu,
          Option,
          DropdownIndicator,
          SingleValue,
        }}
      />

      <PolygonInfoPopup
        isOpen={polygonInfoPopup.isOpen}
        onClose={polygonInfoPopup.close}
      />
    </>
  )
}

export default NetworkSelect
