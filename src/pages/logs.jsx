import { Helmet } from 'react-helmet-async'

import { CONFIG } from '../config-global'

import { UserView } from '../sections/user/view/user-view'
import ProtectedLayout from '../utils/protectedRoute'
import { LogsView } from '../sections/logs/view/logs-view'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Logs - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <LogsView />
      </ProtectedLayout>
    </>
  )
}
