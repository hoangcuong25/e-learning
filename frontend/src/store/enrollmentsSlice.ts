import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllEnrollmentsApi,
  getEnrollmentDetailApi,
  getMyEnrollmentsApi,
  createEnrollmentApi,
  cancelEnrollmentApi,
} from "@/api/enrollments.api";

// 🧱 Kiểu state
interface EnrollmentState {
  enrollments: EnrollmentType[];
  myEnrollments: EnrollmentType[];
  currentEnrollment: EnrollmentType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  myEnrollments: [],
  currentEnrollment: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả enrollment
export const fetchAllEnrollments = createAsyncThunk(
  "enrollment/fetchAll",
  async (params?: PaginationParams) => {
    const response = await getAllEnrollmentsApi(params);
    return response.data;
  }
);

// 🔍 Lấy chi tiết enrollment theo ID
export const fetchEnrollmentDetail = createAsyncThunk(
  "enrollment/fetchById",
  async (id: number) => {
    const response = await getEnrollmentDetailApi(id);
    return response.data;
  }
);

// 🧩 Lấy tất cả enrollment của user hiện tại
export const fetchMyEnrollments = createAsyncThunk(
  "enrollment/fetchMine",
  async () => {
    const response = await getMyEnrollmentsApi();
    return response.data;
  }
);

// ➕ Tạo enrollment (đăng ký khóa học)
export const createEnrollment = createAsyncThunk(
  "enrollment/create",
  async (
    payload: { courseId: number; couponCode?: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await createEnrollmentApi(
        payload.courseId,
        payload.couponCode
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi đăng ký khóa học!"
      );
    }
  }
);

// ❌ Hủy enrollment (rời khóa học)
export const cancelEnrollment = createAsyncThunk(
  "enrollment/cancel",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await cancelEnrollmentApi(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi hủy đăng ký");
    }
  }
);

// 🧩 Slice
const enrollmentsSlice = createSlice({
  name: "enrollments",
  initialState,
  reducers: {
    clearEnrollmentState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch all
      .addCase(fetchAllEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload || [];
      })
      .addCase(fetchAllEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Không thể tải danh sách enrollment";
      })

      // 🔍 Fetch detail
      .addCase(fetchEnrollmentDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchEnrollmentDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentEnrollment = action.payload;
      })
      .addCase(fetchEnrollmentDetail.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Không thể tải chi tiết enrollment";
      })

      // 🧩 Fetch my enrollments
      .addCase(fetchMyEnrollments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.myEnrollments = action.payload || [];
      })
      .addCase(fetchMyEnrollments.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Lỗi khi tải danh sách khóa học của bạn";
      })

      // ➕ Create
      .addCase(createEnrollment.pending, (state) => {
        state.loading = true;
      })
      .addCase(createEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Đăng ký thành công";
        state.myEnrollments.push(action.payload.data);
      })
      .addCase(createEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi khi đăng ký khóa học!";
      })

      // ❌ Cancel
      .addCase(cancelEnrollment.pending, (state) => {
        state.loading = true;
      })
      .addCase(cancelEnrollment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Hủy đăng ký thành công";
        const canceledId = action.meta.arg;
        state.myEnrollments = state.myEnrollments.filter(
          (e) => e.id !== canceledId
        );
      })
      .addCase(cancelEnrollment.rejected, (state, action) => {
        state.loading = false;
        state.error =
          typeof action.payload === "string"
            ? action.payload
            : "Lỗi khi hủy đăng ký";
      });
  },
});

export const { clearEnrollmentState } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;
