import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';


import { _ProductOrderCreations } from 'src/_mock/purchaseData';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Scrollbar } from 'src/components/scrollbar';

import { TableNoData } from '../table-no-data';
import { ProductionOrderCreationOutputTableHead } from '../production-order-creationOutput-table-head';
import { ProductionOrderCreationOutputTableRow } from '../production-order-creationOutput-table-row';
import { ProductionOrderCreationOutputTableToolbar } from '../production-order-creationOutput-table-toolbar';
import { TableEmptyRows } from '../table-empty-rows';
import { emptyRows, applyFilter, getComparator } from '../utils';
import axiosInstance from 'src/configs/axiosInstance';
import ProductionOrderCreationOutputForm from '../../../layouts/modals/addProductionOrderCreationOutput';
import LinearProgress, {
  linearProgressClasses
} from '@mui/material/LinearProgress'
import { varAlpha } from 'src/theme/styles'



// ----------------------------------------------------------------------

export function ProductionOrderCreationOutputView() {
  const table = useTable();
  const [update,setUpdate] = useState(false);
  const [loading, setLoading] = useState(false)
  const [productionOrderOutputCreations,setProductionOrderOutputCreations] = useState([]);
  const [batches,setBatches] = useState([]);
  const [tableRows,setTableRows] = useState([]);
  const [products,setProducts] = useState([]);
const fetchPurchaseOrderCreation = async ()=>{
try{
  setLoading(true)
const result = await axiosInstance.get('/productionOrderCreationOutput');
if(result.data.data){
  setProductionOrderOutputCreations(result.data.data);
  setBatches(result.data.batches);
  setProducts(result.data.products);
  setLoading(false)
}
}catch(err){
  console.error('Error occured in fetching vendors inc client side',err.message)
}
}

useEffect(()=>{
  fetchPurchaseOrderCreation();
},[update]);
  const [filterName, setFilterName] = useState('');

  const dataFiltered= applyFilter({
    inputData: productionOrderOutputCreations,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });
  useEffect(() => {
    setTableRows(dataFiltered.length); // Set the total number of rows after rendering
  }, [dataFiltered, setTableRows,update]);
  const notFound = !dataFiltered.length && !!filterName;
  const nextBatchNumber = `FN${String(tableRows + 1).padStart(3, '0')}`; // Generate batch number
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
        Production Order Creation Output
        </Typography>
        {/* <Button
          variant="contained"
          color="inherit"
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          New user
        </Button> */}  
        <ProductionOrderCreationOutputForm setUpdate={setUpdate}  batches={batches}  nextBatchNumber={nextBatchNumber} products={products}/>
      </Box>

      <Card>
      {loading && renderFallback}
        <ProductionOrderCreationOutputTableToolbar
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
              <ProductionOrderCreationOutputTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={productionOrderOutputCreations.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _ProductOrderCreations.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'productName', label: 'Product Name' },
                  { id: 'producedQuantity', label: 'Produced Quantity' },
                  { id: 'productionCompletionDate', label: 'Production Completion Date' },
                  // { id: 'qualityCheckStatus', label: 'Quality Check Status' },
                  { id: 'storageLocationForOutput', label: 'Storage Location for Output' },
                  { id: 'batchNumberForOutput', label: 'Batch Number for Output' },
                  { id: 'productionNotes', label: 'Production Notes' },
                  { id: 'yield', label: 'Yield' },
                  { id: 'OutputQualityRating', label: 'Output Quality Rating' },
                  { id: 'outputHandlingInstructions', label: 'Output Handling Instructions' },
     
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row,index) => (
                    <ProductionOrderCreationOutputTableRow
                    batches={batches}
                    products={products}
                    setUpdate={setUpdate}
                    index={index}
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, productionOrderOutputCreations.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
     

        <TablePagination
          component="div"
          page={table.page}
          count={productionOrderOutputCreations.length}
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
