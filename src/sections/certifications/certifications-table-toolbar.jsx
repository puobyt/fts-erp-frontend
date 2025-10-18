import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import OutlinedInput from '@mui/material/OutlinedInput'
import InputAdornment from '@mui/material/InputAdornment'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import { Iconify } from 'src/components/iconify'

export function CertificationsTableToolbar ({
  filterName,
  onFilterName,
  status,
  onChangeStatus,
  onClear
}) {
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: theme => theme.spacing(0, 1, 0, 3)
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        <OutlinedInput
          fullWidth
          value={filterName}
          onChange={onFilterName}
          placeholder='Search certificates...'
          startAdornment={
            <InputAdornment position='start'>
              <Iconify width={20} icon='eva:search-fill' sx={{ color: 'text.disabled' }} />
            </InputAdornment>
          }
          sx={{ maxWidth: 320 }}
        />

        <Select size='small' value={status} onChange={onChangeStatus} sx={{ minWidth: 160 }}>
          <MenuItem value='ALL'>All</MenuItem>
          <MenuItem value='ACTIVE'>Active</MenuItem>
          <MenuItem value='EXPIRED'>Expired</MenuItem>
        </Select>

        <Box sx={{ flexGrow: 1 }} />
        <Button variant='text' color='inherit' onClick={onClear}>
          Clear all
        </Button>
      </Box>
    </Toolbar>
  )
}


