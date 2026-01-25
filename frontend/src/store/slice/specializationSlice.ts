import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllSpecializationsApi,
  getSpecializationByIdApi,
  createSpecializationApi,
  updateSpecializationApi,
  deleteSpecializationApi,
  getSpecializationsByInstructorIdApi,
} from "@/store/api/specialization.api";

// 🧱 State
interface SpecializationState {
  specializations: SpecializationType[];
  current: SpecializationType | null;
  instructorSpecializaions: SpecializationType[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// 🌱 Initial State
const initialState: SpecializationState = {
  specializations: [],
  current: null,
  instructorSpecializaions: [],
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Async Actions

// 🧾 Lấy tất cả chuyên ngành
export const fetchAllSpecializations = createAsyncThunk(
  "specialization/fetchAll",
  async () => {
    const response = await getAllSpecializationsApi();
    return response.data;
  }
);

// 🔍 Lấy 1 chuyên ngành theo ID
export const fetchSpecializationById = createAsyncThunk(
  "specialization/fetchById",
  async (id: number) => {
    const response = await getSpecializationByIdApi(id);
    return response.data;
  }
);

// ➕ Tạo chuyên ngành mới
export const createSpecialization = createAsyncThunk(
  "specialization/create",
  async (payload: { name: string; desc: string }) => {
    const response = await createSpecializationApi(payload);
    return response.data;
  }
);

// ✏️ Cập nhật chuyên ngành
export const updateSpecialization = createAsyncThunk(
  "specialization/update",
  async (payload: {
    id: number;
    data: { name?: string; description?: string };
  }) => {
    const response = await updateSpecializationApi(payload.id, payload.data);
    return response.data;
  }
);

// 🗑️ Xóa chuyên ngành
export const deleteSpecialization = createAsyncThunk(
  "specialization/delete",
  async (id: number) => {
    const response = await deleteSpecializationApi(id);
    return { id, message: response?.message ?? "Đã xóa chuyên ngành" };
  }
);

// 👨‍🏫 Lấy danh sách chuyên ngành theo giảng viên
export const fetchSpecializationsByInstructorId = createAsyncThunk(
  "specialization/fetchByInstructorId",
  async (instructorId: number) => {
    const response = await getSpecializationsByInstructorIdApi(instructorId);
    return response.data;
  }
);

// 🧩 Slice
const specializationSlice = createSlice({
  name: "specialization",
  initialState,
  reducers: {
    clearSpecializationState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchAllSpecializations.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllSpecializations.fulfilled,
        (state, action: PayloadAction<SpecializationType[]>) => {
          state.loading = false;
          state.specializations = action.payload;
        }
      )
      .addCase(fetchAllSpecializations.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Lỗi khi tải danh sách chuyên ngành";
      })

      // Fetch by ID
      .addCase(fetchSpecializationById.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSpecializationById.fulfilled,
        (state, action: PayloadAction<SpecializationType>) => {
          state.loading = false;
          state.current = action.payload;
        }
      )
      .addCase(fetchSpecializationById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Không thể tải chi tiết chuyên ngành";
      })

      // Create
      .addCase(createSpecialization.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        createSpecialization.fulfilled,
        (state, action: PayloadAction<SpecializationType>) => {
          state.loading = false;
          state.specializations.push(action.payload);
          state.successMessage = "Tạo chuyên ngành thành công";
        }
      )
      .addCase(createSpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tạo chuyên ngành";
      })

      // Update
      .addCase(updateSpecialization.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        updateSpecialization.fulfilled,
        (state, action: PayloadAction<SpecializationType>) => {
          state.loading = false;
          state.successMessage = "Cập nhật chuyên ngành thành công";
          const index = state.specializations.findIndex(
            (s) => s.id === action.payload.id
          );
          if (index !== -1) state.specializations[index] = action.payload;
        }
      )
      .addCase(updateSpecialization.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi cập nhật chuyên ngành";
      })

      // Delete
      .addCase(deleteSpecialization.fulfilled, (state, action) => {
        state.specializations = state.specializations.filter(
          (s) => s.id !== action.payload.id
        );
        state.successMessage = action.payload.message;
      })
      .addCase(deleteSpecialization.rejected, (state, action) => {
        state.error = action.error.message ?? "Lỗi khi xóa chuyên ngành";
      })

      // 👨‍🏫 Fetch by instructor
      .addCase(fetchSpecializationsByInstructorId.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchSpecializationsByInstructorId.fulfilled,
        (state, action: PayloadAction<SpecializationType[]>) => {
          state.loading = false;
          state.instructorSpecializaions = action.payload;
        }
      )
      .addCase(fetchSpecializationsByInstructorId.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Không thể tải danh sách chuyên ngành của giảng viên";
      });
  },
});

export const { clearSpecializationState } = specializationSlice.actions;
export default specializationSlice.reducer;
