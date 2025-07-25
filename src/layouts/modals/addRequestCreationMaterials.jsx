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

export default function RequestCreationForMaterialsForm ({
  setUpdate,
  finishedGoods,
  materialNames
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    requestNumber: '',
    finishedGoodsName: '',
    status: 'Pending',
    // batchNumber: '',
    materials: [
      { materialsList: '', quantity: '', unit: '', materialCode: '' }
    ],
    requiredDate: ''
  })
  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    // if (!formData.requestNumber)
    //   newErrors.requestNumber = 'Request Number is required'
    // if (!formData.batchNumber)
    //   newErrors.batchNumber = 'Batch Number is required'
    if (!formData.finishedGoodsName)
      newErrors.finishedGoodsName = 'Finished Goods Nameis required'

    if (
      formData.materials.some(
        mat =>
          !mat.materialsList || !mat.quantity || !mat.materialCode || !mat.unit
      )
    ) {
      newErrors.materials = 'All material fields must be filled'
    } else if (
      formData.materials.some(mat => !Number.isFinite(Number(mat.quantity)))
    ) {
      newErrors.quantity = 'Quantity must be a number'
    }

    if (!formData.requiredDate)
      newErrors.requiredDate = 'Required Date is required'
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
      const result = await axiosInstance.post(
        '/newRequestCreationForMaterials',
        formData
      )
      if (result) {
        toast.success(result.data.message)
        handleClose()
        setFormData({
          requestNumber: '',
          finishedGoodsName: '',
          status: 'Pending',
          unit: '',
          // batchNumber: '',
          materials: [
            { materialsList: '', quantity: '', unit: '', materialCode: '' }
          ],
          requiredDate: ''
        })
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in adding newRequestCreationForMaterials in client side',
        err.message
      )
    }
  }

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target

    const updatedMaterials = [...formData.materials]
    updatedMaterials[index][name] = value

    let selectedMaterial
    if (name === 'materialsList') {
       selectedMaterial = materialNames.find(
        material => material.materialName === value
      )
      updatedMaterials[index].materialCode =
        selectedMaterial?.materialCode || ''
    }

    if(!selectedMaterial){
      selectedMaterial = finishedGoods.find(
        material => material.materialName === value
    );
    if(selectedMaterial){
      updatedMaterials[index].materialCode = selectedMaterial?.materialCode || '';
    }
    }

    setFormData({ ...formData, materials: updatedMaterials })
  }

  const addMaterial = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      materials: [
        ...prevFormData.materials,
        { materialsList: '', quantity: '', unit: '', materialCode: '' }
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
      <Button
        onClick={handleOpen}
        variant='contained'
        color='inherit'
        startIcon={<Iconify icon='mingcute:add-line' />}
      >
        New Request Creation For Materials
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
                Add New Request For Creation Materials
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Request Creation For Materials Management
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
                {formData.materials.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={3}>
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
                          <MenuItem key={`finished-${index}`} value={item.materialName}>
                            {item.materialName}
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
                    <Grid item xs={3}>
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

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        select
                        label='Unit'
                        name='unit'
                        value={material.unit}
                        onChange={e => handleMaterialChange(e, index)}
                        error={!!errors.materials}
                        helperText={errors.materials}
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

                    <Grid item xs={3}>
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
                    label='Request Number'
                    name='requestNumber'
                    value={formData.requestNumber}
                    onChange={handleChange}
                    error={!!errors.requestNumber}
                    helperText={errors.requestNumber}
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
                    label='Finished Goods Name'
                    name='finishedGoodsName'
                    value={formData.finishedGoodsName}
                    onChange={handleChange}
                    error={!!errors.finishedGoodsName}
                    helperText={errors.finishedGoodsName}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Required Date'
                    name='requiredDate'
                    type='date'
                    value={formData.requiredDate}
                    onChange={handleChange}
                    error={!!errors.requiredDate}
                    helperText={errors.requiredDate}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true
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