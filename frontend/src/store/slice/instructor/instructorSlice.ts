import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  applyInstructorApi,
  getAllInstructorApplicationsApi,
  getInstructorApplicationByUserIdApi,
  approveInstructorApi,
  rejectInstructorApi,
  ApplyInstructorPayload,
} from "@/store/api/instructor/instructor.api";

// 🧱 State
interface InstructorState {
  applications: InstructorApplicationType[];
  currentApplication: InstructorApplicationType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: InstructorState = {
  applications: [],
  currentApplication: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 📨 Gửi đơn đăng ký giảng viên
export const applyInstructor = createAsyncThunk(
  "instructor/applyInstructor",
  async (data: { userId: number; payload: ApplyInstructorPayload }) => {
    const response = await applyInstructorApi(data.userId, data.payload);
    return response;
  }
);

// 🧾 Lấy danh sách applications (admin)
export const fetchAllApplications = createAsyncThunk(
  "instructor/fetchAllApplications",
  async () => {
    const response = await getAllInstructorApplicationsApi();
    return response;
  }
);

// 🔍 Lấy chi tiết đơn theo User ID
export const fetchApplicationByUserId = createAsyncThunk(
  "instructor/fetchApplicationById",
  async (id: number) => {
    await getInstructorApplicationByUserIdApi(id);
    return;
  }
);

// ✅ Duyệt đơn giảng viên (Admin)
export const approveInstructor = createAsyncThunk(
  "instructor/approveInstructor",
  async ({
    userId,
    applicationId,
  }: {
    userId: number;
    applicationId: number;
  }) => {
    await approveInstructorApi(userId, applicationId);
    return;
  }
);

// ❌ Từ chối đơn giảng viên (Admin)
export const rejectInstructor = createAsyncThunk(
  "instructor/rejectInstructor",
  async ({
    userId,
    applicationId,
  }: {
    userId: number;
    applicationId: number;
  }) => {
    const response = await rejectInstructorApi(userId, applicationId);
    return response;
  }
);

// 🧩 Slice
const instructorSlice = createSlice({
  name: "instructor",
  initialState,
  reducers: {
    clearInstructorState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Apply instructor
      .addCase(applyInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(applyInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Gửi đơn thành công!";
      })
      .addCase(applyInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi gửi đơn giảng viên";
      })

      // Fetch all applications
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading = false;
        state.applications = action.payload;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi lấy danh sách đơn";
      })

      // Fetch single application
      .addCase(fetchApplicationByUserId.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchApplicationByUserId.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(fetchApplicationByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể lấy chi tiết đơn";
      })

      // Approve
      .addCase(approveInstructor.fulfilled, (state, action) => {})
      .addCase(approveInstructor.rejected, (state, action) => {
        state.error = action.error.message ?? "Lỗi khi duyệt đơn";
      })

      // Reject
      .addCase(rejectInstructor.fulfilled, (state, action) => {
        state.successMessage = action.payload.message ?? "Đã từ chối đơn";
      })
      .addCase(rejectInstructor.rejected, (state, action) => {
        state.error = action.error.message ?? "Lỗi khi từ chối đơn";
      });
  },
});

export const { clearInstructorState } = instructorSlice.actions;
export default instructorSlice.reducer;
