import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import { CurrentStockView } from '../sections/currentStock/view/currentStock-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Current Stock Management - ${CONFIG.appName}`}</title>
      </Helmet>

      <CurrentStockView />
    </>
  );
}
