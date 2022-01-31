import { useCallback, useMemo } from 'react'

const useNetlify = (branchName?: string) => {
  const isNetlify = useMemo(
    () => window.location.hostname.includes('netlify'),
    [],
  )
  const isBranchActive = useMemo(
    () => isNetlify && !!branchName && document.cookie.includes(branchName),
    [branchName, isNetlify],
  )

  const enableBranch = useCallback(() => {
    if (!branchName) return

    // set the cookie with the name of the branch of our private beta for 1 year
    const now = new Date()
    const expires = now.getTime() + 1000 * 3600 * 24 * 365
    now.setTime(expires)
    document.cookie = `nf_ab=${branchName}; expires=${now.toUTCString()}`

    // reload the page to pick up the new option
    // (forcing the browser to re-request it, rather than serving from browser cache)
    window.location.reload(true)
  }, [branchName])

  const disableBranch = useCallback(() => {
    if (!branchName) return

    // clear and expire the cookie.
    document.cookie = 'nf_ab=;expires=Thu, 01 Jan 1970 00:00:01 GMT;'

    // reload the page to pick up the new option
    window.location.reload(true)
  }, [branchName])

  const toggleBranch = useCallback(() => {
    if (!isNetlify) return

    if (isBranchActive) disableBranch()
    else enableBranch()
  }, [isNetlify, isBranchActive, disableBranch, enableBranch])

  return {
    isNetlify,
    isBranchActive,
    enableBranch,
    disableBranch,
    toggleBranch,
  }
}

export default useNetlify
