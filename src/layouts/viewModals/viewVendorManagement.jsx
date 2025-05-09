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
import '../../global.css'
import { TextField, Container, Grid, Paper, MenuItem } from '@mui/material'
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

export default function ViewVendorManagement ({ vendorData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
      {/* <Button
           
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
         New Vendor Management
        </Button> */}
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
                View Vendor Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Vendor Management
              </Typography>
            </Box>
            <Box component='form'>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Name Of The Firm'
                    name='nameOfTheFirm'
                    value={vendorData.nameOfTheFirm}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Address'
                    name='address'
                    value={vendorData.address}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                    
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vendor Code'
                    name='vendorCode'
                    value={vendorData.vendorCode}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Number'
                    name='contactNumber'
                    value={vendorData.contactNumber}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Name'
                    name='contactPersonName'
                    value={vendorData.contactPersonName}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Contact Person Details'
                    name='contactPersonDetails'
                    value={vendorData.contactPersonDetails}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material'
                    name='material'
                    value={vendorData.material}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Bank Details'
                    name='bankDetails'
                    value={vendorData.bankDetails}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Pan'
                    name='pan'
                    value={vendorData.pan}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='GST'
                    name='gst'
                    value={vendorData.gst}
                    variant='filled'
                    InputProps={{
                      readOnly: true,
                      style: { borderRadius: 8 }
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
