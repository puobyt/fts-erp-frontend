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

export default function EditMaterialAssignmentForm ({
  setUpdate,
  materialAssignmentData,
  materialNames,
  finishedGoods,
  processOrderNumbers
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const navigate = useNavigate()
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
    authPassword: '',
    materialAssignmentId: materialAssignmentData.materialAssignmentId,
    assignmentNumber: materialAssignmentData.assignmentNumber,
    indentNumber: materialAssignmentData.indentNumber,
    finishedGoodsName: materialAssignmentData.finishedGoodsName,
    date: materialAssignmentData.date,
    // batchNumber: materialAssignmentData.batchNumber,
    processOrderNumber: materialAssignmentData.processOrderNumber,
    materials: materialAssignmentData.materials,
    assignedTo: materialAssignmentData.assignedTo
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!formData.indentNumber)
      newErrors.indentNumber = 'Indent Number is required'
    if (!formData.finishedGoodsName)
      newErrors.finishedGoodsName = 'Finished goods name is required'
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.authPassword)
      newErrors.authPassword = 'Authorization Password is required'
    // if (!formData.batchNumber)
    //   newErrors.batchNumber = 'Batch Number is required'
    if (!formData.processOrderNumber)
      newErrors.processOrderNumber = 'Process Order Number is required'
    // if (!formData.assignmentNumber)
    //   newErrors.assignMentNumber = 'Assignment Number is required'
    if (
      formData.materials.some(
        mat => !mat.materialsList || !mat.assignedQuantity || !mat.materialCode
      )
    ) {
      newErrors.materials = 'All material fields must be filled'
    } else if (
      formData.materials.some(
        mat => !Number.isFinite(Number(mat.assignedQuantity))
      )
    ) {
      newErrors.quantity = 'Assigned Quantity must be a number'
    }
    if (!formData.assignedTo) newErrors.assignedTo = 'AssignedTo is required'

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
        .put('/editMaterialAssignment', formData)
        .then(result => {
          toast.success(result.data.message)
          handleClose()
          setFormData({
            authPassword: '',
            materialAssignmentId: '',
            assignmentNumber: '',
            indentNumber: '',
            finishedGoodsName: '',
            date: '',
            processOrderNumber: '',
            materials: [
              { materialsList: '', assignedQuantity: '', materialCode: '' }
            ],
            assignedTo: ''
          })
          setUpdate(prev => !prev)
        })
        .catch(err => {
          toast.error(err.response.data.message)
          console.error(
            'Error occured in editing material assignment in client side',
            err.message
          )
        })
    } catch (err) {
      console.error(
        'Error occured in editing material assignment in client side',
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
        { materialsList: '', assignedQuantity: '', materialCode: '' }
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
                Edit Assignment Material Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Assignment Material Management
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
                        <MenuItem
                          disabled
                          sx={{ fontWeight: 'bold', fontStyle: 'italic' }}
                        >
                          Materials
                        </MenuItem>
                        {materialNames.map((materialName, index) => (
                          <MenuItem
                            key={`product-${index}`}
                            value={materialName.materialName}
                          >
                            {materialName.materialName}
                          </MenuItem>
                        ))}
                        <MenuItem
                          onClick={() =>
                            navigate('/vendor-stock-management/current-stock')
                          }
                          sx={{ fontStyle: 'italic' }}
                        >
                          Add New Material +
                        </MenuItem>

                        <MenuItem
                          disabled
                          sx={{ fontWeight: 'bold', fontStyle: 'italic' }}
                        >
                          Finished Goods
                        </MenuItem>
                        {finishedGoods.map((item, index) => (
                          <MenuItem key={`finished-${index}`} value={item}>
                            {item}
                          </MenuItem>
                        ))}

                        <MenuItem
                          onClick={() =>
                            navigate('/finished-goods-invoicing/finished-goods')
                          }
                          sx={{ fontStyle: 'italic' }}
                        >
                          Add New Finished Goods +
                        </MenuItem>
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label='Quantity In KG'
                        name='assignedQuantity'
                        error={!!errors.assignedQuantity}
                        value={material.assignedQuantity}
                        helperText={errors.assignedQuantity}
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

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Assignment Number'
                    name='assignmentNumber'
                    value={formData.assignmentNumber}
                    onChange={handleChange}
                    error={!!errors.assignmentNumber}
                    helperText={errors.assignmentNumber}
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
                {formData.materials.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        select
                        label='Finished Goods Name'
                        name='finishedGoodsName'
                        value={formData.finishedGoodsName}
                        onChange={handleChange}
                        error={!!errors.finishedGoodsName}
                        helperText={errors.finishedGoodsName}
                        variant='outlined'
                        InputProps={{ style: { borderRadius: 8 } }}
                      >
                        {finishedGoods.map((item, index) => (
                          <MenuItem key={`finished-${index}`} value={item}>
                            {item}
                          </MenuItem>
                        ))}

                        <MenuItem
                          onClick={() =>
                            navigate('/finished-goods-invoicing/finished-goods')
                          }
                          sx={{ fontStyle: 'italic' }}
                        >
                          Add New Finished Goods +
                        </MenuItem>
                      </TextField>
                    </Grid>
                  </React.Fragment>
                ))}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Indent Number'
                    name='indentNumber'
                    value={formData.indentNumber}
                    onChange={handleChange}
                    error={!!errors.indentNumber}
                    helperText={errors.indentNumber}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>

                {/* <Grid item xs={6}>
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
                </Grid> */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    select
                    label='Process Order Number'
                    name='processOrderNumber'
                    value={formData.processOrderNumber}
                    onChange={handleChange}
                    error={!!errors.processOrderNumber}
                    helperText={errors.processOrderNumber}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {processOrderNumbers.map((processOrderNumber, index) => (
                      <MenuItem key={index} value={processOrderNumber}>
                        {processOrderNumber}
                      </MenuItem>
                    ))}

                    {/* This item only triggers navigation, not a form selection */}
                    <MenuItem
                      onClick={() =>
                        navigate(
                          '/production-workflow/production-order-creation'
                        )
                      }
                      sx={{ fontStyle: 'italic' }} // Optional styling
                    >
                      Add New Process Order Number +
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
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Assigned To'
                    name='assignedTo'
                    value={formData.assignedTo}
                    onChange={handleChange}
                    error={!!errors.assignedTo}
                    helperText={errors.assignedTo}
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
