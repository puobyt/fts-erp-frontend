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
import { TextField, Container,MenuItem, Grid, Paper } from '@mui/material'
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

export default function ViewFinishedGoodsForm ({finishedGoodsData}) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const formattedDate = finishedGoodsData.productionDate
  ? new Date(finishedGoodsData.productionDate).toISOString().split('T')[0]
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
                Edit Finished Goods Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Finished Goods Management
              </Typography>
            </Box>
            <Box component='form' >
              <Grid container spacing={2}>

                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Finished Goods Name'
                    name='finishedGoodsName'
                    value={finishedGoodsData.finishedGoodsName}
                
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={finishedGoodsData.batchNumber}
                 
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 },readOnly:true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Production Date'
                    name='productionDate'
                    type='date'
                    value={formattedDate}
                  
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
                    label='Quantity Produced'
                    name='quantityProduced'
                    value={finishedGoodsData.quantityProduced}
                 
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
