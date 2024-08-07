import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, SALES_REPORT_LIST } from "../../../../Constants/Config";
import { useAuthDetails } from "../../../../Common/cookiesHelper";
const initialState = {
  loading: false,
  SalesReportData: [],
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type
export const fetchSalesReportData = createAsyncThunk(
  "SalesReportList/fetchSalesReportData.",
  async (data, { rejectWithValue }) => {
    const { userTypeData } = useAuthDetails();
    try {
      const { token, ...otherUserData } = userTypeData;
      // console.log(BASE_URL + VENDORS_SALES_REPORT)
      const response = await axios.post(
        BASE_URL + SALES_REPORT_LIST,
        { ...data, ...otherUserData },
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response)
      if (response.data.status === true) {
        // console.log(response.data.sales_data
        //     )
        return response.data.result;
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

const SalesReportSlice = createSlice({
  name: "SalesReportList",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchSalesReportData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchSalesReportData.fulfilled, (state, action) => {
      state.loading = false;
      state.SalesReportData = action.payload;
      state.error = "";
    });
    builder.addCase(fetchSalesReportData.rejected, (state, action) => {
      state.loading = false;
      state.SalesReportData = {};
      state.error = action.error.message;
    });
  },
});

export default SalesReportSlice.reducer;
