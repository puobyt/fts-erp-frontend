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
import { useNavigate } from 'react-router-dom'

import axios from 'axios'
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

export default function QualityInspectionForm({ setUpdate, productNames }) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const navigate = useNavigate();
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
    inspectionNumber: '',
    productName: '',
    inspectionResults: '',
    date: '',
    batchNumber: '',
    quantity: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    // if (!formData.inspectionNumber) newErrors.inspectionNumber = 'Inspection Number is required';
    if (!formData.productName)
      newErrors.productName = 'Product Name is required'
    if (!formData.inspectionResults)
      newErrors.inspectionResults = 'Inspection Results is required'
    if (!formData.date)
      newErrors.date = 'Date is required'
    if (!formData.batchNumber)
      newErrors.batchNumber = 'Batch Number is required'
    if (!formData.quantity)
      newErrors.quantity = 'Quantity is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if there are no errors
  }

  const handleChange = e => {
    const { name, value } = e.target

    const selectedItem = productNames.find((item) => item.productName === value)
    if (selectedItem) {
      setFormData(prev => ({ ...prev, [name]: value, batchNumber: selectedItem.batchNumber }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      const result = await axiosInstance.post('/newQualityInspection', {...formData, createdBy: adminData.email})
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setFormData({
          inspectionNumber: '',
          productName: '',
          inspectionResults: '',
          date: '',
          batchNumber: '',
          quantity: ''
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
        New Quality Inspection
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
                Add New Quality Inspection
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Quality Inspection Management
              </Typography>
            </Box>
            <Box component='form' onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label='Product Name'
                    name='productName'
                    value={formData.productName}
                    onChange={handleChange}
                    error={!!errors.productName}
                    helperText={errors.productName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {productNames.map((item, index) => (
                      <MenuItem key={index} value={item.productName}>
                        {item.productName}
                      </MenuItem>
                    ))}

                    <MenuItem
                      onClick={() => navigate('/production-workflow/production-order-creation-output')}
                      sx={{ fontStyle: 'italic' }}
                    >
                      Create New Product +
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Inspection Number'
                    name='inspectionNumber'
                    value={formData.inspectionNumber}
                    onChange={handleChange}
                    error={!!errors.inspectionNumber}
                    helperText={errors.inspectionNumber}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 },
                      placeholder: 'Auto-Generate'
                    }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label='Inspection Results'
                    name='inspectionResults'
                    value={formData.inspectionResults}
                    onChange={handleChange}
                    error={!!errors.inspectionResults}
                    helperText={errors.inspectionResults}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    <MenuItem value='Accepted' sx={{ color: 'green' }}>
                      Accepted
                    </MenuItem>

                    <MenuItem sx={{ color: 'purple' }} value='Quarantine'>
                      Quarantine
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Date'
                    name='date'
                    type='date'
                    value={formData.date}
                    onChange={handleChange}
                    error={!!errors.date}
                    helperText={errors.date}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 },

                    }}
                    InputLabelProps={{
                      shrink: true
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
                      style: { borderRadius: 8 },

                    }}

                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quantity'
                    name='quantity'
                    value={formData.quantity}
                    onChange={handleChange}
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 },

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
