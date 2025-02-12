import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Input } from '@nextui-org/react'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import '../../global.css'
import { TextField, Container, Grid, Paper, MenuItem } from '@mui/material'
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function EditVendorManagementForm ({ setUpdate, vendorData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
    authPassword: '',
    vendorId: vendorData.vendorId,
    nameOfTheFirm: vendorData.nameOfTheFirm,
    address: vendorData.address,
    contactNumber: vendorData.contactNumber,
    contactPersonName: vendorData.contactPersonName,
    contactPersonDetails: vendorData.contactPersonDetails,
    material: vendorData.material,
    bankDetails: vendorData.bankDetails,
    pan: vendorData.pan,
    gst: vendorData.gst
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    if (!formData.nameOfTheFirm)
      newErrors.nameOfTheFirm = 'Name of the Firm is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact Number is required'
    if (!formData.contactPersonName)
      newErrors.contactPersonName = 'Contact Person Name is required'
    if (!formData.contactPersonDetails)
      newErrors.contactPersonDetails = 'Contact Person Details are required'
    if (!formData.material) newErrors.material = 'Material is required'
    if (!formData.bankDetails)
      newErrors.bankDetails = 'Bank Details are required'
    if (!formData.pan) newErrors.pan = 'PAN is required'
    if (!formData.gst) newErrors.gst = 'GST is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if there are no errors
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      await axiosInstance
        .put('/editVendorManagmenent', formData)
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            vendorId: '',
            nameOfTheFirm: '',
            address: '',
            contactNumber: '',
            contactPersonName: '',
            contactPersonDetails: '',
            material: '',
            bankDetails: '',
            pan: '',
            gst: ''
          })
          setUpdate(prev => !prev)
        })
        .catch(err => {
          toast.error(err.response.data.message)
          // console.log('catchErro', err)
          console.error(
            'Error occured in editing vendor management client side',
            err.message
          )
        })
    } catch (err) {
      toast.error(err.response.data.message)
      console.error(
        'Error occured in editing vendor management client side',
        err.message
      )
    }
  }
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      {/* <Button
           
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
         New Vendor Management
        </Button> */}
      <MenuItem onClick={handleOpen}>
        <Iconify icon='solar:pen-bold' />
        Edit
      </MenuItem>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        {/* <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box> */}

        <Container maxWidth='sm' sx={{ mt: 8 }}>
          <Paper
            elevation={4}
            sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 3 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component='h1'
                variant='h5'
                fontWeight='bold'
                color='primary'
                gutterBottom
              >
                Edit Vendor Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Vendor Management
              </Typography>
            </Box>
            <Box component='form' onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Authorization Password'
                    type='password'
                    name='authPassword'
                    value={formData.authPassword}
                    onChange={handleChange}
                    error={!!errors.authPassword}
                    helperText={errors.authPassword}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Name Of The Firm'
                    name='nameOfTheFirm'
                    value={formData.nameOfTheFirm}
                    onChange={handleChange}
                    error={!!errors.nameOfTheFirm}
                    helperText={errors.nameOfTheFirm}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Number'
                    name='contactNumber'
                    value={formData.contactNumber}
                    onChange={handleChange}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Name'
                    name='contactPersonName'
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    error={!!errors.contactPersonName}
                    helperText={errors.contactPersonName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Details'
                    name='contactPersonDetails'
                    value={formData.contactPersonDetails}
                    onChange={handleChange}
                    error={!!errors.contactPersonDetails}
                    helperText={errors.contactPersonDetails}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material'
                    name='material'
                    value={formData.material}
                    onChange={handleChange}
                    error={!!errors.material}
                    helperText={errors.material}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Bank Details'
                    name='bankDetails'
                    value={formData.bankDetails}
                    onChange={handleChange}
                    error={!!errors.bankDetails}
                    helperText={errors.bankDetails}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Pan'
                    name='pan'
                    value={formData.pan}
                    onChange={handleChange}
                    error={!!errors.pan}
                    helperText={errors.pan}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='GST'
                    name='gst'
                    value={formData.gst}
                    onChange={handleChange}
                    error={!!errors.gst}
                    helperText={errors.gst}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
              </Grid>
              <Button
                type='submit'
                fullWidth
                variant='contained'
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 8,
                  background: 'linear-gradient(90deg, #4a90e2, #3b5998)',
                  color: 'white',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                    background: 'linear-gradient(90deg, #3b5998, #4a90e2)'
                  }
                }}
              >
                Submit
              </Button>
            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  )
}
