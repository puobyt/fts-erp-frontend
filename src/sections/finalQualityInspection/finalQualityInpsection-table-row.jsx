import { useState, useCallback } from 'react'

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
import EditQualityInspectionForm from '../../layouts/editModals/editFinalQualityInspection'
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
import ViewQualityInspectionForm from '../../layouts/viewModals/viewQualityInspection'
// ----------------------------------------------------------------------

export function FinalQualityInpsectionTableRow({
  productNames,
  setUpdate,
  row,
  selected,
  onSelectRow
}) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [openPopover, setOpenPopover] = useState(null)
  const qualityInspectionData = {
    qualityInspectionId: row._id,
    inspectionNumber: row.inspectionNumber,
    productName: row.productName,
    inspectionResults: row.inspectionResults,
    date: row.date,
    batchNumber: row.batchNumber,
    quantity: row.quantity,
    unit: row.unit
  }
  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])

  const handleDelete = async () => {
    try {
      const qualityInspectionId = row._id
      const result = await axiosInstance.delete(
        `/removeFinalQualityInspection?qualityInspectionId=${qualityInspectionId}&user=${adminData.email}`
      )
      if (result) {
        toast.success(result.data.message)
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing Final Quality Inspection in client side',
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
    handleClosePopover() // Close the popover or menu first
    setTimeout(() => {
      confirmDelete()
    }, 0) // Optional delay to ensure the popover is fully closed
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
        <TableCell> {row.inspectionNumber}</TableCell>
        <TableCell>{row.productName}</TableCell>
        <TableCell
          sx={{
            color:
              row.inspectionResults === 'Accepted'
                ? 'green'
                : row.inspectionResults === 'Quarantine'
                  ? 'purple'
                  : row.inspectionResults === 'Rejected'
                    ? 'red'
                    : 'inherit' // Default color if none of the above matches
          }}
        >
          {row.inspectionResults}
        </TableCell>
        <TableCell> {row.date}</TableCell>
        <TableCell>{row.batchNumber}</TableCell>
        <TableCell>{row.quantity}</TableCell>

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
            width: 140,
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
          <EditQualityInspectionForm
            setUpdate={setUpdate}
            qualityInspectionData={qualityInspectionData}
            productNames={productNames}
          />

          <ViewQualityInspectionForm qualityInspectionData={qualityInspectionData} />
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
