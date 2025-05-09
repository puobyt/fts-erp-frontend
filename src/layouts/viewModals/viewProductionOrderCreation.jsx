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

export default function ViewProductionOrderCreationForm ({

  productionOrderData,

}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const navigate = useNavigate();
  const handleClose = () => setOpen(false)
  const formattedStartDate = productionOrderData.startDate
    ? new Date(productionOrderData.startDate).toISOString().split('T')[0]
    : ''
  const formattedEndDate = productionOrderData.endDate
    ? new Date(productionOrderData.endDate).toISOString().split('T')[0]
    : ''


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
        {/* <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Text in a modal
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
          </Typography>
        </Box> */}

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
View              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Production Order Creation Management
              </Typography>
            </Box>
            <Box
              component='form'
             
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
                    label='Product Name'
                    name='productName'
                    value={productionOrderData.productName}
                   
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Process Order'
                    name='processOrder'
                    value={productionOrderData.processOrder}
              
                    variant='filled'
                    InputProps={{
                      style: { borderRadius: 8 },readOnly:true,
                      placeholder: 'Auto-Generate' // Add your placeholder here
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Plant'
                    name='plant'
                    value={productionOrderData.plant}
              
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch'
                    name='batch'
                    value={productionOrderData.batch}
              
                    variant='filled'
                    InputProps={{
                      style: { borderRadius: 8 },readOnly:true,
                      placeholder: 'Auto-Generate'
                    }}
                    InputLabelProps={{
                      shrink: true // Keeps the label above the field to avoid overlap
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Product Quantity'
                    name='productQuantity'
                    value={productionOrderData.productQuantity}
                
                    variant='filled'
                    InputProps={{
                      style: { borderRadius: 8 },readOnly:true
                    }}
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
                      value={productionOrderData.productDescription}
                      InputProps={{readOnly:true }}
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
             
                  </Box>
                </Grid>
                {productionOrderData.materials.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                      
                        label='Materials List'
                        name='materialsList'
                        value={material.materialsList}
                   
                        variant='filled'
                        InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                      >
              

                        {/* This item only triggers navigation, not a form selection */}
              
                      </TextField>
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label='Required Quantity In KG'
                        name='requiredQuantity'
                     
                        value={material.requiredQuantity}
                   
                        variant='filled'
                        InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                      />
                    </Grid>
                    <Grid item xs={4}>
                      <TextField
                        fullWidth
                        label='Material Code'
                        name='materialCode'
                  
                        value={material.materialCode}
                    
                    
                        variant='filled'
                        InputProps={{
                          style: { borderRadius: 8 },
                          readOnly: true // Makes the field uneditable
                        }}
                      />
                    </Grid>
                 
                  </React.Fragment>
                ))}
       
                <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <label htmlFor='description'>Instructions</label>
                    <textarea
                      id='instructions'
                      name='instructions'
                      value={productionOrderData.instructions}
                      InputProps={{readOnly:true }}
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
             
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Start Date'
                    name='startDate'
                    type='text'
                    value={formattedStartDate}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
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
                    type='text'
                    value={formattedEndDate}
              
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                    InputLabelProps={{
                      shrink: true // Keeps the label above the field to avoid overlap
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
