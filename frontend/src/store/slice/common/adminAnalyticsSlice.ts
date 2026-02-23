import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAdminOverviewApi } from "@/store/api/common/adminAnalytics.api";

interface AdminOverview {
  totalUsers: number;
  totalInstructors: number;
  totalCourses: number;
  totalSpecializations: number;
}

interface AdminAnalyticsState {
  overview: AdminOverview | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminAnalyticsState = {
  overview: null,
  loading: false,
  error: null,
};

export const fetchAdminOverview = createAsyncThunk(
  "adminAnalytics/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getAdminOverviewApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải thống kê admin"
      );
    }
  }
);

const adminAnalyticsSlice = createSlice({
  name: "adminAnalytics",
  initialState,
  reducers: {
    clearAdminAnalyticsState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📊 Fetch overview
      .addCase(fetchAdminOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchAdminOverview.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Không thể tải thống kê admin";
      });
  },
});

export const { clearAdminAnalyticsState } = adminAnalyticsSlice.actions;
export default adminAnalyticsSlice.reducer;
