import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import { TextField, Container, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, MenuItem } from '@mui/material'
import axiosInstance from 'src/configs/axiosInstance'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
}

export default function ViewRework({ reworkData }) {
  const [open, setOpen] = useState(false)
  const [reworkParameters, setReworkParameters] = useState([])
  const navigate = useNavigate()
  const handleOpen = async () => {
    setOpen(true)
    // Optionally fetch related rework parameter records
    try {
      const res = await axiosInstance.get(`/rework-parameters?reworkId=${reworkData._id}`)
      setReworkParameters(res.data || [])
    } catch {
      setReworkParameters([])
      // toast.error("Unable to fetch rework parameters")  // Optional
    }
  }
  const handleClose = () => setOpen(false)

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
                View Rework Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Rework Management
              </Typography>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={reworkData.batchNumber}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material Name'
                    name='materialName'
                    value={reworkData.materialName}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Inspection Date'
                    name='inspectionDate'
                    type='text'
                    value={reworkData.inspectionDate}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Inspector Name'
                    name='inspectorName'
                    value={reworkData.inspectorName}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Issue Description'
                    name='issueDescription'
                    value={reworkData.issueDescription}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Proposed Rework Action'
                    name='proposedReworkAction'
                    value={reworkData.proposedReworkAction}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Rework Start Date'
                    name='reworkStartDate'
                    type='text'
                    value={reworkData.reworkStartDate}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Rework Completion Date'
                    name='reworkCompletionDate'
                    type='date'
                    value={reworkData.reworkCompletionDate}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quantity For Rework In Unit'
                    name='quantityForRework'
                    value={reworkData.quantityForRework}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Rework Status'
                    name='reworkStatus'
                    value={reworkData.reworkStatus}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Comments'
                    name='comments'
                    value={reworkData.comments}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* Rework Parameters Table */}
            <Box sx={{ mt: 4 }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Rework Parameters
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Step Name</TableCell>
                      <TableCell>Description</TableCell>
                      <TableCell>Result</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {reworkParameters.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={4} align="center">
                          No rework steps/parameters found.
                        </TableCell>
                      </TableRow>
                    )}
                    {reworkParameters.map((param, idx) => (
                      <TableRow key={param._id || idx}>
                        <TableCell>{param.stepName}</TableCell>
                        <TableCell>{param.description}</TableCell>
                        <TableCell>{param.result}</TableCell>
                        <TableCell>{param.remarks}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

          </Paper>
        </Container>
      </Modal>
    </div>
  )
}