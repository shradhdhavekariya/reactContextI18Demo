import { useState } from 'react'
import { format, fromUnixTime } from 'date-fns'
import { Text } from 'rimble-ui'
import { Swap } from 'src/shared/types'
import autoRound from 'src/shared/utils/math/autoRound'
import { ReactComponent as ChevronRight } from 'src/assets/icons/ChevronRight.svg'
import DateToNow from 'src/components/common/Format/DateToNow'
import { xSymbolToSymbol } from 'src/shared/utils/tokens/converters'
import SwapDetailsModal from './SwapDetailsModal'
import SwapRowWrapper from './SwapRowWrapper'
import SwapRowButton from './SwapRowButton'

interface SwapRowProps {
  swap: Swap
}

const SwapRow = ({ swap }: SwapRowProps) => {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)

  const closeModal = () => setIsDetailsModalOpen(false)

  const openModal = () => setIsDetailsModalOpen(true)

  const date = fromUnixTime(swap.timestamp)

  return (
    <SwapRowWrapper>
      <Text.span
        color="grey"
        title={format(date, 'hh:mm:ss aa MM/dd/yyyy')}
        fontSize={1}
      >
        <DateToNow timestamp={swap.timestamp} />
      </Text.span>

      <Text.span
        textAlign="right"
        pr={2}
        title={`${swap.tokenAmountIn} ${xSymbolToSymbol(swap.tokenInSym)}`}
      >
        <Text.span color="black" fontSize={1}>
          {autoRound(swap.tokenAmountIn)}
        </Text.span>
        <Text.span color="black" fontWeight="bold" ml={2} fontSize={1}>
          {xSymbolToSymbol(swap.tokenInSym)}
        </Text.span>
      </Text.span>

      <Text.span textAlign="center">
        <ChevronRight height="20px" />
      </Text.span>

      <Text.span
        textAlign="right"
        pr={2}
        title={`${swap.tokenAmountOut} ${xSymbolToSymbol(swap.tokenOutSym)}`}
      >
        <Text.span color="black" fontSize={1}>
          {autoRound(swap.tokenAmountOut)}
        </Text.span>
        <Text.span color="black" fontWeight="bold" ml={2} fontSize={1}>
          {xSymbolToSymbol(swap.tokenOutSym)}
        </Text.span>
      </Text.span>

      <SwapRowButton onClick={openModal} fontWeight="normal" fontSize={1}>
        Details
      </SwapRowButton>
      {isDetailsModalOpen && (
        <SwapDetailsModal onClose={closeModal} swap={swap} />
      )}
    </SwapRowWrapper>
  )
}

export default SwapRow
