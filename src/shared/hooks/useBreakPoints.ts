import { useMediaQuery } from '@material-ui/core'

const useBreakpoints = () => {
  const breakpoints = {
    isXs: useMediaQuery('(max-width: 40em)'),
    isSm: useMediaQuery('(min-width: 40.1em) and (max-width: 52em)'),
    isMd: useMediaQuery('(min-width: 52.1em) and (max-width: 64em)'),
    isLg: useMediaQuery('(min-width: 64.1em)'),
    active: 'xs',
  }
  if (breakpoints.isXs) breakpoints.active = 'xs'
  if (breakpoints.isSm) breakpoints.active = 'sm'
  if (breakpoints.isMd) breakpoints.active = 'md'
  if (breakpoints.isLg) breakpoints.active = 'lg'

  return breakpoints
}

export default useBreakpoints
