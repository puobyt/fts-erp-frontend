import React, { useState } from 'react'
import * as XLSX from 'xlsx'
import axios from 'axios'
import { Button } from '@mui/material'
import axiosInstance from '../configs/axiosInstance'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import toast, { Toaster } from 'react-hot-toast'

const ImportExcel = ({setUpdate}) => {
    const [excelData, setExcelData] = useState([]);
  
    // Handle file upload and automatic submission
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
  
          console.log('Excel Data:', sheetsData); // Debugging
          const response = await axiosInstance.post('/processOrder/import-data', { sheetsData });
          if (response.status === 200) {
            setUpdate(prev=>!prev);
            toast.success('Data imported successfully!');
          }
        } catch (err) {
          console.error('Error uploading data:', err);
          toast.error('Failed to import data!');
        }
      };
  
      reader.readAsArrayBuffer(file);
    };
  
    return (
      <div>
        <input
          type="file"
          accept=".xlsx, .xls"
          style={{ display: 'none' }}
          id="excel-file-input"
          onChange={handleFileUpload} // Trigger file upload and submission
        />
        <label htmlFor="excel-file-input">
          <Button
            variant="contained"
            color="primary"
            component="span"
            startIcon={<CloudUploadIcon />}
          >
            Import Excel
          </Button>
        </label>
      </div>
    );
  };

export default ImportExcel
