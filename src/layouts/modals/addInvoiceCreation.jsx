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
import { useNavigate } from 'react-router-dom'
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

export default function InvoiceCreationForm ({ setUpdate,itemNames }) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    invoiceNumber: '',
    customerId: '',
    invoiceDate: '',
    customerName: '',
    customerAddress: '',
    itemName: '',
    quantity: '',
    price: '',
    invoicePreparedBy:''
  })
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {}
    // if (!formData.invoiceNumber)
    //   newErrors.invoiceNumber = 'Invoice Number is required'
    if (!formData.invoiceDate)
      newErrors.invoiceDate = 'Invoice Date is required'
    if (!formData.customerName)
      newErrors.customerName = 'Customer Name is required'
    if (!formData.customerAddress)
      newErrors.customerAddress = 'Customer Address is required'
    if (!formData.itemName) newErrors.itemName = 'Item Name is required'
    if (!formData.quantity) {
      newErrors.quantity = 'Quantity is required'
    } else if (!/^\d+$/.test(formData.quantity)) {
      newErrors.quantity = 'Quantity must be a number only'
    }
    if (!formData.price) newErrors.price = 'Price is required'
      if (!formData.invoicePreparedBy)
      newErrors.invoicePreparedBy = 'Invoice Prepared By is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if there are no errors
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async e => {
    e.preventDefault()

    // if (!validateForm()) {
    //   return
    // }
    try {
      const result = await axiosInstance
        .post('/newInvoiceCreation', {...formData, createdBy: adminData.email})
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            invoiceNumber: '',
            customerId: '',
            invoiceDate: '',
            customerName: '',
            customerAddress: '',
            itemName: '',
            quantity: '',
            price: '',
             invoicePreparedBy:''
          })
          setUpdate(prev => !prev)
        })
        .catch(err => {
          toast.error(err.response.data.message)
          console.error(
            'Error occured in adding invoice creation client side',
            err.message
          )
        })
    } catch (err) {
      console.error(
        'Error occured in adding invoice creation client side',
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
        New Invoice Creation
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

        <Container maxWidth='lg' sx={{ mt: 8 }}>
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
                Add New Invoice Creation
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Invoice Creation Management
              </Typography>
            </Box>
            <Box component='form' onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Invoice Number'
                    name='invoiceNumber'
                    value={formData.invoiceNumber}
                    onChange={handleChange}
                    error={!!errors.invoiceNumber}
                    helperText={errors.invoiceNumber}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 },placeholder:'Auto-Generate' }}
                    InputLabelProps={{
                        shrink: true
                      }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='customer ID'
                    name='customerId'
                    value={formData.customerId}
                    onChange={handleChange}
                    error={!!errors.customerId}
                    helperText={errors.customerId}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 },placeholder:'Auto-Generate' }}
                    InputLabelProps={{
                        shrink: true
                      }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Invoice Date'
                    name='invoiceDate'
                    type='date'
                    value={formData.invoiceDate}
                    onChange={handleChange}
                    error={!!errors.invoiceDate}
                    helperText={errors.invoiceDate}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                        shrink: true
                      }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Customer Name'
                    name='customerName'
                    value={formData.customerName}
                    onChange={handleChange}
                    error={!!errors.customerName}
                    helperText={errors.customerName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Customer Address'
                    name='customerAddress'
                    value={formData.customerAddress}
                    onChange={handleChange}
                    error={!!errors.customerAddress}
                    helperText={errors.customerAddress}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    fullWidth
                    select
                    label='Item Name'
                    name='itemName'
                    value={formData.itemName}
                    onChange={handleChange}
                    error={!!errors.itemName}
                    helperText={errors.itemName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {itemNames.map((itemName, index) => (
                      <MenuItem key={index} value={itemName}>
                        {itemName}
                      </MenuItem>
                    ))}

                    <MenuItem
                      onClick={() => navigate('/finished-goods-invoicing/finished-goods')}
                      sx={{ fontStyle: 'italic' }} 
                    >
                      Add New ItemName +
                    </MenuItem>
                  </TextField>
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
                    label='Price'
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
                    label='Invoice Prepared By:'
                    name='invoicePreparedBy'
                    value={formData.invoicePreparedBy}
                    onChange={handleChange}
                    error={!!errors.invoicePreparedBy}
                    helperText={errors.invoicePreparedBy}
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
