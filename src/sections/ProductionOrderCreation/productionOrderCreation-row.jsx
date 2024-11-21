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
import EditProductionOrderCreationForm from '../../layouts/editModals/editProductionOrderCreation'
import { Label } from 'src/components/label'
import { Iconify } from 'src/components/iconify'
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
// ----------------------------------------------------------------------

export function ProductionOrderCreationTableRow ({
  materialNames,
  setUpdate,
  row,
  selected,
  onSelectRow
}) {
  const [openPopover, setOpenPopover] = useState(null)
  const productionOrderData = {
    productionOrderId: row._id,
    processOrder: row.processOrder,
    plant: row.plant,
    productName: row.productName,
    productDescription: row.productDescription,
    batch: row.batch,
    materials: row.materials,
    instructions: row.instructions,
    startDate: row.startDate,
    endDate: row.endDate
  }
  const handleOpenPopover = useCallback(event => {
    setOpenPopover(event.currentTarget)
  }, [])

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null)
  }, [])
  const handleDelete = async () => {
    try {
      const productionOrderId = row._id
      const result = await axiosInstance.delete(
        `/removeProductionOrderCreation?productionOrderId=${productionOrderId}`
      )
      if (result) {
        toast.success(result.data.message)
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
        setUpdate(prev => !prev)
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
        <TableCell> {row.processOrder}</TableCell>
        <TableCell>{row.plant}</TableCell>
        <TableCell>{row.productDescription}</TableCell>
        <TableCell>{row.productName}</TableCell>
        <TableCell>{row.batch}</TableCell>
        <TableCell
          style={{
          
            overflow: 'hidden',
            textOverflow: 'ellipsis'
          }}
        >
          {row.materials.map((material, index) => (
            <div
              key={index}
              style={{ display: 'inline-block', marginRight: '10px' }}
            >
              <strong>{material.materialsList}</strong>:{' '}
              {`${material.requiredQuantity} KG`}
            </div>
            
          ))}
        </TableCell>

        <TableCell>
          {row.materials.map((material, index) => (
            <div key={index}>{`${material.requiredQuantity} KG`}</div>
          ))}
        </TableCell>
        <TableCell>{row.instructions}</TableCell>
        <TableCell>{new Date(row.startDate).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(row.endDate).toLocaleDateString()}</TableCell>

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
          <EditProductionOrderCreationForm
            setUpdate={setUpdate}
            productionOrderData={productionOrderData}
            materialNames={materialNames}
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
