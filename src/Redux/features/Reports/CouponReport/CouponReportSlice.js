import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, COUPON_REPORT_LIST } from "../../../../Constants/Config";

const initialState = {
  loading: false,
  CouponReportData: [],
  status: false,
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type
export const fetchCouponReportData = createAsyncThunk(
  "CouponReportList/fetchCouponReportData.",
  async (data, { rejectWithValue }) => {
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(
        BASE_URL + COUPON_REPORT_LIST,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(response)
      if (response.data.coupon_report_data.length > 0) {
        // console.log(response.data
        //     )
        const arr = response.data.coupon_report_data;
        const status = response.data.status;
        return {arr,status};
      }else if (response.data.coupon_report_data.length === 0){
        const arr = [];
        const status = false;
        return {arr,status};
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

const CouponReportSlice = createSlice({
  name: "CouponReportList",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchCouponReportData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchCouponReportData.fulfilled, (state, action) => {
      state.loading = false;
      state.CouponReportData = action.payload.arr;
      state.status= action.payload.status;
      state.error = "";
    });
    builder.addCase(fetchCouponReportData.rejected, (state, action) => {
      state.loading = false;
      state.CouponReportData = {};
      state.error = action.error.message;
    });
  },
});

export default CouponReportSlice.reducer;
