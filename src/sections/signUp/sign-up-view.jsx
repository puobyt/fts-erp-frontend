import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import { Link as ReactLink } from 'react-router-dom'
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
import { OTPView } from '../otp/otp-view'
// ----------------------------------------------------------------------

export function SignUpView () {
  const router = useRouter()
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      router.replace('/')
    }
  }, [])
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [userName, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [email, setEmail] = useState('')
  const [step2, setStep2] = useState(false)
  const [otp, setOtp] = useState('')

  const validate = () => {
    const newErrors = {}
    if (!userName) newErrors.userName = 'Username is required'
    if (!email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.com$/.test(email))
      newErrors.email = 'Email is inavlid'
    if (!password) newErrors.password = 'Password is required'
    else if (password.length < 6)
      newErrors.password = ' Password requires minimum 6 characters'
    if (!confirmPassword)
      newErrors.confirmPassword = 'Confirm password is required'
    if (password != confirmPassword)
      newErrors.confirmPassword = 'Password is not match'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSignUp = useCallback(
    async e => {
      try {
        e.preventDefault()
        if (!validate()) return

        await axiosInstance
          .post('/signUp', {
            userName,
            email,
            password
          })
          .then(res => {
            if (res.data.success) {
              setStep2(true)
            }
          })
          .catch(err => {
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
          })
      } catch (error) {
        console.error(
          'Error occurred during sign up in client side:',
          error.message
        )
      }
    },
    [email, password, confirmPassword, userName, router]
  )

  const renderForm = (
    <Box display='flex' flexDirection='column' alignItems='flex-end'>
      <TextField
        fullWidth
        onChange={e => setUserName(e.target.value)}
        name='userName'
        type='text'
        label='Username'
        helperText={errors.userName}
        error={!!errors.userName}
        value={userName}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        onChange={e => setEmail(e.target.value)}
        name='email'
        type='email'
        label='Email address'
        helperText={errors.email}
        error={!!errors.email}
        value={email}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        name='password'
        label='Password'
        error={!!errors.password}
        helperText={errors.password}
        onChange={e => setPassword(e.target.value)}
        value={password}
        type={showPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge='end'
              >
                <Iconify
                  icon={
                    showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ mb: 3 }}
      />
      <TextField
        fullWidth
        name='confirmPassword'
        label='Confirm Password'
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword}
        onChange={e => setConfirmPassword(e.target.value)}
        value={confirmPassword}
        type={showConfirmPassword ? 'text' : 'password'}
        InputProps={{
          endAdornment: (
            <InputAdornment position='end'>
              <IconButton
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                edge='end'
              >
                <Iconify
                  icon={
                    showConfirmPassword
                      ? 'solar:eye-bold'
                      : 'solar:eye-closed-bold'
                  }
                />
              </IconButton>
            </InputAdornment>
          )
        }}
        sx={{ mb: 3 }}
      />

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        color='inherit'
        variant='contained'
        onClick={handleSignUp}
      >
        Sign up
      </LoadingButton>
    </Box>
  )
  if (step2) {
    return <OTPView email={email} />
  } else {
    return (
      <>
        <Box
          gap={1.5}
          display='flex'
          flexDirection='column'
          alignItems='center'
          sx={{ mb: 5 }}
        >
          <Typography variant='h5'>Sign up</Typography>
          <Typography variant='body2' color='text.secondary'>
            Already have an account?
            <ReactLink
              to='/sign-in'
              variant='subtitle2'
              style={{
                color: 'green',
                fontWeight: 600, 
                marginLeft: '8px',
                textDecoration: 'none' 
              }}
            >
              Login here
            </ReactLink>
          </Typography>
        </Box>

        {renderForm}
        <Toaster position='top-center' reverseOrder={false} />
        {/* <Divider
          sx={{ my: 3, '&::before, &::after': { borderTopStyle: 'dashed' } }}
        >
          <Typography
            variant='overline'
            sx={{ color: 'text.secondary', fontWeight: 'fontWeightMedium' }}
          >
            OR
          </Typography>
        </Divider>

        <Box gap={1} display='flex' justifyContent='center'>
          <IconButton color='inherit'>
            <Iconify icon='logos:google-icon' />
          </IconButton>
          <IconButton color='inherit'>
            <Iconify icon='eva:github-fill' />
          </IconButton>
          <IconButton color='inherit'>
            <Iconify icon='ri:twitter-x-fill' />
          </IconButton>
        </Box> */}
      </>
    )
  }
}
