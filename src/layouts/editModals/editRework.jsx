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

export default function EditReworkForm ({ setUpdate,reworkData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
    authPassword: '',
    reworkId:reworkData.reworkId,
    batchNumber:reworkData.batchNumber,
    materialName:reworkData.materialName,
    inspectionDate:reworkData.inspectionDate,
    inspectorName:reworkData.inspectorName,
    issueDescription:reworkData.issueDescription,
    proposedReworkAction:reworkData.proposedReworkAction,
    reworkStartDate:reworkData.reworkStartDate,
    reworkCompletionDate:reworkData.reworkCompletionDate,
    quantityForRework:reworkData.quantityForRework,
    reworkStatus:reworkData.reworkStatus,
    comments:reworkData.comments
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    if (!formData.batchNumber)
      newErrors.batchNumber = 'Batch Number is required'
    if (!formData.materialName)
      newErrors.materialName = 'Material Name is required'
    if (!formData.inspectionDate)
      newErrors.inspectionDate = 'Inspection Date is required'
    if (!formData.inspectorName)
      newErrors.inspectorName = 'Inspector Name is required'
    if (!formData.issueDescription)
      newErrors.issueDescription = 'Issue Description is required'
    if (!formData.proposedReworkAction)
      newErrors.proposedReworkAction = 'Proposed Rework Action is required'
    if (!formData.reworkStartDate)
      newErrors.reworkStartDate = 'Rework Start Date is required'
    if (!formData.reworkCompletionDate)
      newErrors.reworkCompletionDate = 'Rework Completio nDate is required'
    if (!formData.quantityForRework)
      newErrors.quantityForRework = 'Quantity For Rework is required'
    if (!formData.reworkStatus)
      newErrors.reworkStatus = 'Rework Status is required'
    if (!formData.comments) newErrors.comments = 'Comments is required'

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
      const result = await axiosInstance.put('/editRework', formData)
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setFormData({
          authPassword: '',
          reworkId: '',
          batchNumber: '',
          materialName: '',
          inspectionDate: '',
          inspectorName: '',
          issueDescription: '',
          proposedReworkAction: '',
          reworkStartDate: '',
          reworkCompletionDate: '',
          quantityForRework: '',
          reworkStatus: '',
          comments: ''
        })
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in editing Rework in client side',
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
                Edit New Rework Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Rework Management
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
                    label='Inspection Date'
                    name='inspectionDate'
                    type='date'
                    value={formData.inspectionDate}
                    onChange={handleChange}
                    error={!!errors.inspectionDate}
                    helperText={errors.inspectionDate}
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
                    label='Inspector Name'
                    name='inspectorName'
                    value={formData.inspectorName}
                    onChange={handleChange}
                    error={!!errors.inspectorName}
                    helperText={errors.inspectorName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Issue Description'
                    name='issueDescription'
                    value={formData.issueDescription}
                    onChange={handleChange}
                    error={!!errors.issueDescription}
                    helperText={errors.issueDescription}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Proposed Rework Action'
                    name='proposedReworkAction'
                    value={formData.proposedReworkAction}
                    onChange={handleChange}
                    error={!!errors.proposedReworkAction}
                    helperText={errors.proposedReworkAction}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Rework Start Date'
                    name='reworkStartDate'
                    type='date'
                    value={formData.reworkStartDate}
                    onChange={handleChange}
                    error={!!errors.reworkStartDate}
                    helperText={errors.reworkStartDate}
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
                    label='Rework Completion Date'
                    name='reworkCompletionDate'
                    type='date'
                    value={formData.reworkCompletionDate}
                    onChange={handleChange}
                    error={!!errors.reworkCompletionDate}
                    helperText={errors.reworkCompletionDate}
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
                    label='Quantity For Rework'
                    name='quantityForRework'
                    value={formData.quantityForRework}
                    onChange={handleChange}
                    error={!!errors.quantityForRework}
                    helperText={errors.quantityForRework}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Rework Status'
                    name='reworkStatus'
                    value={formData.reworkStatus}
                    onChange={handleChange}
                    error={!!errors.reworkStatus}
                    helperText={errors.reworkStatus}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Comments'
                    name='comments'
                    value={formData.comments}
                    onChange={handleChange}
                    error={!!errors.comments}
                    helperText={errors.comments}
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
