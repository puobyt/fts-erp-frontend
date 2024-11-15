import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'
import { GateEntryView } from '../sections/gateEntry/view/gateEntry-view'
import { ProductionOrderCreationOutputView } from '../sections/productionOrderCreationOutput/view/production-order-creationOutput-view'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Production Order Creation  - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <ProductionOrderCreationOutputView />
      </ProtectedLayout>
    </>
  )
}
