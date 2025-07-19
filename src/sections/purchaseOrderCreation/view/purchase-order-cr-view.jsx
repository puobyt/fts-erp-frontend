import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Typography from '@mui/material/Typography';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { TableNoData } from '../table-no-data';
import { PurchaseOrderCreationTableRow } from '../purchase-order-creation-table-row';
import { PurchaseOrderCreationTableHead } from '../purchase-order-creation-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { PurchcaseOrderCreationTableToolbar } from '../purchase-order-creation-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import axiosInstance from 'src/configs/axiosInstance';
import PurchaseOrderCreationForm from '../../../layouts/modals/addPurchaseOrderCreation';
import { varAlpha } from 'src/theme/styles';

export function PurchaseOrderCreationView() {
  const table = useTable();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [purchaseCreations, setPurchaseCreations] = useState([]);
  const [firms, setFirms] = useState([]);

  const fetchPurchaseOrderCreation = async () => {
    setLoading(true);
    try {
      const result = await axiosInstance.get('/purchaseOrderCreation');
      if (result.data.data) {
        setPurchaseCreations(result.data.data);
        setFirms(result.data.firms);
      } else {
        setPurchaseCreations([]);
        setFirms([]);
      }
    } catch (err) {
      console.error('Error occured in fetching vendors inc client side', err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchaseOrderCreation();
  }, [update]);

  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: purchaseCreations,
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
  );

  return (
    <DashboardContent>
      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Purchase Order Creation
        </Typography>
        <PurchaseOrderCreationForm setUpdate={setUpdate} firms={firms} />
      </Box>

      <Card>
        {loading && renderFallback}
        <PurchcaseOrderCreationTableToolbar
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
            <PurchaseOrderCreationTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={purchaseCreations.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              onSelectAllRows={(checked) =>
                table.onSelectAllRows(
                  checked,
                  purchaseCreations.map((row) => row._id)
                )
              }
              headLabel={[
                { id: 'PurchaseOrderNumber', label: 'Purchase Order Number' },
                { id: 'date', label: 'Date' },
                { id: 'nameOftheFirm', label: 'Name Of The Firm' },
                { id: 'address', label: 'Address' },
                { id: 'contactNumber', label: 'Contact Number' },
                { id: 'contactPersonName', label: 'Contact Person Name' },
                { id: 'contactPersonDetails', label: 'Contact Person Details' },
                { id: 'vendorId', label: 'Vendor Id' },
                { id: 'materialName', label: 'Material Name' },
                { id: 'MfgDate', label: 'MfgDate' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'price', label: 'Price' },
                { id: 'pan', label: 'Pan' },
                { id: 'gst', label: 'GST' },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row) => (
                  <PurchaseOrderCreationTableRow
                    setUpdate={setUpdate}
                    firms={firms}
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, purchaseCreations.length)}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            page={table.page}
            count={purchaseCreations.length}
            rowsPerPage={table.rowsPerPage}
            onPageChange={table.onChangePage}
            rowsPerPageOptions={[5, 10, 25]}
            onRowsPerPageChange={table.onChangeRowsPerPage}
          />
        </TableContainer>
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState([]); // Ensure this is an array
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