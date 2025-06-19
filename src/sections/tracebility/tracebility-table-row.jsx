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

export function TracebilityRow ({ setUpdate,setQC,setProduction, row, selected, onSelectRow }) {



  const handleMaterialClick = async materialCode => {
    try {
      const result = await axiosInstance.get(
        `/search/production?materialCode=${materialCode}`
      ) 
      console.log("RESULT",result)
      if (result && result.data.productionData) {
        console.log('result for production',result.data.productionData)
        console.log('result for QC ',result.data.qcDetails)
        setProduction(result.data.productionData)
        if(result.data.qcDetails){
          setQC(result.data.qcDetails);
        }
      
      }
      
      else {
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
  const handleRowClick=()=>{
    if(row.qcDetails)
    {
      props.setQc(row.qcDetails)
    }
    else if(row.qcData)
    {
      props.setQc(row.qcData)
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
        <TableCell>
          <Link
            component='button'
            onClick={() => handleMaterialClick(row.materialCode)}
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
            {row.materialCode}
          </Link>
        </TableCell>
        <TableCell> {row.materialName}</TableCell>
        <TableCell>{row.batchNumber}</TableCell>
        <TableCell>{`${row.quantity} KG`}</TableCell>
        <TableCell
          style={{ whiteSpace: 'nowrap' }}
        >{`₹ ${row.price}`}</TableCell>
        <TableCell>{row.storageLocation}</TableCell>
        <TableCell>{row.vendorName}</TableCell>
        <TableCell>{new Date(row.dateRecieved).toLocaleDateString()}</TableCell>
        <TableCell>{new Date(row.expiryDate).toLocaleDateString()}</TableCell>

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
