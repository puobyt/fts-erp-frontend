import { Helmet } from 'react-helmet-async'

import { CONFIG } from 'src/config-global'


import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
     
      </ProtectedLayout>
    </>
  )
}
