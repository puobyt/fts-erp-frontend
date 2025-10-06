import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'

import { DashboardContent } from 'src/layouts/dashboard'
import { Iconify } from 'src/components/iconify'
import { Scrollbar } from 'src/components/scrollbar'
import { TableNoData } from '../table-no-data'
import { TableEmptyRows } from '../table-empty-rows'
import { GateEntryTableHead } from '../gateEntry-table-head'
import { GateEntryTableRow } from '../gateEntry-table-row'
import { GateEntryTableToolbar } from '../gateEntry-table-toolbar'
import { emptyRows, applyFilter, getComparator } from '../utils'
import GateEntryForm from '../../../layouts/modals/addGateEntry'
import axiosInstance from 'src/configs/axiosInstance'
import { varAlpha } from 'src/theme/styles'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import * as XLSX from 'xlsx'
import toast, { Toaster } from 'react-hot-toast';


export function GateEntryView() {
  const table = useTable()
  const [update, setUpdate] = useState(false)
  const [loading, setLoading] = useState(false)

  const [entryGateEntries, setEntryGateEntries] = useState([])
  const [qcReturnEntries, setQcReturnEntries] = useState([])
  const [exitGateEntries, setExitGateEntries] = useState([])
  const [firmNames, setFirmNames] = useState([])
  const [selectedTab, setSelectedTab] = useState(0)

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
    table.onResetPage()
  }

  const fetchGateEntry = async () => {
    try {
      setLoading(true)
      const result = await axiosInstance.get('/gateEntry')

      if (result.data.data) {
        const allEntries = result.data.data
        setFirmNames(result.data.firmNames || [])

        setEntryGateEntries(allEntries.filter(entry => entry.gateType === 'entry'))
        setQcReturnEntries(allEntries.filter(entry => entry.gateType === 'qc_return_entry'))
        setExitGateEntries(allEntries.filter(entry => entry.gateType === 'return_exit'))
      }
    } catch (err) {
      console.error('Error occured in fetching gate entries:', err.message)
    } finally {
      setLoading(false)
    }
  }

  const [filterName, setFilterName] = useState('')

  useEffect(() => {
    fetchGateEntry()
  }, [update])

  const getCurrentEntries = () => {
    if (selectedTab === 0) return entryGateEntries
    if (selectedTab === 1) return qcReturnEntries
    return exitGateEntries
  }

  const dataFiltered = applyFilter({
    inputData: getCurrentEntries(),
    comparator: getComparator(table.order, table.orderBy),
    filterName
  })

  const notFound = !dataFiltered.length && !!filterName

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      toast.error('No file selected!');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {

        const data = new Uint8Array(event.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetsData = {};
        workbook.SheetNames.forEach((sheetName) => {
          const sheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(sheet);
          sheetsData[sheetName] = jsonData;
        });

        const response = await axiosInstance.post('/import-newGateEntry', { sheetsData });
        if (response.status === 200) {
          setUpdate(prev => !prev);
          toast.success('Data imported successfully!');
        }
      } catch (err) {
        console.error('Error uploading data:', err);
        toast.error('Failed to import data!');
      }
    };

    reader.readAsArrayBuffer(file);
  };

  const renderFallback = (
    <Box display='flex' alignItems='center' justifyContent='center' flex='1 1 auto'>
      <LinearProgress
        sx={{
          width: 1150,
          bgcolor: theme => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
          [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' }
        }}
      />
    </Box>
  )

  const renderTable = entries => (
    <Card>
      {loading && renderFallback}
      <GateEntryTableToolbar
        sort={table.onSort}
        numSelected={table.selected.length}
        filterName={filterName}
        onFilterName={event => {
          setFilterName(event.target.value)
          table.onResetPage()
        }}
      />
      <TableContainer sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <GateEntryTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={entries.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            headLabel={[
              { id: 'vendorName', label: 'Vendor Name' },
              { id: 'vehicleNumber', label: 'Vehicle Number' },
              { id: 'materialName', label: 'Material Name' },
              { id: 'quantity', label: 'Quantity' },
              { id: 'docNumber', label: 'Doc Number' },
              { id: 'date', label: 'Date' },
              { id: 'entryTime', label: 'Entry Time' }
            ]}
          />
          <TableBody>
            {dataFiltered
              .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
              .map((row, index) => (
                <GateEntryTableRow
                  firmNames={firmNames}
                  setUpdate={setUpdate}
                  key={index}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                />
              ))}

            <TableEmptyRows
              height={68}
              emptyRows={emptyRows(table.page, table.rowsPerPage, entries.length)}
            />

            {notFound && <TableNoData searchQuery={filterName} />}
          </TableBody>
        </Table>
        <TablePagination
          component='div'
          page={table.page}
          count={entries.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </TableContainer>
    </Card>
  )

  return (
    <DashboardContent>
      <Toaster />
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' flexGrow={1}>
          Gate Entry
        </Typography>
        <GateEntryForm setUpdate={setUpdate} firmNames={firmNames} />
        <div >
          <input
            type="file"
            accept=".xlsx, .xls"
            style={{ display: 'none' }}
            id="excel-file-input"
            onChange={handleFileUpload} // Trigger file upload and submission
          />
          <label htmlFor="excel-file-input">
            <Button
              variant="contained"
              color="primary"
              component="span"
              startIcon={<CloudUploadIcon />}
              style={{ marginLeft: 10, marginRight: 10 }}
            >
              Import Excel
            </Button>
          </label>
          <a href={'/files/gate_entries_dummy.xlsx'} download>
            <button>Download Excel Format</button>
          </a>
        </div>
      </Box>

      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label='Entry' />
        <Tab label='QC Return Entry' />
        <Tab label='Exit' />
      </Tabs>

      {renderTable(getCurrentEntries())}
    </DashboardContent>
  )
}

export function useTable() {
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState('name')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selected, setSelected] = useState([])
  const [order, setOrder] = useState('asc')

  const onSort = useCallback(
    id => {
      const isAsc = orderBy === id && order === 'asc'
      setOrder(isAsc ? 'desc' : 'asc')
      setOrderBy(id)
    },
    [order, orderBy]
  )

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds)
    } else {
      setSelected([])
    }
  }, [])

  const onSelectRow = useCallback(inputValue => {
    setSelected(prevSelected => {
      if (prevSelected.includes(inputValue)) {
        return prevSelected.filter(value => value !== inputValue)
      } else {
        return [...prevSelected, inputValue]
      }
    })
  }, [])

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
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage
  }
}
