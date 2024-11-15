import { Helmet } from 'react-helmet-async'

import { CONFIG } from 'src/config-global'

import { BlogView } from 'src/sections/blog/view'
import ProtectedLayout from '../utils/protectedRoute'
// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Blog - ${CONFIG.appName}`}</title>
      </Helmet>
      <ProtectedLayout>
        <BlogView />
      </ProtectedLayout>
    </>
  )
}
