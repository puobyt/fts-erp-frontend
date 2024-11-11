import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';


import { PurchaseOrderCreationView } from '../sections/purchaseOrderCreation/view/purchase-order-cr-view';
import { RequestCreationForMaterialsView } from '../sections/requestCreationForMaterials/view/requestCreationForMaterials-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Request Creation For Materials - ${CONFIG.appName}`}</title>
      </Helmet>

      <RequestCreationForMaterialsView />
    </>
  );
}
