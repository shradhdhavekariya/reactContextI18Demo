import { selectInitiated } from '../selectors'
import useSelector from '../useSelector'

export const useInitiated = () => useSelector(selectInitiated)
