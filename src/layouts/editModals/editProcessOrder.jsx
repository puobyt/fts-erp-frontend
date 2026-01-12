import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import axiosInstance from 'src/configs/axiosInstance'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../../global.css'
import { TextField, Container, MenuItem, Grid, Paper } from '@mui/material'

export default function EditProcessOrderForm ({ setUpdate, processOrderData }) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [open, setOpen] = useState(false)
  const [dropDownItems, setDropDownItems] = useState([])

  const handleOpen = async () => {
    setOpen(true)
    if (dropDownItems.length <= 0) {
      const items = await axiosInstance.get('/mainStock')
      if (items?.data?.data && items?.data?.data.length > 0) {
        const updatedItems = items?.data?.data.map((item) => ({
          label: item.materialName,
          materialCode: item.materialCode,
          batchNumber: item.batchNumber,
          storageLocation: item.storageLocation
        }))
        setDropDownItems(updatedItems)
      }
    }
  }

  const navigate = useNavigate()
  const handleClose = () => setOpen(false)
  
  // formatted dates
  const formattedStartDate = processOrderData.startDate ? processOrderData.startDate.split('-').reverse().join('-') : '';
  const formattedEndDate = processOrderData.finishDate ? processOrderData.finishDate.split('-').reverse().join('-') : '';

  const [formData, setFormData] = useState({
    authPassword: '',
    processOrderId: processOrderData.processOrderId,
    processOrderNumber: processOrderData.processOrderNumber,
    plant: processOrderData.plant,
    equipment: processOrderData.equipment,
    startDate: formattedStartDate,
    finishDate: formattedEndDate,
    productName: processOrderData.productName,
    productCode: processOrderData.productCode,
    batchNumber: processOrderData.batchNumber,
    orderQuantity: processOrderData.orderQuantity,
    unit: processOrderData.unit || '',
    materialInput: processOrderData.materialInput || []
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    if (!formData.processOrderNumber)
      newErrors.processOrderNumber = 'Process Order is required'
    if (!formData.productName)
      newErrors.productName = 'Product Name is required'
    // if (!formData.description)
    //   newErrors.description = 'Product Description is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if there are no errors
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target
    const selectedItem = dropDownItems.find(item => item.materialCode === value)

    const updatedMaterials = [...formData.materialInput]
    updatedMaterials[index][name] = value

    if (selectedItem) {
      updatedMaterials[index]['batch'] = selectedItem?.batchNumber || ''
      updatedMaterials[index]['storageLocation'] = selectedItem?.storageLocation || ''
    }

    setFormData({ ...formData, materialInput: updatedMaterials })
  }

  const addMaterial = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      materialInput: [
        ...prevFormData.materialInput,
        { materialCode: '', quantity: '', unit: '', batch: '', storageLocation: '' }
      ]
    }))
  }

  const removeMaterial = index => {
    const updatedMaterials = formData.materialInput.filter(
      (_, i) => i !== index
    )
    setFormData({ ...formData, materialInput: updatedMaterials })
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      const result = await axiosInstance.put('/editProcessOrder', {...formData, editedBy: adminData.email})
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message)
      console.error(
        'Error occured in editing process order',
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
        onKeyDown={(e) => e.stopPropagation()}
      >
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
                Edit Process Order
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Process order Management
              </Typography>
            </Box>
            <Box
              component='form'
              onSubmit={handleSubmit}
              sx={{
                maxHeight: '65vh',
                overflowY: 'auto',
                paddingRight: 2
              }}
            >
              <Grid container spacing={2} >
                <Grid item xs={6} sx={{ mt: 2 }}>
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
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Process Order Number'
                    name='processOrderNumber'
                    value={formData.processOrderNumber}
                    onChange={handleChange}
                    error={!!errors.processOrderNumber}
                    helperText={errors.processOrderNumber}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Plant'
                    name='plant'
                    value={formData.plant}
                    onChange={handleChange}
                    error={!!errors.plant}
                    helperText={errors.plant}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Equipment'
                    name='equipment'
                    value={formData.equipment}
                    onChange={handleChange}
                    error={!!errors.equipment}
                    helperText={errors.equipment}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    type='date'
                    label='Start Date'
                    name='startDate'
                    value={formData.startDate}
                    onChange={handleChange}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
                    variant='outlined'
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Finish Date'
                    type='date'
                    name='finishDate'
                    value={formData.finishDate}
                    onChange={handleChange}
                    error={!!errors.finishDate}
                    helperText={errors.finishDate}
                    variant='outlined'
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Product Code'
                    name='productCode'
                    value={formData.productCode}
                    onChange={handleChange}
                    error={!!errors.productCode}
                    helperText={errors.productCode}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Product Name'
                    name='productName'
                    value={formData.productName}
                    onChange={handleChange}
                    error={!!errors.productName}
                    helperText={errors.productName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={formData.batchNumber}
                    onChange={handleChange}
                    error={!!errors.batchNumber}
                    helperText={errors.batchNumber}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={5} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Order Quantity'
                    name='orderQuantity'
                    value={formData.orderQuantity}
                    onChange={handleChange}
                    error={!!errors.orderQuantity}
                    helperText={errors.orderQuantity}
                    variant='outlined'
                  />
                </Grid>
                <Grid item xs={1} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    select
                    label='Unit'
                    name='unit'
                    value={formData.unit}
                    onChange={handleChange}
                    error={!!errors.unit}
                    helperText={errors.unit}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {['KG', 'Gram', 'Litre', 'ML', 'Pieces'].map(unit => (
                      <MenuItem key={unit} value={unit}>
                        {unit}
                      </MenuItem>
                    ))}
                  </TextField>
                </Grid>
                
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    fontWeight='bold'
                  >
                    Material Input
                  </Typography>
                </Grid>

                {formData.materialInput.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={3}>
                      <TextField
                        select
                        fullWidth
                        label="Material Name"
                        name="materialCode"
                        value={material.materialCode || ''}
                        onChange={e => handleMaterialChange(e, index)}
                        error={!!errors.materialInput}
                        helperText={errors.materialInput}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 } }}
                      >
                        {dropDownItems.map((item, idx) => (
                          <MenuItem key={idx} value={item.materialCode}>
                            {item.label}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        label='Quantity'
                        name='quantity'
                        error={!!errors.materialInput}
                        value={material.quantity}
                        helperText={errors.materialInput}
                        onChange={e => handleMaterialChange(e, index)}
                        variant='outlined'
                        InputProps={{ style: { borderRadius: 8 } }}
                      />
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        select
                        label='Unit'
                        name='unit'
                        value={material.unit || ''}
                        onChange={e => handleMaterialChange(e, index)}
                        error={!!errors.materialInput}
                        helperText={errors.materialInput}
                        variant='outlined'
                        InputProps={{ style: { borderRadius: 8 } }}
                      >
                        {['KG', 'Gram', 'Litre', 'ML', 'Pieces'].map(unit => (
                          <MenuItem key={unit} value={unit}>
                            {unit}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        label='Batch'
                        name='batch'
                        error={!!errors.materialInput}
                        value={material.batch}
                        helperText={errors.materialInput}
                        onChange={e => handleMaterialChange(e, index)}
                        variant='outlined'
                        InputProps={{
                          style: { borderRadius: 8 }
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label='Storage Location'
                        name='storageLocation'
                        error={!!errors.materialInput}
                        value={material.storageLocation}
                        helperText={errors.materialInput}
                        onChange={e => handleMaterialChange(e, index)}
                        variant='outlined'
                        InputProps={{
                          style: { borderRadius: 8 }
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', 
                        alignItems: 'center' 
                      }}
                    >
                      <Button
                        variant='text'
                        color='error'
                        onClick={() => removeMaterial(index)}
                        size='small'
                        sx={{
                          textTransform: 'none',
                          padding: 0,
                          minWidth: 'auto'
                        }}
                      >
                        Remove
                      </Button>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={12}>
                  <Button
                    variant='contained'
                    color='primary'
                    onClick={addMaterial}
                  >
                    Add Material
                  </Button>
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
