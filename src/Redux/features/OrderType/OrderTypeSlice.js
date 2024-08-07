import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, LIST_ALL_ORDER_TYPE } from "../../../Constants/Config";
import { useAuthDetails } from "../../../Common/cookiesHelper";

const initialState = {
  loading: false,
  orderTypeData: [],
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type
export const fetchOrderTypeData = createAsyncThunk(
  "orderType/fetchOrderTypeData.",
  async (data, { rejectWithValue }) => {
    const { userTypeData } = useAuthDetails();
    try {
      const { token, ...otherUserData } = userTypeData;
      const response = await axios.post(
        BASE_URL + LIST_ALL_ORDER_TYPE,
        { ...data, ...otherUserData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.data.success === true) {
        console.log("SDFSD", response.data);
        return response.data.data;
      } else if (
        response.data.success === false &&
        response.data.message === "No data found for the specified criteria"
      ) {
        console.log("SDFSD", response.data);
        return response.data;
      }
    } catch (error) {
      // throw new Error(error.response.data.message);
      const customError = {
        message: error.message,
        status: error.response ? error.response.status : "Network Error",
        data: error.response ? error.response.data : null,
      };
      return rejectWithValue(customError);
    }
  }
);
// Generate pening , fulfilled and rejected action type

const OrderTypeSlice = createSlice({
  name: "orderType",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchOrderTypeData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchOrderTypeData.fulfilled, (state, action) => {
      state.loading = false;
      state.orderTypeData = action.payload;
      state.error = "";
    });
    builder.addCase(fetchOrderTypeData.rejected, (state, action) => {
      state.loading = false;
      state.orderTypeData = {};
      state.error = action.error.message;
    });
  },
});

export default OrderTypeSlice.reducer;
