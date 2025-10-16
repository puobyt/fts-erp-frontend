import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Chip from '@mui/material/Chip'
import { format } from 'date-fns'

function getStatus (expiryIso) {
  const now = Date.now()
  const exp = new Date(expiryIso).getTime()
  return exp >= now ? 'ACTIVE' : 'EXPIRED'
}

export function CertificationsTableRow ({ row }) {
  const status = getStatus(row.expiryDate)
  return (
    <TableRow>
      <TableCell>{row.name}</TableCell>
      <TableCell>{row.email}</TableCell>
      <TableCell>{format(new Date(row.expiryDate), 'dd-MM-yyyy')}</TableCell>
      <TableCell>
        <Chip label={status} color={status === 'ACTIVE' ? 'success' : 'error'} size='small' />
      </TableCell>
    </TableRow>
  )
}


