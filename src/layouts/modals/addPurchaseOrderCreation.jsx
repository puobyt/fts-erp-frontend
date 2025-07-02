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
import { TextField, MenuItem, Container, Grid, Paper, FormControlLabel, Checkbox } from '@mui/material'

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

export default function PurchaseOrderCreationForm ({ setUpdate, firms }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const [sameAsBilling, setSameAsBilling] = useState(false)
  const [deliveryAddress, setDeliveryAddress] = useState('')
  const [loading, setLoading] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const [formData, setFormData] = useState({
    purchaseOrderNumber: '',
    date: '',
    address: '',
    nameOfTheFirm: '',
    contactNumber: '',
    contactPersonName: '',
    contactPersonDetails: '',
    quotationReferenceNumber: '',
    hsn: '',
    description: '',
    totalAmount: '',
    amountInWords: '',
    discount: '',
    afterDiscount: '',
    igst: '',
    transportationFreight: '',
    roundOff: '',
    finalAmount: '',
    poDate: '',
    vendorId: '',
    pan: '',
    gst: '',
    termsAndConditions: "",
    materials: [{ materialName: '', quantity: '', unit: '', price: '', mfgDate: '' }]
  })

  const handleFirmChange = event => {
    const selectedFirmName = event.target.value
    const selectedFirm = firms.find(
      firm => firm.nameOfTheFirm === selectedFirmName
    )
    if (selectedFirm) {
      setFormData(prev => ({
        ...prev,
        nameOfTheFirm: selectedFirm.nameOfTheFirm,
        contactNumber: selectedFirm.contactNumber,
        pan: selectedFirm.pan,
        gst: selectedFirm.gst,
        address: selectedFirm.address,
        contactPersonName: selectedFirm.contactPersonName,
        contactPersonDetails: selectedFirm.contactPersonDetails,
        vendorId: selectedFirm._id
      }))
    }
  }

  const [errors, setErrors] = useState({})

  const validateForm = () => {
    const newErrors = {}
    if (!sameAsBilling && !deliveryAddress) {
      newErrors.deliveryAddress = 'Delivery address is required!'
    }
    if (!formData.date) newErrors.date = 'Date is required'
    if (!formData.nameOfTheFirm) newErrors.nameOfTheFirm = 'Name Of The Firm is required'
    if (!formData.address) newErrors.address = 'Address is required'
    if (!formData.contactNumber) newErrors.contactNumber = 'Contact Number is required'
    if (!formData.contactPersonName) newErrors.contactPersonName = 'Contact Person Name is required'
    if (!formData.contactPersonDetails) newErrors.contactPersonDetails = 'Contact Person Details are required'
    if (!formData.pan) newErrors.pan = 'PAN is required'
    if (!formData.gst) newErrors.gst = 'GST is required'

    // Materials validation
    formData.materials.forEach((mat, i) => {
      if (!mat.materialName || !mat.quantity || !mat.unit) {
        newErrors[`materials_${i}`] = 'All material fields are required'
      } else if (!/^\d+(\.\d+)?$/.test(mat.quantity)) {
        newErrors[`materials_${i}_quantity`] = 'Quantity must be a valid number'
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
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
      setLoading(true)
      const dataToSubmit = {
        ...formData,
        deliveryAddress: sameAsBilling ? formData.address : deliveryAddress
      }
      const result = await axiosInstance.post(
        '/newPurchaseOrderCreation',
        dataToSubmit
      )
      if (result) {
        toast.success(result.data.message)
        setFormData({
          purchaseOrderNumber: '',
          date: '',
          address: '',
          nameOfTheFirm: '',
          contactNumber: '',
          contactPersonName: '',
          contactPersonDetails: '',
          vendorId: '',
          quotationReferenceNumber: '',
          hsn: '',
          description: '',
          totalAmount: '',
          amountInWords: '',
          discount: '',
          afterDiscount: '',
          igst: '',
          transportationFreight: '',
          roundOff: '',
          finalAmount: '',
          poDate: '',
          pan: '',
          gst: '',
          termsAndConditions: "",
          materials: [{ materialName: '', quantity: '', unit: '', price: '', mfgDate: '' }]
        })
        setDeliveryAddress('')
        setSameAsBilling(false)
        handleClose()
        setTimeout(() => {
          setLoading(false)
        }, 1000)
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error occurred")
      console.error(
        'Error occured in adding new purchase order creation client side',
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
        { materialName: '', quantity: '', unit: '', price: '', mfgDate: '' }
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
        New Purchase Order Creation
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Container maxWidth='lg' sx={{ mt: 8 }}>
          <Paper elevation={4} sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component='h1'
                variant='h5'
                fontWeight='bold'
                color='primary'
                gutterBottom
              >
                Add New Purchase Order Creation
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Purchase Order Management
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
                    label='Name Of The Firm'
                    name='nameOfTheFirm'
                    value={formData.nameOfTheFirm}
                    onChange={handleFirmChange}
                    error={!!errors.nameOfTheFirm}
                    helperText={errors.nameOfTheFirm}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {firms.map((firm, index) => (
                      <MenuItem key={index} value={firm.nameOfTheFirm}>
                        {firm.nameOfTheFirm}
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() =>
                        navigate('/vendor-stock-management/vendor-management')
                      }
                      sx={{ fontStyle: 'italic' }}
                    >
                      Add New Firm +
                    </MenuItem>
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Purchase Order Number'
                    name='purchaseOrderNumber'
                    value={formData.purchaseOrderNumber}
                    onChange={handleChange}
                    error={!!errors.purchaseOrderNumber}
                    helperText={errors.purchaseOrderNumber}
                    variant='outlined'
                    InputProps={{
                      style: { borderRadius: 8, marginTop: '2px' },
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
                    label='Address'
                    name='address'
                    value={formData.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Number'
                    name='contactNumber'
                    value={formData.contactNumber}
                    onChange={handleChange}
                    error={!!errors.contactNumber}
                    helperText={errors.contactNumber}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Name'
                    name='contactPersonName'
                    value={formData.contactPersonName}
                    onChange={handleChange}
                    error={!!errors.contactPersonName}
                    helperText={errors.contactPersonName}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Details'
                    name='contactPersonDetails'
                    value={formData.contactPersonDetails}
                    onChange={handleChange}
                    error={!!errors.contactPersonDetails}
                    helperText={errors.contactPersonDetails}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <FormControlLabel
                    control={
                      <Checkbox checked={sameAsBilling}
                        onChange={(e) => {
                          setSameAsBilling(e.target.checked)
                          if (e.target.checked) {
                            setDeliveryAddress(formData.address)
                          }
                        }}
                        color='primary' />
                    }
                    label='Same as billing address' />
                  <TextField
                    fullWidth
                    label='Delivery Address'
                    name='deliveryAddress'
                    value={sameAsBilling ? formData.address : deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    disabled={sameAsBilling}
                    error={!!errors.deliveryAddress}
                    helperText={errors.deliveryAddress}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                {/* MATERIALS SECTION */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Materials
                  </Typography>
                  {formData.materials.map((material, index) => (
                    <Grid container spacing={2} key={index} sx={{ mb: 1 }}>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label='Material Name'
                          name='materialName'
                          value={material.materialName}
                          onChange={e => handleMaterialChange(e, index)}
                          error={!!errors[`materials_${index}`]}
                          helperText={errors[`materials_${index}`]}
                          variant='outlined'
                          InputProps={{ style: { borderRadius: 8 } }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          fullWidth
                          label='Quantity'
                          name='quantity'
                          value={material.quantity}
                          onChange={e => handleMaterialChange(e, index)}
                          error={!!errors[`materials_${index}_quantity`]}
                          helperText={errors[`materials_${index}_quantity`]}
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
                          value={material.unit}
                          onChange={e => handleMaterialChange(e, index)}
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
                          label='Price/unit'
                          name='price'
                          value={material.price}
                          onChange={e => handleMaterialChange(e, index)}
                          variant='outlined'
                          InputProps={{ style: { borderRadius: 8 } }}
                        />
                      </Grid>
                      <Grid item xs={2}>
                        <TextField
                          fullWidth
                          label='MFG Date'
                          name='mfgDate'
                          type='date'
                          value={material.mfgDate}
                          onChange={e => handleMaterialChange(e, index)}
                          variant='outlined'
                          InputProps={{ style: { borderRadius: 8 } }}
                          InputLabelProps={{ shrink: true }}
                        />
                      </Grid>
                      <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Button
                          variant='text'
                          color='error'
                          onClick={() => removeMaterial(index)}
                          size='small'
                        >
                          Remove
                        </Button>
                      </Grid>
                    </Grid>
                  ))}
                  <Button variant='contained' color='primary' onClick={addMaterial} sx={{ mb: 2 }}>
                    Add Material
                  </Button>
                </Grid>
                {/* REST OF THE FORM */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Pan'
                    name='pan'
                    value={formData.pan}
                    onChange={handleChange}
                    error={!!errors.pan}
                    helperText={errors.pan}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='GST'
                    name='gst'
                    value={formData.gst}
                    onChange={handleChange}
                    error={!!errors.gst}
                    helperText={errors.gst}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quotation Reference Number'
                    name='quotationReferenceNumber'
                    value={formData.quotationReferenceNumber}
                    onChange={handleChange}
                    error={!!errors.quotationReferenceNumber}
                    helperText={errors.quotationReferenceNumber}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='HSN'
                    name='hsn'
                    value={formData.hsn}
                    onChange={handleChange}
                    error={!!errors.hsn}
                    helperText={errors.hsn}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Description'
                    name='description'
                    value={formData.description}
                    onChange={handleChange}
                    error={!!errors.description}
                    helperText={errors.description}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Total Amount'
                    name='totalAmount'
                    value={formData.totalAmount}
                    onChange={handleChange}
                    error={!!errors.totalAmount}
                    helperText={errors.totalAmount}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Amount In Words'
                    name='amountInWords'
                    value={formData.amountInWords}
                    onChange={handleChange}
                    error={!!errors.amountInWords}
                    helperText={errors.amountInWords}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Discount'
                    name='discount'
                    value={formData.discount}
                    onChange={handleChange}
                    error={!!errors.discount}
                    helperText={errors.discount}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='After Discount'
                    name='afterDiscount'
                    value={formData.afterDiscount}
                    onChange={handleChange}
                    error={!!errors.afterDiscount}
                    helperText={errors.afterDiscount}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='GST'
                    name='igst'
                    value={formData.igst}
                    onChange={handleChange}
                    error={!!errors.igst}
                    helperText={errors.igst}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Transportation Freight'
                    name='transportationFreight'
                    value={formData.transportationFreight}
                    onChange={handleChange}
                    error={!!errors.transportationFreight}
                    helperText={errors.transportationFreight}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Round Off'
                    name='roundOff'
                    value={formData.roundOff}
                    onChange={handleChange}
                    error={!!errors.roundOff}
                    helperText={errors.roundOff}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Final Amount'
                    name='finalAmount'
                    value={formData.finalAmount}
                    onChange={handleChange}
                    error={!!errors.finalAmount}
                    helperText={errors.finalAmount}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='P.O Date'
                    name='poDate'
                    type='date'
                    value={formData.poDate}
                    onChange={handleChange}
                    error={!!errors.poDate}
                    helperText={errors.poDate}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Terms and Conditions"
                    name='termsAndConditions'
                    value={formData.termsAndConditions}
                    onChange={handleChange}
                    error={!!errors.termsAndConditions}
                    helperText={errors.termsAndConditions}
                    variant='outlined'
                    multiline
                    minRows={6}
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
                  },
                  position: 'relative'
                }}
                disabled={loading}
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