import { useState, useCallback } from 'react'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import MenuList from '@mui/material/MenuList'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem'
import { Label } from 'src/components/label'
import { Iconify } from 'src/components/iconify'
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
import EditProcessOrderForm from '../../layouts/editModals/editProcessOrder'
import ViewProcessOrderForm from '../../layouts/viewModals/viewProcessOrder'
import * as XLSX from 'xlsx'

// ----------------------------------------------------------------------

export function ProcessOrderTableRow({
  setUpdate,
  row,
  selected,
  onSelectRow
}) {
  const adminData = JSON.parse(localStorage.getItem('admin'))
  const [openPopover, setOpenPopover] = useState(null)

  const processOrderData = {
    processOrderId: row._id,
    processOrderNumber: row.processOrderNumber,
    plant: row.plant,
    equipment: row.equipment,
    startDate: row.startDate,
    finishDate: row.finishDate,
    productName: row.productName,
    productCode: row.productCode,
    batchNumber: row.batchNumber,
    orderQuantity: row.orderQuantity,
    unit: row?.unit,
    materialInput: row.materialInput
  }

  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])

  // Download function for individual row
  const handleDownload = useCallback(() => {
    try {
      // Create a new workbook
      const wb = XLSX.utils.book_new();

      // Prepare basic process order data
      const basicData = {
        'Process Order Number': row.processOrderNumber || '',
        'Plant': row.plant || '',
        'Equipment': row.equipment || '',
        'Start Date': row.startDate || '',
        'Finish Date': row.finishDate || '',
        'Product Name': row.productName || '',
        'Product Code': row.productCode || '',
        'Batch': row.batch || '',
        'Order Quantity': row.orderQuantity || ''
      };

      // Create basic info worksheet
      const basicWs = XLSX.utils.json_to_sheet([basicData]);
      XLSX.utils.book_append_sheet(wb, basicWs, 'Process Order Info');

      // Prepare material input data
      if (row.materialInput && row.materialInput.length > 0) {
        const materialInputData = row.materialInput.map((material, index) => ({
          'S.No': index + 1,
          'Material Code': material.materialCode || '',
          'Quantity': material.quantity || '',
          'Batch': material.batch || '',
          'Storage Location': material.storageLocation || ''
        }));

        const materialInputWs = XLSX.utils.json_to_sheet(materialInputData);
        XLSX.utils.book_append_sheet(wb, materialInputWs, 'Material Input');
      }

      // Prepare material output data
      if (row.materialOutput && row.materialOutput.length > 0) {
        const materialOutputData = row.materialOutput.map((material, index) => ({
          'S.No': index + 1,
          'Material Code': material.materialCode || '',
          'Quantity': material.quantity || '',
          'Batch': material.batch || '',
          'Storage Location': material.storageLocation || '',
          'Yield': material.Yield || ''
        }));

        const materialOutputWs = XLSX.utils.json_to_sheet(materialOutputData);
        XLSX.utils.book_append_sheet(wb, materialOutputWs, 'Material Output');
      }

      // Generate filename with process order number
      const filename = `ProcessOrder_${row.processOrderNumber || Date.now()}.xlsx`;

      // Download the file
      XLSX.writeFile(wb, filename);

      // Show success message
      toast.success('Process Order downloaded successfully!');

      // Close the popover
      handleClosePopover();

    } catch (error) {
      console.error('Error downloading process order:', error);
      toast.error('Error occurred while downloading the file. Please try again.');
    }
  }, [row, handleClosePopover]);

  const handleDelete = async () => {
    try {
      const processOrderId = row._id
      const result = await axiosInstance.delete(
        `/removeProcessOrder?processOrderId=${processOrderId}&user=${adminData.email}`
      )
      if (result) {
        toast.success(result.data.message)
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing production order in client side',
        err.message
      )
    }
  }

  const confirmDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      backdrop: false
    }).then(result => {
      if (result.isConfirmed) {
        handleDelete()
      }
    })
  }

  const handleMenuCloseAndConfirmDelete = () => {
    handleClosePopover()
    setTimeout(() => {
      confirmDelete()
    }, 0)
  }

  return (
    <>
      <TableRow>
        <TableCell> {row.processOrderNumber}</TableCell>
        <TableCell>{row.plant}</TableCell>
        <TableCell> {row.equipment}</TableCell>
        <TableCell sx={{ minWidth: 120 }}>{row.startDate}</TableCell>
        <TableCell sx={{ minWidth: 120 }}>{row.finishDate}</TableCell>
        <TableCell sx={{ minWidth: 150 }}>{row.productName}</TableCell>
        <TableCell> {row.productCode}</TableCell>
        <TableCell>{row.batch}</TableCell>
        <TableCell>{row.orderQuantity}{row.unit}</TableCell>

        <TableCell>
          {row.materialInput.map((material, index) => (
            <div key={index}>{`${material.materialCode}`}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialInput.map((material, index) => (
            <div key={index}>{`${material.quantity} ${material?.unit || '--'}`}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialInput.map((material, index) => (
            <div key={index}>{material.batch}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialInput.map((material, index) => (
            <div key={index}>{material.storageLocation}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialOutput?.map((material, index) => (
            <div key={index}>{`${material.materialCode}`}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialOutput?.map((material, index) => (
            <div key={index}>{`${material.quantity}`}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialOutput?.map((material, index) => (
            <div key={index}>{material.batch}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialOutput?.map((material, index) => (
            <div key={index}>{material.storageLocation}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialOutput?.map((material, index) => (
            <div key={index}>{material.Yield}</div>
          ))}
        </TableCell>

        <TableCell align='right'>
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon='eva:more-vertical-fill' />
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
            width: 160,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' }
            }
          }}
        >
          <MenuItem onClick={handleDownload}>
            <Iconify icon='eva:download-fill' />
            Download
          </MenuItem>

          <EditProcessOrderForm
            setUpdate={setUpdate}
            processOrderData={processOrderData}
          />

          <ViewProcessOrderForm
            processOrderData={processOrderData}
          />

          <MenuItem
            onClick={handleMenuCloseAndConfirmDelete}
            sx={{ color: 'error.main' }}
          >
            <Iconify icon='solar:trash-bin-trash-bold' />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  )
}