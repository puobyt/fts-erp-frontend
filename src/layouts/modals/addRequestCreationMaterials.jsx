import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Iconify } from 'src/components/iconify';
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import '../../global.css';
import { TextField, Container, MenuItem, Grid, Paper, CircularProgress } from '@mui/material';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export default function RequestCreationForMaterialsForm({ setUpdate }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState({ po: false, prodOrder: false, materials: false });
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    resetForm();
  };
  const navigate = useNavigate();

  // Dropdown states
  const [poList, setPoList] = useState([]);
  const [selectedPO, setSelectedPO] = useState('');
  const [prodOrderList, setProdOrderList] = useState([]);
  const [selectedProdOrder, setSelectedProdOrder] = useState('');
  const [materialList, setMaterialList] = useState([]);
  
  const [formData, setFormData] = useState({
    requestNumber: '',
    finishedGoodsName: '',
    status: '',
    materials: [{ materialsList: '', quantity: '', unit: '', materialCode: '' }],
    requiredDate: '',
  });
  const [errors, setErrors] = useState({});

  // Reset form function
  const resetForm = () => {
    setFormData({
      requestNumber: '',
      finishedGoodsName: '',
      status: '',
      materials: [{ materialsList: '', quantity: '', unit: '', materialCode: '' }],
      requiredDate: '',
    });
    setSelectedPO('');
    setSelectedProdOrder('');
    setPoList([]);
    setProdOrderList([]);
    setMaterialList([]);
    setErrors({});
  };

  // Fetch PO list on open
  useEffect(() => {
    if (open) {
      fetchPurchaseOrders();
    }
  }, [open]);

  const fetchPurchaseOrders = async () => {
    setLoading(prev => ({ ...prev, po: true }));
    try {
      const res = await axiosInstance.get('/purchase-orders');
      setPoList(res.data.data|| []);
    } catch (err) {
      toast.error('Failed to fetch Purchase Orders');
      console.error('PO fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, po: false }));
    }
  };

  // Fetch Production Orders when PO changes
  useEffect(() => {
    if (selectedPO) {
      fetchProductionOrders(selectedPO);
    } else {
      // Reset dependent dropdowns
      setProdOrderList([]);
      setSelectedProdOrder('');
      setMaterialList([]);
      // Reset materials in form
      setFormData(prev => ({
        ...prev,
        materials: [{ materialsList: '', quantity: '', unit: '', materialCode: '' }]
      }));
    }
  }, [selectedPO]);

  const fetchProductionOrders = async (poId) => {
    setLoading(prev => ({ ...prev, prodOrder: true }));
    try {
      const res = await axiosInstance.get(`/purchase-orders/${poId}/production-orders`);
      console.log("FETCH PRODUCTIONORDERS",res)
      setProdOrderList(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch Production Orders');
      console.error('Production Order fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, prodOrder: false }));
    }
  };

  // Fetch Materials when Production Order changes
  useEffect(() => {
    if (selectedProdOrder) {
      fetchMaterials(selectedProdOrder);
    } else {
      setMaterialList([]);
      // Reset materials in form
      setFormData(prev => ({
        ...prev,
        materials: [{ materialsList: '', quantity: '', unit: '', materialCode: '' }]
      }));
    }
  }, [selectedProdOrder]);

  const fetchMaterials = async (prodOrderId) => {
    setLoading(prev => ({ ...prev, materials: true }));
    try {
      const res = await axiosInstance.get(`/production-orders/${prodOrderId}/materials`);
      console.log("FETCH MATERIALS",res)
      setMaterialList(res.data || []);
    } catch (err) {
      toast.error('Failed to fetch Materials');
      console.error('Materials fetch error:', err);
    } finally {
      setLoading(prev => ({ ...prev, materials: false }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required field validations
    if (!selectedPO) newErrors.selectedPO = 'Purchase Order is required';
    if (!selectedProdOrder) newErrors.selectedProdOrder = 'Production Order is required';
    if (!formData.finishedGoodsName.trim()) newErrors.finishedGoodsName = 'Finished Goods Name is required';
    if (!formData.requiredDate) newErrors.requiredDate = 'Required Date is required';
    
    // Date validation
    if (formData.requiredDate && new Date(formData.requiredDate) <= new Date()) {
      newErrors.requiredDate = 'Required date must be in the future';
    }
    
    // Materials validation
    if (formData.materials.length === 0) {
      newErrors.materials = 'At least one material is required';
    } else {
      let hasMaterialErrors = false;
      formData.materials.forEach((mat, idx) => {
        if (!mat.materialsList || !mat.quantity || !mat.materialCode || !mat.unit) {
          newErrors[`material-${idx}`] = 'All material fields must be filled';
          hasMaterialErrors = true;
        } else if (!Number.isFinite(Number(mat.quantity)) || Number(mat.quantity) <= 0) {
          newErrors[`quantity-${idx}`] = 'Quantity must be a positive number';
          hasMaterialErrors = true;
        }
      });
      if (hasMaterialErrors) {
        newErrors.materials = 'Please fix material errors';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePOChange = (e) => {
    const value = e.target.value;
    setSelectedPO(value);
    setSelectedProdOrder(''); // Reset dependent selections
    // Clear errors
    setErrors(prev => ({ ...prev, selectedPO: undefined }));
  };

  const handleProdOrderChange = (e) => {
    const value = e.target.value;
    setSelectedProdOrder(value);
    // Clear errors
    setErrors(prev => ({ ...prev, selectedProdOrder: undefined }));
  };

  const handleMaterialChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaterials = [...formData.materials];
    updatedMaterials[index][name] = value;

    // Auto-fill code and unit when material is selected
    if (name === 'materialsList') {
      const selectedMaterial = materialList.find(mat => mat.materialName === value);
      if (selectedMaterial) {
        updatedMaterials[index].materialCode = selectedMaterial.materialCode || '';
        updatedMaterials[index].unit = selectedMaterial.unit || '';
      } else {
        updatedMaterials[index].materialCode = '';
        updatedMaterials[index].unit = '';
      }
    }
    
    setFormData({ ...formData, materials: updatedMaterials });
    
    // Clear material-specific errors
    setErrors(prev => ({ 
      ...prev, 
      [`material-${index}`]: undefined,
      [`quantity-${index}`]: undefined,
      materials: undefined 
    }));
  };

  const addMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      materials: [
        ...prev.materials,
        { materialsList: '', quantity: '', unit: '', materialCode: '' },
      ],
    }));
  };

  const removeMaterial = (index) => {
    if (formData.materials.length > 1) {
      setFormData((prev) => ({
        ...prev,
        materials: prev.materials.filter((_, i) => i !== index),
      }));
      
      // Clear errors for removed material
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`material-${index}`];
        delete newErrors[`quantity-${index}`];
        return newErrors;
      });
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear field-specific errors
    setErrors(prev => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the form errors');
      return;
    }

    try {
      const payload = {
        ...formData,
        purchaseOrder: selectedPO,
        productionOrder: selectedProdOrder,
        // Ensure all required fields are included
        finishedGoodsName: formData.finishedGoodsName.trim(),
      };

      const result = await axiosInstance.post('/newRequestCreationForMaterials', payload);
      
      if (result?.data) {
        toast.success(result.data.message || 'Request created successfully');
        handleClose();
        setUpdate((prev) => !prev);
      }
    } catch (err) {
      const errorMessage = err?.response?.data?.message || 'Submission failed';
      toast.error(errorMessage);
      console.error('Submission error:', err);
    }
  };

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Button
        onClick={handleOpen}
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        New Request Creation For Materials
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Container maxWidth="lg" sx={{ mt: 8 }}>
          <Paper elevation={4} sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 3 }}>
              <Typography component="h1" variant="h5" fontWeight="bold" color="primary" gutterBottom>
                Add New Request For Creation Materials
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Request Creation For Materials Management
              </Typography>
            </Box>
            
            <Box component="form" onSubmit={handleSubmit} sx={{ maxHeight: '65vh', overflowY: 'auto', paddingRight: 2 }}>
              <Grid container spacing={2} sx={{ mt: 0.1 }}>
                
                {/* Cascading Dropdowns */}
                <Grid item xs={4}>
                  <TextField
                    select
                    label="Linked PO *"
                    value={selectedPO}
                    onChange={handlePOChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.selectedPO}
                    helperText={errors.selectedPO}
                    InputProps={{ style: { borderRadius: 8 } }}
                    disabled={loading.po}
                  >
                    {loading.po ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading...
                      </MenuItem>
                    ) : (
                      poList.map(po => (
                        <MenuItem key={po._id} value={po._id}>{po.purchaseOrderNumber}</MenuItem>

                      ))
                    )}
                  </TextField>
                </Grid>
                
                <Grid item xs={4}>
                  <TextField
                    select
                    label="Production Order *"
                    value={selectedProdOrder}
                    onChange={handleProdOrderChange}
                    fullWidth
                    variant="outlined"
                    error={!!errors.selectedProdOrder}
                    helperText={errors.selectedProdOrder}
                    InputProps={{ style: { borderRadius: 8 } }}
                    disabled={!selectedPO || loading.prodOrder}
                  >
                    {loading.prodOrder ? (
                      <MenuItem disabled>
                        <CircularProgress size={20} sx={{ mr: 1 }} />
                        Loading...
                      </MenuItem>
                    ) : (
                      prodOrderList.map(po => (
                        <MenuItem key={po._id} value={po._id}>{po.productionOrderNumber}</MenuItem>
                      ))
                    )}
                  </TextField>
                </Grid>
                
                <Grid item xs={4}>
                  <TextField
                    fullWidth
                    label="Finished Goods Name *"
                    name="finishedGoodsName"
                    value={formData.finishedGoodsName}
                    onChange={handleChange}
                    error={!!errors.finishedGoodsName}
                    helperText={errors.finishedGoodsName}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>

                {/* Materials Section */}
                <Grid item xs={12}>
                  <Typography variant="h6" sx={{ mt: 2, mb: 1 }}>
                    Materials {errors.materials && <span style={{ color: 'red', fontSize: '0.8em' }}>({errors.materials})</span>}
                  </Typography>
                </Grid>
                
                {formData.materials.map((material, index) => (
                  <React.Fragment key={index}>
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        select
                        label={`Material ${index + 1} *`}
                        name="materialsList"
                        value={material.materialsList}
                        onChange={(e) => handleMaterialChange(e, index)}
                        error={!!errors[`material-${index}`]}
                        helperText={errors[`material-${index}`]}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 } }}
                        disabled={!selectedProdOrder || loading.materials}
                      >
                        {loading.materials ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} sx={{ mr: 1 }} />
                            Loading...
                          </MenuItem>
                        ) : (
                          materialList.map((mat, idx) => (
                            <MenuItem key={idx} value={mat.materialName}>
                              {mat.materialName}
                            </MenuItem>
                          ))
                        )}
                      </TextField>
                    </Grid>
                    
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Quantity *"
                        name="quantity"
                        value={material.quantity}
                        onChange={(e) => handleMaterialChange(e, index)}
                        error={!!errors[`quantity-${index}`]}
                        helperText={errors[`quantity-${index}`]}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 } }}
                        type="number"
                        inputProps={{ min: 0, step: "any" }}
                      />
                    </Grid>
                    
                    <Grid item xs={2}>
                      <TextField
                        fullWidth
                        label="Unit"
                        name="unit"
                        value={material.unit}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={3}>
                      <TextField
                        fullWidth
                        label="Material Code"
                        name="materialCode"
                        value={material.materialCode}
                        variant="outlined"
                        InputProps={{ style: { borderRadius: 8 }, readOnly: true }}
                        disabled
                      />
                    </Grid>
                    
                    <Grid item xs={1} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {formData.materials.length > 1 && (
                        <Button
                          variant="text"
                          color="error"
                          onClick={() => removeMaterial(index)}
                          size="small"
                          sx={{ textTransform: 'none', minWidth: 'auto' }}
                        >
                          Remove
                        </Button>
                      )}
                    </Grid>
                  </React.Fragment>
                ))}
                
                <Grid item xs={12}>
                  <Button 
                    variant="outlined" 
                    color="primary" 
                    onClick={addMaterial}
                    disabled={!selectedProdOrder || materialList.length === 0}
                  >
                    Add Material
                  </Button>
                </Grid>

                {/* Other Form Fields */}
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Request Number"
                    name="requestNumber"
                    value={formData.requestNumber}
                    onChange={handleChange}
                    error={!!errors.requestNumber}
                    helperText={errors.requestNumber || "Auto-generated if left empty"}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                  />
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    select
                    fullWidth
                    label="Status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    error={!!errors.status}
                    helperText={errors.status}
                    variant="outlined"
                    InputProps={{ style: { borderRadius: 8 } }}
                  >
                    <MenuItem value="">None</MenuItem>
                    <MenuItem value="Return" sx={{ color: 'blue', fontWeight: 'bold' }}>
                      Return
                    </MenuItem>
                  </TextField>
                </Grid>
                
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Required Date *"
                    name="requiredDate"
                    type="date"
                    value={formData.requiredDate}
                    onChange={handleChange}
                    error={!!errors.requiredDate}
                    helperText={errors.requiredDate}
                    variant="outlined"
                    InputProps={{
                      style: { borderRadius: 8 },
                      inputProps: { min: new Date(Date.now() + 86400000).toISOString().split('T')[0] }, // Tomorrow
                    }}
                    InputLabelProps={{ shrink: true }}
                  />
                </Grid>
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
                  background: 'linear-gradient(90deg, #4a90e2, #3b5998)',
                  color: 'white',
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.2)',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.05)',
                    boxShadow: '0px 6px 16px rgba(0, 0, 0, 0.3)',
                    background: 'linear-gradient(90deg, #3b5998, #4a90e2)',
                  },
                }}
              >
                Submit Request
              </Button>
            </Box>
          </Paper>
        </Container>
      </Modal>
    </div>
  );
}