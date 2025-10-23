import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
// import Link from '@mui/material/Link'
import { Link } from 'react-router-dom'
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

export function SignInView () {
  const router = useRouter()

  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  useEffect(() => {
    const adminToken = localStorage.getItem('adminToken')
    if (adminToken) {
      router.replace('/')
    }
  }, [])
  const validate = () => {
    const newErrors = {}
    if (!email) newErrors.email = 'Email is required'
    else if (!/^[^\s@]+@[^\s@]+\.com$/.test(email))
      newErrors.email = 'Email is inavlid'
    if (!password) newErrors.password = 'Password is required'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleLogin = useCallback(
    async e => {
      try {
        e.preventDefault()
        if (!validate()) return

        await axiosInstance
          .post('/signIn', {
            email,
            password
          })
          .then(res => {

            toast.success(res.data.message)
            if (res.data.adminToken) {
              localStorage.setItem('adminToken', res.data.adminToken)

              localStorage.setItem('admin', JSON.stringify(res.data.adminData));
              // Dispatch custom event to notify other components
              window.dispatchEvent(new CustomEvent('adminDataChanged'))
              router.replace('/')
            }
          })
          .catch(err => {
            console.log(err.response.data.message)
            toast.error(err.response.data.message)
          })
      } catch (error) {
        console.error('Error occurred during login:', error.message)
      }
    },
    [email, password, router]
  )

  const renderForm = (
    <Box display='flex' flexDirection='column' alignItems='flex-end'>
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

      {/* <Link variant='body2' color='inherit' sx={{ mb: 1.5 }}>
        Forgot password?
      </Link> */}

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

      <LoadingButton
        fullWidth
        size='large'
        type='submit'
        color='inherit'
        variant='contained'
        onClick={handleLogin}
      >
        Sign in
      </LoadingButton>
    </Box>
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
        <Typography variant='h5'>Sign in</Typography>
        <Typography variant='body2' color='text.secondary'>
          Don’t have an account?
          <Link
      to="/sign-up"
      style={{
        color: 'green',
        fontWeight: 600, // Slightly bolder
        marginLeft: '8px',
        textDecoration: 'none', // Removes underline
      }}
    >
      Get started
    </Link>
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
      </Divider> */}

      {/* <Box gap={1} display='flex' justifyContent='center'>
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
