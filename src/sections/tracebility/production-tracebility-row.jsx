import { useState, useCallback } from 'react'
import Swal from 'sweetalert2'
import Box from '@mui/material/Box'
import Avatar from '@mui/material/Avatar'
import Popover from '@mui/material/Popover'
import TableRow from '@mui/material/TableRow'
import Checkbox from '@mui/material/Checkbox'
import MenuList from '@mui/material/MenuList'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem'
import EditVendorManagementForm from '../../layouts/editModals/editVendorManagement'
import { Label } from 'src/components/label'
import { Iconify } from 'src/components/iconify'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
import { Link } from '@mui/material'
// ----------------------------------------------------------------------

export function TracebilityProductionRow ({
  setUpdate,
  setShipping,
  row,
  selected,
  onSelectRow
}) {
    const handleProductionClick = async processCode => {
      try {
        const result = await axiosInstance.get(
          `/search/packing&shipping?processCode=${processCode}`
        )

        if (result && result.data.shippingData) {
          setShipping(result.data.shippingData)
        } else {
          console.log('No production data found.')
        }
      } catch (err) {
        console.error('Error occurred while fetching productions:', err.message)
      }
    }

  const [openPopover, setOpenPopover] = useState(null)

  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])

  const handleDelete = async () => {
    try {
      const vendorId = row._id
      const result = await axiosInstance.delete(
        `/removeVendorManagement?vendorId=${vendorId}`
      )
      if (result) {
        toast.success(result.data.message)
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

        <TableCell>{new Date(row.startDate).toLocaleDateString()}</TableCell>
        <TableCell>
          <Link
            component='button'
            onClick={() => handleProductionClick(row.processOrder)}
            sx={{
              textDecoration: 'none',
              color: 'primary.main',
              fontWeight: 'bold',
              cursor: 'pointer',
              '&:hover': {
                textDecoration: 'underline'
              }
            }}
          >
            {row.processOrderNumber}
          </Link>
        </TableCell>
        <TableCell>{row.plant}</TableCell>
        <TableCell>
          {row.materialInput.map((material, index) => (
            <div key={index}>
              <strong>{material.materialCode}</strong>:{' '}
              {`${material.quantity}`}
            </div>
          ))}
        </TableCell>
        <TableCell>{`${row.orderQuantity} ${row?.unit}`}</TableCell>
        <TableCell>{`${row.batchNumber}`}</TableCell>
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
