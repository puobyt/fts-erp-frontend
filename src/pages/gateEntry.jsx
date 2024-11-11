import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import { GateEntryView } from '../sections/gateEntry/view/gateEntry-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Get Entry - ${CONFIG.appName}`}</title>
      </Helmet>

      <GateEntryView />
    </>
  );
}
