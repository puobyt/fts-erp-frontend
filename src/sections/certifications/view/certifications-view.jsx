import { useEffect, useMemo, useState, useCallback } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'

import { DashboardContent } from 'src/layouts/dashboard'
import { CertificationsTableToolbar } from '../certifications-table-toolbar'
import { CertificationsTableRow } from '../certifications-table-row'
import { CertificationsTableHead } from '../certifications-table-head'
import { TableNoData } from 'src/sections/user/table-no-data'
import { TableEmptyRows } from 'src/sections/user/table-empty-rows'
import { emptyRows, getComparator, applyFilter } from '../utils'
import AddCertificationModal from 'src/layouts/modals/addCertification'
import axiosInstance from 'src/configs/axiosInstance'

export function useTable () {
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState('name')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [order, setOrder] = useState('asc')

  const onSort = useCallback(
    id => {
      const isAsc = orderBy === id && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(id)
    },
    [order, orderBy]
  )

  const onResetPage = useCallback(() => {
    setPage(0)
  }, [])

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage)
  }, [])

  const onChangeRowsPerPage = useCallback(
    event => {
      setRowsPerPage(parseInt(event.target.value, 10))
      onResetPage()
    },
    [onResetPage]
  )

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    onSort,
    onResetPage,
    onChangePage,
    onChangeRowsPerPage
  }
}

export default function CertificationsView () {
  const table = useTable()
  const [openModal, setOpenModal] = useState(false)

  const [certifications, setCertifications] = useState([])
  const [loading, setLoading] = useState(false)
  const [refreshFlag, setRefreshFlag] = useState(false)

  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('ALL') // ALL | ACTIVE | EXPIRED

  const dataFiltered = useMemo(
    () =>
      applyFilter({
        inputData: certifications,
        comparator: getComparator(table.order, table.orderBy),
        filterName: search,
        status
      }),
    [certifications, search, status, table.order, table.orderBy]
  )

  const notFound = !dataFiltered.length && (!!search || status !== 'ALL')

  const fetchCertificates = async () => {
    try {
      setLoading(true)
      const res = await axiosInstance.get('/certificates')
      const list = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : []
      const normalized = list.map((item) => ({
        id: item.id || item._id || String(Math.random()),
        name: item.certificateName || item.name || '',
        email: item.email || '',
        expiryDate: item.expiryDate || item.expiry || '',
        createdBy: item.createdBy || ''
      }))
      setCertifications(normalized)
    } catch (e) {
      // silent fail for now
      // console.error('Failed to fetch certificates', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCertificates()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshFlag])

  const handleCreate = async (formData) => {
    try {
      // Derive createdBy from local storage 'admin' if available (data.email)
      let createdBy = ''
      try {
        const raw = localStorage.getItem('admin')
        if (raw) {
          const parsed = JSON.parse(raw)
          createdBy = parsed?.email || createdBy
        }
      } catch {}

      const payload = {
        certificateName: formData.name,
        email: formData.email,
        expiryDate: formData.expiryDate,
        createdBy
      }
      const res = await axiosInstance.post('/newCertificate', payload)
      // Optionally log response
      // console.log('Create certificate response:', res?.data)
      setOpenModal(false)
      setRefreshFlag(prev => !prev)
    } catch (e) {
      // console.error('Failed to create certificate', e)
    }
  }

  return (
    <DashboardContent>
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' flexGrow={1}>
          Certification Management
        </Typography>
        <Button variant='contained' onClick={() => setOpenModal(true)}>
          Create
        </Button>
      </Box>

      <Card>
        <CertificationsTableToolbar
          filterName={search}
          onFilterName={e => {
            setSearch(e.target.value)
            table.onResetPage()
          }}
          status={status}
          onChangeStatus={e => {
            setStatus(e.target.value)
            table.onResetPage()
          }}
          onClear={() => {
            setSearch('')
            setStatus('ALL')
            table.onResetPage()
          }}
        />

        <TableContainer sx={{ overflow: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <CertificationsTableHead
              order={table.order}
              orderBy={table.orderBy}
              onSort={table.onSort}
              headLabel={[
                { id: 'name', label: 'Certificate Name' },
                { id: 'email', label: 'Email' },
                { id: 'expiryDate', label: 'Expiry Date' },
                { id: 'status', label: 'Status' }
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map(row => (
                  <CertificationsTableRow key={row.id} row={row} />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(
                  table.page,
                  table.rowsPerPage,
                  dataFiltered.length
                )}
              />

              {notFound && <TableNoData searchQuery={search} />}
            </TableBody>
          </Table>
          <TablePagination
            component='div'
            page={table.page}
            count={dataFiltered.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </TableContainer>
      </Card>

      <AddCertificationModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={handleCreate}
      />
    </DashboardContent>
  )
}


