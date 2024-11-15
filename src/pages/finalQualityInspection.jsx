import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import ProtectedLayout from '../utils/protectedRoute'
import { FinalQualityInspectionView } from '../sections/finalQualityInspection/view/finalQualityInpsection-view'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Final Quality Inspection - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <FinalQualityInspectionView />
      </ProtectedLayout>
    </>
  )
}
