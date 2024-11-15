import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'
import { CurrentStockView } from '../sections/currentStock/view/currentStock-view'
import { QualityCheckView } from '../sections/qualityCheck/view/qualityCheck-view'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Quality Check - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <QualityCheckView />
      </ProtectedLayout>
    </>
  )
}
