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

export default function ViewProcessOrderForm ({ processOrderData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const navigate = useNavigate()
  const handleClose = () => setOpen(false)
  const formattedStartDate = processOrderData.startDate.split('-').reverse().join('-');
  const formattedEndDate = processOrderData.finishDate.split('-').reverse().join('-');


  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />

      <MenuItem onClick={handleOpen}>
        <Iconify icon='solar:eye-bold' />
        view
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
                 View Process Order
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Process order Management
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
              <Grid container spacing={2} >
    
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Process Order Number'
                    name='processOrderNumber'
                    value={processOrderData.processOrderNumber}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Plant'
                    name='plant'
                    value={processOrderData.plant}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Equipment'
                    name='equipment'
                    value={processOrderData.equipment}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    type='text'
                    label='Start Date'
                    name='startDate'
                    value={processOrderData.startDate}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Finish Date'
                    type='text'
                    name='finishDate'
                    value={processOrderData.finishDate}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
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
                    value={processOrderData.productCode}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Product Name'
                    name='productName'
                    value={processOrderData.productName}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                     variant='filled'
                  
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={processOrderData.batchNumber}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={6} sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label='Order Quantity'
                    name='orderQuantity'
                    value={processOrderData.orderQuantity}
                    InputProps={{
                        style: { borderRadius: 8 },readOnly:true
                      }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    fontWeight='bold'
                 
                  >
                    Material Input
                  </Typography>
                </Grid>

                {processOrderData.materialInput.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label='Material Code'
                        name='materialCode'
                        value={material.materialCode}
                     
                        variant='filled'
                        InputProps={{
                            style: { borderRadius: 8 },readOnly:true
                          }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label='Quantity'
                        name='quantity'
                    
                        value={material.quantity}
                  
                        variant='filled'
                        InputProps={{
                            style: { borderRadius: 8 },readOnly:true
                          }}
                      />
                    </Grid>

                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label='Batch'
                        name='batch'
                     
                        value={material.batch}
                    
                        variant='filled'
                        InputProps={{
                            style: { borderRadius: 8 },readOnly:true
                          }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label='Storage Location'
                        name='storageLocation'
                
                        value={material.storageLocation}
                   
                        variant='filled'
                        InputProps={{
                            style: { borderRadius: 8 },readOnly:true
                          }}
                      />
                    </Grid>
        
                  </React.Fragment>
                ))}
     

                {/* <Grid item xs={12}>
                  <Box
                    sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
                  >
                    <label htmlFor='description' style={{ fontWeight: 'bold' }}>
                      Description
                    </label>
                    <textarea
                      id='description'
                      name='description'
                      value={formData.description}
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
                    {errors.description && (
                      <Typography variant='body2' color='error'>
                        {errors.description}
                      </Typography>
                    )}
                  </Box>
                </Grid> */}
              </Grid>

            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  )
}
