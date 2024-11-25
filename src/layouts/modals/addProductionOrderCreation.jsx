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

export default function ProductionOrderCreationForm ({
  setUpdate,
  materialNames,
  processOrderNumbers
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const navigate = useNavigate();
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
    processOrder: '',
    plant: '',
    productDescription: '',
    productName: '',
    batch: '',
    materials: [{ materialsList: '', requiredQuantity: '' }],
    instructions: '',
    startDate: '',
    endDate: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    // if (!formData.processOrder)
    //   newErrors.processOrder = 'Process Order is required'
    if (!formData.plant) newErrors.plant = 'Plant is required'

    if (!formData.productName)
      newErrors.productName = 'Product Name is required'
    if (!formData.productDescription)
      newErrors.productDescription = 'Product Description is required'
    // if (!formData.batch) newErrors.batch = 'Batch is required'
    if (
      formData.materials.some(
        mat => 
          !mat.materialsList || 
          !mat.requiredQuantity
      )
    ) {
      newErrors.materials = 'All material fields must be filled';
    } else if (
      formData.materials.some(
        mat => !Number.isFinite(Number(mat.requiredQuantity))
      )
    ) {
      newErrors.requiredQuantity = 'Required Quantity must be a number';
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

  const handleProcessOrderChange = event => {
    const selectedNumber = event.target.value
    const isSelectedNumber = processOrderNumbers.find(
      processOrder => selectedNumber === processOrder.processOrderNumber
    )

    if (isSelectedNumber) {
      setFormData({
        ...formData,
        processOrder: selectedNumber,
        productName: isSelectedNumber.productName
      })
    }
  }

  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      const result = await axiosInstance.post(
        '/newProductionOrderCreation',
        formData
      )
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setFormData({
          processOrder: '',
          plant: '',
          productDescription: '',
          productName: '',
          batch: '',
          materials: [{ materialsList: '', requiredQuantity: '' }],
          instructions: '',
          startDate: '',
          endDate: ''
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

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target
    const updatedMaterials = [...formData.materials]
    updatedMaterials[index][name] = value
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

  // const handleBatchChange = event => {
  //   const selectedBatch = event.target.value
  //   const isSelectedBatch = batches.find(
  //     batch => selectedBatch === batch.batchNumber
  //   )

  //   if (isSelectedBatch) {
  //     setFormData({
  //       ...formData,
  //       materialName: isSelectedBatch.materialName,
  //       batch: selectedBatch
  //     })
  //   }
  // }
  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      <Button
        onClick={handleOpen}
        variant='contained'
        color='inherit'
        startIcon={<Iconify icon='mingcute:add-line' />}
      >
        New Production Order Creation
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
                Add New Production Order Creation
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
              <Grid container spacing={2}>
              <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label='Process Order'
                    name='processOrder'
                    value={formData.processOrder}
                    onChange={handleProcessOrderChange}
                    error={!!errors.processOrder}
                    helperText={errors.processOrder}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {processOrderNumbers.map((processOrder, index) => (
                      <MenuItem key={index} value={processOrder.processOrderNumber}>
                        {processOrder.processOrderNumber}
                      </MenuItem>
                    ))}

                    <MenuItem
                      onClick={() => navigate('/process-order')}
                      sx={{ fontStyle: 'italic' }}
                    >
                      Add New Material In Current Stock +
                    </MenuItem>
                  </TextField>
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
                {/* <Grid item xs={6}>
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
                </Grid> */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Product Description'
                    name='productDescription'
                    value={formData.productDescription}
                    onChange={handleChange}
                    error={!!errors.productDescription}
                    helperText={errors.productDescription}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch'
                    name='batch'
                    value={formData.batch}
                    onChange={handleChange}
                    error={!!errors.batch}
                    helperText={errors.batch}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 },
                      placeholder: 'Auto-Generate'
                    }}
                    InputLabelProps={{
                      shrink: true // Keeps the label above the field to avoid overlap
                    }}
                  />
                </Grid>
                {formData.materials.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
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
                        {materialNames.map((materialName, index) => (
                          <MenuItem key={index} value={materialName}>
                            {materialName}
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
                    <Grid item xs={6}>
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
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Instructions'
                    name='instructions'
                    value={formData.instructions}
                    onChange={handleChange}
                    error={!!errors.instructions}
                    helperText={errors.instructions}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
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
