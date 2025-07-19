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
  List,
  ListItem,
  ListItemText,
} from '@mui/material';

function formatDate(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date)) return 'N/A';
  return date.toLocaleDateString("en-IN", {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

const PurchaseOrder = forwardRef(({ pdfData = {} }, ref) => {
  // Calculate totals if not provided
  const calculateTotals = () => {
    if (pdfData.totalAmount && pdfData.finalAmount) {
      return {
        subtotal: pdfData.totalAmount,
        finalAmount: pdfData.finalAmount
      };
    }

    if (!pdfData.materials || !pdfData.materials.length) {
      return {
        subtotal: '0.00',
        finalAmount: '0.00'
      };
    }

    const subtotal = pdfData.materials.reduce((sum, item) => {
      const price = parseFloat(item.price) || 0;
      const quantity = parseFloat(item.quantity) || 0;
      return sum + (price * quantity);
    }, 0);

    return {
      subtotal: subtotal.toFixed(2),
      finalAmount: subtotal.toFixed(2) // Adjust if you have discounts/taxes
    };
  };

  const { subtotal, finalAmount } = calculateTotals();

  // Format amount in words
  const amountInWords = pdfData.amountInWords || `RUPEES ${finalAmount} ONLY`;

  return (
    <Box ref={ref} p={4} bgcolor="#fff" color="#000" maxWidth="800px" margin="0 auto">
      {/* Heading */}
      <Typography variant="h6" align="center" fontWeight="bold">
        FRUITION NATURAL EXTRACTS PRIVATE LIMITED
      </Typography>
      <Typography variant="subtitle1" align="center" fontWeight={600} mt={1}>
        PURCHASE ORDER
      </Typography>

      {/* Company Info */}
      <Box mb={3} textAlign="center">
        <Typography variant="body2">
          C13 AND C14, SIPCOT INDUSTRIAL AREA, OLLIAPATTI VILLAGE, UTHANGARITALUK,
          <br />
          KRISHNAGIRI DISTRICT, TAMIL NADU - 635 304
          <br />
          GST: 33AACCF4218J0ZH | PH: +91 73566 89998
        </Typography>
      </Box>

      {/* Address and PO Details */}
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

        {/* Delivery Address */}
        <Grid item xs={12} md={4}>
          <Typography fontWeight="bold" variant="subtitle2">
            DELIVERY TO:
          </Typography>
          <Typography variant="body2">
            FRUITION NATURAL EXTRACTS PVT LTD
            <br />
            C13 AND C14, SIPCOT INDUSTRIAL AREA,
            <br />
            KRISHNAGIRI DISTRICT, TAMIL NADU - 635 304
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
            PO Date: {formatDate(pdfData.date)}
            <br />
            Ref No: {pdfData.quotationReferenceNumber || 'N/A'}
          </Typography>
        </Grid>
      </Grid>

      {/* Products Table */}
      <Table sx={{ mt: 4, border: '1px solid #ddd' }}>
        <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
          <TableRow>
            {['SI No.', 'QTY', 'UNIT', 'HSN', 'DESCRIPTION', 'UNIT PRICE', 'TOTAL'].map(
              (head, idx) => (
                <TableCell
                  key={idx}
                  sx={{
                    border: '1px solid #ddd',
                    padding: '8px',
                    fontWeight: 'bold',
                    textAlign: idx > 0 ? 'center' : 'left'
                  }}
                >
                  {head}
                </TableCell>
              )
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {pdfData.materials?.map((material, index) => {
            const total = (parseFloat(material.price) * (parseFloat(material.quantity)))
            return (
              <TableRow key={material._id || index}>
                <TableCell sx={{ border: '1px solid #ddd' }}>{index + 1}</TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                  {material.quantity || 'N/A'}
                </TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                  {material.unit || 'N/A'}
                </TableCell>
                <TableCell align="center" sx={{ border: '1px solid #ddd' }}>
                  {pdfData.hsn || 'N/A'}
                </TableCell>
                <TableCell sx={{ border: '1px solid #ddd' }}>
                  {material.materialName || 'N/A'}
                </TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}>
                  {material.price ? `₹${parseFloat(material.price).toFixed(2)}` : 'N/A'}
                </TableCell>
                <TableCell align="right" sx={{ border: '1px solid #ddd' }}>
                  {!isNaN(total) ? `₹${total.toFixed(2)}` : 'N/A'}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>

      {/* Amount in Words */}
      <Box mt={2} p={1} bgcolor="#f9f9f9" borderRadius={1}>
        <Typography variant="body1" fontWeight="bold">
          TOTAL P.O AMOUNT IN WORDS: {amountInWords}
        </Typography>
      </Box>

      {/* Summary and Terms */}
      <Grid container spacing={3} mt={2}>
        {/* Terms and Conditions */}
        <Grid item xs={12} md={6}>
          <Typography fontWeight="bold" gutterBottom>
            TERMS & CONDITIONS:
          </Typography>
          <List dense sx={{ listStyleType: 'decimal', pl: 2 }}>
            {pdfData.termsAndConditions?.map((term, index) => (
              <ListItem key={index} sx={{ display: 'list-item', py: 0, pl: 1 }}>
                <ListItemText primary={term} sx={{ m: 0 }} />
              </ListItem>
            ))}
          </List>
        </Grid>

        {/* Amount Summary */}
        <Grid item xs={12} md={6}>
          <Table sx={{ border: '1px solid #ddd' }}>
            <TableBody>
              {[
                ['Subtotal', `₹${subtotal}`],
                ['Discount', `₹${pdfData.discount || '0.00'}`],
                ['After Discount', `₹${pdfData.afterDiscount || subtotal}`],
                ['GST 18%', `₹${pdfData.igst || '0.00'}`],
                ['Transportation Freight', `₹${pdfData.transportationFreight || '0.00'}`],
                ['Round Off', `₹${pdfData.roundOff || '0.00'}`],
                ['Total', `₹${finalAmount}`],
              ].map(([label, value], idx, arr) => (
                <TableRow key={idx}>
                  <TableCell
                    sx={{
                      border: '1px solid #ddd',
                      fontWeight: idx === arr.length - 1 ? 'bold' : 'normal',
                      padding: '6px 8px',
                    }}
                  >
                    {label}
                  </TableCell>
                  <TableCell
                    align="right"
                    sx={{
                      border: '1px solid #ddd',
                      fontWeight: idx === arr.length - 1 ? 'bold' : 'normal',
                      padding: '6px 8px',
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
      <Grid container justifyContent="space-between" mt={4} pt={2} borderTop="1px dashed #ccc">
        <Grid item xs={12} md={5}>
          <Typography fontWeight="bold" gutterBottom>
            ACCEPTED WITH TERMS & CONDITIONS
          </Typography>
          <Box mt={4}>
            <Typography variant="body2">Signature: ________________</Typography>
            <Typography variant="body2">Name: __________________</Typography>
            <Typography variant="body2">Date: __________________</Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={5} textAlign="right">
          <Typography fontWeight="bold" gutterBottom>
            FOR FRUITION NATURAL EXTRACTS PVT LTD
          </Typography>
          <Box mt={4}>
            <Typography variant="body2">Signature: ________________</Typography>
            <Typography variant="body2">Date: __________________</Typography>
          </Box>
        </Grid>
      </Grid>

      {/* Footer */}
      <Typography 
        variant="caption" 
        align="center" 
        display="block" 
        mt={4} 
        fontStyle="italic"
        color="text.secondary"
      >
        THIS IS COMPUTER GENERATED DOCUMENT
      </Typography>
    </Box>
  );
});

PurchaseOrder.displayName = 'PurchaseOrder';
export default PurchaseOrder;