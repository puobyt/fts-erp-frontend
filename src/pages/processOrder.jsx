import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'
import { ProcessOrderView } from '../sections/processOrder/view/processOrder-view'
import { ProductionOrderCreationView } from '../sections/ProductionOrderCreation/view/productionOrderCreation-view'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Process Order - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <ProcessOrderView />
      </ProtectedLayout>
    </>
  )
}
