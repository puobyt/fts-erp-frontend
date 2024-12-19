import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import { UserView } from '../sections/user/view/user-view'
import { TracebilityView } from '../sections/tracebility/view/tracebility-view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Tracebility - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <TracebilityView />
      </ProtectedLayout>
    </>
  )
}
