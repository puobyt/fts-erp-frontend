import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

const generatePocpdf = ({
  vendorName = "( VENDOR NAME )",
  deliveryAddress = "FRUITION NATURAL EXTRACTS PVT LTD",
  tableBody = [
    ['1', '10', 'KG', '1234', 'Sample Product', '500', '5000']
  ],
  totalAmountInWords = "RUPEES ******** ONLY",
  termsAndConditions = [] // Array of strings!
} = {}) => {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(16);
  doc.text('FRUITION NATURAL EXTRACTS PRIVATE LIMITED', 10, 10);
  doc.setFontSize(12);
  doc.text('PURCHASE ORDER', 150, 10);

  // Company Details
  doc.setFontSize(10);
  doc.text('C13 AND C14, SIPCOT INDUSTRIAL AREA,', 10, 20);
  doc.text('OLLIAPATTI VILLAGE, UTHANGARITALUK,', 10, 25);
  doc.text('KRISHNAGIRI DISTRICT, TAMIL NADU - 635 304', 10, 30);
  doc.text('PH: +91 73566 89998', 10, 35);

  // Vendor & Delivery Address
  doc.text('VENDOR ADDRESS:', 10, 50);
  doc.text(vendorName, 10, 55);
  doc.text('DELIVERY ADDRESS:', 120, 50);
  doc.text(deliveryAddress, 120, 55);

  // Table
  autoTable(doc, {
    startY: 70,
    head: [['SI No.', 'QTY', 'UNIT', 'HSN', 'DESCRIPTION', 'UNIT PRICE', 'TOTAL']],
    body: tableBody,
    theme: 'grid',
  });
 let y = doc.autoTable.previous.finalY + 10;

  // Terms as array
  const termsAndConditions = termsString.split('\n');

  doc.setFontSize(12);
  doc.text('TERMS AND CONDITIONS:', 10, y);

  doc.setFontSize(10);
  y += 7;

  termsAndConditions.forEach((term, idx) => {
    if (y > 280) { doc.addPage(); y = 20; }
    doc.text(`${idx + 1}. ${term}`, 12, y);
    y += 7;
  });

  // Save PDF
  doc.save('purchase_order.pdf');
};

export default generatePocpdf;