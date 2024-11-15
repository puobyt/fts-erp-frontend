import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import { BillOfMaterialsView } from '../sections/billOfMaterials/view/billOfMaterials-view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Bill Of Materials- ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <BillOfMaterialsView />
      </ProtectedLayout>
    </>
  )
}
