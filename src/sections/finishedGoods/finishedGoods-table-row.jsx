import { useState, useCallback } from 'react';
import { generateTraceabilityReport } from '../../utils/finishedGoodsPDF';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditFinishedGoodsForm from '../../layouts/editModals/editFinishedGoods';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Swal from 'sweetalert2'
import { CircularProgress } from '@mui/material';
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast'
// ----------------------------------------------------------------------


 
export function FinishedGoodsTableRow({ setUpdate,row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const [loading, setLoading] = useState(false);
  const finishedGoodsData = {
    finishedGoodsId:row._id,
    finishedGoodsName:row.finishedGoodsName,
    batchNumber:row.batchNumber,
    productionDate:row.productionDate,
    quantityProduced:row.quantityProduced
  }

  const handlePDFDownload = async () => {
    setLoading(true);
    try {
      await generateTraceabilityReport(row);
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setLoading(false);
    }
  };
  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const handleDelete = async()=>{
    try {
      const finishedGoodsId = row._id;
      const result = await axiosInstance.delete(`/removeFinishedGoods?finishedGoodsId=${finishedGoodsId}`);
      if (result) {
        toast.success(result.data.message);
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing Finished Goods in client side',
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
      <TableRow>
      {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}
        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nameOfTheFirm}  />
          
          </Box>
        </TableCell> */}
        <TableCell>  {row.finishedGoodsName}</TableCell>
        <TableCell>{row.batchNumber}</TableCell>
        <TableCell>{new Date(row.productionDate).toLocaleDateString()}</TableCell>
        <TableCell>{`${row.quantityProduced} KG`}</TableCell>
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
       <EditFinishedGoodsForm setUpdate={setUpdate} finishedGoodsData={finishedGoodsData}/>

          <MenuItem onClick={handleMenuCloseAndConfirmDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete 
          </MenuItem>
          <MenuItem
            sx={{ color: 'primary.main' }}
            onClick={handlePDFDownload}
            disabled={loading} 
          >
           <Iconify icon="solar:download-bold" />
            Download PDF
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
