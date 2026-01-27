import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createRatingApi,
  getRatingsApi,
  updateRatingApi,
  deleteRatingApi,
} from "@/store/api/course-rating.api";

interface CourseRatingState {
  ratings: any[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CourseRatingState = {
  ratings: [],
  pagination: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Fetch ratings (with filter & pagination)
export const fetchCourseRatings = createAsyncThunk(
  "courseRating/fetchRatings",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await getRatingsApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tải danh sách đánh giá"
      );
    }
  }
);

// ➕ Create rating
export const createRating = createAsyncThunk(
  "courseRating/create",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await createRatingApi(data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi tạo đánh giá"
      );
    }
  }
);

// ✏️ Update rating
export const updateRating = createAsyncThunk(
  "courseRating/update",
  async ({ id, data }: { id: number; data: any }, { rejectWithValue }) => {
    try {
      const response = await updateRatingApi(id, data);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi cập nhật đánh giá"
      );
    }
  }
);

// 🗑️ Delete rating
export const deleteRating = createAsyncThunk(
  "courseRating/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteRatingApi(id);
      return { id, ...response };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Lỗi khi xóa đánh giá"
      );
    }
  }
);

const courseRatingSlice = createSlice({
  name: "courseRating",
  initialState,
  reducers: {
    clearRatingState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    clearRatings: (state) => {
      state.ratings = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch ratings
      .addCase(fetchCourseRatings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseRatings.fulfilled, (state, action) => {
        state.loading = false;
        state.ratings = action.payload.data?.data || [];
        state.pagination = action.payload.data?.pagination || null;
      })
      .addCase(fetchCourseRatings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Create rating
      .addCase(createRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRating.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Đánh giá thành công";
      })
      .addCase(createRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update rating
      .addCase(updateRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateRating.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Cập nhật đánh giá thành công";
        const updatedRating = action.payload.data;
        state.ratings = state.ratings.map((r) =>
          r.id === updatedRating.id ? updatedRating : r
        );
      })
      .addCase(updateRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete rating
      .addCase(deleteRating.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteRating.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Xóa đánh giá thành công";
        state.ratings = state.ratings.filter((r) => r.id !== action.payload.id);
      })
      .addCase(deleteRating.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearRatingState, clearRatings } = courseRatingSlice.actions;
export default courseRatingSlice.reducer;
