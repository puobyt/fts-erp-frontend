import React,{ useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../../global.css'
import { TextField, MenuItem, Container, Grid, Paper, Divider } from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function ViewPurchaseOrderCreation({ orderData }) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedDate = orderData.date
    ? new Date(orderData.date).toLocaleDateString()
    : ''
  console.log("orderData",orderData)
  // Support multiple materials
  const materials = Array.isArray(orderData.materials) && orderData.materials.length
    ? orderData.materials
    : ((orderData.materialName || orderData.quantity || orderData.unit || orderData.price || orderData.mfgDate) ? [{
        materialName: orderData.materialName || '',
        quantity: orderData.quantity || '',
        unit: orderData.unit || '',
        price: orderData.price || '',
        mfgDate: orderData.mfgDate || ''
      }] : [])

  // Support multiple terms
  const terms = Array.isArray(orderData.termsAndConditions)
    ? orderData.termsAndConditions
    : (orderData.termsAndConditions
        ? orderData.termsAndConditions.split('\n').filter(x=>x.trim()!=='')
        : [])

  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      <MenuItem onClick={handleOpen}>
        <Iconify icon='solar:eye-bold' />
        View
      </MenuItem>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
      >
        <Container maxWidth='md' sx={{ mt: 8 }}>
          <Paper
            elevation={4}
            sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 1 }}
          >
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component='h1'
                variant='h5'
                fontWeight='bold'
                color='primary'
                gutterBottom
              >
                View Purchase Order Creation
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Purchase Order Management
              </Typography>
            </Box>
            <Box
              sx={{
                maxHeight: '65vh',
                overflowY: 'auto',
                paddingRight: 2
              }}
            >
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                {/* General Info */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Purchase Order Number'
                    value={orderData.purchaseOrderNumber || ''}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8, marginTop: '2px' },
                      placeholder: 'Auto-Generate'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Date'
                    value={formattedDate}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Delivery Address'
                    value={orderData.deliveryAddress || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Address'
                    value={orderData.address || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Name Of The Firm'
                    value={orderData.nameOfTheFirm || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Number'
                    value={orderData.contactNumber || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Name'
                    value={orderData.contactPersonName || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Details'
                    value={orderData.contactPersonDetails || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vendor Id'
                    value={orderData.vendorId || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>

                {/* MATERIALS SECTION */}
                {materials.length > 0 && (
                  <>
                    <Grid item xs={12}>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                        Materials
                      </Typography>
                    </Grid>
                    {materials.map((mat, idx) => (
                      <React.Fragment key={idx}>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            label='Material Name'
                            value={mat.materialName}
                            variant='filled'
                            InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            fullWidth
                            label='Quantity'
                            value={mat.quantity}
                            variant='filled'
                            InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            fullWidth
                            label='Unit'
                            value={mat.unit}
                            variant='filled'
                            InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={2}>
                          <TextField
                            fullWidth
                            label='Price/unit'
                            value={mat.price}
                            variant='filled'
                            InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                          />
                        </Grid>
                        <Grid item xs={3}>
                          <TextField
                            fullWidth
                            label='MFG Date'
                            value={mat.mfgDate ? new Date(mat.mfgDate).toLocaleDateString() : ""}
                            variant='filled'
                            InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                          />
                        </Grid>
                      </React.Fragment>
                    ))}
                  </>
                )}

                {/* Rest of the fields */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Pan'
                    value={orderData.pan || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='GST'
                    value={orderData.gst || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quotation Reference Number'
                    value={orderData.quotationReferenceNumber || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='HSN'
                    value={orderData.hsn || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Description'
                    value={orderData.description || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Total Amount'
                    value={orderData.totalAmount || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Amount In Words'
                    value={orderData.amountInWords || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Discount'
                    value={orderData.discount || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='After Discount'
                    value={orderData.afterDiscount || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Transportation Freight'
                    value={orderData.transportationFreight || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Round Off'
                    value={orderData.roundOff || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Final Amount'
                    value={orderData.finalAmount || ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='P.O Date'
                    type='date'
                    value={orderData.poDate ? new Date(orderData.poDate).toISOString().split('T')[0] : ''}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>

                {/* Terms and Conditions */}
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" color="primary" sx={{ mb: 1 }}>
                    Terms and Conditions
                  </Typography>
                  {terms.length > 0 ? (
                    terms.map((term, idx) => (
                      <Typography key={idx} sx={{ mb: 0.5 }}>
                        {idx + 1}. {term}
                      </Typography>
                    ))
                  ) : (
                    <Typography color="textSecondary" sx={{ mb: 0.5 }}>
                      No terms available.
                    </Typography>
                  )}
                </Grid>
              </Grid>
            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  )
}