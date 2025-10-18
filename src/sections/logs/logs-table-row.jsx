import { useState } from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import IconButton from '@mui/material/IconButton'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import Chip from '@mui/material/Chip'
import Alert from '@mui/material/Alert'
import VisibilityIcon from '@mui/icons-material/Visibility'
import AddCircleIcon from '@mui/icons-material/AddCircle'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined'
import { colorChangeOfExpiry } from '../../utils/expiryHelper'
import { format } from 'date-fns'

// ----------------------------------------------------------------------

export function LogsTableRow({
  vendors,
  purchaseOrderData,
  materials,
  setUpdate,
  row,
  selected,
  onSelectRow
}) {
  const [openModal, setOpenModal] = useState(false)

  const handleOpenModal = () => setOpenModal(true)
  const handleCloseModal = () => setOpenModal(false)

  // Get the data to display (prioritize recordData, fallback to data)
  const displayData = row.recordData || row.data || {}
  const isDeleted = !row.recordData && row.action?.toUpperCase() === 'DELETE'
  const isCreated = row.action?.toUpperCase() === 'CREATE'

  // Function to render field values
  const renderValue = (value) => {
    if (value === null || value === undefined) {
      return <Typography variant="body2" color="text.secondary">N/A</Typography>
    }
    
    if (typeof value === 'boolean') {
      return <Chip label={value ? 'Yes' : 'No'} size="small" color={value ? 'success' : 'default'} />
    }
    
    if (typeof value === 'object' && !Array.isArray(value)) {
      return <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(value, null, 2)}</pre>
    }
    
    if (Array.isArray(value)) {
      return <pre style={{ margin: 0, fontSize: '12px', whiteSpace: 'pre-wrap' }}>{JSON.stringify(value, null, 2)}</pre>
    }
    
    // Check if it's a date string
    if (typeof value === 'string' && !isNaN(Date.parse(value)) && value.includes('-')) {
      try {
        return format(new Date(value), 'dd-MM-yyyy HH:mm:ss')
      } catch {
        return value
      }
    }
    
    return value
  }

  // Function to format field names (camelCase to Title Case)
  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, (str) => str.toUpperCase())
      .trim()
  }

  // Get action color
  const getActionColor = (action) => {
    const colors = {
      CREATE: 'success',
      UPDATE: 'info',
      DELETE: 'error',
      READ: 'default',
    }
    return colors[action?.toUpperCase()] || 'default'
  }

  // Get action icon
  const getActionIcon = (action) => {
    const icons = {
      CREATE: <AddCircleIcon fontSize="small" />,
      UPDATE: <EditIcon fontSize="small" />,
      DELETE: <DeleteIcon fontSize="small" />,
      READ: <VisibilityOutlinedIcon fontSize="small" />,
    }
    return icons[action?.toUpperCase()] || null
  }

  // Get reference info
  const getReferenceInfo = () => {
    if (isDeleted) {
      return {
        type: 'deleted',
        message: 'This record has been deleted and is no longer available in the system.',
        severity: 'error',
        icon: <DeleteIcon />
      }
    }
    if (isCreated) {
      return {
        type: 'created',
        message: 'This record was created during this action.',
        severity: 'success',
        icon: <AddCircleIcon />
      }
    }
    if (row.recordData) {
      return {
        type: 'active',
        message: 'This record is currently active in the system.',
        severity: 'info',
        icon: null
      }
    }
    return null
  }

  const referenceInfo = getReferenceInfo()

  return (
    <>
      <TableRow style={{ backgroundColor: colorChangeOfExpiry(row.expiryDate) }}>
        <TableCell>{row.model}</TableCell>
        <TableCell>
          <Chip 
            label={row.action} 
            color={getActionColor(row.action)} 
            size="small"
            icon={getActionIcon(row.action)}
          />
        </TableCell>
        <TableCell>{row.user}</TableCell>
        <TableCell>{format(new Date(row.timestamp), 'dd-MM-yyyy HH:mm:ss')}</TableCell>
        <TableCell>
          <Typography variant="caption" sx={{ fontFamily: 'monospace' }}>
            {row.recordId}
          </Typography>
        </TableCell>
        <TableCell align="center">
          <IconButton 
            onClick={handleOpenModal} 
            color="primary" 
            size="small"
            disabled={!displayData || Object.keys(displayData).length === 0}
          >
            <VisibilityIcon />
          </IconButton>
        </TableCell>
      </TableRow>

      {/* Modal for viewing data */}
      <Dialog 
        open={openModal} 
        onClose={handleCloseModal}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="h6">
                {row.action} - {row.model}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Record ID: {row.recordId}
              </Typography>
            </Box>
            <Chip 
              label={row.action} 
              color={getActionColor(row.action)} 
              size="small"
              icon={getActionIcon(row.action)}
            />
          </Box>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            {format(new Date(row.timestamp), 'dd-MM-yyyy HH:mm:ss')} by {row.user}
          </Typography>
        </DialogTitle>
        
        <DialogContent dividers>
          {/* Reference Info Alert */}
          {referenceInfo && (
            <Alert 
              severity={referenceInfo.severity} 
              icon={referenceInfo.icon}
              sx={{ mb: 3 }}
            >
              <Typography variant="body2">
                <strong>{referenceInfo.type.toUpperCase()}:</strong> {referenceInfo.message}
              </Typography>
            </Alert>
          )}

          {/* Show data from row.data if record is deleted */}
          {isDeleted && row.data && Object.keys(row.data).length > 0 && (
            <Box sx={{ mb: 2 }}>
              <Alert severity="warning" sx={{ mb: 2 }}>
                Showing snapshot of data at the time of deletion
              </Alert>
            </Box>
          )}

          {/* Show current data if record still exists */}
          {row.recordData && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2, color: 'primary.main' }}>
                Current Record Data:
              </Typography>
            </Box>
          )}

          {Object.keys(displayData).length > 0 ? (
            <Box>
              {Object.entries(displayData).map(([key, value]) => {
                // Skip internal MongoDB fields if you want
                if (key === '__v') {
                  return null
                }
                
                return (
                  <Box 
                    key={key} 
                    sx={{ 
                      mb: 2, 
                      pb: 2, 
                      borderBottom: '1px solid #e0e0e0',
                      '&:last-child': { borderBottom: 'none' }
                    }}
                  >
                    <Typography 
                      variant="subtitle2" 
                      color="text.secondary" 
                      gutterBottom
                      sx={{ fontWeight: 600 }}
                    >
                      {formatFieldName(key)}:
                    </Typography>
                    <Box sx={{ pl: 2 }}>
                      {renderValue(value)}
                    </Box>
                  </Box>
                )
              })}
            </Box>
          ) : (
            <Typography color="text.secondary" align="center">
              No data available
            </Typography>
          )}

          {/* Additional info section */}
          <Box sx={{ mt: 3, pt: 2, borderTop: '1px solid #e0e0e0' }}>
            <Typography variant="caption" color="text.secondary">
              <strong>Action:</strong> {row.action} | 
              <strong> Model:</strong> {row.model} | 
              <strong> Record ID:</strong> {row.recordId}
            </Typography>
          </Box>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={handleCloseModal} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}