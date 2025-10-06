import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { _users } from 'src/_mock';

import { TableNoData } from '../table-no-data';

import { TableEmptyRows } from '../table-empty-rows';
import { MainStockTableHead } from '../mainStock-table-head';
import { MainStockTableRow } from '../mainStock-table-row';
import { MainStockTableToolbar } from '../mainStock-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import MainStockForm from '../../../layouts/modals/addMainStock';
import axiosInstance from 'src/configs/axiosInstance';
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'
import { varAlpha } from 'src/theme/styles'
import ColorOfExpiry from '../../../utils/ColorOfExpiry';
import { Button } from '@mui/material';
import { hasPermission } from '../../../utils/permissionCheck';




// ----------------------------------------------------------------------

export function MainStockView() {
  const table = useTable();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [mainStocks, setMainStocks] = useState([]);
  const fetchMainStock = async () => {
    try {
      setLoading(true)
      const result = await axiosInstance.get('/mainStock');
      if (result.data.data) {

        setMainStocks(result.data.data);
        setLoading(false)
      }
    } catch (err) {
      console.error('Error occured in fetching vendors inc client side', err.message)
    }
  }
  const [filterName, setFilterName] = useState('');
  useEffect(() => {
    fetchMainStock();
  }, [update]);


  const dataFiltered = applyFilter({
    inputData: mainStocks,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
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
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Main Stock Management
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => table.onSort('expiryDate')}  // Trigger sorting by expiry date
          sx={{ mr: 2 }}
        >
          Sort by Expiry Date
        </Button>

        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}
        {hasPermission('Main stock') === 'fullAccess' &&

          <MainStockForm setUpdate={setUpdate} />
        }

      </Box>

      <ColorOfExpiry />
      <Card>
        {loading && renderFallback}
        <MainStockTableToolbar
          sort={table.onSort}
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />


        <TableContainer sx={{ overflow: 'auto' }}>
          <Table sx={{ minWidth: 800 }}>
            <MainStockTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={mainStocks.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              headLabel={[
                { id: 'materialName', label: 'Material Name' },
                { id: 'materialCode', label: 'Material Code' },
                { id: 'grn', label: 'GRN' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'price', label: 'Price' },
                { id: 'storageLocation', label: 'Storage Location' },
                { id: 'vendorName', label: 'Vendor Name' },
                { id: 'dateRecieved', label: 'Date Received' },
                { id: 'expiryDate', label: 'Expiry Date' },  // Ensure expiryDate is included in headLabel
              ]}
            />

            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <MainStockTableRow

                    setUpdate={setUpdate}
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, mainStocks.length)}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>


        <TablePagination
          component="div"
          page={table.page}
          count={mainStocks.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]);
  const [order, setOrder] = useState('asc');

  const onSort = useCallback(
    (id) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onSelectAllRows = useCallback((checked, newSelecteds) => {
    if (checked) {
      setSelected(newSelecteds);
    } else {
      setSelected([]);
    }
  }, []);

  const onSelectRow = useCallback(
    (inputValue) => {
      setSelected((prevSelected) => {
        if (prevSelected.includes(inputValue)) {
          return prevSelected.filter((value) => value !== inputValue);
        } else {
          return [...prevSelected, inputValue];
        }
      });
    },
    []
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event, newPage) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  // Add sorting logic based on `expiryDate`
  const getComparator = (order, orderBy) => {
    return order === 'desc'
      ? (a, b) => (new Date(b[orderBy]) - new Date(a[orderBy]))
      : (a, b) => (new Date(a[orderBy]) - new Date(b[orderBy]));
  };

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
    onChangeRowsPerPage,
    getComparator, // return the comparator function
  };
}

