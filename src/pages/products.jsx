import { Helmet } from 'react-helmet-async'

import { CONFIG } from 'src/config-global'

import { ProductsView } from 'src/sections/product/view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Products - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <ProductsView />
      </ProtectedLayout>
    </>
  )
}
