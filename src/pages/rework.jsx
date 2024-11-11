import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import { CurrentStockView } from '../sections/currentStock/view/currentStock-view';
import { ReworkView } from '../sections/rework/view/rework-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Rework- ${CONFIG.appName}`}</title>
      </Helmet>

      <ReworkView />
    </>
  );
}
