import { Box } from 'rimble-ui'
import { Color } from 'src/theme'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Divider = (props: any) => {
  return (
    <Box
      width="100%"
      height="0"
      borderBottomWidth="1px"
      borderBottomStyle="solid"
      borderColor={Color.border}
      my="24px"
      {...props}
    />
  )
}

export default Divider
