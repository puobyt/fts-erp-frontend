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

export default function ViewProductionOrderCreationOutputForm ({

  productionOrderOutputData,

}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate();
  const formattedDate = productionOrderOutputData.productionCompletionDate
    ? new Date(productionOrderOutputData.productionCompletionDate)
        .toISOString()
        .split('T')[0]
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
                View Production Order Creation Output Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Production Order Creation Management
              </Typography>
            </Box>
            <Box component='form' >
              <Grid container spacing={2}>
              <Grid item xs={6}>
                  <TextField
                    fullWidth

                    label='Product Name'
                    name='productName'
                    value={productionOrderOutputData.productName}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  >
             
                
                  </TextField>
                </Grid>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Produced Quantity'
                    name='producedQuantity'
                    value={productionOrderOutputData.producedQuantity}
                  
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Production Completion Date'
                    name='productionCompletionDate'
                    type='text'
                    value={formattedDate}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
      
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Storage Location for Output'
                    name='storageLocationforOutput'
                    value={productionOrderOutputData.storageLocationforOutput}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true  }}
                  />
                </Grid>
                <Grid item xs={6}>
                          <TextField
                            fullWidth
                       
                            label='Batch Number For Output'
                            name='batchNumberforOutput'
                            value={productionOrderOutputData.batchNumberforOutput}
                          
                            variant='filled'
                            InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                          >
                    
                     
                          </TextField>
                        </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Production Notes'
                    name='productionNotes'
                    value={productionOrderOutputData.productionNotes}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Yield'
                    name='Yield'
                    value={productionOrderOutputData.Yield}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Output Quality Rating'
                    name='outputQualityRating'
                    value={productionOrderOutputData.outputQualityRating}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Output Handling Instructions'
                    name='outputHandlingInstructions'
                    value={productionOrderOutputData.outputHandlingInstructions}
               
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
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
