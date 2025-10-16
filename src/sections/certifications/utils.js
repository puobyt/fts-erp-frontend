export function emptyRows (page, rowsPerPage, arrayLength) {
  return page ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0
}

function descendingComparator (a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1
  }
  if (b[orderBy] > a[orderBy]) {
    return 1
  }
  return 0
}

export function getComparator (order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy)
}

function computeStatus (expiryDate) {
  const now = Date.now()
  const exp = new Date(expiryDate).getTime()
  return exp >= now ? 'ACTIVE' : 'EXPIRED'
}

export function applyFilter ({ inputData, comparator, filterName, status }) {
  const stabilizedThis = inputData.map((el, index) => [el, index])

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0])
    if (order !== 0) return order
    return a[1] - b[1]
  })

  let output = stabilizedThis.map(el => el[0])

  if (filterName) {
    const q = filterName.toLowerCase()
    output = output.filter(item => {
      const name = String(item.name || '').toLowerCase()
      const email = String(item.email || '').toLowerCase()
      return name.includes(q) || email.includes(q)
    })
  }

  if (status && status !== 'ALL') {
    output = output.filter(item => computeStatus(item.expiryDate) === status)
  }

  return output
}


