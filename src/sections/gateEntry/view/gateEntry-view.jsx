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

import { GateEntryTableHead } from '../gateEntry-table-head';
import { GateEntryTableRow } from '../gateEntry-table-row';
import { GateEntryTableToolbar } from '../gateEntry-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import GateEntryForm from '../../../layouts/modals/addGateEntry';
import axiosInstance from 'src/configs/axiosInstance';

// ----------------------------------------------------------------------

export function GateEntryView() {
  const table = useTable();
  const [update,setUpdate] = useState(false);
  const [gateEntries,setGateEntries] = useState([]);
  const [firmNames,setfirmNames] = useState([]);
const fetchGateEntry = async ()=>{
try{
const result = await axiosInstance.get('/gateEntry');
if(result.data.data){
  setGateEntries(result.data.data);
  setfirmNames(result.data.firmNames);
}
}catch(err){
  console.error('Error occured in fetching vendors inc client side',err.message)
}
}
  const [filterName, setFilterName] = useState('');
useEffect(()=>{
  fetchGateEntry();
},[update]);


  const dataFiltered= applyFilter({
    inputData: gateEntries,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
       Gate Entry
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}

        <GateEntryForm setUpdate={setUpdate} firmNames={firmNames}/>
    
      </Box>

      <Card>
        <GateEntryTableToolbar
         sort={table.onSort}
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <GateEntryTableHead
              
                order={table.order}
                orderBy={table.orderBy}
                rowCount={gateEntries.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                // onSelectAllRows={(checked) =>
                //   table.onSelectAllRows(
                //     checked,
                //     _users.map((user) => user.id)
                //   )
                // }
                headLabel={[
                  { id: 'entryTime', label: 'Entry Time' },
                  { id: 'vehicleNumber', label: 'Vehicle Number' },
                  { id: 'vendorName', label: 'Vendor Name' },
                  { id: 'date', label: 'Date' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row,index) => (
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
                  emptyRows={emptyRows(table.page, table.rowsPerPage, gateEntries.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={gateEntries.length}
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
