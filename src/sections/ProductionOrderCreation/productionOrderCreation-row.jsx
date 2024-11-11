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
import EditProductionOrderCreationForm from 'src/layouts/editModals/editProductionOrderCreation';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------



export function ProductionOrderCreationTableRow({setUpdate, row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const productionOrderData = {
    productionOrderId:row._id,
    processOrder:row.processOrder,
    plant:row.plant,
    materialCode:row.materialCode,
    productDescription:row.productDescription,
    storageLocation:row.storageLocation,
    batch:row.batch,
    requiredQuantity:row.requiredQuantity,
    instructions:row.instructions,
    startDate:row.startDate,
    endDate:row.endDate
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
        <TableCell>  {row.processOrder}</TableCell>
        <TableCell>{row.plant}</TableCell>

        <TableCell>{row.materialCode}</TableCell>
        <TableCell>{row.productDescription}</TableCell>
        <TableCell>{row.storageLocation}</TableCell>
        <TableCell>{row.batch}</TableCell>
        <TableCell>{row.requiredQuantity}</TableCell>
        <TableCell>{row.instructions}</TableCell>
        <TableCell>{new Date(row.startDate).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(row.endDate).toLocaleDateString()}</TableCell>
  
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
       <EditProductionOrderCreationForm setUpdate={setUpdate} productionOrderData={productionOrderData}/>

          <MenuItem onClick={handleClosePopover} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete 
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
