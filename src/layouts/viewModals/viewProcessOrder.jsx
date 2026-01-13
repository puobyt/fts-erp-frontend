import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../../global.css'
import { TextField, Container, MenuItem, Grid, Paper, IconButton } from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '80%',
  maxWidth: 1200,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 0, // Changed to 0 to allow custom padding in child components
  maxHeight: '90vh',
  overflowY: 'auto'
}

export default function ViewProcessOrderForm ({ processOrderData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

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
        <Box sx={style}>
          <Paper
            elevation={4}
            sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 1 }}
          >
            {/* Header with close button */}
            <Box sx={{ 
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 3,
              position: 'relative'
            }}>
              <Box sx={{ textAlign: 'center', width: '100%' }}>
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
              <IconButton
                aria-label="close"
                onClick={handleClose}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box
              component='form'
              sx={{
                maxHeight: '65vh',
                overflowY: 'auto',
                paddingRight: 2
              }}
            >
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Process Order Number'
                    name='processOrderNumber'
                    value={processOrderData.processOrderNumber}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Plant'
                    name='plant'
                    value={processOrderData.plant}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Equipment'
                    name='equipment'
                    value={processOrderData.equipment}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type='text'
                    label='Start Date'
                    name='startDate'
                    value={processOrderData.startDate}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Finish Date'
                    type='text'
                    name='finishDate'
                    value={processOrderData.finishDate}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Product Code'
                    name='productCode'
                    value={processOrderData.productCode}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Product Name'
                    name='productName'
                    value={processOrderData.productName}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={processOrderData.batchNumber}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label='Order Quantity'
                    name='orderQuantity'
                    value={processOrderData.orderQuantity + ' ' + processOrderData?.unit || '---'}
                    InputProps={{
                      style: { borderRadius: 8 },
                      readOnly: true
                    }}
                    variant='filled'
                  />
                </Grid>
                
                <Grid item xs={12}>
                  <Typography
                    variant='subtitle2'
                    fontWeight='bold'
                    sx={{ mt: 2, mb: 1 }}
                  >
                    Material Input
                  </Typography>
                </Grid>

                {processOrderData.materialInput.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label='Material Code'
                        name='materialCode'
                        value={material.materialCode}
                        variant='filled'
                        InputProps={{
                          style: { borderRadius: 8 },
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label='Quantity'
                        name='quantity'
                        value={material.quantity + ' ' + material?.unit || '---'}
                        variant='filled'
                        InputProps={{
                          style: { borderRadius: 8 },
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label='Batch'
                        name='batch'
                        value={material.batch}
                        variant='filled'
                        InputProps={{
                          style: { borderRadius: 8 },
                          readOnly: true
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                      <TextField
                        fullWidth
                        label='Storage Location'
                        name='storageLocation'
                        value={material.storageLocation}
                        variant='filled'
                        InputProps={{
                          style: { borderRadius: 8 },
                          readOnly: true
                        }}
                      />
                    </Grid>
                  </React.Fragment>
                ))}
              </Grid>
            </Box>
          </Paper>
        </Box>
      </Modal>
    </div>
  )
}