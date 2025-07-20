import { useState, useCallback } from 'react';
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditRequestCreationForMaterialsForm from '../../layouts/editModals/editRequestCreationForMaterials';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast'
import ViewRequestCreationForMaterialsForm from '../../layouts/viewModals/viewRequestCreationMaterials';
// ----------------------------------------------------------------------



export function RequestCreationForMaterialsTableRow({ materialNames, finishedGoods, setUpdate, row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const requestMaterialsData = {
    requestMaterialsId: row._id,
    requestNumber: row.requestNumber,
    finishedGoodsName: row.finishedGoodsName,
    batchNumber: row.batchNumber,
    materials: row.materials,
    requiredDate: row.requiredDate,
    status: row.status,
  }
  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = async () => {
    try {

      const requestCreationId = row._id;
      const result = await axiosInstance.delete(`/removeRequestCreationForMaterials?requestCreationId=${requestCreationId}`);
      if (result) {
        toast.success(result.data.message);
        setUpdate(prev => !prev)

      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing request creation materials in client side',
        err.message
      )
    }
  }

  const confirmDelete = () => {
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

    const getStatusLabel = (status) => {
      switch (status) {
        case 'Pending':
          return (
            <Typography sx={{ color: '#FFA500', fontWeight: 'bold' }}>
              Pending
            </Typography>
          );
        case 'Assigned':
          return (
            <Typography sx={{ color: '#4CAF50', fontWeight: 'bold' }}>
              Assigned
            </Typography>
          );
        default:
          return (
            <Typography sx={{ color: '#757575', fontWeight: 'bold' }}>
              Unknown
            </Typography>
          );
      }
    }
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
        <TableCell>  {row.requestNumber}</TableCell>
        <TableCell>  {row.finishedGoodsName}</TableCell>
        {/* <TableCell>  {row.batchNumber}</TableCell> */}
        <TableCell
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {row.materials.map((material, index) => (
            <div
              key={index}
              style={{ marginRight: '10px' }}
            >
              <strong>{material.materialsList}</strong>:{' '}
              {`${material.quantity} KG`}
            </div>

          ))}
        </TableCell>

        <TableCell>
          {row.materials.map((material, index) => (
            <div key={index}>{`${material.quantity} KG`}</div>
          ))}
        </TableCell>
        <TableCell>
          {row.materials.map((material, index) => (
            <div key={index}>{material.materialCode}</div>

          ))}
        </TableCell>
        <TableCell>{new Date(row.requiredDate).toLocaleDateString()}</TableCell>
        <TableCell>
        {getStatusLabel(row.status)}
        </TableCell>

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
          <EditRequestCreationForMaterialsForm setUpdate={setUpdate} requestMaterialsData={requestMaterialsData} materialNames={materialNames} finishedGoods={finishedGoods} />
          <ViewRequestCreationForMaterialsForm requestMaterialsData={requestMaterialsData} />
          <MenuItem onClick={handleMenuCloseAndConfirmDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
