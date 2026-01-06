import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getOverviewApi,
  getDailyStatsApi,
  getCourseAnalyticsApi,
  getEarningsHistoryApi,
  getEnrollmentStatsApi,
} from "../api/instructorAnalytics.api";

interface EnrollmentStats {
  totalStudents: number;
  totalEnrollments: number;
  averageProgress: number;
  completedEnrollmentsCount: number;
}

interface InstructorEarning {
  id: number;
  courseId: number;
  amount: number;
  type: string;
  createdAt: string;
  transaction: {
    id: number;
    note: string | null;
  } | null;
}

interface EarningsResponse {
  data: InstructorEarning[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  };
}

interface InstructorAnalyticsState {
  overview: {
    totalRevenue: number;
    totalEnrollments: number;
    totalViews: number;
    totalCourses: number;
    totalEarnings: number;
  } | null;
  dailyStats: any[];
  courseAnalytics: any[];
  earnings: EarningsResponse | null;
  enrollmentStats: EnrollmentStats | null;
  loading: boolean;
  error: string | null;
}

const initialState: InstructorAnalyticsState = {
  overview: null,
  dailyStats: [],
  courseAnalytics: [],
  earnings: null,
  enrollmentStats: null,
  loading: false,
  error: null,
};

// Thunks
export const fetchOverview = createAsyncThunk(
  "instructorAnalytics/fetchOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getOverviewApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch overview"
      );
    }
  }
);

export const fetchDailyStats = createAsyncThunk(
  "instructorAnalytics/fetchDailyStats",
  async (
    params: { startDate?: string; endDate?: string } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await getDailyStatsApi(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch daily stats"
      );
    }
  }
);

export const fetchCourseAnalytics = createAsyncThunk(
  "instructorAnalytics/fetchCourseAnalytics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getCourseAnalyticsApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch course analytics"
      );
    }
  }
);

export const fetchEarningsHistory = createAsyncThunk(
  "instructorAnalytics/fetchEarningsHistory",
  async (
    params: { page?: number; limit?: number } | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await getEarningsHistoryApi(params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch earnings history"
      );
    }
  }
);

export const fetchEnrollmentStats = createAsyncThunk(
  "instructorAnalytics/fetchEnrollmentStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getEnrollmentStatsApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch enrollment stats"
      );
    }
  }
);

const instructorAnalyticsSlice = createSlice({
  name: "instructorAnalytics",
  initialState,
  reducers: {
    clearAnalyticsState: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Overview
      .addCase(fetchOverview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOverview.fulfilled, (state, action) => {
        state.loading = false;
        state.overview = action.payload;
      })
      .addCase(fetchOverview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Daily Stats
      .addCase(fetchDailyStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyStats.fulfilled, (state, action) => {
        state.loading = false;
        state.dailyStats = action.payload;
      })
      .addCase(fetchDailyStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Course Analytics
      .addCase(fetchCourseAnalytics.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseAnalytics.fulfilled, (state, action) => {
        state.loading = false;
        state.courseAnalytics = action.payload;
      })
      .addCase(fetchCourseAnalytics.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Earnings History
      .addCase(fetchEarningsHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEarningsHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.earnings = action.payload;
      })
      .addCase(fetchEarningsHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Enrollment Stats
      .addCase(fetchEnrollmentStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentStats.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollmentStats = action.payload;
      })
      .addCase(fetchEnrollmentStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAnalyticsState } = instructorAnalyticsSlice.actions;
export default instructorAnalyticsSlice.reducer;
