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

export default function ViewBillOfMaterialsForm ({

  billOfMaterialsData,


}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate()

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
                View Bill Of Material
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Bill Of Material Management
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
                    label='Bom Number'
                    name='bomNumber'
                    value={billOfMaterialsData.bomNumber}
                 
                
                    variant='filled'
                    InputProps={{
                      style: { borderRadius: 8 },readOnly:true,
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
              
                    label='Product Name'
                    name='productName'
                    value={billOfMaterialsData.productName}
                  
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  >
             
                  </TextField>
                </Grid>

                {billOfMaterialsData.materials &&
                  billOfMaterialsData.materials.map((material, index) => (
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
               
                        </TextField>
                      </Grid>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label='Quantity'
                          name='quantity'
                       
                          value={material.quantity}
                       
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
                            style: { borderRadius: 8 },readOnly:true,
                            readOnly: true
                          }}
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
