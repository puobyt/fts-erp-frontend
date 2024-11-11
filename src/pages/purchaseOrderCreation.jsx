import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';


import { PurchaseOrderCreationView } from '../sections/purchaseOrderCreation/view/purchase-order-cr-view';


// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Purchase order creation - ${CONFIG.appName}`}</title>
      </Helmet>

      <PurchaseOrderCreationView />
    </>
  );
}
