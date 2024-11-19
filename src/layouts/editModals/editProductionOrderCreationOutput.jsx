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

export default function EditProductionOrderCreationOutputForm ({
  setUpdate,
  productionOrderOutputData
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedDate = productionOrderOutputData.productionCompletionDate
    ? new Date(productionOrderOutputData.productionCompletionDate)
        .toISOString()
        .split('T')[0]
    : ''
  const [formData, setFormData] = useState({
    authPassword: '',
    productionOrderoutputId: productionOrderOutputData.productionOrderoutputId,
    producedQuantity: productionOrderOutputData.producedQuantity,
    productionCompletionDate: formattedDate,
    // qualityCheckStatus: productionOrderOutputData.qualityCheckStatus,
    storageLocationforOutput:
      productionOrderOutputData.storageLocationforOutput,
    batchNumberforOutput: productionOrderOutputData.batchNumberforOutput,
    productionNotes: productionOrderOutputData.productionNotes,
    Yield: productionOrderOutputData.Yield,
    outputQualityRating: productionOrderOutputData.outputQualityRating,
    outputHandlingInstructions:
      productionOrderOutputData.outputHandlingInstructions
  })

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    if (!formData.producedQuantity)
      newErrors.producedQuantity = 'Produced Quantity is required'
    if (!formData.productionCompletionDate)
      newErrors.productionCompletionDate =
        'Production Completion Date is required'
    // if (!formData.qualityCheckStatus)
    //   newErrors.qualityCheckStatus = 'Quality Check status is required'
    if (!formData.storageLocationforOutput)
      newErrors.storageLocationforOutput =
        'Storage Location for Output is required'
    // if (!formData.batchNumberforOutput)
    //   newErrors.batchNumberforOutput = 'Batch Number for Output is required'
    if (!formData.productionNotes)
      newErrors.productionNotes = 'Production Notes is required'
    if (!formData.Yield) newErrors.Yield = 'Yield is required'
    if (!formData.outputQualityRating)
      newErrors.outputQualityRating = 'Output Quality Rating is required'
    if (!formData.outputHandlingInstructions)
      newErrors.outputHandlingInstructions =
        'Output Handling Instructions is required'

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
        .put('/editProductionOrderCreationOutput', formData)
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            productionOrderOutputId: '',
            producedQuantity: '',
            productionCompletionDate: '',
            // qualityCheckStatus: '',
            storageLocationforOutput: '',
            batchNumberforOutput: '',
            productionNotes: '',
            Yield: '',
            outputQualityRating: '',
            outputHandlingInstructions: ''
          })
          setUpdate(prev => !prev)
        })
        .catch(err => {
          toast.error(err.response.data.message)
          console.error(
            'Error occured in editing production order in client side',
            err.message
          )
        })
    } catch (err) {
      console.error(
        'Error occured in editing production orderin client side',
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
                Edit Production Order Creation Output Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Production Order Creation Management
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
                    label='Produced Quantity'
                    name='producedQuantity'
                    value={formData.producedQuantity}
                    onChange={handleChange}
                    error={!!errors.producedQuantity}
                    helperText={errors.producedQuantity}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Production Completion Date'
                    name='productionCompletionDate'
                    type='date'
                    value={formData.productionCompletionDate}
                    onChange={handleChange}
                    error={!!errors.productionCompletionDate}
                    helperText={errors.productionCompletionDate}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quality Check Status'
                    name='qualityCheckStatus'
                    value={formData.qualityCheckStatus}
                    onChange={handleChange}
                    error={!!errors.qualityCheckStatus}
                    helperText={errors.qualityCheckStatus}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid> */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Storage Location for Output'
                    name='storageLocationforOutput'
                    value={formData.storageLocationforOutput}
                    onChange={handleChange}
                    error={!!errors.storageLocationforOutput}
                    helperText={errors.storageLocationforOutput}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch Number for Output'
                    name='batchNumberforOutput'
                    value={formData.batchNumberforOutput}
                    onChange={handleChange}
                    error={!!errors.batchNumberforOutput}
                    helperText={errors.batchNumberforOutput}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 },
                      placeholder: 'Auto-Generate' 
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Production Notes'
                    name='productionNotes'
                    value={formData.productionNotes}
                    onChange={handleChange}
                    error={!!errors.productionNotes}
                    helperText={errors.productionNotes}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Yield'
                    name='Yield'
                    value={formData.Yield}
                    onChange={handleChange}
                    error={!!errors.Yield}
                    helperText={errors.Yield}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Output Quality Rating'
                    name='outputQualityRating'
                    value={formData.outputQualityRating}
                    onChange={handleChange}
                    error={!!errors.outputQualityRating}
                    helperText={errors.outputQualityRating}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Output Handling Instructions'
                    name='outputHandlingInstructions'
                    value={formData.outputHandlingInstructions}
                    onChange={handleChange}
                    error={!!errors.outputHandlingInstructions}
                    helperText={errors.outputHandlingInstructions}
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
