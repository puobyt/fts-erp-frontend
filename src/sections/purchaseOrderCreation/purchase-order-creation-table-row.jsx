import { useState, useCallback } from 'react';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import PurchaseOrder from '../../components/pdf/purchaseOrder';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditPurchaseOrderCreationForm from '../../layouts/editModals/editPurchaseOrderCreation';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast'
import generatePocpdf from '../../utils/purchaseOrderCreation';
import ViewPurchaseOrderCreation from '../../layouts/viewModals/viewPurchaseOrder';

// ----------------------------------------------------------------------



export function PurchaseOrderCreationTableRow({setUpdate,firms, row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const pdfRef = useRef();
  const handleDownload = () => {
    const element = pdfRef.current;
    const opt = {
      margin:       5,
      filename:     'purchase_order.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };
  const orderData = {
    orderId:row._id,
    purchaseOrderNumber:row.purchaseOrderNumber,
    date:row.date,
    nameOfTheFirm:row.nameOfTheFirm,
    address:row.address,
    contactNumber:row.contactNumber,
    contactPersonName:row.contactPersonName,
    contactPersonDetails:row.contactPersonDetails,
    vendorId:row.vendorId,
    materialName:row.materialName,
    quotationReferenceNumber: row.quotationReferenceNumber,
    hsn: row.hsn,
    description: row.description,
    totalAmount: row.totalAmount,
    amountInWords: row.amountInWords,
    discount: row.discount,
    afterDiscount: row.afterDiscount,
    igst: row.igst,
    transportationFreight: row.transportationFreight,
    roundOff: row.roundOff,
    finalAmount: row.finalAmount,
    poDate: row.poDate,
 unit:row.unit,
    // batchNumber:row.batchNumber,
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
  const handleDelete = async()=>{
    try {

      const purchaseOrderId = row._id;
      const result = await axiosInstance.delete(`/removePurchaseOrderCreation?purchaseOrderId=${purchaseOrderId}`);
      if (result) {
        toast.success(result.data.message);
        setUpdate(prev => !prev)
    
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing purchase order creation in client side',
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
        <TableCell>  {row.purchaseOrderNumber}</TableCell>
        <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
        <TableCell>{row.nameOfTheFirm}</TableCell>
        <TableCell>{row.address}</TableCell>
        <TableCell>{row.contactNumber}</TableCell>
        <TableCell>{row.contactPersonName}</TableCell>
        <TableCell>{row.contactPersonDetails}</TableCell>
        <TableCell>{row.vendorId}</TableCell>
        <TableCell>{row.materialName}</TableCell>
        {/* <TableCell>{row.batchNumber}</TableCell> */}
        <TableCell>{new Date(row.mfgDate).toLocaleDateString()}</TableCell>
        <TableCell>{`${row.quantity} ${row.unit}`}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>₹ {`${row.price}`}</TableCell>
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
      <EditPurchaseOrderCreationForm setUpdate={setUpdate} orderData={orderData} firms={firms}/>
      <ViewPurchaseOrderCreation orderData={orderData}/>
          <MenuItem onClick={handleMenuCloseAndConfirmDelete} sx={{ color: 'error.main' }}>
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete 
          </MenuItem>

          <MenuItem sx={{ color: 'primary.main' }} onClick={handleDownload}>
        <Iconify icon='solar:download-bold' />
        Download PDF
      </MenuItem>

      {/* Hidden container for HTML2PDF */}
      <div style={{ display: 'none' }}>
        <PurchaseOrder pdfData={orderData} ref={pdfRef} />
        
      </div>
        </MenuList>
      </Popover>
    </>
  );
}
