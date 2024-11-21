import jsPDF from 'jspdf';
import 'jspdf-autotable';

const generatePDF = (row) => {
  const doc = new jsPDF();

  doc.setFont('times', 'bold');
  doc.setFontSize(18);

  const pageWidth = doc.internal.pageSize.width;
  const textWidth = doc.getTextWidth('Invoice');
  const xInvoice = (pageWidth - textWidth) / 2;

  doc.text('Invoice', xInvoice, 20);

  const underlineY = 22;
  doc.line(xInvoice, underlineY, xInvoice + textWidth, underlineY);

  doc.setFont('times', 'normal');
  doc.setFontSize(12);
  const formattedDate = row.invoiceDate
  ? new Date(row.invoiceDate).toLocaleDateString('en-GB')
  : '';
  const invoiceDateText = `Invoice Date: ${formattedDate}`;
  const textWidthDate = doc.getTextWidth(invoiceDateText);
  const xDate = pageWidth - textWidthDate - 14;

  doc.setFont('times', 'bold');

  const yDate = 30;

  doc.text(invoiceDateText, xDate, yDate);

  doc.setFont('times', 'bold');

  doc.text('Invoice Number:', 14, 40);
  doc.text('Customer Name:', 14, 50);
  doc.text('Customer ID:', 14, 60);
  doc.text('Customer Address:', 14, 70);

  doc.setFont('times', 'normal');

  const xValues = 55;

  doc.text(row.invoiceNumber, xValues, 40);
  doc.text(row.customerName, xValues, 50);
  doc.text(row.customerId, xValues, 60);
  doc.text(row.customerAddress, xValues, 70);

  doc.autoTable({
    startY: 80,
    head: [['Item Name', 'Quantity', 'Price']],
    body: [[row.itemName, row.quantity, row.price]],
    theme: 'grid',
    styles: { fontSize: 10 },
  });

  doc.save(`Invoice ${row.invoiceNumber}.pdf`);
};

export { generatePDF };
