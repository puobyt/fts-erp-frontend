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

export default function ViewInvoiceCreationForm ({ invoiceData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const navigate = useNavigate();
  const formattedDate = invoiceData.invoiceDate
  ? new Date(invoiceData.invoiceDate).toISOString().split('T')[0]
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
                View Inovice Creation Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Invoice Creation Management
              </Typography>
            </Box>
            <Box component='form' >
              <Grid container spacing={2}>
    
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Invoice Number'
                    name='invoiceNumber'
                    value={invoiceData.invoiceNumber}
                  
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
                    label='customer ID'
                    name='customerId'
                    value={invoiceData.customerId}
                 
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
                    label='Invoice Date'
                    name='invoiceDate'
                    type='text'
                    value={invoiceData.invoiceDate}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Customer Name'
                    name='customerName'
                    value={invoiceData.customerName}
                  
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Customer Address'
                    name='customerAddress'
                    value={invoiceData.customerAddress}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                <TextField
                    fullWidth
             
                    label='Item Name'
                    name='itemName'
                    value={invoiceData.itemName}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  >
                

        
                  </TextField>
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quantity'
                    name='quantity'
                    value={invoiceData.quantity}
                  
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Price'
                    name='price'
                    value={invoiceData.price}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Invoice Prepared By:'
                    name='invoicePreparedBy'
                    value={invoiceData.invoicePreparedBy}
                 
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
