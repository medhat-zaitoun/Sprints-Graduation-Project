import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

// Initial state
const initialState = {
  approvalURL: null, // For PayPal-like redirect (Stripe handles with sessionID)
  isLoading: false,
  orderId: null,
  orderList: [],
  orderDetails: null,
  stripeSessionId: null, // To handle Stripe's session ID
};

// Async action to create a new order and Stripe session
export const createNewOrder = createAsyncThunk(
  "/order/createNewOrder",
  async (orderData) => {
    const response = await axios.post(
      `https://art-market-blue.vercel.app/api/shop/order/create`,
      orderData
    );
    return response.data; // Backend will return sessionId and orderId
  }
);

// Capture Stripe payment (used after payment is confirmed on the frontend)
export const capturePayment = createAsyncThunk(
  "/order/capturePayment",
  async ({ paymentId, orderId }) => {
    const response = await axios.post(
      `https://art-market-blue.vercel.app/api/shop/order/capture`,
      { paymentId, orderId }
    );
    return response.data;
  }
);

// Fetch all orders for a user
export const getAllOrdersByUserId = createAsyncThunk(
  "/order/getAllOrdersByUserId",
  async (userId) => {
    const response = await axios.get(
      `https://art-market-blue.vercel.app/api/shop/order/list/${userId}`
    );
    return response.data;
  }
);

// Fetch specific order details by ID
export const getOrderDetails = createAsyncThunk(
  "/order/getOrderDetails",
  async (id) => {
    const response = await axios.get(
      `https://art-market-blue.vercel.app/api/shop/order/details/${id}`
    );
    return response.data;
  }
);
// Redux slice
const shoppingOrderSlice = createSlice({
  name: "shoppingOrderSlice",
  initialState,
  reducers: {
    resetOrderDetails: (state) => {
      state.orderDetails = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createNewOrder.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createNewOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stripeSessionId = action.payload.id; // Stripe session ID
        state.orderId = action.payload.orderId; // Order ID returned by backend
        state.approvalURL=action.payload.url
      })
      .addCase(createNewOrder.rejected, (state) => {
        state.isLoading = false;
        state.stripeSessionId = null;
        state.orderId = null;
      })
      .addCase(capturePayment.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(capturePayment.fulfilled, (state) => {
        state.isLoading = false;
        // Payment confirmed, order status will be updated
      })
      .addCase(capturePayment.rejected, (state) => {
        state.isLoading = false;
      })
      .addCase(getAllOrdersByUserId.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllOrdersByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderList = action.payload.data;
      })
      .addCase(getAllOrdersByUserId.rejected, (state) => {
        state.isLoading = false;
        state.orderList = [];
      })
      .addCase(getOrderDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrderDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orderDetails = action.payload.data;
      })
      .addCase(getOrderDetails.rejected, (state) => {
        state.isLoading = false;
        state.orderDetails = null;
      });
  },
});

// Export actions and reducer
export const { resetOrderDetails } = shoppingOrderSlice.actions;
export default shoppingOrderSlice.reducer;
