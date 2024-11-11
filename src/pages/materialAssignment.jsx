import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';


import { MaterialAssignmentView } from '../sections/materialAssignment/view/materialAssignment-view';

// ----------------------------------------------------------------------

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`Material Assignment- ${CONFIG.appName}`}</title>
      </Helmet>

      <MaterialAssignmentView />
    </>
  );
}
