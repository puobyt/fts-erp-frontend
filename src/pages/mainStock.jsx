import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import { MainStockView } from '../sections/mainStock/view/mainStock-view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Main Stock Management - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <MainStockView />
      </ProtectedLayout>
    </>
  )
}
