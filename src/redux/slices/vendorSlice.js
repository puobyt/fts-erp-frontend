// productsSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";


export const fetchVendors = createAsyncThunk(
  "vendors/fetchProducts",
  async () => {
    const response = await fetch("/api/products");
    return await response.json();
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState: {
    items: [],
    status: "idle",
  },
  reducers: {
    addProduct: (state, action) => {
      state.items.push(action.payload);
    },
    deleteProduct: (state, action) => {
      state.items = state.items.filter(
        (product) => product.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "failed";
      });
  },
});

export const { addProduct, deleteProduct } = productsSlice.actions;

export default productsSlice.reducer;
