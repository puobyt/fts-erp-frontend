import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Vendor Management',
    path: '/vendor-management',
    icon: icon('ic-cart'),
  },
  {
    title: 'Purchase Order Creation',
    path: '/purchase-order-creation',
    icon: icon('ic-cart'),
    // info: (
    //   <Label color="error" variant="inverted">
    //     +3
    //   </Label>
    // ),
  },
  {
    title: 'Gate Entry',
    path: '/gate-entry',
    icon: icon('ic-cart'),
  },
  {
    title: 'Inward Current Stock',
    path: '/current-stock',
    icon: icon('ic-cart'),
  },
  {
    title: 'Inward Quality Check',
    path: '/quality-check',
    icon: icon('ic-cart'),
  },
  {
    title: 'Main Stock',
    path: '/main-stock',
    icon: icon('ic-cart'),
  },
  {
    title: 'Out Of Stock',
    path: '/out-of-stock',
    icon: icon('ic-cart'),
  },

  {
    title: 'Rework',
    path: '/rework',
    icon: icon('ic-cart'),
  },
  {
    title: 'Process Order',
    path: '/process-order',
    icon: icon('ic-cart'),
  },
  {
    title: 'Production Order Creation',
    path: '/production-order-creation',
    icon: icon('ic-cart'),
  },

  {
    title: 'Request Creation For Materials',
    path: '/request-creation-for-materials',
    icon: icon('ic-cart'),
  },
  {
    title: 'Material Assignment',
    path: '/material-assignment',
    icon: icon('ic-cart'),
  },
  {
    title: 'Production Order Creation-Output',
    path: '/production-order-creation-output',
    icon: icon('ic-cart'),
  },
  {
    title: 'Bill Of Materials',
    path: '/bill-of-materials',
    icon: icon('ic-cart'),
  },
  {
    title: 'Final Quality Inspection',
    path: '/final-quality-inspection',
    icon: icon('ic-cart'),
  },
  {
    title: 'Finished Goods',
    path: '/finished-goods',
    icon: icon('ic-cart'),
  },
  {
    title: 'Invoice Creation',
    path: '/invoice-creations',
    icon: icon('ic-cart'),
  },
  // {
  //   title: 'sign-in',
  //   path: '/sign-in',

  // },
  {
    title: '',
    path: '',

  },
];
