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

export default function EditBillOfMaterialsForm ({
  setUpdate,
  billOfMaterialsData,
  productNames,
  materialNames
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    authPassword: '',
    billOfMaterialsId: billOfMaterialsData.billOfMaterialsId,
    bomNumber: billOfMaterialsData.bomNumber,
    productName: billOfMaterialsData.productName,
    materials: billOfMaterialsData.materials
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    // if (!formData.bomNumber) newErrors.bomNumber = 'BOM Number is required'
    if (!formData.productName)
      newErrors.productName = 'Product Name is required'
    if (
      formData.materials.some(
        mat => !mat.materialsList || !mat.quantity || !mat.materialCode
      )
    ) {
      newErrors.materials = 'All material fields must be filled'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0 // Returns true if there are no errors
  }

  const handleChange = e => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
        { materialsList: '', quantity: '', materialCode: '' }
      ]
    }))
  }

  const removeMaterial = index => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index)
    setFormData({ ...formData, materials: updatedMaterials })
  }
  const handleSubmit = async e => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    try {
      const result = await axiosInstance
        .put('/editBillOfMaterials', formData)
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            billOfMaterialsId: '',
            bomNumber: '',
            productName: '',
            materials: [{ materialsList: '', quantity: '', materialCode: '' }]
          })
          setUpdate(prev => !prev)
        })
        .catch(err => {
          toast.error(err.response.data.message)

          console.error(
            'Error occured in editing bill of materials in client side',
            err.message
          )
        })
    } catch (err) {
      console.error(
        'Error occured in editing bill of materials in client side',
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
                Add New Bill Of Material
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Bill Of Material Management
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
                <Grid item xs={12}>
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
                    label='Bom Number'
                    name='bomNumber'
                    value={formData.bomNumber}
                    onChange={handleChange}
                    error={!!errors.bomNumber}
                    helperText={errors.bomNumber}
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
                    label='Product Name'
                    name='productName'
                    value={formData.productName}
                    onChange={handleChange}
                    error={!!errors.productName}
                    helperText={errors.productName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {productNames.map((productName, index) => (
                      <MenuItem key={index} value={productName}>
                        {productName}
                      </MenuItem>
                    ))}

                    {/* This item only triggers navigation, not a form selection */}
                    <MenuItem
                      onClick={() => navigate('/production-workflow/production-order-creation-output')}
                      sx={{ fontStyle: 'italic' }} // Optional styling
                    >
                      Add New Product +
                    </MenuItem>
                  </TextField>
                </Grid>

                {formData.materials &&
                  formData.materials.map((material, index) => (
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

                          <MenuItem
                            onClick={() => navigate('/vendor-stock-management/current-stock')}
                            sx={{ fontStyle: 'italic' }} // Optional styling
                          >
                            Add New materialName +
                          </MenuItem>
                        </TextField>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Quantity'
                          name='quantity'
                          error={!!errors.materials}
                          value={material.quantity}
                          helperText={errors.materials}
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
                            readOnly: true
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
