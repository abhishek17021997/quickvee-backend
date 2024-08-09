import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { BASE_URL, PROFIT_SUMMARY_REPORT } from "../../../../Constants/Config";

const initialState = {
  loading: false,
  ProfitSummaryReportData: [],
  successMessage: "",
  error: "",
};

// Generate pening , fulfilled and rejected action type
export const fetchProfitSummaryReportData = createAsyncThunk(
  "ProfitSummaryReportList/fetchProfitSummaryReportData.",
  async (data, { rejectWithValue }) => {
    try {
      const { token, ...dataNew } = data;
      const response = await axios.post(
        BASE_URL + PROFIT_SUMMARY_REPORT,
        dataNew,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(response)
      if (response.data.status === true) {
        // console.log(response.data
        //     )
        return response.data.profit_data;
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

const ProfitSummaryReportSlice = createSlice({
  name: "ProfitSummaryReportList",
  initialState,
  extraReducers: (builder) => {
    builder.addCase(fetchProfitSummaryReportData.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfitSummaryReportData.fulfilled, (state, action) => {
      state.loading = false;
      state.ProfitSummaryReportData = action.payload;
      state.error = "";
    });
    builder.addCase(fetchProfitSummaryReportData.rejected, (state, action) => {
      state.loading = false;
      state.ProfitSummaryReportData = {};
      state.error = action.error.message;
    });
  },
});

export default ProfitSummaryReportSlice.reducer;