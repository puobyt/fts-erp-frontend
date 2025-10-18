import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'

export default function AddCertificationModal ({ open, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [expiryDate, setExpiryDate] = useState('')

  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!name.trim()) e.name = 'Certificate name is required'
    if (!expiryDate) e.expiryDate = 'Expiry date is required'
    if (!email.trim()) e.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = 'Invalid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    const payload = { name: name.trim(), email: email.trim(), expiryDate }
    // As requested: log to console
    console.log('Create certification:', payload)
    onSubmit?.(payload)
  }

  const handleClose = () => {
    setErrors({})
    onClose?.()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Create Certification</DialogTitle>
      <DialogContent>
        <Box display='grid' gridTemplateColumns='1fr' gap={2} mt={1}>
          <TextField
            label='Certificate Name'
            value={name}
            onChange={e => setName(e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />
          <TextField
            label='Email'
            value={email}
            onChange={e => setEmail(e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            fullWidth
          />
          <TextField
            label='Expiry Date'
            type='date'
            value={expiryDate}
            onChange={e => setExpiryDate(e.target.value)}
            error={!!errors.expiryDate}
            helperText={errors.expiryDate}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color='inherit'>Cancel</Button>
        <Button variant='contained' onClick={handleSubmit}>Submit</Button>
      </DialogActions>
    </Dialog>
  )
}


