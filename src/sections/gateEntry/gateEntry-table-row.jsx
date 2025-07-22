import { useState, useCallback } from 'react';
import moment from "moment";
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditGateEntryForm from '../../layouts/editModals/editGateEntry';
import { Iconify } from 'src/components/iconify';
import Swal from 'sweetalert2'
import axiosInstance from 'src/configs/axiosInstance';
import jsPDF from 'jspdf'
import toast from 'react-hot-toast'
import ViewGateEntry from '../../layouts/viewModals/viewGateEntry';
// ----------------------------------------------------------------------



export function GateEntryTableRow({firmNames,setUpdate, row, selected, onSelectRow }) {
  const [openPopover, setOpenPopover] = useState(null);
  const gateEntryData = {
  gateEntryId: row._id,
  entryTime: row.entryTime,
  vendorName: row.vendorName,
  vehicleNumber: row.vehicleNumber,
  date: row.date,
  docNumber: row.docNumber,
  returnReason:row.returnReason,
  returnedBy:row.returnedBy,
  materials: row.materials,
  gateType: row.gateType,
  qcDocuments: row.qcDocuments,
  returnType: row.returnType,
  replacementRequired: row.replacementRequired,
  isPartialReturn: row.isPartialReturn,
  removed: row.removed,
  enabled: row.enabled,
};


const handleDownload = (row) => {
  const doc = new jsPDF()
  const pageWidth = doc.internal.pageSize.getWidth()
  const pageHeight = doc.internal.pageSize.getHeight()
  let y = 20

  // Header with gradient-like effect
  doc.setFillColor(34, 139, 34) // Forest Green
  doc.rect(0, 0, pageWidth, 40, 'F')
  
  // Header text
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(22)
  doc.setFont('helvetica', 'bold')
  doc.text('GATE ENTRY REPORT', pageWidth / 2, 18, { align: 'center' })
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Security & Access Control', pageWidth / 2, 30, { align: 'center' })
  
  // Reset text color
  doc.setTextColor(0, 0, 0)
  y = 55

  // Gate type badge
  const gateTypeBadge = row.gateType?.toUpperCase() || 'UNKNOWN'
  doc.setFillColor(220, 53, 69) // Red for ENTRY, could be customized based on gate type
  if (gateTypeBadge.includes('EXIT')) {
    doc.setFillColor(40, 167, 69) // Green for EXIT
  } else if (gateTypeBadge.includes('ENTRY')) {
    doc.setFillColor(0, 123, 255) // Blue for ENTRY
  }
  
  doc.roundedRect(20, y - 8, 40, 15, 3, 3, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text(gateTypeBadge, 40, y, { align: 'center' })
  
  // Document ID
  doc.setTextColor(100, 100, 100)
  doc.setFontSize(9)
  doc.setFont('helvetica', 'italic')
  doc.text(`Document ID: ${row._id || 'N/A'}`, pageWidth - 20, y, { align: 'right' })
  
  y += 25

  // Main details section
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text('Entry Details', 20, y)
  
  // Section underline
  doc.setLineWidth(2)
  doc.setDrawColor(34, 139, 34)
  doc.line(20, y + 3, 85, y + 3)
  y += 20

  // Basic details first
  const basicDetails = [
    { 
      icon: '🏢', 
      label: 'Vendor Name', 
      value: row.vendorName || 'Not Specified',
      important: true 
    },
    { 
      icon: '🚚', 
      label: 'Vehicle Number', 
      value: row.vehicleNumber || 'Not Provided',
      important: true 
    },
    { 
      icon: '📄', 
      label: 'Document Number', 
      value: row.docNumber || 'N/A' 
    },
    { 
      icon: '📅', 
      label: 'Date', 
      value: new Date(row.date).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    },
    { 
      icon: '🕐', 
      label: 'Entry Time', 
      value: row.entryTime || 'Not Recorded' 
    }
  ]

  // Add return-specific fields if they exist
  if (row.returnReason) {
    basicDetails.push({
      icon: '↩️',
      label: 'Return Reason',
      value: row.returnReason,
      important: true
    })
  }

  if (row.returnedBy) {
    basicDetails.push({
      icon: '👤',
      label: 'Returned By',
      value: row.returnedBy
    })
  }

  basicDetails.forEach((detail, index) => {
    // Background for important items
    if (detail.important) {
      doc.setFillColor(248, 249, 250)
      doc.rect(15, y - 8, pageWidth - 30, 18, 'F')
    }

    // Icon (using bullet point since jsPDF doesn't support emojis well)
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(34, 139, 34)
    doc.text('●', 20, y)

    // Label
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'bold')
    doc.text(`${detail.label}:`, 30, y)

    // Value
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(detail.important ? 0 : 60, detail.important ? 0 : 60, detail.important ? 0 : 60)
    
    // Handle long text wrapping
    const maxWidth = pageWidth - 110
    const splitText = doc.splitTextToSize(detail.value, maxWidth)
    doc.text(splitText, 110, y)
    
    y += splitText.length > 1 ? 12 * splitText.length : 18
  })

  // Materials section
  if (row.materials && row.materials.length > 0) {
    y += 15
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text('Materials', 20, y)
    
    // Section underline
    doc.setLineWidth(2)
    doc.setDrawColor(34, 139, 34)
    doc.line(20, y + 3, 75, y + 3)
    y += 20

    // Table header
    doc.setFillColor(34, 139, 34)
    doc.rect(15, y - 8, pageWidth - 30, 15, 'F')
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(255, 255, 255)
    doc.text('Material Name', 20, y)
    doc.text('Quantity', 90, y)
    doc.text('Unit', 130, y)
    doc.text('QC Status', 160, y)

    y += 12

    // Materials list
    row.materials.forEach((material, index) => {
      // Alternating row background
      if (index % 2 === 0) {
        doc.setFillColor(248, 249, 250)
        doc.rect(15, y - 8, pageWidth - 30, 15, 'F')
      }

      doc.setFontSize(9)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(0, 0, 0)
      
      // Material name
      const materialName = material.materialName || 'Not Specified'
      const splitMaterialName = doc.splitTextToSize(materialName, 65)
      doc.text(splitMaterialName, 20, y)

      // Quantity (use returnedQuantity if available, otherwise quantity)
      const quantity = material.returnedQuantity || material.quantity || '0'
      doc.text(quantity.toString(), 90, y)

      // Unit
      doc.text(material.unit || '-', 130, y)

      // QC Status with color coding
      const qcStatus = material.qcStatus || 'Unknown'
      if (qcStatus.toLowerCase() === 'approved') {
        doc.setTextColor(0, 128, 0) // Green
      } else if (qcStatus.toLowerCase() === 'rejected') {
        doc.setTextColor(255, 0, 0) // Red
      } else {
        doc.setTextColor(255, 165, 0) // Orange for pending
      }
      doc.text(qcStatus.toUpperCase(), 160, y)
      doc.setTextColor(0, 0, 0) // Reset color

      y += splitMaterialName.length > 1 ? 12 * splitMaterialName.length : 15
    })

    y += 10
  }

  // Status section
  y += 15
  doc.setFillColor(240, 248, 255)
  doc.rect(15, y - 5, pageWidth - 30, 25, 'F')
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 86, 179)
  doc.text('STATUS', 20, y + 5)
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  doc.text('✓ Entry Processed Successfully', 25, y + 15)

  // Footer with border
  const footerY = pageHeight - 25
  doc.setLineWidth(0.5)
  doc.setDrawColor(200, 200, 200)
  doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)
  
  doc.setFillColor(248, 249, 250)
  doc.rect(0, footerY - 2, pageWidth, 20, 'F')
  
  // Footer content
  doc.setFontSize(8)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(100, 100, 100)
  doc.text('Generated by Gate Management System', 20, footerY + 5)
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 20, footerY + 12)
  doc.text(`Page 1 of 1`, pageWidth - 20, footerY + 8, { align: 'right' })

  // Save with better filename
  const timestamp = new Date().toISOString().slice(0, 10)
  const filename = `GateEntry_${gateTypeBadge}_${row.vehicleNumber || 'Vehicle'}_${timestamp}.pdf`
  doc.save(filename)
}
  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);
  const handleDelete = async()=>{
    try {

      const gateEntryId = row._id;
      const result = await axiosInstance.delete(`/removeGateEntry?gateEntryId=${gateEntryId}`);
      if (result) {
        toast.success(result.data.message)
        setUpdate(prev => !prev)
      }
    } catch (err) {
      toast.success(err.response.data.message)
      console.error(
        'Error occured in removing gate entry in client side',
        err.message
      )
    }
  }

  const confirmDelete = ()=>{
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      backdrop: false
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  }
  const formatTo12Hour = (time24) => moment(time24, "HH:mm").format("h:mm A");
  const formattedTime = formatTo12Hour(row.entryTime);
  const handleMenuCloseAndConfirmDelete = () => {
    handleClosePopover(); // Close the popover or menu first
    setTimeout(() => {
      confirmDelete();
    }, 0); // Optional delay to ensure the popover is fully closed
  };
  return (
    <>
      <TableRow>
      {/* <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell> */}
        {/* <TableCell component="th" scope="row">
          <Box gap={2} display="flex" alignItems="center">
            <Avatar alt={row.nameOfTheFirm}  />
          
          </Box>
        </TableCell> */}
           <TableCell>{row.vendorName}</TableCell>
           <TableCell>  {row.vehicleNumber}</TableCell>
              <TableCell
                style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}
              >
                {row.materials?.map((material, index) => (
                  <div
                    key={index}
                    style={{ marginRight: '10px' }}
                  >
                    <strong>{material.materialName}</strong>{' '}
                  </div>
                  
                ))}
              </TableCell>
      
              <TableCell>
                {row.materials.map((material, index) => (
                  <div key={index}>{`${material.quantity} ${material.unit||"KG"}`}</div>
                ))}
              </TableCell>
           <TableCell>  {row.docNumber}</TableCell>
           <TableCell>{new Date(row.date).toLocaleDateString()}</TableCell>
        <TableCell>  {formattedTime}</TableCell>
     
     
   

   


        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
   <EditGateEntryForm firmNames={firmNames} setUpdate={setUpdate} gateEntryData={gateEntryData}/>
   <ViewGateEntry  gateEntryData={gateEntryData}/>
   <MenuItem onClick={() => handleDownload(row)}>
            <Iconify icon="solar:download-bold" />
            Download
          </MenuItem>
          <MenuItem onClick={handleMenuCloseAndConfirmDelete} sx={{ color: 'error.main' }}>
          
            <Iconify icon="solar:trash-bin-trash-bold" />
            Delete 
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
