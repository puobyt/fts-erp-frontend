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
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  FormLabel
} from '@mui/material'
import '../../global.css'
import { TextField, Container, MenuItem, Grid, Paper } from '@mui/material'
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

export default function MainStockForm ({
  setUpdate,
  purchaseOrderData,
  materials
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [batchNumberType, setBatchNumberType] = useState('')
  const [formData, setFormData] = useState({
    materialName: '',
    materialCode: '',
    quantity: '',
    price: '',
    storageLocation: '',
    vendorName: '',
    dateRecieved: '',
    expiryDate: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.materialName)
      newErrors.materialName = 'Material Name is required'
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required'
    } else if (!/^\d+(\.\d+)?$/.test(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a valid number'
    }
    if (!formData.materialCode)
      newErrors.materialCode = 'Material Code is required'
    if (batchNumberType == 'manual') {
      if (!formData.batchNumber)
        newErrors.batchNumber = 'Batch Number is required'
    }
    if (!batchNumberType) {
      newErrors.batchNumberType = 'Please select a batch number type'
    }
    if (!formData.price) newErrors.price = 'Price is required'
    if (!formData.storageLocation)
      newErrors.storageLocation = 'Storage Location is required'
    if (!formData.vendorName) newErrors.vendorName = 'Vendor Name is required'
    if (!formData.dateRecieved)
      newErrors.dateRecieved = 'Date Recieved is required'
    if (!formData.expiryDate) newErrors.expiryDate = 'Expiry is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if there are no errors
  }

  const handleRadioChange = event => {
    setBatchNumberType(event.target.value)
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
      const result = await axiosInstance.post('/newMainStock', formData)
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setFormData({
          materialName: '',
          materialCode: '',
          quantity: '',
          price: '',
          storageLocation: '',
          vendorName: '',
          dateRecieved: '',
          expiryDate: ''
        })
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in adding Current stock in client side',
        err.message
      )
    }
  }
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      <Button
        onClick={handleOpen}
        variant='contained'
        color='inherit'
        startIcon={<Iconify icon='mingcute:add-line' />}
      >
        New Main Stock
      </Button>
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
                Add New Main Stock
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Current Stock Management
              </Typography>
            </Box>
            <Box component='form' onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl error={!!errors.batchNumberType}>
                    <FormLabel>Batch Number Type</FormLabel>
                    <RadioGroup
                      row
                      name='batchNumberType'
                      value={formData.batchNumberType}
                      onChange={handleRadioChange}
                    >
                      <FormControlLabel
                        value='manual'
                        control={<Radio />}
                        label='Manual Batch Number'
                      />
                      <FormControlLabel
                        value='automated'
                        control={<Radio />}
                        label='Automated Batch Number'
                      />
                    </RadioGroup>
                    {errors.batchNumberType && (
                      <Typography variant='body2' color='error'>
                        {errors.batchNumberType}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material Name'
                    name='materialName'
                    value={formData.materialName}
                    onChange={handleChange}
                    error={!!errors.materialName}
                    helperText={errors.materialName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material Code'
                    name='materialCode'
                    value={formData.materialCode}
                    onChange={handleChange}
                    error={!!errors.materialCode}
                    helperText={errors.materialCode}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 }
                    }}
                
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={formData.batchNumber}
                    onChange={handleChange}
                    error={!!errors.batchNumber}
                    helperText={errors.batchNumber}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 }
                    }}
                    disabled={batchNumberType !== 'manual'}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quantity In KG'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Price/Kg'
                    name='price'
                    value={formData.price}
                    onChange={handleChange}
                    error={!!errors.price}
                    helperText={errors.price}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Storage Location'
                    name='storageLocation'
                    value={formData.storageLocation}
                    onChange={handleChange}
                    error={!!errors.storageLocation}
                    helperText={errors.storageLocation}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vendor Name'
                    name='vendorName'
                    value={formData.vendorName}
                    onChange={handleChange}
                    error={!!errors.vendorName}
                    helperText={errors.vendorName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Date Recieved'
                    name='dateRecieved'
                    type='date'
                    value={formData.dateRecieved}
                    onChange={handleChange}
                    error={!!errors.dateRecieved}
                    helperText={errors.dateRecieved}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true // Keeps the label above the field to avoid overlap
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Expiry'
                    name='expiryDate'
                    type='date'
                    value={formData.expiryDate}
                    onChange={handleChange}
                    error={!!errors.expiryDate}
                    helperText={errors.expiryDate}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true // Keeps the label above the field to avoid overlap
                    }}
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
