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
import { useNavigate } from 'react-router-dom'
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

export default function EditQualityCheckForm ({
  setUpdate,
  qualityCheckData,
  products,
  batches
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const navigate = useNavigate()
  const handleClose = () => setOpen(false)
  const formattedDate = qualityCheckData.inspectionDate
    ? new Date(qualityCheckData.inspectionDate).toISOString().split('T')[0]
    : ''
  const [formData, setFormData] = useState({
    authPassword: '',
    qualityCheckId: qualityCheckData.qualityCheckId,
    batchNumber: qualityCheckData.batchNumber,
    materialName: qualityCheckData.materialName,
    materialCode: qualityCheckData.materialCode,
    inspectionDate: formattedDate,
    inspectorName: qualityCheckData.inspectorName,
    qualityStatus: qualityCheckData.qualityStatus,
    comments: qualityCheckData.comments
  })
  const [errors, setErrors] = useState({})


  const handleMaterialChange = event => {
    const selectedMaterial = event.target.value
    const isSelectedMaterial = batches.find(
      batch => selectedMaterial === batch.materialName
    )

    if (isSelectedMaterial) {
      setFormData({
        ...formData,
        materialName: selectedMaterial,
        batchNumber: isSelectedMaterial.batchNumber,
        materialCode: isSelectedMaterial.materialCode
      })
    }
  }

  const handleMaterialCodeChange = event => {
    const selectedMaterialCode = event.target.value
    const isSelectedMaterialCode = batches.find(
      batch => selectedMaterialCode === batch.materialCode
    )

    if (isSelectedMaterialCode) {
      setFormData({
        ...formData,
        materialCode: selectedMaterialCode,
        batchNumber: isSelectedMaterialCode.batchNumber,
        materialName: isSelectedMaterialCode.materialName
      })
    }
  }

  const handleBatchChange = event => {
    const selectedBatch = event.target.value
    const isSelectedBatch = batches.find(
      batch => selectedBatch === batch.batchNumber
    )

    if (isSelectedBatch) {
      setFormData({
        ...formData,
        materialName: isSelectedBatch.materialName,
        batchNumber: selectedBatch,
        materialCode: isSelectedMaterial.materialCode
      })
    }
  }
  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    if (!formData.batchNumber)
      newErrors.batchNumber = 'Batch Number is required'
    if (!formData.materialName)
      newErrors.materialName = 'Material Name is required'

          if (!formData.materialCode)
      newErrors.materialCode = 'material Code is required'
    if (!formData.inspectionDate)
      newErrors.inspectionDate = 'Inspection Date is required'
    if (!formData.inspectorName)
      newErrors.inspectorName = 'Inspector Name is required'
    if (!formData.qualityStatus)
      newErrors.qualityStatus = 'Quality Status is required'
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
      const result = await axiosInstance
        .put('/editQualityCheck', formData)
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            qualityCheckId: '',
            batchNumber: '',
            materialCode:'',
            materialName: '',
            inspectionDate: '',
            inspectorName: '',
            qualityStatus: '',
            comments: ''
          })
          setUpdate(prev => !prev)
        })
        .catch(err => {
          toast.error(err.response.data.message)
          console.error(
            'Error occured in editing quality check in client side',
            err.message
          )
        })
    } catch (err) {
      console.error(
        'Error occured in editing quality check in client side',
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
                Edit Quality Check Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Quality Check Management
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
                    select
                    label='Material Name'
                    name='materialName'
                    value={formData.materialName}
                    onChange={handleMaterialChange}
                    error={!!errors.materialName}
                    helperText={errors.materialName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {batches.map((batch, index) => (
                      <MenuItem key={index} value={batch.materialName}>
                        {batch.materialName}
                      </MenuItem>
                    ))}

                    {/* This item only triggers navigation, not a form selection */}
                    <MenuItem
                      onClick={() => navigate('/vendor-stock-management/current-stock')}
                      sx={{ fontStyle: 'italic' }} // Optional styling
                    >
                      Add New Material In Current Stock +
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label='Material Code'
                    name='materialCode'
                    value={formData.materialCode}
                    onChange={handleMaterialCodeChange}
                    error={!!errors.materialCode}
                    helperText={errors.materialCode}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {batches.map((batch, index) => (
                      <MenuItem key={index} value={batch.materialCode}>
                        {batch.materialCode}
                      </MenuItem>
                    ))}

                    {/* This item only triggers navigation, not a form selection */}
                    <MenuItem
                      onClick={() => navigate('/vendor-stock-management/current-stock')}
                      sx={{ fontStyle: 'italic' }} // Optional styling
                    >
                      Add New Material Code +
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label='Batch Number'
                    name='batchNumber'
                    value={formData.batchNumber}
                    onChange={handleBatchChange}
                    error={!!errors.batchNumber}
                    helperText={errors.batchNumber}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {batches.map((batch, index) => (
                      <MenuItem key={index} value={batch.batchNumber}>
                        {batch.batchNumber}
                      </MenuItem>
                    ))}

                    {/* This item only triggers navigation, not a form selection */}
                    <MenuItem
                      onClick={() => navigate('/vendor-stock-management/current-stock')}
                      sx={{ fontStyle: 'italic' }} // Optional styling
                    >
                      Add New Batch +
                    </MenuItem>
                  </TextField>
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
                    select
                    label='Quality Status'
                    name='qualityStatus'
                    value={formData.qualityStatus}
                    onChange={handleChange}
                    error={!!errors.qualityStatus}
                    helperText={errors.qualityStatus}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    <MenuItem value='Accepted' sx={{ color: 'green' }}>
                      Accepted
                    </MenuItem>

                    <MenuItem sx={{ color: 'red' }} value='Rejected'>
                      Rejected
                    </MenuItem>
                    {/* <MenuItem sx={{ color: 'purple' }} value='Quarantine'>
                      Quarantine
                    </MenuItem> */}
                  </TextField>
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
