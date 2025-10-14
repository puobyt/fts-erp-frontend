import * as React from 'react';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { Input } from '@nextui-org/react';
import Modal from '@mui/material/Modal';
import { Iconify } from 'src/components/iconify';
import axiosInstance from 'src/configs/axiosInstance';
import toast, { Toaster } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../../global.css';
import { TextField, Container, MenuItem, Grid, Paper, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '85vw', // Responsive width
  maxWidth: 1000, // or any max width you prefer
  maxHeight: '90vh', // Responsive height
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  overflowY: 'auto', // Scroll if content overflows
};

export default function ProductionOrderCreationOutputForm({
  setUpdate,
  batches,
  nextBatchNumber,
  products,
}) {
  const [open, setOpen] = useState(false);
  const [product, setProduct] = useState(null)
  const navigate = useNavigate();
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [formData, setFormData] = useState({
    productName: '',
    producedQuantity: '',
    productionCompletionDate: '',
    // qualityCheckStatus: '',
    storageLocationforOutput: '',
    batchNumberforOutput: '',
    productionNotes: '',
    Yield: '',
    outputQualityRating: '',
    outputHandlingInstructions: '',
    packingMaterials: [{ type: '', quantity: '', unit: '' }],
    returnItems: [{ item: '', quantity: '', unit: '' }],

  });
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    formData.packingMaterials.forEach((material, index) => {
      if (!material.type) {
        newErrors[`packingMaterials[${index}].type`] = 'Type is required';
      }
      if (!material.quantity) {
        newErrors[`packingMaterials[${index}].quantity`] = 'Quantity is required';
      } else if (!/^\d+(\.\d+)?$/.test(material.quantity)) {
        newErrors[`packingMaterials[${index}].quantity`] = 'Quantity must be a valid number';
      }
      if (!material.unit) {
        newErrors[`packingMaterials[${index}].unit`] = 'Unit is required';
      }
    });
    if (!formData.producedQuantity) {
      newErrors.producedQuantity = 'Produced Quantity is required';
    } else if (!/^\d+(\.\d+)?$/.test(formData.producedQuantity)) {
      newErrors.producedQuantity = 'Produced Quantity must be a valid number';
    }
    if (!formData.productionCompletionDate)
      newErrors.productionCompletionDate = 'Production Completion Date is required';
    // if (!formData.qualityCheckStatus)
    //   newErrors.qualityCheckStatus = 'Quality Check Status is required'
    if (!formData.storageLocationforOutput)
      newErrors.storageLocationforOutput = 'Storage Location for Output is required';
    // if (!formData.batchNumberforOutput)
    //   newErrors.batchNumberforOutput = 'Batch Number for Output is required'
    if (!formData.productionNotes) newErrors.productionNotes = 'Production Notes is required';
    if (!formData.Yield) {
      newErrors.Yield = 'Yield is required';
    } else if (!/^\d+(\.\d+)?$/.test(formData.Yield)) {
      newErrors.Yield = 'Yield must be a valid number';
    }
    if (!formData.Yield) newErrors.Yield = 'Yield is required';
    if (!formData)
      if (!formData.outputQualityRating)
        newErrors.outputQualityRating = 'Output Quality Rating is required';
    if (!formData.outputHandlingInstructions)
      newErrors.outputHandlingInstructions = 'Output Handling Instructions is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0; // Returns true if there are no errors
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'productName') {
      const selectedProduct = products.filter((item) => item.productName === value)
      console.log('selectedProduct', selectedProduct)
      setProduct(selectedProduct[0])
    }
    setFormData((prev) => ({ ...prev, [name]: value }));

  };
  const handlePackingMaterialChange = (e, index) => {
    const { name, value } = e.target;
    const updatedMaterials = [...formData.packingMaterials];
    updatedMaterials[index][name] = value;
    setFormData({ ...formData, packingMaterials: updatedMaterials });
  };

  const handleReturnItemsChange = (e, index) => {
    const { name, value } = e.target;
    const updatedReturnItems = [...formData.returnItems];
    updatedReturnItems[index][name] = value;
    setFormData({ ...formData, returnItems: updatedReturnItems });
    console.log("------form",{ ...formData, returnItems: updatedReturnItems })
  }

  const addPackingMaterial = () => {
    setFormData((prev) => ({
      ...prev,
      packingMaterials: [...prev.packingMaterials, { type: '', quantity: '', unit: '' }],
    }));
  };

  const addReturnItems = () => {
    setFormData((prev) => ({
      ...prev,
      returnItems: [...prev.returnItems, { item: '', quantity: '', unit: '' }],
    }));
  };

  const removePackingMaterial = (index) => {
    const updatedMaterials = formData.packingMaterials.filter((_, i) => i !== index);
    setFormData({ ...formData, packingMaterials: updatedMaterials });
  };

  const removeReturnItem = (index) => {
    const updatedReturnItems = formData.returnItems.filter((_, i) => i !== index);
    setFormData({ ...formData, returnItems: updatedReturnItems });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }
    try {
      const result = await axiosInstance.post('/newProductionOrderCreationOutput', formData);
      if (result) {
        toast.success(result.data.message);
        handleClose();
        setFormData({
          productName: '',
          producedQuantity: '',
          productionCompletionDate: '',
          //   qualityCheckStatus: '',
          storageLocationforOutput: '',
          batchNumberforOutput: '',
          productionNotes: '',
          Yield: '',
          outputQualityRating: '',
          outputHandlingInstructions: '',
          packingMaterials: [{ type: '', quantity: '', unit: '' }],
          returnItems: [{ item: '', quantity: '', unit: '' }],
        });
        setUpdate((prev) => !prev);
      }
    } catch (err) {
      toast.success(err.response.data.message);
      console.error('Error occured in adding Current stock in client side', err.message);
    }
  };

  console.log("---product", product?.materials[0])

  return (
    <div>
      <Toaster position="top-center" reverseOrder={false} />
      <Button
        onClick={handleOpen}
        variant="contained"
        color="inherit"
        startIcon={<Iconify icon="mingcute:add-line" />}
      >
        New Production Order Creation Output
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          {/* X button to close modal */}
          <IconButton
            aria-label="close"
            onClick={handleClose}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
              zIndex: 10,
            }}
          >
            <CloseIcon />
          </IconButton>
          <Container maxWidth="lg">
            <Paper elevation={4} sx={{ p: 5, backgroundColor: '#f9f9f9', borderRadius: 3 }}>
              <Box sx={{ textAlign: 'center', mb: 3 }}>
                <Typography
                  component="h1"
                  variant="h5"
                  fontWeight="bold"
                  color="primary"
                  gutterBottom
                >
                  Add New Production Order Creation Output
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Production Order Creation Output Management
                </Typography>
              </Box>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Product Name"
                      name="productName"
                      value={formData.productName}
                      onChange={handleChange}
                      error={!!errors.productName}
                      helperText={errors.productName}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    >
                      {products.map((product, index) => (
                        <MenuItem key={index} value={product.productName}>
                          {product.productName}
                        </MenuItem>
                      ))}
                      <MenuItem
                        onClick={() => navigate('/production-workflow/production-order-creation')}
                        sx={{ fontStyle: 'italic' }}
                      >
                        Add New product +
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Produced Quantity"
                      name="producedQuantity"
                      value={formData.producedQuantity}
                      onChange={handleChange}
                      error={!!errors.producedQuantity}
                      helperText={errors.producedQuantity}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Production Completion Date"
                      name="productionCompletionDate"
                      type="date"
                      value={formData.productionCompletionDate}
                      onChange={handleChange}
                      error={!!errors.productionCompletionDate}
                      helperText={errors.productionCompletionDate}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Grid>
                  {/* <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label='Quality Check Status'
                      name='qualityCheckStatus'
                      value={formData.qualityCheckStatus}
                      onChange={handleChange}
                      error={!!errors.qualityCheckStatus}
                      helperText={errors.qualityCheckStatus}
                      variant='outlined'
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid> */}
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Storage Location For Output"
                      name="storageLocationforOutput"
                      value={formData.storageLocationforOutput}
                      onChange={handleChange}
                      error={!!errors.storageLocationforOutput}
                      helperText={errors.storageLocationforOutput}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      select
                      label="Batch Number For Output"
                      name="batchNumberforOutput"
                      value={formData.batchNumberforOutput}
                      onChange={handleChange}
                      error={!!errors.batchNumberforOutput}
                      helperText={errors.batchNumberforOutput}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    >
                      {batches.map((batch, index) => (
                        <MenuItem key={index} value={batch}>
                          {batch}
                        </MenuItem>
                      ))}
                      <MenuItem
                        onClick={() => navigate('/production-workflow/production-order-creation')}
                        sx={{ fontStyle: 'italic' }}
                      >
                        Add New Batch +
                      </MenuItem>
                    </TextField>
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Production Notes"
                      name="productionNotes"
                      value={formData.productionNotes}
                      onChange={handleChange}
                      error={!!errors.productionNotes}
                      helperText={errors.productionNotes}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Yield In %"
                      name="Yield"
                      value={formData.Yield}
                      onChange={handleChange}
                      error={!!errors.Yield}
                      helperText={errors.Yield}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>

                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Output Quality Rating"
                      name="outputQualityRating"
                      value={formData.outputQualityRating}
                      onChange={handleChange}
                      error={!!errors.outputQualityRating}
                      helperText={errors.outputQualityRating}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Output Handling Instructions"
                      name="outputHandlingInstructions"
                      value={formData.outputHandlingInstructions}
                      onChange={handleChange}
                      error={!!errors.outputHandlingInstructions}
                      helperText={errors.outputHandlingInstructions}
                      variant="outlined"
                      InputProps={{ style: { borderRadius: 8 } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                      Packing Materials
                    </Typography>
                  </Grid>

                  {formData.packingMaterials.map((material, index) => (
                    <React.Fragment key={index}>
                      <Grid item xs={4}>
                        <TextField
                          fullWidth
                          label="Type"
                          name="type"
                          value={material.type}
                          onChange={(e) => handlePackingMaterialChange(e, index)}
                          error={!!errors[`packingMaterials[${index}].type`]}
                          helperText={errors[`packingMaterials[${index}].type`]}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          name="quantity"
                          type="number"
                          value={material.quantity}
                          onChange={(e) => handlePackingMaterialChange(e, index)}
                          error={!!errors[`packingMaterials[${index}].quantity`]}
                          helperText={errors[`packingMaterials[${index}].quantity`]}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={3}>
                        <TextField
                          fullWidth
                          select
                          label="Unit"
                          name="unit"
                          value={material.unit}
                          onChange={(e) => handlePackingMaterialChange(e, index)}
                          error={!!errors[`packingMaterials[${index}].unit`]}
                          helperText={errors[`packingMaterials[${index}].unit`]}
                          variant="outlined"
                        >
                          {['KG', 'Gram', 'Litre', 'ML', 'Pieces'].map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
                        <IconButton onClick={() => removePackingMaterial(index)} color="error">
                          <Iconify icon="mdi:delete-outline" />
                        </IconButton>
                      </Grid>
                    </React.Fragment>
                  ))}

                  <Grid item xs={12}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="mdi:plus" />}
                      onClick={addPackingMaterial}
                    >
                      Add Packing Material
                    </Button>
                  </Grid>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant="subtitle2" fontWeight="bold" sx={{ mt: 2, mb: 1 }}>
                    Return Items
                  </Typography>
                </Grid>

                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {formData.returnItems.map((material, index) => (
                    <div key={index} style={{ display: 'flex', marginBottom: '16px', alignItems: 'center' }}>
                      {/* Type */}
                      <div style={{ flex: 1, marginRight: '8px' }}>
                        <TextField
                          fullWidth
                          select
                          label="Item"
                          name="item"
                          value={material.type}
                          onChange={(e) => handleReturnItemsChange(e, index)}
                          error={!!errors[`returnItems[${index}].item`]}
                          helperText={errors[`returnItems[${index}].item`]}
                          variant="outlined"
                        >
                        {product && product?.materials[0].map((material, index) => (
                          <MenuItem key={index} value={material?.materialsList}>
                            {material?.materialsList}
                          </MenuItem>
                        ))}
                        </TextField>
                      </div>

                      {/* Quantity */}
                      <div style={{ flex: 1, marginRight: '8px' }}>
                        <TextField
                          fullWidth
                          label="Quantity"
                          name="quantity"
                          type="number"
                          value={material.quantity}
                          onChange={(e) => handleReturnItemsChange(e, index)}
                          error={!!errors[`returnItems[${index}].quantity`]}
                          helperText={errors[`returnItems[${index}].quantity`]}
                          variant="outlined"
                        />
                      </div>

                      {/* Unit */}
                      <div style={{ flex: 1, marginRight: '8px' }}>
                        <TextField
                          fullWidth
                          select
                          label="Unit"
                          name="unit"
                          value={material.unit}
                          onChange={(e) => handleReturnItemsChange(e, index)}
                          error={!!errors[`returnItems[${index}].unit`]}
                          helperText={errors[`returnItems[${index}].unit`]}
                          variant="outlined"
                        >
                          {['KG', 'Gram', 'Litre', 'ML', 'Pieces'].map((unit) => (
                            <MenuItem key={unit} value={unit}>
                              {unit}
                            </MenuItem>
                          ))}
                        </TextField>
                      </div>

                      {/* Delete Button */}
                      <div style={{ marginLeft: '8px' }}>
                        <IconButton onClick={() => removeReturnItem(index)} color="error">
                          <Iconify icon="mdi:delete-outline" />
                        </IconButton>
                      </div>
                    </div>
                  ))}

                  {/* Add Material Button */}
                  <div style={{ marginTop: '16px' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="mdi:plus" />}
                      onClick={addReturnItems}
                    >
                      Add Return Item
                    </Button>
                  </div>
                </div>


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
                  Submit
                </Button>
              </Box>
            </Paper>
          </Container>
        </Box>
      </Modal>
    </div >
  );
}