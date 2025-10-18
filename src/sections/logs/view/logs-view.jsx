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
import { emptyRows, applyFilter, getComparator } from '../utils';
import CurrentStockForm from '../../../layouts/modals/addCurrentStock';
import axiosInstance from 'src/configs/axiosInstance';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';
import { varAlpha } from 'src/theme/styles';
import ColorOfExpiry from '../../../utils/ColorOfExpiry';

import { hasPermission } from '../../../utils/permissionCheck';

import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import * as XLSX from 'xlsx'
import toast, { Toaster } from 'react-hot-toast'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import { LogsTableToolbar } from '../logs-table-toolbar';
import { LogsTableHead } from '../logs-table-head';
import { LogsTableRow } from '../logs-table-row';
import { TableNoData } from '../../user/table-no-data';
import { TableEmptyRows } from '../../user/table-empty-rows';


// ----------------------------------------------------------------------

export function LogsView() {
  const table = useTable();
  const [update, setUpdate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState([]);
  const [section, setSection] = useState('ALL');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');


  const fetchCurrentStock = async () => {
    try {
      setLoading(true);
      const result = await axiosInstance.get('/audit-logs');
      console.log('logs', result.data.data.data);
      if (result.data.data) {
        setLogs(result.data.data.data);
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

  const getCurrentEntries = () => {
    return logs
  }


  const dataFiltered = applyFilter({
    inputData: getCurrentEntries(),
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    section,
    dateFrom,
    dateTo,
  });

  const notFound = !dataFiltered.length && !!filterName;
 

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue)
    table.onResetPage()
  }

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

  const renderTable = entries => (
    <Card>
      
      <LogsTableToolbar
        sort={table.onSort}
        numSelected={table.selected.length}
        filterName={filterName}
        onFilterName={(event) => {
          setFilterName(event.target.value);
          table.onResetPage();
        }}
        section={section}
        onChangeSection={(event) => {
          setSection(event.target.value);
          table.onResetPage();
        }}
        sectionOptions={[
          'ALL',
          ...Array.from(new Set(logs.map((l) => l.model).filter(Boolean))).sort(),
        ]}
        dateFrom={dateFrom}
        dateTo={dateTo}
        onChangeDateFrom={(event) => {
          setDateFrom(event.target.value);
          table.onResetPage();
        }}
        onChangeDateTo={(event) => {
          setDateTo(event.target.value);
          table.onResetPage();
        }}
        onClear={() => {
          setFilterName('');
          setSection('ALL');
          setDateFrom('');
          setDateTo('');
          table.onResetPage();
        }}
      />

      <TableContainer sx={{ overflow: 'auto' }}>
        <Table sx={{ minWidth: 800 }}>
          <LogsTableHead
            order={table.order}
            orderBy={table.orderBy}
            rowCount={logs.length}
            numSelected={table.selected.length}
            onSort={table.onSort}
            // onSelectAllRows={(checked) =>
            //   table.onSelectAllRows(
            //     checked,
            //     _users.map((user) => user.id)
            //   )
            // }
            headLabel={[
              { id: 'section', label: 'Section' },
              { id: 'action', label: 'Action' },
              { id: 'user', label: 'user' },
              { id: 'date', label: 'Date' },
              { id: 'materialName', label: 'Material Name' },
            ]}
          />
          <TableBody>
            {dataFiltered
              .slice(
                table.page * table.rowsPerPage,
                table.page * table.rowsPerPage + table.rowsPerPage
              )
              .map((row, index) => (
                <LogsTableRow
                  setUpdate={setUpdate}
                  key={index}
                  row={row}
                  selected={table.selected.includes(row.id)}
                  onSelectRow={() => table.onSelectRow(row.id)}
                />
              ))}

            <TableEmptyRows
              height={68}
              emptyRows={emptyRows(table.page, table.rowsPerPage, logs.length)}
            />

            {notFound && <TableNoData searchQuery={filterName} />}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
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

      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
          Audit Logs
        </Typography>
      </Box>

      {renderTable(getCurrentEntries())}

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
