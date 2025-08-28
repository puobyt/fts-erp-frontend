import { useState, useCallback } from 'react'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import MenuList from '@mui/material/MenuList'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import  { menuItemClasses } from '@mui/material/MenuItem'
import { Iconify } from 'src/components/iconify'
import  { Toaster } from 'react-hot-toast'
import { ViewQcDetails } from './ViewQcDetails'

export function TracebilityQCRow ({ setUpdate, row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null)

  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])

  //   const handleDelete = async () => {
  //     try {
  //       const vendorId = row._id
  //       const result = await axiosInstance.delete(
  //         `/removeVendorManagement?vendorId=${vendorId}`
  //       )
  //       if (result) {
  //         toast.success(result.data.message)
  //         setUpdate(prev => !prev)
  //       }
  //     } catch (err) {
  //       toast.success(err.response.data.message)
  //       console.error(
  //         'Error occured in adding Rework in client side',
  //         err.message
  //       )
  //     }
  //   }

  //   const confirmDelete = () => {
  //     Swal.fire({
  //       title: 'Are you sure?',
  //       text: "You won't be able to revert this!",
  //       icon: 'warning',
  //       showCancelButton: true,
  //       confirmButtonColor: '#3085d6',
  //       cancelButtonColor: '#d33',
  //       confirmButtonText: 'Yes, delete it!',
  //       backdrop: false
  //     }).then(result => {
  //       if (result.isConfirmed) {
  //         handleDelete()
  //       }
  //     })
  //   }

  //   const handleMenuCloseAndConfirmDelete = () => {
  //     handleClosePopover() // Close the popover or menu first
  //     setTimeout(() => {
  //       confirmDelete()
  //     }, 0) // Optional delay to ensure the popover is fully closed
  //   }

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

        <TableCell>{row.grn}</TableCell>
        <TableCell>{row.materialName}</TableCell>
        <TableCell>{row.materialCode}</TableCell>
        <TableCell>
          {new Date(row.inspectionDate).toLocaleDateString()}
        </TableCell>
        <TableCell>{row.inspectorName}</TableCell>
        <TableCell>{row.qualityStatus}</TableCell>
        <TableCell>{row.comments}</TableCell>
        <TableCell>
          <ViewQcDetails qcData={row}/>
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
          {/* <MenuItem >
            <Iconify icon="solar:pen-bold" />
           
          </MenuItem> */}
        </MenuList>
      </Popover>
    </>
  )
}
