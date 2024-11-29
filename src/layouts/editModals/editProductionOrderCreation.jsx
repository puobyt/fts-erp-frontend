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

export default function EditProductionOrderCreationForm ({
  setUpdate,
  productionOrderData,
  materialNames
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedStartDate = productionOrderData.startDate
    ? new Date(productionOrderData.startDate).toISOString().split('T')[0]
    : ''
  const formattedEndDate = productionOrderData.endDate
    ? new Date(productionOrderData.endDate).toISOString().split('T')[0]
    : ''
  const [formData, setFormData] = useState({
    authPassword: '',
    productionOrderId: productionOrderData.productionOrderId,
    processOrder: productionOrderData.processOrder,
    plant: productionOrderData.plant,
    productDescription: productionOrderData.productDescription,
    productName: productionOrderData.productName,
    batch: productionOrderData.batch,
    materials: productionOrderData.materials,
    instructions: productionOrderData.instructions,
    startDate: formattedStartDate,
    endDate: formattedEndDate
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    // if (!formData.processOrder)
    //   newErrors.processOrder = 'Process Order is required'
    if (!formData.plant) newErrors.plant = 'Plant is required'
    if (!formData.productName) newErrors.productName = 'ProductName is required'
    if (!formData.productDescription)
      newErrors.productDescription = 'Product Description is required'
    if (!formData.batch) newErrors.batch = 'Batch is required'
    if (
      formData.materials.some(
        mat => !mat.materialsList || !mat.requiredQuantity || !mat.materialCode
      )
    ) {
      newErrors.materials = 'All material fields must be filled'
    } else if (
      formData.materials.some(
        mat => !Number.isFinite(Number(mat.requiredQuantity))
      )
    ) {
      newErrors.requiredQuantity = 'Required Quantity must be a number'
    }
    if (!formData.instructions)
      newErrors.instructions = 'Instructions is required'
    if (!formData.startDate) newErrors.startDate = 'Start Date is required'
    if (!formData.endDate) newErrors.endDate = 'End Date is required'

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
        .put('/editProductionOrderCreation', formData)
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            productionOrderId: '',
            processOrder: '',
            plant: '',
            productDescription: '',
            productName: '',
            batch: '',
            materials: [
              { materialsList: '', requiredQuantity: '', materialCode: '' }
            ],
            instructions: '',
            startDate: '',
            endDate: ''
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

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target

    const updatedMaterials = [...formData.materials]
    updatedMaterials[index][name] = value

    if (name === 'materialsList') {
      const selectedMaterial = materialNames.find(
        material => material.materialName === value
      )
      updatedMaterials[index].materialCode =
        selectedMaterial?.materialCode || ''
    }

    setFormData({ ...formData, materials: updatedMaterials })
  }

  const addMaterial = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      materials: [
        ...prevFormData.materials,
        { materialsList: '', requiredQuantity: '' }
      ]
    }))
  }

  const removeMaterial = index => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index)
    setFormData({ ...formData, materials: updatedMaterials })
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
                Edit Production Order Creation Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Production Order Creation Management
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
              <Grid container spacing={2} sx={{ mt: 0.1 }}>
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Process Order'
                    name='processOrder'
                    value={formData.processOrder}
                    onChange={handleChange}
                    error={!!errors.processOrder}
                    helperText={errors.processOrder}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 },
                      placeholder: 'Auto-Generate' // Add your placeholder here
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Plant'
                    name='plant'
                    value={formData.plant}
                    onChange={handleChange}
                    error={!!errors.plant}
                    helperText={errors.plant}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <label htmlFor='description'>Product Description</label>
                    <textarea
                      id='productDescription'
                      name='productDescription'
                      value={formData.productDescription}
                      onChange={handleChange}
                      rows='6'
                      style={{
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                    {errors.productDescription && (
                      <Typography variant='body2' color='error'>
                        {errors.productDescription}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                {formData.materials.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        select
                        label='Materials List'
                        name='materialsList'
                        value={material.materialsList}
                        onChange={e => handleMaterialChange(e, index)}
                        error={!!errors.materials}
                        helperText={errors.materials}
                        variant='outlined'
                        InputProps={{ style: { borderRadius: 8 } }}
                      >
                        {materialNames.map((material, index) => (
                          <MenuItem key={index} value={material.materialName}>
                            {material.materialName}
                          </MenuItem>
                        ))}

                        {/* This item only triggers navigation, not a form selection */}
                        <MenuItem
                          onClick={() => navigate('/main-stock')}
                          sx={{ fontStyle: 'italic' }} // Optional styling
                        >
                          Add New materialName +
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label='Required Quantity In KG'
                        name='requiredQuantity'
                        error={!!errors.requiredQuantity}
                        value={material.requiredQuantity}
                        helperText={errors.requiredQuantity}
                        onChange={e => handleMaterialChange(e, index)}
                        variant='outlined'
                        InputProps={{ style: { borderRadius: 8 } }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label='Material Code'
                        name='materialCode'
                        error={!!errors.materials}
                        value={material.materialCode}
                        helperText={errors.materials}
                        onChange={e => handleMaterialChange(e, index)}
                        variant='outlined'
                        InputProps={{
                          style: { borderRadius: 8 },
                          readOnly: true // Makes the field uneditable
                        }}
                      />
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sx={{
                        display: 'flex',
                        justifyContent: 'flex-end', // Align to the right
                        alignItems: 'center' // Vertically center the content if needed
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
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <label htmlFor='description'>Instructions</label>
                    <textarea
                      id='instructions'
                      name='instructions'
                      value={formData.instructions}
                      onChange={handleChange}
                      rows='6'
                      style={{
                        width: '100%',
                        border: '1px solid #ccc',
                        borderRadius: '8px',
                        padding: '8px',
                        fontSize: '16px',
                        fontFamily: 'inherit'
                      }}
                    />
                    {errors.instructions && (
                      <Typography variant='body2' color='error'>
                        {errors.instructions}
                      </Typography>
                    )}
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Start Date'
                    name='startDate'
                    type='date'
                    value={formData.startDate}
                    onChange={handleChange}
                    error={!!errors.startDate}
                    helperText={errors.startDate}
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
                    label='End Date'
                    name='endDate'
                    type='date'
                    value={formData.endDate}
                    onChange={handleChange}
                    error={!!errors.endDate}
                    helperText={errors.endDate}
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
