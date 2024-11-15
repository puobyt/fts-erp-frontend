import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'
import { CurrentStockView } from '../sections/currentStock/view/currentStock-view'
import { ReworkView } from '../sections/rework/view/rework-view'

// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Rework- ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <ReworkView />
      </ProtectedLayout>
    </>
  )
}
