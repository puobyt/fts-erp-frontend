import { Box, Typography } from '@mui/material'

export const ColorOfExpiry = () => {
  return (
    <Box display='flex' alignItems='center' mb={2} gap={3}>
      <Box display='flex' alignItems='center' gap={1}>
        <Box sx={{width:14, height:14, bgcolor:"#f8d7da", borderRadius:'50%', border:'1.5px solid #d32f2f'}} />
        <Typography variant='body2' sx={{ mr: 2 }}>Expired</Typography>
        <Box sx={{width:14, height:14, bgcolor:"#fff3cd", borderRadius:'50%', border:'1.5px solid #ed6c02'}} />
        <Typography variant='body2' sx={{ mr: 2 }}>Near Expiry (&lt;30 days)</Typography>
        <Box sx={{width:14, height:14, bgcolor:"#e0f2f1", borderRadius:'50%', border:'1.5px solid #26a69a'}} />
        <Typography variant='body2'>Healthy</Typography>
      </Box>
    </Box>
  )
}

export default ColorOfExpiry