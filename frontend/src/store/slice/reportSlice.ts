import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createReportApi,
  getAllReportsApi,
  getReportDetailApi,
  deleteReportApi,
  CreateReportPayload,
} from "@/store/api/report.api";

interface ReportState {
  reports: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  currentReport: any | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ReportState = {
  reports: [],
  pagination: null,
  currentReport: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 1. Create Report
export const createReport = createAsyncThunk(
  "report/create",
  async (payload: CreateReportPayload, { rejectWithValue }) => {
    try {
      const response = await createReportApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi gửi báo cáo");
    }
  }
);

// 2. Fetch All Reports (Admin)
export const fetchAllReports = createAsyncThunk(
  "report/fetchAll",
  async (
    params:
      | { page?: number; limit?: number; type?: string; search?: string }
      | undefined,
    { rejectWithValue }
  ) => {
    try {
      const response = await getAllReportsApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách báo cáo"
      );
    }
  }
);

// 3. Fetch Report Detail (Admin)
export const fetchReportDetail = createAsyncThunk(
  "report/fetchDetail",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await getReportDetailApi(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải chi tiết báo cáo"
      );
    }
  }
);

// 4. Delete Report (Admin)
export const deleteReport = createAsyncThunk(
  "report/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteReportApi(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi xóa báo cáo");
    }
  }
);

const reportSlice = createSlice({
  name: "report",
  initialState,
  reducers: {
    clearReportState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.currentReport = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReport.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Gửi báo cáo thành công";
      })
      .addCase(createReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message ??
          action.error.message ??
          "Lỗi khi gửi báo cáo";
      })

      // Fetch All
      .addCase(fetchAllReports.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllReports.fulfilled, (state, action) => {
        state.loading = false;
        state.reports = action.payload.data || [];
        state.pagination = action.payload.meta || null;
      })
      .addCase(fetchAllReports.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message ??
          action.error.message ??
          "Lỗi khi tải danh sách báo cáo";
      })

      // Fetch Detail
      .addCase(fetchReportDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReportDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentReport = action.payload.data || action.payload;
      })
      .addCase(fetchReportDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message ??
          action.error.message ??
          "Lỗi khi tải chi tiết báo cáo";
      })

      // Delete
      .addCase(deleteReport.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReport.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Xóa báo cáo thành công";
        // Remove from list
        const deletedId = action.meta.arg;
        state.reports = state.reports.filter((r) => r.id !== deletedId);
      })
      .addCase(deleteReport.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as any)?.message ??
          action.error.message ??
          "Lỗi khi xóa báo cáo";
      });
  },
});

export const { clearReportState } = reportSlice.actions;
export default reportSlice.reducer;
