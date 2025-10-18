
// ----------------------------------------------------------------------

export const visuallyHidden = {
  border: 0,
  margin: -1,
  padding: 0,
  width: '1px',
  height: '1px',
  overflow: 'hidden',
  position: 'absolute',
  whiteSpace: 'nowrap',
  clip: 'rect(0 0 0 0)',
} ;

// ----------------------------------------------------------------------

export function emptyRows(page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function getComparator(
  order,
  orderBy
) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------


export function applyFilter({ inputData, comparator, filterName, section, dateFrom, dateTo }) {
  const stabilizedThis = inputData.map((el, index) => [el, index] );

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  // Text search across common log fields
  if (filterName) {
    const q = filterName.toLowerCase();
    inputData = inputData.filter((log) => {
      const model = String(log.model || '').toLowerCase();
      const action = String(log.action || '').toLowerCase();
      const user = String(log.user || '').toLowerCase();
      const recordId = String(log.recordId || '').toLowerCase();
      const recordData = log.recordData ? JSON.stringify(log.recordData).toLowerCase() : '';
      const data = log.data ? JSON.stringify(log.data).toLowerCase() : '';
      return (
        model.includes(q) ||
        action.includes(q) ||
        user.includes(q) ||
        recordId.includes(q) ||
        recordData.includes(q) ||
        data.includes(q)
      );
    });
  }

  // Section filter (model)
  if (section && section !== 'ALL') {
    inputData = inputData.filter((log) => String(log.model || '').toLowerCase() === String(section).toLowerCase());
  }

  // Date range filter on timestamp
  if (dateFrom || dateTo) {
    const fromTime = dateFrom ? new Date(dateFrom).setHours(0, 0, 0, 0) : null;
    const toTime = dateTo ? new Date(dateTo).setHours(23, 59, 59, 999) : null;
    inputData = inputData.filter((log) => {
      const ts = log.timestamp ? new Date(log.timestamp).getTime() : null;
      if (!ts) return false;
      if (fromTime && ts < fromTime) return false;
      if (toTime && ts > toTime) return false;
      return true;
    });
  }
  

  return inputData;
}
