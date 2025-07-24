import { useState, useCallback, useEffect } from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';
import { _users } from 'src/_mock';
import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';

import { TableEmptyRows } from '../table-empty-rows';
import { OutOfStockTableHead } from '../outOfStock-table-head';
import { OutOfStockTableToolbar } from '../outOfStock-table-toolbar';
import { OutOfStockTableRow } from '../outOfStock-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';
import MainStockForm from '../../../layouts/modals/addMainStock';
import axiosInstance from 'src/configs/axiosInstance';
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'
import { varAlpha } from 'src/theme/styles'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'




// ----------------------------------------------------------------------

export function OutOfStockView() {
  const table = useTable();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [outOfStocks, setOutOfStocks] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0)
  const [finishedGoods, setFinishedGoods] = useState([])

  const fetchOutOfStocks = async () => {
    try {
      setLoading(true)
      const result = await axiosInstance.get('/outOfStock');
      if (result.data.data) {
        const data = result.data.data;

        // Filter items with GRN (non-finished goods)
        const outOfStocks = data.filter(item => item.grn !== null && item.grn !== undefined);

        // Filter items without GRN (finished goods)
        const finishedGoods = data.filter(item => !item.grn);

        // Update state
        setOutOfStocks(outOfStocks);
        setFinishedGoods(finishedGoods);

        setLoading(false)
      }
    } catch (err) {
      console.error('Error occured in fetching vendors inc client side', err.message)
    }
  }
  const [filterName, setFilterName] = useState('');
  useEffect(() => {
    fetchOutOfStocks();
  }, [update]);

  const getCurrentEntries = () => {
    if (selectedTab === 0) return outOfStocks
    if (selectedTab === 1) return finishedGoods
  }


  const dataFiltered = applyFilter({
    inputData: getCurrentEntries(),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
    table.onResetPage()
  }

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
          Out Of Stock Management
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}

        {/* <MainStockForm setUpdate={setUpdate}/> */}

      </Box>
      <Tabs value={selectedTab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label='Main Stock' />
        <Tab label='Finished Goods' />
      </Tabs>

      <Card>
        {loading && renderFallback}
        <OutOfStockTableToolbar
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
            <OutOfStockTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={outOfStocks.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     _users.map((user) => user.id)
              //   )
              // }
              headLabel={selectedTab===0 ? [
                { id: 'materialName', label: 'Material Name' },
                { id: 'grn', label: 'GRN' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'price', label: 'Price' },
                { id: 'storageLocation', label: 'Storage Location' },
                { id: 'vendorName', label: 'vendorName' },
                { id: 'dateRecieved', label: 'Date Recieved' },
                { id: 'expiryDate', label: 'Expiry' },
              ] :[
                { id: 'materialName', label: 'Material Name' },
                { id: 'materialCode', label: 'Material Code' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'storageLocation', label: 'Storage Location' },
                { id: 'vendorName', label: 'vendorName' },
                { id: 'productionDate', label: 'Production Date' },
              ] }
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <OutOfStockTableRow
                    outOfStocks={outOfStocks}
                    setUpdate={setUpdate}
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                    selectedTab={selectedTab}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, outOfStocks.length)}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
        </TableContainer>


        <TablePagination
          component="div"
          page={table.page}
          count={outOfStocks.length}
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
  const [selected, setSelected] = useState([]);  // Ensure this is an array
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
  };
}
