import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import jsPDF from 'jspdf';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';
import EditMaterialAssignmentForm from '../../layouts/editModals/editMaterialAssingment';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import Swal from 'sweetalert2';
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import ViewMaterialAssignmentForm from '../../layouts/viewModals/viewMaterialAssignment';

export function MaterialAssignmentTableRow({
  processOrderNumbers,
  materialNames,
  finishedGoods,
  setUpdate,
  row,
  selected,
  onSelectRow,
}) {
  const adminData = JSON.parse(localStorage.getItem('admin'))

  const [openPopover, setOpenPopover] = useState(null);
  const materialAssignmentData = {
    materialAssignmentId: row._id,
    assignmentNumber: row.assignmentNumber,
    indentNumber: row.indentNumber,
    finishedGoodsName: row.finishedGoodsName,
    date: row.date,
    batchNumber: row.batchNumber,
    processOrderNumber: row.processOrderNumber,
    materials: row.materials,
    assignedTo: row.assignedTo,
  };
  const handleOpenPopover = useCallback((event) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleDelete = async () => {
    try {
      const materialAssignmentId = row._id;
      const result = await axiosInstance.delete(
        `/removeMaterialAssignment?materialAssignmentId=${materialAssignmentId}&user=${adminData.email}`
      );
      if (result) {
        toast.success(result.data.message);
        setUpdate((prev) => !prev);
      }
    } catch (err) {
      toast.success(err.response.data.message);
      console.error('Error occured in removing material assignment in client side', err.message);
    }
  };

  const confirmDelete = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      backdrop: false,
    }).then((result) => {
      if (result.isConfirmed) {
        handleDelete();
      }
    });
  };

  const handleDownload = (row) => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let y = 20;

    doc.setFillColor(41, 128, 185);
    doc.rect(0, 0, pageWidth, 35, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('MATERIAL ASSIGNMENT REPORT', pageWidth / 2, 22, { align: 'center' });

    doc.setTextColor(0, 0, 0);
    y = 50;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Assignment Details', 20, y);

    doc.setLineWidth(0.5);
    doc.line(20, y + 2, 100, y + 2);
    y += 15;

    doc.setFontSize(11);
    doc.setFont('helvetica', 'normal');

    const details = [
      { label: 'Assignment Number:', value: row.assignmentNumber },
      { label: 'Indent Number:', value: row.indentNumber },
      { label: 'Process Order Number:', value: row.processOrderNumber },
      { label: 'Finished Goods Name:', value: row.finishedGoodsName },
      { label: 'Assigned To:', value: row.assignedTo },
      { label: 'Date:', value: new Date(row.date).toLocaleDateString() },
    ];

    details.forEach((detail) => {
      doc.setFont('helvetica', 'bold');
      doc.text(detail.label, 25, y);
      doc.setFont('helvetica', 'normal');
      doc.text(detail.value, 85, y);
      y += 12;
    });

    y += 10;

    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Materials List', 20, y);
    doc.line(20, y + 2, 100, y + 2);
    y += 15;

    doc.setFillColor(240, 240, 240);
    doc.rect(20, y - 5, pageWidth - 40, 15, 'F');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text('Material Name', 25, y + 5);
    doc.text('Code', 100, y + 5);
    doc.text('Quantity', 140, y + 5);

    doc.setLineWidth(0.3);
    doc.rect(20, y - 5, pageWidth - 40, 15);

    y += 20;

    doc.setFont('helvetica', 'normal');
    row.materials.forEach((mat, index) => {
      if (y > pageHeight - 30) {
        doc.addPage();
        y = 30;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 250);
        doc.rect(20, y - 5, pageWidth - 40, 15, 'F');
      }

      doc.setTextColor(0, 0, 0);
      doc.text(mat.materialsList || 'N/A', 25, y + 5);
      doc.text(mat.materialCode || 'N/A', 100, y + 5);
      doc.text(mat.assignedQuantity?.toString() || '0', 140, y + 5);

      doc.setLineWidth(0.1);
      doc.rect(20, y - 5, pageWidth - 40, 15);

      y += 15;
    });

    const footerY = pageHeight - 20;
    doc.setFillColor(240, 240, 240);
    doc.rect(0, footerY - 5, pageWidth, 15, 'F');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on ${new Date().toLocaleString()}`, pageWidth / 2, footerY, {
      align: 'center',
    });
    doc.text(`Page 1 of ${doc.getNumberOfPages()}`, pageWidth - 20, footerY, { align: 'right' });

    doc.save(`MaterialAssignment_${row.assignmentNumber}.pdf`);
  };
  const handleMenuCloseAndConfirmDelete = () => {
    handleClosePopover();
    setTimeout(() => {
      confirmDelete();
    }, 0);
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
        <TableCell> {row.assignmentNumber}</TableCell>
        <TableCell> {row.indentNumber}</TableCell>
        <TableCell> {row.finishedGoodsName}</TableCell>
        <TableCell> {row.date}</TableCell>
        <TableCell> {row.processOrderNumber}</TableCell>
        <TableCell
          style={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
          }}
        >
          {row.materials.map((material, index) => (
            <div key={index} style={{ marginRight: '10px' }}>
              <strong>{material.materialsList}</strong>: {`${material.assignedQuantity} KG`}
            </div>
          ))}
        </TableCell>

        <TableCell>
          {row.materials.map((material, index) => (
            <div key={index}>{`${material.assignedQuantity} KG`}</div>
          ))}
        </TableCell>

        <TableCell>
          {row.materials.map((material, index) => (
            <div key={index}>{material.materialCode}</div>
          ))}
        </TableCell>
        <TableCell>{row.assignedTo}</TableCell>

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
          <EditMaterialAssignmentForm
            setUpdate={setUpdate}
            materialAssignmentData={materialAssignmentData}
            materialNames={materialNames}
            finishedGoods={finishedGoods}
            processOrderNumbers={processOrderNumbers}
          />
          <ViewMaterialAssignmentForm materialAssignmentData={materialAssignmentData} />
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
