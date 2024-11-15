import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'

import { PurchaseOrderCreationView } from '../sections/purchaseOrderCreation/view/purchase-order-cr-view'

// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Purchase order creation - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <PurchaseOrderCreationView />
      </ProtectedLayout>
    </>
  )
}
