import { SvgColor } from 'src/components/svg-color';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import Inventory2TwoToneIcon from '@mui/icons-material/Inventory2TwoTone';
import InventoryTwoToneIcon from '@mui/icons-material/InventoryTwoTone';
import DoorSlidingTwoToneIcon from '@mui/icons-material/DoorSlidingTwoTone';;
import StoreTwoToneIcon from '@mui/icons-material/StoreTwoTone';
import LocalGroceryStoreTwoToneIcon from '@mui/icons-material/LocalGroceryStoreTwoTone';
import ProductionQuantityLimitsTwoToneIcon from '@mui/icons-material/ProductionQuantityLimitsTwoTone';

import GppGoodIcon from '@mui/icons-material/GppGood';
import VerifiedUserTwoToneIcon from '@mui/icons-material/VerifiedUserTwoTone';
import TuneTwoToneIcon from '@mui/icons-material/TuneTwoTone';
import RemoveRedEyeTwoToneIcon from '@mui/icons-material/RemoveRedEyeTwoTone';
import VerifiedTwoToneIcon from '@mui/icons-material/VerifiedTwoTone';
import CategoryIcon from '@mui/icons-material/Category';
import GradingIcon from '@mui/icons-material/Grading';
import EditNoteTwoToneIcon from '@mui/icons-material/EditNoteTwoTone';
import SummarizeTwoToneIcon from '@mui/icons-material/SummarizeTwoTone';
import OutputTwoToneIcon from '@mui/icons-material/OutputTwoTone';
import SaveAsTwoToneIcon from '@mui/icons-material/SaveAsTwoTone';
import ReceiptLongTwoToneIcon from '@mui/icons-material/ReceiptLongTwoTone';
import FeaturedPlayListIcon from '@mui/icons-material/FeaturedPlayList';
import AssignmentTurnedInTwoToneIcon from '@mui/icons-material/AssignmentTurnedInTwoTone';
import DescriptionTwoToneIcon from '@mui/icons-material/DescriptionTwoTone';
import ContentPasteSearchIcon from '@mui/icons-material/ContentPasteSearch';
import ContentPasteSearchTwoToneIcon from '@mui/icons-material/ContentPasteSearchTwoTone';
const icons = (IconComponent) => <IconComponent style={{ fontSize: 24 }} />;
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
    title: 'Vendor & Stock Management',
    children:[
      {
        title: 'Vendor Management',
        path: '/vendor-stock-management/vendor-management',
        icon: icons(Inventory2TwoToneIcon),
      },
      {
        title: 'Purchase Order Creation',
        path: '/vendor-stock-management/purchase-order-creation',
        icon: icons(LocalGroceryStoreTwoToneIcon),
      },
      {
        title: 'Gate Entry',
        path: '/vendor-stock-management/gate-entry',
        icon: icons(DoorSlidingTwoToneIcon),
      },
      {
        title: 'Inward Current Stock',
        path: '/vendor-stock-management/current-stock',
        icon: icons(StoreTwoToneIcon),
      },
      {
        title: 'Main Stock',
        path: '/vendor-stock-management/main-stock',
        icon: icons(InventoryTwoToneIcon),
      },
      {
        title: 'Out of Stock',
        path: '/vendor-stock-management/out-of-stock',
        icon: icons(ProductionQuantityLimitsTwoToneIcon),
      },
    ],
    
    icon: icons(Inventory2Icon),
  },
  
  {
    title: 'Quality Control',
    children:[
      {
        title: 'Inward Quality Check',
        path: '/quality-control/quality-check',
        icon: icons(VerifiedUserTwoToneIcon),
      },
      {
        title:"Qc Parameters",
        path:"/quality-control/qcparameters",
        icon:icons(TuneTwoToneIcon)
      },
      {
        title: 'Rework',
        path: '/quality-control/rework',
        icon: icons(RemoveRedEyeTwoToneIcon),
      },
      {
        title: 'Final Quality Inspection',
        path: '/quality-control/final-quality-inspection',
        icon: icons(VerifiedTwoToneIcon),
      },

    ],
    icon: icons(GppGoodIcon),
  },
  {
    title: 'Production Workflow',
    children:[
      {
        title: 'Process Order',
        path: '/production-workflow/process-order',
        icon: icons(GradingIcon),
      },
      {
        title: 'Production Order Creation',
        path: '/production-workflow/production-order-creation',
        icon: icons(EditNoteTwoToneIcon),
      },
      {
        title: 'Request Creation For Materials',
        path: '/production-workflow/request-creation-for-materials',
        icon: icons(SaveAsTwoToneIcon),
      },
      {
        title: 'Material Assignment',
        path: '/production-workflow/material-assignment',
        icon: icons(SummarizeTwoToneIcon),
      },
      {
        title: 'Production Order Creation Output',
        path: '/production-workflow/production-order-creation-output',
        icon: icons(OutputTwoToneIcon),
      },

      {
        title: 'Bill Of Material',
        path: '/production-workflow/bill-of-materials',
        icon: icons(ReceiptLongTwoToneIcon),
      },

    ],
    icon: icons(CategoryIcon),
  },

  {
    title: 'Finished Goods & Invoicing',
    children:[
      {
        title: 'Finished Goods',
        path: '/finished-goods-invoicing/finished-goods',
        icon: icons(AssignmentTurnedInTwoToneIcon),
      },
      {
        title: 'Invoice Creation',
        path: '/finished-goods-invoicing/invoice-creations',
        icon: icons(DescriptionTwoToneIcon),
      },


    ],
    icon: icons(FeaturedPlayListIcon),
  },

  {
    title: 'Tracebility',
    children:[
      {
        title: 'Tracebility',
        path: '/tracebility/tracebility',
        icon: icons(ContentPasteSearchIcon),
      },
    ],
    icon: icons(ContentPasteSearchTwoToneIcon),
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
