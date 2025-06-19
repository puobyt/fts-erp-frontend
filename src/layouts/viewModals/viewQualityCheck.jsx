import * as React from 'react'
import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import Modal from '@mui/material/Modal'
import { Iconify } from 'src/components/iconify'
import toast, { Toaster } from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'
import '../../global.css'
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

export default function ViewQualityCheck({ qualityCheckData }) {
  const [open, setOpen] = useState(false)
  const [qcParameters, setQcParameters] = useState([])
  const navigate = useNavigate()
  const handleOpen = async () => {
    setOpen(true)
    // Fetch parameter results for this QC
    try {
      const res = await axiosInstance.get(`/qc-parameters/results?qualityCheck=${qualityCheckData._id}`)
      setQcParameters(res.data || [])
    } catch (err) {
      setQcParameters([])
      toast.error("Unable to fetch QC parameters")
    }
  }
  const handleClose = () => setOpen(false)
  const formattedDate = qualityCheckData.inspectionDate
    ? new Date(qualityCheckData.inspectionDate).toISOString().split('T')[0]
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
          <Paper elevation={4} sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 1 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography
                component='h1'
                variant='h5'
                fontWeight='bold'
                color='primary'
                gutterBottom
              >
                View Quality Check Details
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Quality Check Management
              </Typography>
            </Box>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material Name'
                    name='materialName'
                    value={qualityCheckData.materialName}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Material Code'
                    name='materialCode'
                    value={qualityCheckData.materialCode}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Batch Number'
                    name='batchNumber'
                    value={qualityCheckData.batchNumber}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Inspection Date'
                    name='inspectionDate'
                    type='text'
                    value={formattedDate}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Inspector Name'
                    name='inspectorName'
                    value={qualityCheckData.inspectorName}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Quality Status'
                    name='qualityStatus'
                    value={qualityCheckData.qualityStatus}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label='Comments'
                    name='comments'
                    value={qualityCheckData.comments}
                    variant='filled'
                    InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                  />
                </Grid>
              </Grid>
            </Box>

            {/* QC Parameters Table */}
            <Box sx={{ mt: 4 }}>
              <Typography variant='h6' sx={{ mb: 2 }}>
                Quality Parameters
              </Typography>
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Parameter Name</TableCell>
                      <TableCell>Method of Analysis</TableCell>
                      <TableCell>Min</TableCell>
                      <TableCell>Max</TableCell>
                      <TableCell>Unit</TableCell>
                      <TableCell>Actual Result</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Remarks</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {qcParameters.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={8} align="center">
                          No parameters found for this QC record.
                        </TableCell>
                      </TableRow>
                    )}
                    {qcParameters.map((param, idx) => (
                      <TableRow key={param._id || idx}>
                        <TableCell>{param?.parameter?.parameterName || ''}</TableCell>
                        <TableCell>{param?.parameter?.methodOfAnalysis || ''}</TableCell>
                        <TableCell>{param?.parameter?.minRange ?? ''}</TableCell>
                        <TableCell>{param?.parameter?.maxRange ?? ''}</TableCell>
                        <TableCell>{param?.parameter?.unit || ''}</TableCell>
                        <TableCell>{param.actualResult}</TableCell>
                        <TableCell>
                          <Typography color={param.status === 'PASS' ? 'green' : 'red'}>
                            {param.status}
                          </Typography>
                        </TableCell>
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