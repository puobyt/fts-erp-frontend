import { useState, useCallback, useEffect } from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import Table from '@mui/material/Table'
import Button from '@mui/material/Button'
import TableBody from '@mui/material/TableBody'
import Typography from '@mui/material/Typography'
import TableContainer from '@mui/material/TableContainer'
import TablePagination from '@mui/material/TablePagination'

import { DashboardContent } from 'src/layouts/dashboard'
import { _users } from 'src/_mock'
import { Iconify } from 'src/components/iconify'
import { Scrollbar } from 'src/components/scrollbar'

import { TableNoData } from '../table-no-data'

import { TableEmptyRows } from '../table-empty-rows'

import { ProductionOrderCreationTableHead } from '../productionOrderCreation-table-head'
import { ProductionOrderCreationTableRow } from '../productionOrderCreation-row'
import { ProductionOrderCreationTableToolbar } from '../productionOrderCreation-table-toolbar'
import ProductionOrderCreationForm from '../../../layouts/modals/addProductionOrderCreation'
import { emptyRows, applyFilter, getComparator } from '../utils'

import axiosInstance from 'src/configs/axiosInstance'
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'
import { varAlpha } from 'src/theme/styles'



// ----------------------------------------------------------------------

export function ProductionOrderCreationView () {
  const table = useTable()
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [productionOrders, setProductionOrders] = useState([]);
  const [materialNames, setMaterialNames] = useState([]);
  const [processOrderNumbers, setProcessOrderNumbers] = useState([]);
  const fetchProductionOrders = async () => {
    try {
      setLoading(true)
      const result = await axiosInstance.get('/productionOrderCreation')
      if (result.data.data) {
        setProductionOrders(result.data.data)
        setMaterialNames(result.data.materials);
        setProcessOrderNumbers(result.data.processOrderNumbers);
        setLoading(false)
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
    fetchProductionOrders()
  }, [update])

  const dataFiltered = applyFilter({
    inputData: productionOrders,
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
      <Box display='flex' alignItems='center' mb={5}>
        <Typography variant='h4' flexGrow={1}>
          Production Order Creation
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}

        <ProductionOrderCreationForm setUpdate={setUpdate} materialNames={materialNames} processOrderNumbers={processOrderNumbers} />
      </Box>

      <Card>
      {loading && renderFallback}
        <ProductionOrderCreationTableToolbar
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
              <ProductionOrderCreationTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={productionOrders.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     _users.map((user) => user.id)
                //   )
                // }
                headLabel={[
                  { id: 'processOrder', label: 'Process Order Number' },
                  { id: 'plant', label: 'Plant' },
         
                  { id: 'productDescription', label: 'Product Description' },
                  { id: 'productName', label: 'Product Name' },
                  { id: 'productQuantity', label: 'Product Quantity' },
                  { id: 'batch', label: 'GRN' },
                  { id: 'materialList', label: 'Material List' },
                  { id: 'requiredQuantity', label: 'Required Quantity' },
                  { id: 'materialCode', label: 'Material Code' },
                  { id: 'instructions', label: 'Instructions' },
                  { id: 'startDate', label: 'Start Date' },
                  { id: 'endDate', label: 'End Date' }
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row, index) => (
                    <ProductionOrderCreationTableRow
                    materialNames={materialNames}
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
                    productionOrders.length
                  )}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
 

        <TablePagination
          component='div'
          page={table.page}
          count={productionOrders.length}
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
