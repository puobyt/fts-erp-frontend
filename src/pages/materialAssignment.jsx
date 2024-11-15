import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'
import ProtectedLayout from '../utils/protectedRoute'

import { MaterialAssignmentView } from '../sections/materialAssignment/view/materialAssignment-view'

// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Material Assignment- ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <MaterialAssignmentView />
      </ProtectedLayout>
    </>
  )
}
