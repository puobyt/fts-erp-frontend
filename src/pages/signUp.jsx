import { Helmet } from 'react-helmet-async'

import { CONFIG } from 'src/config-global'

import { SignUpView } from '../sections/signUp/sign-up-view'

// ----------------------------------------------------------------------

export default function Page () {
  return (
    <>
      <Helmet>
        <title> {`Sign in - ${CONFIG.appName}`}</title>
      </Helmet>
      <SignUpView />
    </>
  )
}
