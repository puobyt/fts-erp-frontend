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

export default function ViewGateEntry ({
  setUpdate,
  gateEntryData
}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedDate = gateEntryData.date
    ? new Date(gateEntryData.date).toISOString().split('T')[0]
    : ''

 

  function convertTo24HourFormat(time12h) {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
  
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
  
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  }
  
  
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
                View Gate Entry Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Gate Entry Management
              </Typography>
            </Box>
            <Box component='form' 
                  sx={{
                    maxHeight: '65vh',
                    overflowY: 'auto',
                    paddingRight: 2
                  }}>
              <Grid container spacing={2}  sx={{ mt: 0.1 }}>
         
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Entry Time'
                    name='entryTime'
                    type='text'
                    value={gateEntryData.entryTime}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vehicle Number'
                    name='vehicleNumber'
                    value={gateEntryData.vehicleNumber}
                  
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Doc Number'
                    name='docNumber'
                    value={gateEntryData.docNumber}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vendor Name'
                    name='vendorName'
                    value={gateEntryData.vendorName}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  >
                 
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Date'
                    name='date'
                    type='date'
                    value={gateEntryData.date}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                {gateEntryData.materials?.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                    
                        label='Materials Name'
                        name='materialName'
                        value={material.materialName}
                   
                        variant='filled'
                        InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                      >
                
                  
                        {/* {materialNames?.map((materialName, index) => (
                                          <MenuItem
                                            key={`product-${index}`}
                                            value={materialName.materialsList}
                                          >
                                            {materialName.materialsList}
                                          </MenuItem>
                                        ))} */}
             
                      </TextField>
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label='Quantity'
                        name='quantity'
                     
                        value={`${material.quantity} ${material.unit||"KG"}`}
                 
                    
                        variant='filled'
                        InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                      />
                    </Grid>
         
                  </React.Fragment>
                ))}

        
  
              </Grid>

            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  )
}
