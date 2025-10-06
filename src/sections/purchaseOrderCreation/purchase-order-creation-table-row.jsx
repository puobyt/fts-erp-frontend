import { useState, useCallback } from 'react';
import { useRef } from 'react';
import html2pdf from 'html2pdf.js';
import PurchaseOrder from '../../components/pdf/purchaseOrder';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditPurchaseOrderCreationForm from '../../layouts/editModals/editPurchaseOrderCreation';
import { Iconify } from 'src/components/iconify';
import Swal from 'sweetalert2';
import axiosInstance from 'src/configs/axiosInstance';
import toast from 'react-hot-toast';
import ViewPurchaseOrderCreation from '../../layouts/viewModals/viewPurchaseOrder';
import { hasPermission } from '../../utils/permissionCheck';

// ----------------------------------------------------------------------

export function PurchaseOrderCreationTableRow({ setUpdate, firms, row, selected, onSelectRow }) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [openPopover, setOpenPopover] = useState(null);
  const pdfRef = useRef();

  // PDF download handler
  const handleDownload = useCallback(() => {
    const element = pdfRef.current;

    if (!element) {
      toast.error('PDF element not found');
      return;
    }

    const opt = {
      margin: 5,
      filename: `purchase_order_${row.purchaseOrderNumber || 'unknown'}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
    };

    html2pdf().set(opt).from(element).save();
  }, [row.purchaseOrderNumber]);

  // Format order data for PDF and forms
  const orderData = {
    orderId: row._id,
    purchaseOrderNumber: row.purchaseOrderNumber,
    date: row.date,
    nameOfTheFirm: row.nameOfTheFirm,
    address: row.address,
    contactNumber: row.contactNumber,
    contactPersonName: row.contactPersonName,
    contactPersonDetails: row.contactPersonDetails,
    vendorId: row.vendorId,
    materialName: row.materialName,
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
    unit: row.unit,
    mfgDate: row.mfgDate,
    quantity: row.quantity,
    price: row.price,
    pan: row.pan,
    gst: row.gst,
    termsAndConditions: row.termsAndConditions,
    deliveryAddress: row.deliveryAddress,
    materials: Array.isArray(row.materials)
      ? row.materials
      : (row.materialName || row.quantity || row.unit || row.price || row.mfgDate)
        ? [{
          materialName: row.materialName || '',
          quantity: row.quantity || '',
          unit: row.unit || '',
          price: row.price || '',
          mfgDate: row.mfgDate || ''
        }]
        : []
  };

  // Popover handlers
  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  // Delete purchase order
  const handleDelete = async () => {
    try {
      const purchaseOrderId = row._id;

      if (!purchaseOrderId) {
        toast.error('Purchase order ID not found');
        return;
      }

      const result = await axiosInstance.delete(
        `/removePurchaseOrderCreation?purchaseOrderId=${purchaseOrderId}&user=${adminData.email}`
      );

      if (result) {
        toast.success(result.data.message || 'Purchase order deleted successfully');
        setUpdate((prev) => !prev);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Error deleting purchase order';
      toast.error(errorMessage);
      console.error('Error occurred in removing purchase order creation:', err.message);
    }
  };

  // Confirm delete with SweetAlert2
  const confirmDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      backdrop: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  // Handle menu close and confirm delete
  const handleMenuCloseAndConfirmDelete = () => {
    handleClosePopover();
    setTimeout(() => {
      confirmDelete();
    }, 100); // Small delay to ensure popover is closed
  };

  // Format date helper
  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  // Format materials display
  const formatMaterials = (materials, field) => {
    if (Array.isArray(materials)) {
      return materials.map(mat => {
        switch (field) {
          case 'materialName':
            return mat.materialName || '';
          case 'mfgDate':
            return formatDate(mat.mfgDate);
          case 'quantity':
            return mat.quantity && mat.unit ? `${mat.quantity} ${mat.unit}` : '';
          case 'price':
            return mat.price ? `₹ ${mat.price}` : '';
          default:
            return '';
        }
      }).filter(Boolean).join(', ');
    } else {
      // Fallback for non-array materials
      switch (field) {
        case 'materialName':
          return row.materialName || '';
        case 'mfgDate':
          return formatDate(row.mfgDate);
        case 'quantity':
          return row.quantity && row.unit ? `${row.quantity} ${row.unit}` : '';
        case 'price':
          return row.price ? `₹ ${row.price}` : '';
        default:
          return '';
      }
    }
  };

  return (
    <>
      <TableRow>
        <TableCell>{row.purchaseOrderNumber || 'N/A'}</TableCell>
        <TableCell>{formatDate(row.date)}</TableCell>
        <TableCell>{row.nameOfTheFirm || 'N/A'}</TableCell>
        <TableCell>{row.address || 'N/A'}</TableCell>
        <TableCell>{row.contactNumber || 'N/A'}</TableCell>
        <TableCell>{row.contactPersonName || 'N/A'}</TableCell>
        <TableCell>{row.contactPersonDetails || 'N/A'}</TableCell>
        <TableCell>{row.vendorId || 'N/A'}</TableCell>
        <TableCell>{formatMaterials(row.materials, 'materialName')}</TableCell>
        <TableCell>{formatMaterials(row.materials, 'mfgDate')}</TableCell>
        <TableCell>{formatMaterials(row.materials, 'quantity')}</TableCell>
        <TableCell style={{ whiteSpace: 'nowrap' }}>
          {formatMaterials(row.materials, 'price')}
        </TableCell>
        <TableCell>{row.pan || 'N/A'}</TableCell>
        <TableCell>{row.gst || 'N/A'}</TableCell>
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
          {hasPermission('Purchase Order Creation') === 'fullAccess' &&

            <EditPurchaseOrderCreationForm
              setUpdate={setUpdate}
              orderData={orderData}
              firms={firms}
            />
          }
          <ViewPurchaseOrderCreation orderData={orderData} />
          {hasPermission('Purchase Order Creation') === 'fullAccess' &&

            <MenuItem onClick={handleMenuCloseAndConfirmDelete} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:trash-bin-trash-bold" />
              Delete
            </MenuItem>
          }
          <MenuItem sx={{ color: 'primary.main' }} onClick={handleDownload}>
            <Iconify icon="solar:download-bold" />
            Download PDF
          </MenuItem>
        </MenuList>
      </Popover>

      {/* Hidden PDF component for download */}
      <div style={{ display: 'none' }}>
        <PurchaseOrder pdfData={orderData} ref={pdfRef} />
      </div>
    </>
  );
}