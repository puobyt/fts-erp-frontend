import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import  { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../../global.css'
import { TextField, MenuItem, Container, Grid, Paper } from '@mui/material'

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

export default function ViewPurchaseOrderCreation ({
  orderData,
}) {
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedDate = orderData.date
  ? new Date(orderData.date).toISOString().split('T')[0]
  : ''
  console.log("ORDERDATA",orderData)
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
        <Container maxWidth='xl' sx={{ mt: 8 }}>
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
              component='form'
         
              sx={{
                maxHeight: '65vh', // Restrict height to 70% of viewport height
                overflowY: 'auto', // Enable vertical scrolling
                paddingRight: 2 // Add padding to avoid scrollbar overlap with content
              }}
            >
              <Grid container spacing={2} sx={{ mt: 0.5 }}>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Purchase Order Number'
                    name='purchaseOrderNumber'
                    value={orderData.purchaseOrderNumber}
                 
                    variant='filled'
                    InputProps={{
                        readOnly:true,
                      style: { borderRadius: 8, marginTop: '2px' },
                      placeholder: 'Auto-Generate'
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Date'
                    name='date'
                    type='text'
                    value={formattedDate}
                
                    variant='filled'
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
                    value={orderData.address}
                  
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
               <Grid item xs={6}>
              <TextField
             fullWidth
              label='Name Of The Firm'
              name='nameOfTheFirm'
              value={orderData.nameOfTheFirm}
              variant='filled'
              InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
              />
              </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Number'
                    name='contactNumber'
                    value={orderData.contactNumber}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Name'
                    name='contactPersonName'
                    value={orderData.contactPersonName}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Details'
                    name='contactPersonDetails'
                    value={orderData.contactPersonDetails}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                {/* <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vendor Id'
                    name='vendorId'
                    value={formData.vendorId}
                    onChange={handleChange}
                    error={!!errors.vendorId}
                    helperText={errors.vendorId}
                    variant='outlined'
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid> */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material Name'
                    name='materialName'
                    value={orderData.materialName}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
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
                    label='MFG Date'
                    name='mfgDate'
                    type='text'
                    value={orderData.mfgDate}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Terms and conditions'
                    name='termsAndConditions'
                    type='text'
                    value={orderData.termsAndConditions}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
      

               <Grid item xs={6}>
  <TextField
    fullWidth
    label='Unit'
    name='unit'
    value={orderData.unit}
    variant='filled'
    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
  />
</Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Price/unit'
                    name='price'
                    value={orderData.price}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quantity'
                    name='quantity'
                    value={orderData.quantity}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
         
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Pan'
                    name='pan'
                    value={orderData.pan}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='GST'
                    name='gst'
                    value={orderData.gst}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quotation Reference Number'
                    name='quoationReferenceNumber'
                    value={orderData.quoationReferenceNumber}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='HSN'
                    name='hsn'
                    value={orderData.hsn}
               
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Description'
                    name='description'
                    value={orderData.description}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Total Amount'
                    name='totalAmount'
                    value={orderData.totalAmount}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Amount In Words'
                    name='amountInWords'
                    value={orderData.amountInWords}
               
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Discount'
                    name='discount'
                    value={orderData.discount}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='After Discount'
                    name='afterDiscount'
                    value={orderData.afterDiscount}
             
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Igst18%'
                    name='igst'
                    value={orderData.igst}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Transportation Freight'
                    name='transportationFreight'
                    value={orderData.transportationFreight}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Round Off'
                    name='roundOff'
                    value={orderData.roundOff}
               
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Final Amount'
                    name='finalAmount'
                    value={orderData.finalAmount}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='P.O Date'
                    name='poDate'
                    type='date'
                    value={orderData.poDate}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
              </Grid>

            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  )
}
