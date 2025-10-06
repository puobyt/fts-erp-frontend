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

import { CurrentStockTableHead } from '../currentStock-table-head';
import { CurrentStockTableRow } from '../currentStock-table-row';
import { CurrentStockTableToolbar } from '../currentStock-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';
import CurrentStockForm from '../../../layouts/modals/addCurrentStock';
import axiosInstance from 'src/configs/axiosInstance';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import ColorOfExpiry from '../../../utils/ColorOfExpiry';
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import * as XLSX from 'xlsx'
import toast, { Toaster } from 'react-hot-toast'


// ----------------------------------------------------------------------

export function CurrentStockView() {
  const table = useTable();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentStocks, setCurrentStocks] = useState([]);
  const [purchaseOrderData, setPurchaseOrderData] = useState([]);
  const [materials, setMaterials] = useState([]);
  const [vendors, setVendors] = useState([]);
  const fetchCurrentStock = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get('/currentStock');
      console.log('currentstock', result);
      if (result.data.data) {
        setCurrentStocks(result.data.data);
        setPurchaseOrderData(result.data.purchaseOrderCreationData);
        setMaterials(result.data.materials);
        setVendors(result.data.vendors);
        setLoading(false);
      }
    } catch (err) {
      console.error('Error occured in fetching vendors inc client side', err.message);
    }
  };
  const [filterName, setFilterName] = useState('');
  useEffect(() => {
    fetchCurrentStock();
  }, [update]);

  const dataFiltered = applyFilter({
    inputData: currentStocks,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;
  const renderFallback = (
    <Box display="flex" alignItems="center" justifyContent="center" flex="1 1 auto">
      <LinearProgress
        sx={{
          width: 1150,
          bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
          [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
        }}
      />
    </Box>
  );

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

        const response = await axiosInstance.post('/import-stock', { sheetsData });
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

  return (
    <DashboardContent>
      <Toaster />

      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Current Stock Management
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}

        <CurrentStockForm
          setUpdate={setUpdate}
          purchaseOrderData={purchaseOrderData}
          materials={materials}
          vendors={vendors}
        />

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
              style={{ marginLeft: 10, marginRight:10 }}
            >
              Import Excel
            </Button>
          </label>
          <a href={'/files/stocks_dummy.xlsx'} download>
            <button>Download Excel Format</button>
          </a>
        </div>
      </Box>

      <Card>
        <ColorOfExpiry />
        {loading && renderFallback}
        <CurrentStockTableToolbar
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
            <CurrentStockTableHead
              order={table.order}
              orderBy={table.orderBy}
              rowCount={currentStocks.length}
              numSelected={table.selected.length}
              onSort={table.onSort}
              // onSelectAllRows={(checked) =>
              //   table.onSelectAllRows(
              //     checked,
              //     _users.map((user) => user.id)
              //   )
              // }
              headLabel={[
                { id: 'materiaLName', label: 'Material Name' },
                { id: 'materialCode', label: 'Material Code' },
                { id: 'grn', label: 'GRN' },
                { id: 'quantity', label: 'Quantity' },
                { id: 'price', label: 'Price' },
                { id: 'storageLocation', label: 'Storage Location' },
                { id: 'vendorName', label: 'Vendor Name' },
                { id: 'dateRecieved', label: 'Date Recieved' },
                { id: 'expiryDate', label: 'Expiry' },
              ]}
            />
            <TableBody>
              {dataFiltered
                .slice(
                  table.page * table.rowsPerPage,
                  table.page * table.rowsPerPage + table.rowsPerPage
                )
                .map((row, index) => (
                  <CurrentStockTableRow
                    vendors={vendors}
                    purchaseOrderData={purchaseOrderData}
                    materials={materials}
                    setUpdate={setUpdate}
                    key={index}
                    row={row}
                    selected={table.selected.includes(row.id)}
                    onSelectRow={() => table.onSelectRow(row.id)}
                  />
                ))}

              <TableEmptyRows
                height={68}
                emptyRows={emptyRows(table.page, table.rowsPerPage, currentStocks.length)}
              />

              {notFound && <TableNoData searchQuery={filterName} />}
            </TableBody>
          </Table>
          <TablePagination
            component="div"
            page={table.page}
            count={currentStocks.length}
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

  const onSelectRow = useCallback((inputValue) => {
    setSelected((prevSelected) => {
      if (prevSelected.includes(inputValue)) {
        return prevSelected.filter((value) => value !== inputValue);
      } else {
        return [...prevSelected, inputValue];
      }
    });
  }, []);

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
