import * as React from 'react'
import { useState } from 'react'
import {
  Box,
  Typography,
  Modal,
  TextField,
  Container,
  MenuItem,
  Grid,
  Paper,
  Button,
  Link
} from '@mui/material'
import { Iconify } from 'src/components/iconify'
import { Toaster } from 'react-hot-toast'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  borderRadius: 2
}

export default function ViewGateEntry({ setUpdate, gateEntryData }) {
  const [open, setOpen] = useState(false)
  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  console.log('gateentrydata',gateEntryData)

  const isQcReturn = gateEntryData.gateType === 'qc_return_entry'
  const isExit = gateEntryData.gateType === 'return_exit'
  const isEntry = gateEntryData.gateType === 'entry'

  const fileUrl = (path) => `${import.meta.env.VITE_BACKEND_URL}/${path.replace(/\\/g, '/')}`

  return (
    <>
      <Toaster position='top-center' reverseOrder={false} />
      <MenuItem onClick={handleOpen}>
        <Iconify icon='solar:eye-bold' />
        View
      </MenuItem>

      <Modal  
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-title'
        aria-describedby='modal-description'
      >
        <Container maxWidth='xl' sx={{ mt: 8 }}>
          <Paper elevation={4} sx={style}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography variant='h5' fontWeight='bold' color='primary' gutterBottom>
                View Gate Entry Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Gate Type: {gateEntryData.gateType?.replace(/_/g, ' ')}
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {/* Entry / Exit Time */}
             {(gateEntryData.entryTime || gateEntryData.exitTime) && (
  <Grid item xs={6}>
    <TextField
      fullWidth
      label={(isQcReturn || isExit) ? 'Exit Time' : 'Entry Time'}
      value={(isQcReturn || isExit) ? gateEntryData.exitTime : gateEntryData.entryTime}
      variant='filled'
      InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
    />
  </Grid>
)}

              {/* Vehicle Number */}
              {gateEntryData.vehicleNumber && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vehicle Number'
                    value={gateEntryData.vehicleNumber}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
              )}

              {/* Document Number */}
              {gateEntryData.docNumber && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Doc Number'
                    value={gateEntryData.docNumber}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
              )}

              {/* Vendor */}
              {gateEntryData.vendorName && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Vendor Name'
                    value={gateEntryData.vendorName}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
              )}

              {/* Date */}
              {gateEntryData.date && (
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Date'
                    type='date'
                    value={new Date(gateEntryData.date).toISOString().split('T')[0]}
                    InputLabelProps={{ shrink: true }}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
              )}

              {/* QC-specific fields */}
              {(isQcReturn || isExit) && (
  <>
    <Grid item xs={6}>
      <TextField
        fullWidth
        label='Return Reason'
        value={gateEntryData.returnReason}
        variant='filled'
        InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
      />
    </Grid>

    <Grid item xs={6}>
      <TextField
        fullWidth
        label='Returned By'
        value={gateEntryData.returnedBy}
        variant='filled'
        InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
      />
    </Grid>
  </>
)}


              {/* Materials */}
              {gateEntryData.materials?.length > 0 &&
                gateEntryData.materials.map((mat, idx) => (
                  <React.Fragment key={idx}>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label='Material Name'
                        value={mat.materialName}
                        variant='filled'
                        InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <TextField
                        fullWidth
                        label='Quantity'
                        value={`${mat.returnedQuantity || mat.quantity || '0'} ${mat.unit || ''}`}
                        variant='filled'
                        InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                      />
                    </Grid>
                  </React.Fragment>
                ))}

              {/* QC Documents */}
              {gateEntryData.qcDocuments?.length > 0 &&
                gateEntryData.qcDocuments.map((doc, i) => (
                  <Grid item xs={12} key={i}>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        border: '1px solid #ccc',
                        p: 1.5,
                        borderRadius: 2,
                        backgroundColor: '#fff'
                      }}
                    >
                      <Typography variant='body2'>{doc.originalName}</Typography>
                     <Button
  variant="outlined"
  size="small"
  component={Link}
  href={fileUrl(doc.path)}
  target="_blank"
  rel="noopener noreferrer"
>
  View
</Button>

                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Paper>
        </Container>
      </Modal>
    </>
  )
}
