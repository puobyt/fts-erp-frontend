import * as React from 'react';
import { useState, useRef, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Iconify } from 'src/components/iconify';
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../global.css';
import {
  TextField,
  Container,
  MenuItem,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  Avatar,
  IconButton,
  Chip,
  Divider,
  Alert,
  Autocomplete,
  Card,
  CardContent,
  CardActions
} from '@mui/material';
import { UNIT_OPTIONS } from '../../utils/Unit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DownloadIcon from '@mui/icons-material/Download';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { DeleteForever } from '@mui/icons-material';

const GATE_TYPES = {
  ENTRY: 'entry',
  QC_RETURN_ENTRY: 'qc_return_entry',
  RETURN_EXIT: 'return_exit'
};

const RETURN_REASONS = [
  'Quality Control Failure',
  'Damage During Transport',
  'Incorrect Specifications',
  'Customer Return',
  'Defective Material',
  'Wrong Quantity Delivered',
  'Expired Product',
  'Other'
];

const QC_STATUS = {
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',
  HOLD: 'hold'
};

export default function GateEntryExitForm({ setUpdate, firmNames }) {
  const [open, setOpen] = useState(false);
  const [gateType, setGateType] = useState(GATE_TYPES.ENTRY);
  const [qcDocuments, setQcDocuments] = useState([]);
  const [originalEntries, setOriginalEntries] = useState([]);
  const qcDocRef = useRef(null);
  const navigate = useNavigate();

  const initialFormData = {
    gateType: GATE_TYPES.ENTRY,
    entryTime: '',
    exitTime: '',
    vehicleNumber: '',
    vendorName: '',
    docNumber: '',
    materials: [{ materialName: '', quantity: '', unit: "", originalQuantity: '', returnedQuantity: '' }],
    date: '',
    remarks: '',
    returnReason: '',
    originalDocNumber: '',
    qcStatus: QC_STATUS.PENDING,
    qcRemarks: '',
    qcDocuments: [],
    isPartialReturn: false,
    returnedBy: '',
    approvedBy: '',
    expectedReturnDate: '',
    returnType: 'vendor',
    replacementRequired: false,
    replacementDueDate: '',
    batchNumber: '',
    lotNumber: '',
    serialNumbers: []
  };

  const handleGateTypeChange = (e) => {
    const type = e.target.value;
    setGateType(type);
    setFormData(prev => ({
      ...prev,
      gateType: type,
      returnReason: type === GATE_TYPES.QC_RETURN_ENTRY ? prev.returnReason : '',
      originalDocNumber: type === GATE_TYPES.QC_RETURN_ENTRY ? prev.originalDocNumber : '',
      qcStatus: type === GATE_TYPES.QC_RETURN_ENTRY ? prev.qcStatus : QC_STATUS.PENDING
    }));
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({});

  const isReturnType = gateType === GATE_TYPES.QC_RETURN_ENTRY || gateType === GATE_TYPES.RETURN_EXIT;

  const handleOpen = () => setOpen(true);

  useEffect(() => {
    if (isReturnType) {
      fetchOriginalEntries();
    }
  }, [gateType]);

  const fetchOriginalEntries = async () => {
    try {
      let endpoint = '/gateEntry';
      let response;

      if (gateType === GATE_TYPES.QC_RETURN_ENTRY) {
        endpoint = '/finishedGoods';
        response = await axiosInstance.get(endpoint);

        const transformedData = response.data.data.map(item => ({
          docNumber: item.batchNumber || 'N/A',
          vendorName: item.finishedGoodsName || 'N/A',
          date: item.productionDate || item.createdAt,
          materials: item.materials.map(mat => ({
            materialName: mat.materialsList || '',
            quantity: mat.quantity || '',
            unit: '', // You can add `unit` if available
            batchNumber: item.batchNumber || '',
            lotNumber: item.lotNumber || '',
            materialCode: mat.materialCode || '',
            vendorId: mat.vendorId || '',
            vendorName: mat.vendorName || ''
          }))
        }));

        setOriginalEntries(transformedData);
      } else {
        response = await axiosInstance.get(endpoint);
        const entries = response.data.data || [];
        const filteredEntries = entries.filter(entry => entry.gateType === 'entry');
        setOriginalEntries(filteredEntries);
      }
    } catch (error) {
      console.error('Error fetching original entries:', error);
      toast.error('Failed to fetch original entries');
    }
  };


  const validateField = (name, value) => {
    let error = '';

    switch (name) {
      case 'vehicleNumber':
        if (!value.trim()) error = 'Vehicle Number is required';
        else if (!/^[A-Za-z0-9\s-]+$/.test(value)) error = 'Invalid vehicle number format';
        break;
      case 'docNumber':
        if (!value.trim()) error = 'Document Number is required';
        else if (value.trim().length < 3) error = 'Document Number too short';
        break;
      case 'vendorName':
        if (!value.trim()) error = 'Vendor Name is required';
        break;
      case 'date':
        if (!value) error = 'Date is required';
        else if (new Date(value) > new Date()) error = 'Date cannot be in the future';
        break;
      case 'entryTime':
      case 'exitTime':
        if (!value) error = 'Time is required';
        break;
      case 'returnReason':
        if (isReturnType && !value) error = 'Return reason is required';
        break;
      case 'originalDocNumber':
        if (isReturnType && !value) error = 'Original document number is required';
        break;
      case 'returnedBy':
        if (isReturnType && !value.trim()) error = 'Returned by is required';
        break;
      case 'materialName':
        if (!value.trim()) error = 'Material name is required';
        else if (value.trim().length < 2) error = 'Material name too short';
        break;
      case 'quantity':
        if (!value) error = 'Quantity is required';
        else if (isNaN(value) || Number(value) <= 0) error = 'Quantity must be a positive number';
        break;
      case 'returnedQuantity':
        if (isReturnType && !value) error = 'Returned quantity is required';
        else if (isReturnType && (isNaN(value) || Number(value) <= 0)) error = 'Returned quantity must be a positive number';
        else if (isReturnType && Number(value) <= Number(formData.materials.find(m => m.materialName === name)?.originalQuantity || 0)) {
          error = 'Returned quantity cannot exceed original quantity';
        }
        break;
      default:
        break;
    }

    return error;
  };

  const validateForm = () => {
    const newErrors = {};
    let isValid = true;

    const fieldsToValidate = [
      'vehicleNumber', 'docNumber', 'vendorName', 'date',
      gateType.includes('entry') ? 'entryTime' : 'exitTime'
    ];

    if (isReturnType) {
      fieldsToValidate.push('returnReason', 'originalDocNumber', 'returnedBy');
    }

    fieldsToValidate.forEach(field => {
      const error = validateField(field, formData[field]);
      if (error) {
        newErrors[field] = error;
        isValid = false;
      }
    });

    formData.materials.forEach((material, index) => {
      const materialErrors = {};
      let materialHasErrors = false;

      ['materialName', isReturnType ? 'returnedQuantity' : 'quantity'].forEach(field => {
        const error = validateField(field, material[field]);
        if (error) {
          materialErrors[field] = error;
          materialHasErrors = true;
        }
      });

      if (materialHasErrors) {
        newErrors.materials = newErrors.materials || [];
        newErrors.materials[index] = materialErrors;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    const processedValue = type === 'text' || type === 'textarea' ? value.trim() : value;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : processedValue
    }));

    if (errors[name]) {
      const error = validateField(name, type === 'checkbox' ? checked : processedValue);
      setErrors(prev => ({
        ...prev,
        [name]: error || undefined
      }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fix the errors in the form');
      return;
    }

    try {
      const formDataToSend = new FormData();
      const { qcDocuments, materials, serialNumbers, ...otherFields } = formData;

      // Debugging: Log the form data before sending
      console.log('Form Data to Send:', { ...otherFields, materials, serialNumbers });

      Object.entries(otherFields).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formDataToSend.append(key, value);
        }
      });

      formDataToSend.append('materials', JSON.stringify(materials));
      formDataToSend.append('serialNumbers', JSON.stringify(serialNumbers));

      qcDocuments.forEach((file) => {
        formDataToSend.append('qcDocuments', file);
      });

      let endpoint;
      switch (gateType) {
        case GATE_TYPES.ENTRY:
          endpoint = '/newGateEntry';
          break;
        case GATE_TYPES.QC_RETURN_ENTRY:
          endpoint = '/newQcReturnEntry';
          break;
        case GATE_TYPES.RETURN_EXIT:
          endpoint = '/newGateExit';
          break;
        default:
          endpoint = '/newGateEntry';
      }

      const result = await axiosInstance.post(endpoint, formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (result) {
        toast.success(result.data.message);
        handleClose();
        setUpdate(prev => !prev);
      }
    } catch (err) {
      console.error('Submission error:', err);
      toast.error(err.response?.data?.message || 'Failed to submit form');
    }
  };

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaterials = [...formData.materials];
    const processedValue = ['materialName', 'batchNumber', 'lotNumber'].includes(name) ? value.trim() : value;

    updatedMaterials[index][name] = processedValue;
    setFormData({ ...formData, materials: updatedMaterials });

    if (errors.materials?.[index]?.[name]) {
      const error = validateField(name, processedValue);
      setErrors(prev => {
        const newErrors = { ...prev };
        if (error) {
          newErrors.materials = newErrors.materials || [];
          newErrors.materials[index] = newErrors.materials[index] || {};
          newErrors.materials[index][name] = error;
        } else if (newErrors.materials?.[index]) {
          delete newErrors.materials[index][name];
          if (Object.keys(newErrors.materials[index]).length === 0) {
            newErrors.materials.splice(index, 1);
            if (newErrors.materials.length === 0) {
              delete newErrors.materials;
            }
          }
        }
        return newErrors;
      });
    }
  };

  const addMaterial = () => {
    setFormData(prevFormData => ({
      ...prevFormData,
      materials: [
        ...prevFormData.materials,
        { materialName: '', quantity: '', unit: "", originalQuantity: '', returnedQuantity: '' }
      ]
    }));
  };

  const removeMaterial = index => {
    const updatedMaterials = formData.materials.filter((_, i) => i !== index);
    setFormData({ ...formData, materials: updatedMaterials });

    setErrors(prev => {
      const newErrors = { ...prev };
      if (newErrors.materials) {
        newErrors.materials.splice(index, 1);
        if (newErrors.materials.length === 0) {
          delete newErrors.materials;
        }
      }
      return newErrors;
    });
  };

  const handleClose = () => {
    setOpen(false);
    setQcDocuments([]);
    setGateType(GATE_TYPES.ENTRY);
    setFormData({
      ...initialFormData,
      qcDocuments: []
    });
    setErrors({});

    if (qcDocRef.current) qcDocRef.current.value = '';
  };

  const handleQcDocumentUpload = (e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['application/pdf', 'image/jpeg'];
      const isValidType = validTypes.includes(file.type);
      const isValidSize = file.size <= 10 * 1024 * 1024;

      if (!isValidType) {
        toast.error(`Invalid file type for ${file.name}. Only PDF and JPEG are allowed.`);
        return false;
      }
      if (!isValidSize) {
        toast.error(`File ${file.name} is too large. Maximum size is 10MB.`);
        return false;
      }
      return true;
    });

    setQcDocuments(prev => [...prev, ...validFiles]);
    setFormData(prev => ({
      ...prev,
      qcDocuments: [...prev.qcDocuments, ...validFiles]
    }));
  };

  const removeQcDocument = (index) => {
    setQcDocuments(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      qcDocuments: prev.qcDocuments.filter((_, i) => i !== index)
    }));
  };

  const triggerQcDocInput = () => {
    qcDocRef.current.click();
  };

  const handleOriginalDocSelect = (selectedDoc) => {
    if (selectedDoc) {
      setFormData(prev => ({
        ...prev,
        originalDocNumber: selectedDoc.docNumber,
        vendorName: selectedDoc.vendorName,
        materials: selectedDoc.materials.map(mat => ({
          ...mat,
          originalQuantity: mat.quantity,
          returnedQuantity: '',
          quantity: '',
          unit: mat.unit // Preserve the original unit
        }))
      }));
    }
  };

  const getGateTypeIcon = (type) => {
    switch (type) {
      case GATE_TYPES.ENTRY:
        return <LocalShippingIcon />;
      case GATE_TYPES.QC_RETURN_ENTRY:
        return <AssignmentReturnIcon />;
      case GATE_TYPES.RETURN_EXIT:
        return <AssignmentReturnIcon style={{ transform: 'rotate(180deg)' }} />;
      default:
        return <LocalShippingIcon />;
    }
  };

  const getGateTypeColor = (type) => {
    switch (type) {
      case GATE_TYPES.ENTRY:
        return 'success';
      case GATE_TYPES.QC_RETURN_ENTRY:
        return 'warning';
      case GATE_TYPES.RETURN_EXIT:
        return 'error';
      default:
        return 'default';
    }
  };

  return (
    <div>
      <Toaster position='top-center' reverseOrder={false} />
        <Button
          onClick={handleOpen}
          variant='contained'
          color='inherit'
          startIcon={<Iconify icon='mingcute:add-line' />}
        >
          New Gate Entry/Exit
        </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='modal-modal-title'
        aria-describedby='modal-modal-description'
        sx={{ overflow: 'auto' }}
      >
        <Container maxWidth='lg' sx={{ mt: 4, mb: 4 }}>
          <Paper elevation={4} sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 3, maxHeight: "90vh", overflow: 'auto' }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component='h1' variant='h5' fontWeight='bold' color='primary' gutterBottom>
                {gateType === GATE_TYPES.ENTRY && 'Add New Gate Entry'}
                {gateType === GATE_TYPES.QC_RETURN_ENTRY && 'QC Return Entry'}
                {gateType === GATE_TYPES.RETURN_EXIT && 'Return Exit'}
              </Typography>
              <Typography variant='body2' color='textSecondary'>
                Gate Management System
              </Typography>
            </Box>

            <Box component='form' onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <InputLabel>Gate Type</InputLabel>
                    <Select
                      value={gateType}
                      onChange={handleGateTypeChange}
                      label="Gate Type"
                      variant="outlined"
                      sx={{ borderRadius: 2 }}
                    >
                      <MenuItem value={GATE_TYPES.ENTRY}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <LocalShippingIcon color="success" />
                          <span>Entry</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value={GATE_TYPES.QC_RETURN_ENTRY}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentReturnIcon color="warning" />
                          <span>Return Entry (QC Failed)</span>
                        </Box>
                      </MenuItem>
                      <MenuItem value={GATE_TYPES.RETURN_EXIT}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AssignmentReturnIcon color="error" style={{ transform: 'rotate(180deg)' }} />
                          <span>Return Exit (Back to Vendor)</span>
                        </Box>
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', height: '100%' }}>
                    <Chip
                      icon={getGateTypeIcon(gateType)}
                      label={gateType.replace('_', ' ').toUpperCase()}
                      color={getGateTypeColor(gateType)}
                      variant="outlined"
                      size="large"
                    />
                  </Box>
                </Grid>

                {isReturnType && (
                  <>
                    <Grid item xs={12}>
                      <Alert severity="info" sx={{ mb: 2 }}>
                        <Typography variant="body2">
                          <strong>Return Processing:</strong> This section handles products returned due to QC failures or other issues.
                        </Typography>
                      </Alert>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Autocomplete
                        options={originalEntries}
                        getOptionLabel={(option) => `${option.docNumber} - ${option.vendorName}`}
                        onChange={(event, value) => handleOriginalDocSelect(value)}
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            label="Original Document Number"
                            error={!!errors.originalDocNumber}
                            helperText={errors.originalDocNumber}
                            variant="outlined"
                            InputProps={{ ...params.InputProps, style: { borderRadius: 8 } }}
                          />
                        )}
                        renderOption={(props, option) => (
                          <Box component="li" {...props}>
                            <Box>
                              <Typography variant="body2" fontWeight="bold">
                                {option.docNumber}
                              </Typography>
                              <Typography variant="caption" color="textSecondary">
                                {option.vendorName} - {option.date}
                              </Typography>
                              {option.materials && option.materials[0] && (
                                <Typography variant="caption" display="block">
                                  Material: {option.materials[0].materialName}
                                </Typography>
                              )}
                            </Box>
                          </Box>
                        )}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="Return Reason"
                        name="returnReason"
                        value={formData.returnReason}
                        onChange={handleChange}
                        error={!!errors.returnReason}
                        helperText={errors.returnReason}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 } }}
                      >
                        {RETURN_REASONS.map((reason) => (
                          <MenuItem key={reason} value={reason}>
                            {reason}
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        select
                        label="QC Status"
                        name="qcStatus"
                        value={formData.qcStatus}
                        onChange={handleChange}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 } }}
                      >
                        <MenuItem value={QC_STATUS.PENDING}>
                          <Chip label="Pending" color="warning" size="small" />
                        </MenuItem>
                        <MenuItem value={QC_STATUS.APPROVED}>
                          <Chip label="Approved" color="success" size="small" />
                        </MenuItem>
                        <MenuItem value={QC_STATUS.REJECTED}>
                          <Chip label="Rejected" color="error" size="small" />
                        </MenuItem>
                        <MenuItem value={QC_STATUS.HOLD}>
                          <Chip label="Hold" color="info" size="small" />
                        </MenuItem>
                      </TextField>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Returned By"
                        name="returnedBy"
                        value={formData.returnedBy}
                        onChange={handleChange}
                        error={!!errors.returnedBy}
                        helperText={errors.returnedBy}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 } }}
                      />
                    </Grid>
                  </>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    type="time"
                    label={gateType.includes('entry') ? 'Entry Time' : 'Exit Time'}
                    name={gateType.includes('entry') ? 'entryTime' : 'exitTime'}
                    value={gateType.includes('entry') ? formData.entryTime : formData.exitTime}
                    onChange={handleChange}
                    error={!!(gateType.includes('entry') ? errors.entryTime : errors.exitTime)}
                    helperText={gateType.includes('entry') ? errors.entryTime : errors.exitTime}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Vehicle Number"
                    name="vehicleNumber"
                    value={formData.vehicleNumber}
                    onChange={handleChange}
                    error={!!errors.vehicleNumber}
                    helperText={errors.vehicleNumber}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Doc Number"
                    name="docNumber"
                    value={formData.docNumber}
                    onChange={handleChange}
                    error={!!errors.docNumber}
                    helperText={errors.docNumber}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    select
                    label="Vendor Name"
                    name="vendorName"
                    value={formData.vendorName}
                    onChange={handleChange}
                    error={!!errors.vendorName}
                    helperText={errors.vendorName}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    {firmNames.map((firm, index) => (
                      <MenuItem key={index} value={firm}>
                        {firm}
                      </MenuItem>
                    ))}
                    <MenuItem
                      onClick={() => navigate('/vendor-stock-management/vendor-management')}
                      sx={{ fontStyle: 'italic' }}
                    >
                      Add New Firm +
                    </MenuItem>
                  </TextField>
                </Grid>

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Date"
                    name="date"
                    type="date"
                    value={formData.date}
                    onChange={handleChange}
                    error={!!errors.date}
                    helperText={errors.date}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }}>
                    <Typography variant="h6" color="primary">
                      Materials Information
                    </Typography>
                  </Divider>
                </Grid>

                {formData.materials.map((material, index) => (
                  <Grid item xs={12} key={index}>
                    <Card variant="outlined" sx={{ mb: 2 }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Material {index + 1}
                        </Typography>
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={4}>
                            <TextField
                              fullWidth
                              label="Material Name"
                              name="materialName"
                              value={material.materialName}
                              onChange={e => handleMaterialChange(e, index)}
                              error={!!errors.materials?.[index]?.materialName}
                              helperText={errors.materials?.[index]?.materialName}
                              variant="outlined"
                              InputProps={{ style: { borderRadius: 8 } }}
                            />
                          </Grid>

                          {isReturnType && (
                            <>
                              <Grid item xs={12} md={2}>
                                <TextField
                                  fullWidth
                                  label="Original Qty"
                                  name="originalQuantity"
                                  value={material.originalQuantity}
                                  onChange={e => handleMaterialChange(e, index)}
                                  variant="outlined"
                                  disabled
                                  InputProps={{ style: { borderRadius: 8 } }}
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <TextField
                                  fullWidth
                                  label="Returned Qty"
                                  name="returnedQuantity"
                                  value={material.returnedQuantity}
                                  onChange={e => handleMaterialChange(e, index)}
                                  error={!!errors.materials?.[index]?.returnedQuantity}
                                  helperText={errors.materials?.[index]?.returnedQuantity}
                                  variant="outlined"
                                  InputProps={{ style: { borderRadius: 8 } }}
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <TextField
                                  fullWidth
                                  label="Unit"
                                  name="unit"
                                  value={material.unit}
                                  variant="outlined"
                                  disabled
                                  InputProps={{ style: { borderRadius: 8 } }}
                                />
                              </Grid>
                              <Grid item xs={12} md={2}>
                                <TextField
                                  fullWidth
                                  label="Batch/Lot No"
                                  name="batchNumber"
                                  value={material.batchNumber || ''}
                                  onChange={e => handleMaterialChange(e, index)}
                                  variant="outlined"
                                  InputProps={{ style: { borderRadius: 8 } }}
                                />
                              </Grid>
                            </>
                          )}
                          {!isReturnType && (
                            <>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  label="Quantity"
                                  name="quantity"
                                  value={material.quantity}
                                  onChange={e => handleMaterialChange(e, index)}
                                  error={!!errors.materials?.[index]?.quantity}
                                  helperText={errors.materials?.[index]?.quantity}
                                  variant="outlined"
                                  InputProps={{ style: { borderRadius: 8 } }}
                                />
                              </Grid>
                              <Grid item xs={12} md={3}>
                                <TextField
                                  fullWidth
                                  select
                                  label="Unit"
                                  name="unit"
                                  value={material.unit}
                                  onChange={e => handleMaterialChange(e, index)}
                                  error={!!errors.materials?.[index]?.unit}
                                  helperText={errors.materials?.[index]?.unit}
                                  variant="outlined"
                                  InputProps={{ style: { borderRadius: 8 } }}
                                >
                                  {UNIT_OPTIONS.map((unit) => (
                                    <MenuItem key={unit} value={unit}>{unit}</MenuItem>
                                  ))}
                                </TextField>
                              </Grid>
                            </>
                          )}
                        </Grid>
                      </CardContent>
                      <CardActions>
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => removeMaterial(index)}
                          size="small"
                        >
                          Remove Material
                        </Button>
                      </CardActions>
                    </Card>
                  </Grid>
                ))}

                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={addMaterial}
                    startIcon={<Iconify icon="mingcute:add-line" />}
                  >
                    Add Material
                  </Button>
                </Grid>

                {isReturnType && (
                  <Grid item xs={12} md={6}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <input
                        type="file"
                        ref={qcDocRef}
                        onChange={handleQcDocumentUpload}
                        accept=".pdf,.jpg,.jpeg"
                        multiple
                        style={{ display: 'none' }}
                      />
                      <Button
                        variant="outlined"
                        color="warning"
                        startIcon={<PictureAsPdfIcon />}
                        onClick={triggerQcDocInput}
                        sx={{ borderRadius: 8 }}
                      >
                        Upload QC Documents (PDF/JPEG only)
                      </Button>
                      {qcDocuments.length > 0 && (
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          {qcDocuments.map((doc, index) => (
                            <Chip
                              key={index}
                              label={doc.name}
                              onDelete={() => removeQcDocument(index)}
                              color="warning"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}
                    </Box>
                  </Grid>
                )}

                {isReturnType && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="QC Remarks"
                      name="qcRemarks"
                      value={formData.qcRemarks}
                      onChange={handleChange}
                      variant="outlined"
                      multiline
                      rows={3}
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>
                )}

                <Grid item xs={12} md={6}>
                  <TextField
                    fullWidth
                    label="Remarks"
                    name="remarks"
                    value={formData.remarks}
                    onChange={handleChange}
                    variant="outlined"
                    multiline
                    rows={3}
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>

                {isReturnType && (
                  <Grid item xs={12} md={6}>
                    <FormControl fullWidth>
                      <InputLabel>Replacement Required</InputLabel>
                      <Select
                        value={formData.replacementRequired}
                        onChange={handleChange}
                        name="replacementRequired"
                        label="Replacement Required"
                        variant="outlined"
                        sx={{ borderRadius: 2 }}
                      >
                        <MenuItem value={false}>No</MenuItem>
                        <MenuItem value={true}>Yes</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                )}

                {isReturnType && formData.replacementRequired && (
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label="Replacement Due Date"
                      name="replacementDueDate"
                      type="date"
                      value={formData.replacementDueDate}
                      onChange={handleChange}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                )}
              </Grid>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  mt: 4,
                  py: 1.5,
                  fontWeight: 'bold',
                  borderRadius: 8,
                  background: isReturnType
                    ? 'linear-gradient(90deg, #ff6b6b, #ee5a24)'
                    : 'linear-gradient(90deg, #4a90e2, #3b5998)',
                  color: 'white',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                    background: isReturnType
                      ? 'linear-gradient(90deg, #ee5a24, #ff6b6b)'
                      : 'linear-gradient(90deg, #3b5998, #4a90e2)'
                  }
                }}
              >
                {isReturnType ? 'Process Return' : 'Submit'}
              </Button>
            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  );
}