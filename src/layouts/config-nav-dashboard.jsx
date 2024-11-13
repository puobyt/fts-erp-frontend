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
    icon: icon('ic-user'),
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
    title: 'Current Stock',
    path: '/current-stock',
    icon: icon('ic-user'),
  },
  {
    title: 'Quality Check',
    path: '/quality-check',
    icon: icon('ic-cart'),
  },
  {
    title: 'Rework',
    path: '/rework',
    icon: icon('ic-cart'),
  },
  {
    title: 'Production Order Creation',
    path: '/production-order-creation',
    icon: icon('ic-user'),
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
    title: 'Bill Of Materials',
    path: '/bill-of-materials',
    icon: icon('ic-user'),
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
    icon: icon('ic-user'),
  },
  {
    title: '',
    path: '',

  },
  {
    title: '',
    path: '',

  },
];
