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
import EditMainStockForm from '../../layouts/editModals/editMainStock'
import { Label } from 'src/components/label'
import { Iconify } from 'src/components/iconify'
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
// ----------------------------------------------------------------------

export function OutOfStockTableRow({ outOfStocks, setUpdate, row, selected, onSelectRow, selectedTab }) {
  const [openPopover, setOpenPopover] = useState(null)
  const mainStockData = {
    mainStockId: row._id,
    materialName: row.materialName,
    materialCode: row.materialCode,
    grn: row.grn,
    quantity: row.quantity,
    unit: row.unit,
    price: row.price,
    storageLocation: row.storageLocation,
    vendorName: row?.vendorName || '---',
    dateRecieved: row.dateRecieved,
    expiryDate: row.expiryDate
  }
  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])
  const handleDelete = async () => {
    try {
      const mainStockId = row._id
      const result = await axiosInstance.delete(
        `/removeMainStock?mainStockId=${mainStockId}`
      )
      if (result) {
        toast.success(result.data.message);
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing main Stock in client side',
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
        <TableCell> {row.materialName}</TableCell>
        {selectedTab === 1 && <TableCell> {row.materialCode}</TableCell>}

        {selectedTab === 0 && <TableCell>{row.grn}</TableCell>}
        <TableCell>{`${row.quantity} ${' '} ${row.unit}`}</TableCell>
        {selectedTab === 0 && <TableCell style={{ whiteSpace: 'nowrap' }}>{`₹ ${row.price}`}</TableCell>}

        {selectedTab === 0 && <TableCell style={{ whiteSpace: 'nowrap' }}>{row?.vendorName || '--'}</TableCell>}

        {/* <TableCell>{row?.vendorName || '--'}</TableCell> */}
        <TableCell>{row.storageLocation}</TableCell>
        <TableCell>{new Date(row.dateRecieved).toLocaleDateString()}</TableCell>
        {selectedTab === 0 && <TableCell>{new Date(row.expiryDate).toLocaleDateString()}</TableCell>}



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
          {/* <EditMainStockForm
            setUpdate={setUpdate}
            mainStockData={mainStockData}
          /> */}

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
