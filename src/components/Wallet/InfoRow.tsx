import { Text, Loader } from 'rimble-ui'

interface InfoRowProps {
  children?: React.ReactNode
  span?: number
  show?: boolean
  loading?: boolean
  error?: React.ReactNode
}

const InfoRow = ({
  children,
  span = 4,
  show = false,
  loading = false,
  error = false,
}: InfoRowProps) => {
  if (loading || show || error) {
    return (
      <tr>
        <td colSpan={span}>
          <Text.span fontWeight={2} color="grey" textAlign="center">
            {loading && <Loader size="30px" m="auto" />}
            {!loading && (error || children)}
          </Text.span>
        </td>
      </tr>
    )
  }

  return null
}

export default InfoRow
