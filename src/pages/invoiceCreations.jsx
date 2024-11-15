import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'
import { InvoiceCreationView } from '../sections/invoiceCreation/view/invoiceCreation-view'

// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Invoice Creation - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <InvoiceCreationView />
      </ProtectedLayout>
    </>
  )
}
