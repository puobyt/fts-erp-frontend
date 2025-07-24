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
import { useEffect } from 'react'
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

export default function ReworkForm({ setUpdate, batches }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
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
  const [errors, setErrors] = useState({})
  const [quarentineItems, setQuarentineItems] = useState([])
  const [selectedItem, setSelectedItem] = useState({})


  const navigate = useNavigate();

  useEffect(() => {
    if (quarentineItems.length <= 0) {
      getQuarentineItems()
    }
  }, [open])

  const getQuarentineItems = async () => {
    const result = await axiosInstance.get('/get-quarantine-items')
    if (result?.data) {
      setQuarentineItems(result.data.data || [])
    }
  }
  const validateForm = () => {
    const newErrors = {}
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
    if (!formData.quantityForRework) {
      newErrors.quantityForRework = 'Quantity for rework is required';
    } else if (!/^\d+(\.\d+)?$/.test(formData.quantityForRework)) {
      newErrors.quantityForRework = 'Quantity for rework must be a valid number';
    }
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


  const handleMaterialChange = event => {
    const selectedMaterial = event.target.value
    const isSelectedMaterial = batches.find(
      batch => selectedMaterial === batch.materialName
    )

    if (isSelectedMaterial) {
      setFormData({
        ...formData,
        materialName: selectedMaterial,
        batchNumber: isSelectedMaterial.batchNumber
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
        batchNumber: selectedBatch
      })
    }
  }
  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      const result = await axiosInstance.post('/newRework', formData)
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setFormData({
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
        'Error occured in adding Rework in client side',
        err.message
      )
    }
  }

  const handleQuarentineItemSelection = (e) => {
    const value = e.target.value
    setSelectedItem(value)
    setFormData((prev) => ({
      ...prev,
      batchNumber: value.batchNumber,
      materialName: value?.productName ? value?.productName : value?.materialName,
      inspectorName: value?.inspectorName || '',
      issueDescription: value?.comments || '',
      quantityForRework: value?.quantity || ''
    }))
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
        New Rework
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
                Add New Rework
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Rework Management
              </Typography>
            </Box>
            <Box component='form' onSubmit={handleSubmit} sx={{
              maxHeight: '65vh', // Restrict height to 70% of viewport height
              overflowY: 'auto', // Enable vertical scrolling
              paddingRight: 2 // Add padding to avoid scrollbar overlap with content
            }}>
              <Grid item xs={6} sx={{ mt: 2.1 }}>
                <TextField
                  fullWidth
                  select
                  label='Quarantine Items'
                  name='quarantine'
                  value={selectedItem}
                  onChange={handleQuarentineItemSelection}
                  // error={!!errors.assignmentNumber}
                  helperText={errors.assignmentNumber}
                  variant='outlined'
                  InputProps={{
                    style: { borderRadius: 8 },
                  }}
                >
                  {(quarentineItems && quarentineItems.length > 0) && quarentineItems.map((item, index) => (
                    <MenuItem
                      key={`product-${index}`}
                      value={item}
                    >
                      {item?.productName || item?.materialName}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  {selectedItem ? (
                    <TextField
                      fullWidth
                      label='Batch Number'
                      name='batchNumber'
                      value={formData.batchNumber}
                      InputProps={{
                        readOnly: true,
                        style: { borderRadius: 8 },
                      }}
                      variant='outlined'
                      helperText='Filled from Quarantine Item'
                    />
                  ) : (
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
                      <MenuItem
                        onClick={() => navigate('/vendor-stock-management/current-stock')}
                        sx={{ fontStyle: 'italic' }}
                      >
                        Add New Batch +
                      </MenuItem>
                    </TextField>
                  )}
                </Grid>
                <Grid item xs={6}>
                  {selectedItem ? (
                    <TextField
                      fullWidth
                      label='Material Name'
                      name='materialName'
                      value={formData.materialName}
                      InputProps={{
                        readOnly: true,
                        style: { borderRadius: 8 },
                      }}
                      variant='outlined'
                      helperText='Filled from Quarantine Item'
                    />
                  ) : (
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
                      <MenuItem
                        onClick={() => navigate('/vendor-stock-management/current-stock')}
                        sx={{ fontStyle: 'italic' }}
                      >
                        Add New Material In Current Stock +
                      </MenuItem>
                    </TextField>
                  )}
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
                    select
                    label='Rework Status'
                    name='reworkStatus'
                    value={formData.reworkStatus}
                    onChange={handleChange}
                    error={!!errors.reworkStatus}
                    helperText={errors.reworkStatus}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    <MenuItem value='Accepted' sx={{ color: 'green' }}>
                      Accepted
                    </MenuItem>
                    <MenuItem sx={{ color: 'purple' }} value='Quarantine'>
                      Quarantine
                    </MenuItem>
                    <MenuItem sx={{ color: 'red' }} value='Rejected'>
                      Rejected
                    </MenuItem>
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
