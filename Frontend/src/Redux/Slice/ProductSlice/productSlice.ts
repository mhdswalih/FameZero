import { createSlice, PayloadAction } from '@reduxjs/toolkit'

interface IProductDetails {
  category: string;
  customCategory: string;
  productName: string;
  price: string;
  quantity: string;
}

interface ProductState {
  products: IProductDetails[];
}

const initialState: ProductState = {
  products: []
};

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    addProducts: (state, action: PayloadAction<IProductDetails>) => {
      // Check if the product already exists (by productName or custom logic)
      const exists = state.products.some(
        (p) => p.productName === action.payload.productName
      );
      if (!exists) {
        state.products.push(action.payload);
      }
    },
    removeProduct: (state, action: PayloadAction<string>) => {
      // Remove product by name
      state.products = state.products.filter(
        (p) => p.productName !== action.payload
      );
    },
    clearProducts: (state) => {
      state.products = [];
    }
  }
});

export const { addProducts, removeProduct, clearProducts } = productSlice.actions;
export default productSlice.reducer;
