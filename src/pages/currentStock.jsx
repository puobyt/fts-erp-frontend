import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import { CurrentStockView } from '../sections/currentStock/view/currentStock-view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Current Stock Management - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <CurrentStockView />
      </ProtectedLayout>
    </>
  )
}
