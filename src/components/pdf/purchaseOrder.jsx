import React, { forwardRef } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Grid,
} from '@mui/material';
function formatDate(dateString)
{
  if(!dateString)return "N/A"
  const date=new Date(dateString)
  if(isNaN(date))return 'N/A'
  return date.toLocaleDateString("en-IN",{
    day:'2-digit',
    month:'2-digit',
    year:'numeric',

  })
}

const PurchaseOrder = forwardRef(({ pdfData }, ref) => {
  return (
    <Box ref={ref} p={4} bgcolor="#fff" color="#000" maxWidth="800px" margin="0 auto">
      {/* Heading */}
      <Typography variant="h6" align="center" fontWeight="bold">
        FRUITION NATURAL EXTRACTS PRIVATE LIMITED
      </Typography>
      <Typography variant="subtitle1" align="center" fontWeight="600" mt={1}>
        PURCHASE ORDER
      </Typography>

      <Grid item xs={4}>
        <Typography fontWeight="bold">Delivery Address:</Typography>
        <Typography variant="body2">
          FRUITION NATURAL EXTRACTS PVT LTD
          <br />
          C13 AND C14, SIPCOT INDUSTRIAL AREA,
          <br />
          KRISHNAGIRI DISTRICT, TAMIL NADU - 635 304
          <br />
          GST: 33AACCF4218J0ZH
          <br />
          PH: +91 73566 89998
        </Typography>
      </Grid>

      {/* Address Section */}
      <Grid container spacing={2} mt={2}>
        {/* Vendor Address */}
        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold" variant="subtitle2">
            VENDOR:
          </Typography>
          <Typography variant="body2">
            {pdfData.nameOfTheFirm || 'N/A'}
            <br />
            {pdfData.address || 'N/A'}
            <br />
            GST: {pdfData.gst || 'N/A'}
            <br />
            Contact: {pdfData.contactNumber || 'N/A'}
          </Typography>
        </Grid>

        {/* Delivery Address (Dynamic) */}
        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold" variant="subtitle2">
            DELIVERY TO:
          </Typography>
          <Typography variant="body2">
            {pdfData.deliveryAddress || ( // Use deliveryAddress if available, else fallback to vendor address
              <>
                FRUITION NATURAL EXTRACTS PVT LTD
                <br />
                C13 AND C14, SIPCOT INDUSTRIAL AREA,
                <br />
                KRISHNAGIRI DISTRICT, TAMIL NADU - 635 304
                <br />
                GST: 33AACCF4218J0ZH
                <br />
                PH: +91 73566 89998
              </>
            )}
          </Typography>
        </Grid>

        {/* PO Details */}
        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold" variant="subtitle2">
            PO DETAILS:
          </Typography>
          <Typography variant="body2">
            PO No: {pdfData.purchaseOrderNumber || 'N/A'}
            <br />
            PO Date: {formatDate(pdfData.poDate)}
            <br />
            Ref No: {pdfData.quotationReferenceNumber || 'N/A'}
            <br />
            Due Date: {formatDate(pdfData.dueDate)}
          </Typography>
        </Grid>
      </Grid>

      <Table sx={{ mt: 4, border: '1px solid black' }}>
        <TableHead sx={{ backgroundColor: '#f0f0f0' }}>
          <TableRow>
            {['SI No.', 'QTY', 'UNIT', 'HSN', 'DESCRIPTION', 'UNIT PRICE', 'TOTAL'].map(
              (head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    border: '1px solid black',
                    padding: '8px',
                    fontWeight: 'bold',
                  }}
                >
                  {head}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableCell align="center" sx={{ border: '1px solid black' }}>
              1
            </TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>
              {pdfData.quantity}
            </TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>
              {pdfData.unit}
            </TableCell>
            <TableCell align="center" sx={{ border: '1px solid black' }}>
              {pdfData.hsn}
            </TableCell>
            <TableCell sx={{ border: '1px solid black' }}>{pdfData.description}</TableCell>
            <TableCell align="right" sx={{ border: '1px solid black' }}>
              {pdfData.price}
            </TableCell>
            <TableCell align="right" sx={{ border: '1px solid black' }}>
              {pdfData.totalAmount}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>

      {/* Total */}
      <Typography variant="body1" fontWeight="bold" mt={2}>
        TOTAL P.O AMOUNT IN WORDS: {pdfData.amountInWords}
      </Typography>

      <Grid container justifyContent="space-between" mt={6}>
        <Grid item>
          <Typography fontWeight="bold"> Terms & Conditions</Typography>
          <Typography variant="body2">
            1: *************
            <br />
            2: ************
            <br />
            3: *********
          </Typography>
        </Grid>
        <Grid item>
          <Table sx={{ mt: 2, border: '1px solid black', width: '100%' }}>
            <TableBody>
              {[
                ['Subtotal', `${pdfData.totalAmount}`],
                ['Discount', `${pdfData.discount}`],
                ['After Discount', `${pdfData.afterDiscount}`],
                ['IGST 18%', `${pdfData.igst}`],
                ['Transportation Freight', `${pdfData.transportationFreight}`],
                ['Round Off', `${pdfData.roundOff}`],
                ['Total', `${pdfData.finalAmount}`],
              ].map(([label, value], idx, arr) => (
                <TableRow key={idx} sx={{ height: '30px' }}>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: idx === arr.length - 1 ? 'bold' : 'normal',
                      padding: '4px 8px',
                      fontSize: '0.85rem',
                      minWidth: '150px',
                    }}
                  >
                    {label}
                  </TableCell>
                  <TableCell
                    sx={{
                      border: '1px solid black',
                      fontWeight: 'bold',
                      padding: '4px 8px',
                      fontSize: '0.85rem',
                      minWidth: '200px',
                    }}
                  >
                    {value}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Grid>
      </Grid>

      {/* Signature Section */}
      <Grid container justifyContent="space-between" mt={6}>
        <Grid item>
          <Typography fontWeight="bold">Accepted with Terms & Conditions</Typography>
          <Typography variant="body2">
            Signature: __________
            <br />
            Name: __________
            <br />
            Date: __________
          </Typography>
        </Grid>
        <Grid item>
          <Typography fontWeight="bold">FOR FRUITION NATURAL EXTRACTS PVT LTD</Typography>
          <Typography variant="body2">
            Signature: __________
            <br />
            Date: __________
          </Typography>
        </Grid>
      </Grid>

      {/* Footer */}
      <Typography variant="caption" align="center" display="block" mt={6} fontStyle="italic">
        THIS IS COMPUTER GENERATED BILL
      </Typography>
    </Box>
  );
});

PurchaseOrder.displayName = 'PurchaseOrder';
export default PurchaseOrder;
