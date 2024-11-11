import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditPurchaseOrderCreationForm from 'src/layouts/editModals/editPurchaseOrderCreation';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';


// ----------------------------------------------------------------------



export function PurchaseOrderCreationTableRow({setUpdate, row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const orderData = {
    orderId:row._id,
    purchaseOrderNumber:row.purchaseOrderNumber,
    date:row.date,
    nameOfTheFirm:row.nameOfTheFirm,
    address:row.address,
    contact:row.contact,
    contactPersonName:row.contactPersonName,
    contactPersonDetails:row.contactPersonDetails,
    vendorId:row.vendorId,
    productName:row.productName,
    batchNumber:row.batchNumber,
    mfgDate:row.mfgDate,
    quantity:row.quantity,
    price:row.price,
    pan:row.pan,
    gst:row.gst
  }
  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  return (
    <>
      <TableRow>
      {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}
        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nameOfTheFirm}  />
          
          </Box>
        </TableCell> */}
        <TableCell>  {row.purchaseOrderNumber}</TableCell>
        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
        <TableCell>{row.nameOfTheFirm}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.contact}</TableCell>
        <TableCell>{row.contactPersonName}</TableCell>
        <TableCell>{row.contactPersonDetails}</TableCell>
        <TableCell>{row.vendorId}</TableCell>
        <TableCell>{row.productName}</TableCell>
        <TableCell>{row.batchNumber}</TableCell>
        <TableCell>{new Date(row.mfgDate).toLocaleDateString()}</TableCell>
        <TableCell>{row.quantity}</TableCell>
        <TableCell>{row.price}</TableCell>
        <TableCell>{row.pan}</TableCell>
        <TableCell>{row.gst}</TableCell>
   


        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
      <EditPurchaseOrderCreationForm setUpdate={setUpdate} orderData={orderData}/>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete 
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
