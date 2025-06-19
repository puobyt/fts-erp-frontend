import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'
import ImportExcel from '../../../utils/ExcelImport'
import { DashboardContent } from 'src/layouts/dashboard'
import { _users } from 'src/_mock'
import { Iconify } from 'src/components/iconify'
import { Scrollbar } from 'src/components/scrollbar'

import { TableNoData } from '../table-no-data'

import { TableEmptyRows } from '../table-empty-rows'

import { ProcessOrderTableHead } from '../processOrder-table-head'
import { ProcessOrderTableRow } from '../processOrder-row'
import { ProcessOrderToolbar } from '../processOrder-table-toolbar'
import ProcessOrderForm from '../../../layouts/modals/addProcessOrder'
import { emptyRows, applyFilter, getComparator } from '../utils'

import axiosInstance from 'src/configs/axiosInstance'
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'
import { varAlpha } from 'src/theme/styles'


// ----------------------------------------------------------------------

export function ProcessOrderView () {
  const table = useTable()
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [processOrders, setProcessOrders] = useState([])
  // const [materialNames, setMaterialNames] = useState([])
  const fetchprocessOrders = async () => {
    try {
      setLoading(true)
      const result = await axiosInstance.get('/processOrder');
      if (result.data.data) {

        setProcessOrders(result.data.data)
        setLoading(false)
        // setMaterialNames(result.data.materials)
      }
    } catch (err) {
      console.error(
        'Error occured in fetching vendors inc client side',
        err.message
      )
    }
  }
  const [filterName, setFilterName] = useState('')
  useEffect(() => {
    fetchprocessOrders()
  }, [update])

  const dataFiltered = applyFilter({
    inputData: processOrders,
    comparator: getComparator(table.order, table.orderBy),
    filterName
  })

  const notFound = !dataFiltered.length && !!filterName

  const renderFallback = (
    <Box
     display='flex'
      alignItems='center'
      justifyContent='center'
      flex='1 1 auto'
    >
      <LinearProgress
        sx={{
          width: 1150,
          bgcolor: theme =>
            varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
          [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' }
        }}
      />
    </Box>
  )
  return (
    <DashboardContent>
      <Box display='flex' alignItems='center' mb={5}  sx={{ gap: 2 }}>
        <Typography variant='h4' flexGrow={1}>
         Process Order Details
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}

        <ProcessOrderForm setUpdate={setUpdate} />
        <ImportExcel setUpdate={setUpdate}/>
      </Box>

      <Card>
      {loading && renderFallback}
        <ProcessOrderToolbar
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
              <ProcessOrderTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={processOrders.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     _users.map((user) => user.id)
                //   )
                // }
                headLabel={[
                  { id: 'processOrderNumber', label: 'Process Order Number' },
                  { id: 'plant', label: 'Plant' },
                  { id: 'equipment', label: 'Equipment' },
                  { id: 'startDate', label: 'Start Date' },
                  { id: 'finishDate', label: 'Finish Date' },
                  { id: 'productName', label: 'Product Name' },
                  { id: 'productCode', label: ' Product Code' },
                  { id: 'batchNumber', label: 'GRN' },
                  { id: 'orderQuantity', label: 'Order Quantity' },
                  { id: 'materialCode', label: 'Material Code(Material Input)' },
                  { id: 'materialQuantity', label: 'Material Quantity(Material Input) ' },
                  { id: 'batch', label: 'Batch(Material Input) ' },
                  { id: 'storageLocation', label: 'Storage Location(Material Input) ' },

                  { id: 'materialCode', label: 'Material Code(Material Output)' },
                  { id: 'materialQuantity', label: 'Material Quantity(Material Output) ' },
                  { id: 'batch', label: 'Batch(Material Output) ' },
                  { id: 'storageLocation', label: 'Storage Location(Material Output) ' },
                  { id: 'yield', label: 'Yield(Material Output) ' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <ProcessOrderTableRow
                      setUpdate={setUpdate}
                      key={index}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(
                    table.page,
                    table.rowsPerPage,
                    processOrders.length
                  )}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
      

        <TablePagination
          component='div'
          page={table.page}
          count={processOrders.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  )
}

// ----------------------------------------------------------------------

export function useTable () {
  const [page, setPage] = useState(0)
  const [orderBy, setOrderBy] = useState('name')
  const [rowsPerPage, setRowsPerPage] = useState(5)
  const [selected, setSelected] = useState([]) // Ensure this is an array
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
