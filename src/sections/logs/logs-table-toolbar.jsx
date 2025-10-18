import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------


export function LogsTableToolbar({sort, numSelected, filterName, onFilterName, section, onChangeSection, sectionOptions = [], dateFrom, dateTo, onChangeDateFrom, onChangeDateTo, onClear }) {
  const handleSortClick = () => {
    sort('createdAt'); // Example: sorting by the "nameOfTheFirm" column
  };
  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
        ...(numSelected > 0 && {
          color: 'primary.main',
          bgcolor: 'primary.lighter',
        }),
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
        {numSelected > 0 ? (
          <Typography component="div" variant="subtitle1">
            {numSelected} selected
          </Typography>
        ) : (
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search logs..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
        )}

        <Select
          size="small"
          value={section}
          onChange={onChangeSection}
          displayEmpty
          sx={{ minWidth: 160 }}
        >
          {sectionOptions.map((opt) => (
            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
          ))}
        </Select>

        <TextField
          size="small"
          type="date"
          label="From"
          value={dateFrom}
          onChange={onChangeDateFrom}
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          size="small"
          type="date"
          label="To"
          value={dateTo}
          onChange={onChangeDateTo}
          InputLabelProps={{ shrink: true }}
        />

        <Box sx={{ flexGrow: 1 }} />
        <Button variant="text" color="inherit" onClick={onClear}>
          Clear all
        </Button>
      </Box>

      {numSelected > 0 ? (
        <Tooltip title="Delete">
          <IconButton>
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Filter list" onClick={handleSortClick}>
          <IconButton>
            <Iconify icon="ic:round-filter-list" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
