import React, { useEffect, useState } from 'react'
import { Modal, Box, TextField, Button, Typography, Grid, Paper } from '@mui/material'
import axiosInstance from 'src/configs/axiosInstance'
import { Toaster, toast } from 'react-hot-toast'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 500,
  bgcolor: 'background.paper',
  boxShadow: 24,
  borderRadius: 2,
  p: 4
}

export default function QCParameterForm({ open, onClose, onSuccess, editData }) {
  const [form, setForm] = useState({
    parameterName: '',
    minRange: '',
    maxRange: '',
    unit: '',
    methodOfAnalysis: ''
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (editData) setForm(editData)
    else setForm({ parameterName: '', minRange: '', maxRange: '', unit: '', methodOfAnalysis: '' })
  }, [editData, open])

  const validate = () => {
    const newErrors = {}
    if (!form.parameterName) newErrors.parameterName = 'Required'
    if (form.minRange === '') newErrors.minRange = 'Required'
    if (form.maxRange === '') newErrors.maxRange = 'Required'
    if (!form.methodOfAnalysis) newErrors.methodOfAnalysis = 'Required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      if (editData) {
        await axiosInstance.put(`/qc-parameters/${editData._id}`, form)
        toast.success('Parameter updated!')
      } else {
        await axiosInstance.post('/qc-parameters', form)
        toast.success('Parameter created!')
      }
      onSuccess && onSuccess()
      onClose()
    } catch (e) {
      toast.error('Error saving parameter')
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Toaster position="top-center" />
        <Typography variant="h6" mb={2}>{editData ? "Edit" : "New"} QC Parameter</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                label="Parameter Name"
                name="parameterName"
                fullWidth
                value={form.parameterName}
                onChange={handleChange}
                error={!!errors.parameterName}
                helperText={errors.parameterName}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Min Range"
                name="minRange"
                type="number"
                fullWidth
                value={form.minRange}
                onChange={handleChange}
                error={!!errors.minRange}
                helperText={errors.minRange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Max Range"
                name="maxRange"
                type="number"
                fullWidth
                value={form.maxRange}
                onChange={handleChange}
                error={!!errors.maxRange}
                helperText={errors.maxRange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Unit"
                name="unit"
                fullWidth
                value={form.unit}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                label="Method of Analysis"
                name="methodOfAnalysis"
                fullWidth
                value={form.methodOfAnalysis}
                onChange={handleChange}
                error={!!errors.methodOfAnalysis}
                helperText={errors.methodOfAnalysis}
              />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" type="submit">
                {editData ? "Update" : "Create"}
              </Button>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Modal>
  )
}