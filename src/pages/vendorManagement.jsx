import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';


import { UserView } from '../sections/user/view/user-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Vendor management - ${CONFIG.appName}`}</title>
      </Helmet>

      <UserView />
    </>
  );
}
