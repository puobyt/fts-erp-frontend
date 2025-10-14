import { useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Divider from '@mui/material/Divider'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import LoadingButton from '@mui/lab/LoadingButton'
import InputAdornment from '@mui/material/InputAdornment'
import axiosInstance from 'src/configs/axiosInstance'
import { useRouter } from 'src/routes/hooks'
import { Iconify } from 'src/components/iconify'
import toast, { Toaster } from 'react-hot-toast'

// ----------------------------------------------------------------------

export function OTPView ({ email }) {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [otp, setOtp] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!otp) newErrors.otp = 'Please enter your OTP'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = useCallback(
    async e => {
      try {
        e.preventDefault()
        if (!validate()) return

        await axiosInstance
          .post('/verifyOtp', { otp, email })
          .then(result => {
            if (result.data.success) {
              toast.success(`${result.data.message}, Please login `);
              setTimeout(() => {
                router.replace('/sign-in')
              }, 2000)
            } else {
              toast.error('OTP is invalid')
            }
          })
          .catch(err => {
            console.error(
              'Error occurred during OTP verification:',
              err.message
            )
            toast.error(err.response.data.message)
          })
      } catch (error) {
        console.error('Error occurred during OTP verification:', error.message)
      }
    },
    [otp, router]
  )

  return (
    <>
      <Box
        gap={1.5}
        display='flex'
        flexDirection='column'
        alignItems='center'
        sx={{ mb: 5 }}
      >
        <Typography variant='h5' align='center'>
          Admin will review your request and get back to you.
        </Typography>
      </Box>

      {/* Toaster component to show any notifications if required */}
      <Toaster position='top-center' reverseOrder={false} />
    </>
  )
}
