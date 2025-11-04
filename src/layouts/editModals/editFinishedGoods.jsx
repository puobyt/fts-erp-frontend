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

export default function EditFinishedGoodsForm({ setUpdate, finishedGoodsData }) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedDate = finishedGoodsData.productionDate
    ? new Date(finishedGoodsData.productionDate).toISOString().split('T')[0]
    : ''
  const [formData, setFormData] = useState({
    authPassword: '',
    finishedGoodsId: finishedGoodsData.finishedGoodsId,
    finishedGoodsName: finishedGoodsData.finishedGoodsName,
    batchNumber: finishedGoodsData.batchNumber,
    productionDate: formattedDate,
    quantityProduced: finishedGoodsData.quantityProduced
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    if (!formData.finishedGoodsName)
      newErrors.finishedGoodsName = 'Finished Goods Name is required'
    if (!formData.batchNumber)
      newErrors.batchNumber = 'Batch Number is required'
    if (!formData.productionDate)
      newErrors.productionDate = 'Production Date is required'
    if (!formData.quantityProduced)
      newErrors.quantityProduced = 'Quantity Produced is required'

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
      const result = await axiosInstance.put('/editFinishedGoods', { ...formData, editedBy: adminData.email })
        .then((result) => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            finishedGoodsId: '',
            finishedGoodsName: '',
            batchNumber: '',
            productionDate: '',
            quantityProduced: ''
          })
          setUpdate(prev => !prev)
        }).catch((err) => {
          toast.error(err.response.data.message)
          console.error(
            'Error occured in editing finished goods in client side',
            err.message
          )
        })
    } catch (err) {
      console.error(
        'Error occured in editing finished goods in client side',
        err.message
      )
    }
  }
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      <MenuItem onClick={handleOpen}>
        <Iconify icon='solar:pen-bold' />
        Edit
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        onKeyDown={(e) => e.stopPropagation()}  // Add this

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
            sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 2 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component='h1'
                variant='h5'
                fontWeight='bold'
                color='primary'
                gutterBottom
              >
                Edit Finished Goods Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Finished Goods Management
              </Typography>
            </Box>
            <Box component='form' onSubmit={handleSubmit}>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Authorization Password'
                    name='authPassword'
                    type='password'
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
                    label='Finished Goods Name'
                    name='finishedGoodsName'
                    value={formData.finishedGoodsName}
                    onChange={handleChange}
                    error={!!errors.finishedGoodsName}
                    helperText={errors.finishedGoodsName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
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
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Production Date'
                    name='productionDate'
                    type='date'
                    value={formData.productionDate}
                    onChange={handleChange}
                    error={!!errors.productionDate}
                    helperText={errors.productionDate}
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
                    label='Quantity Produced'
                    name='quantityProduced'
                    value={formData.quantityProduced}
                    onChange={handleChange}
                    error={!!errors.quantityProduced}
                    helperText={errors.quantityProduced}
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
