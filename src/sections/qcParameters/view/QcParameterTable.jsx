import  { useEffect, useState } from 'react'
import { Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Button, IconButton, Typography, Tooltip } from '@mui/material'
import { Iconify } from 'src/components/iconify'
import axiosInstance from 'src/configs/axiosInstance'
import QCParameterForm from '../../../layouts/modals/addQcParameterForm'

export default function QCParameterTable() {
  const [parameters, setParameters] = useState([])
  const [loading, setLoading] = useState(true)
  const [editParam, setEditParam] = useState(null)
  const [createOpen, setCreateOpen] = useState(false)

  const fetchParameters = async () => {
    setLoading(true)
    try {
      const res = await axiosInstance.get('/qc-parameters')
      setParameters(res.data || [])
    } catch {
      setParameters([])
    }
    setLoading(false)
  }

  useEffect(() => { fetchParameters() }, [])

  const handleEdit = (param) => setEditParam(param)
  const handleDelete = async (id) => {
    if (window.confirm('Delete this parameter?')) {
      await axiosInstance.delete(`/qc-parameters/${id}`)
      fetchParameters()
    }
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">QC Parameters</Typography>
        <Button variant="contained" onClick={() => setCreateOpen(true)}>
          <Iconify icon="mingcute:add-line" /> New Parameter
        </Button>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Parameter Name</TableCell>
              <TableCell>Min</TableCell>
              <TableCell>Max</TableCell>
              <TableCell>Unit</TableCell>
              <TableCell>Method of Analysis</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {parameters.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.parameterName}</TableCell>
                <TableCell>{row.minRange}</TableCell>
                <TableCell>{row.maxRange}</TableCell>
                <TableCell>{row.unit}</TableCell>
                <TableCell>{row.methodOfAnalysis}</TableCell>
                <TableCell>
                  <Tooltip title="Edit">
                    <IconButton onClick={() => handleEdit(row)}>
                      <Iconify icon="solar:pen-bold" />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Delete">
                    <IconButton onClick={() => handleDelete(row._id)}>
                      <Iconify icon="solar:trash-bin-trash-bold" color="red" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
            {parameters.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} align="center">No QC Parameters Found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <QCParameterForm open={createOpen} onClose={() => setCreateOpen(false)} onSuccess={fetchParameters} />
      <QCParameterForm open={!!editParam} editData={editParam} onClose={() => setEditParam(null)} onSuccess={fetchParameters} />
    </Box>
  )
}