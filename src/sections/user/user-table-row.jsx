import { useState, useCallback } from 'react';
import Swal from 'sweetalert2'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditVendorManagementForm from '../../layouts/editModals/editVendorManagement';
import ViewVendorManagement from '../../layouts/viewModals/viewVendorManagement';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast'

// ----------------------------------------------------------------------



export function UserTableRow({setUpdate, row, selected, onSelectRow }) {

  const vendorData = {
    nameOfTheFirm: row.nameOfTheFirm,
    address: row.address,
    vendorCode: row.vendorCode,
    vendorId: row._id,
    contactNumber:row.contactNumber,
    contactPersonName:row.contactPersonName,
    contactPersonDetails:row.contactPersonDetails,
    material:row.material,
    bankDetails:row.bankDetails,
    pan:row.pan,
    gst:row.gst
  };
  
  const [openPopover, setOpenPopover] = useState(null);

  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);


  const handleDelete = async()=>{
    try {

      const vendorId = row._id;
      const result = await axiosInstance.delete(`/removeVendorManagement?vendorId=${vendorId}`);
      if (result) {
        toast.success(result.data.message);
        setUpdate(prev => !prev)
    
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in adding Rework in client side',
        err.message
      )
    }
  }

  const confirmDelete = ()=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      backdrop: false
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  }

  const handleMenuCloseAndConfirmDelete = () => {
    handleClosePopover(); // Close the popover or menu first
    setTimeout(() => {
      confirmDelete();
    }, 0); // Optional delay to ensure the popover is fully closed
  };

  return (
    <>
     <Toaster position='top-center' reverseOrder={false} />
      <TableRow>
      {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}
        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nameOfTheFirm}  />
          
          </Box>
        </TableCell> */}
        <TableCell>  {row.nameOfTheFirm}</TableCell>
        <TableCell>{row.vendorCode}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.contactNumber}</TableCell>
        <TableCell>{row.contactPersonName}</TableCell>
        <TableCell>{row.contactPersonDetails}</TableCell>
        <TableCell>{row.material}</TableCell>
        <TableCell>{row.bankDetails}</TableCell>
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
          {/* <MenuItem >
            <Iconify icon="solar:pen-bold" />
           
          </MenuItem> */}
        
<EditVendorManagementForm setUpdate={setUpdate} vendorData ={vendorData}/>
<ViewVendorManagement vendorData ={vendorData}/>
          <MenuItem onClick={handleMenuCloseAndConfirmDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete 
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
