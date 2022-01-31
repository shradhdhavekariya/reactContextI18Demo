import { useEffect } from 'react'
import { Redirect, useParams } from 'react-router'
import PoolDetails from 'src/components/PoolDetails'
import Layout from 'src/components/common/Layout'
import { useSnackbar } from 'src/components/common/Snackbar'
import { usePoolDetails } from 'src/shared/hooks'
import { AlertVariant } from 'src/components/common/Snackbar/types'
import HeaderActions from 'src/components/common/HeaderActions'

const SinglePool = () => {
  const { address } = useParams<{ address: string }>()
  const { addAlert } = useSnackbar()
  const { pool, poolToken, loading, errors, refetch } = usePoolDetails(address)

  useEffect(() => {
    if (errors?.length) {
      addAlert("Such pool doesn't exist", {
        variant: AlertVariant.error,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errors?.length])

  return (
    // TODO: replace the empty header with back button after its implementation
    <Layout header=" " headerActions={<HeaderActions passport wallet />}>
      {(errors.length && <Redirect to="/pools/shared" />) || (
          <PoolDetails
            pool={pool}
            poolToken={poolToken}
            reload={refetch}
            loading={loading}
          />
        ) ||
        (!loading && !pool && <Redirect to="/pools/shared" />)}
    </Layout>
  )
}

export default SinglePool
