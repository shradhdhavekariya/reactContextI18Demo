import { Switch, Route, useRouteMatch } from 'react-router'

import Vouchers from 'src/components/Vouchers/List'
import Payment from 'src/components/Vouchers/Payment'
import Form from 'src/components/Vouchers/Form'

const QuickBuy = () => {
  const { path } = useRouteMatch()

  return (
    <>
      <Switch>
        <Route exact path={path} component={Form} />
        <Route path={`${path}/payment`} component={Payment} />
        <Route path={`${path}/list`} component={Vouchers} />
      </Switch>
    </>
  )
}

export default QuickBuy
