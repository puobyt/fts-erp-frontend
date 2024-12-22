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
// ----------------------------------------------------------------------

export function ProcessOrderTableRow ({
  setUpdate,
  row,
  selected,
  onSelectRow
}) {
  const [openPopover, setOpenPopover] = useState(null)
  const processOrderData = {
    processOrderId: row._id,
    processOrderNumber: row.processOrderNumber,
    productName: row.productName,
    description: row.description
  }
  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])
  const handleDelete = async () => {
    try {
      const processOrderId = row._id
      const result = await axiosInstance.delete(
        `/removeProcessOrder?processOrderId=${processOrderId}`
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
        {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}
        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nameOfTheFirm}  />
          
          </Box>
        </TableCell> */}

        <TableCell> {row.processOrderNumber}</TableCell>
        <TableCell>{row.plant}</TableCell>
        <TableCell> {row.equipment}</TableCell>
        <TableCell sx={{ minWidth: 120 }} >{row.startDate}</TableCell>
        <TableCell sx={{ minWidth: 120 }}>{row.finishDate}</TableCell>
        <TableCell sx={{ minWidth: 150 }}>{row.productName}</TableCell>

        <TableCell> {row.productCode}</TableCell>
      

        <TableCell>{row.batchNumber}</TableCell>
        <TableCell>{row.orderQuantity}</TableCell>

        <TableCell>
          {row.materialInput.map((material, index) => (
       <div key={index}>{`${material.materialCode}`}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materialInput.map((material, index) => (
            <div key={index}>{`${material.quantity}`}</div>
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
            <div key={index}>{`${material.quantity} `}</div>
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
        {/* <TableCell
          style={{
            maxWidth: '300px', // Set a maximum width for the cell
            overflow: 'hidden', // Hide content that overflows the width
            textOverflow: 'ellipsis' // Add ellipsis for overflowed text
            // Prevent text from wrapping to the next line
          }}
        >
          {row.description}
        </TableCell> */}

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
          <EditProcessOrderForm
            setUpdate={setUpdate}
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
