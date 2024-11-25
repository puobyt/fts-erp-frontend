import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import { OutOfStockView } from '../sections/outOfStock/view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Out Of Stock Management - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <OutOfStockView />
      </ProtectedLayout>
    </>
  )
}
