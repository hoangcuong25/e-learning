import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllCoursesApi,
  getCourseByIdApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getCoursesByInstructorApi,
  getCourseDetailApi,
  getCourseDetailWithAuthApi,
  getPopularCoursesApi,
} from "@/store/api/course/courses.api";

// 🧱 State
interface CourseState {
  courses: CourseType[];
  currentCourse: CourseType | null;
  instructorCourses: CourseType[];
  popularCourses: CourseType[];
  pagination: {
    total: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
  } | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  instructorCourses: [],
  popularCourses: [],
  pagination: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả khóa học
export const fetchAllCourses = createAsyncThunk(
  "course/fetchAll",
  async (params?: PaginationParams) => {
    const response = await getAllCoursesApi(params);
    return response.data;
  }
);

// 🔍 Lấy chi tiết khóa học (dành cho người dùng)
export const fetchCourseDetail = createAsyncThunk(
  "course/fetchById",
  async (id: number) => {
    const response = await getCourseDetailApi(id);
    return response.data;
  }
);

// 🔍 Lấy chi tiết khóa học theo ID (Instructor)
export const fetchCourseById = createAsyncThunk(
  "course/fetchByIdInstructor",
  async (id: number) => {
    const response = await getCourseByIdApi(id);
    return response.data.data;
  }
);

// 🧩 Lấy tất cả khóa học của instructor
export const fetchCoursesByInstructor = createAsyncThunk(
  "course/fetchByInstructor",
  async () => {
    const response = await getCoursesByInstructorApi();
    return response.data;
  }
);

// 🔍 Lấy chi tiết khóa học (bao gồm enrollment - cần đăng nhập)
export const fetchCourseDetailWithAuth = createAsyncThunk(
  "course/fetchDetailWithAuth",
  async (id: number) => {
    const response = await getCourseDetailWithAuthApi(id);
    return response.data;
  }
);

// ➕ Tạo khóa học mới
export const createCourse = createAsyncThunk(
  "courses/createCourse",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await createCourseApi(formData);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tạo khóa học");
    }
  }
);

// ✏️ Cập nhật khóa học
export const updateCourse = createAsyncThunk(
  "course/update",
  async (data: { id: number; payload: any }) => {
    const response = await updateCourseApi(data.id, data.payload);
    return response;
  }
);

// 🗑️ Xóa khóa học
export const deleteCourse = createAsyncThunk(
  "course/delete",
  async (id: number) => {
    const response = await deleteCourseApi(id);
    return response;
  }
);

export const fetchPopularCourses = createAsyncThunk(
  "course/fetchPopular",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getPopularCoursesApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải danh sách khóa học phổ biến"
      );
    }
  }
);

// 🧩 Slice
const coursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    clearCourseState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch all
      .addCase(fetchAllCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.courses = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tải danh sách khóa học";
      })

      // 🔍 Fetch one (user)
      .addCase(fetchCourseDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể tải chi tiết khóa học";
      })

      // 🔍 Fetch one (instructor)
      .addCase(fetchCourseById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể tải chi tiết khóa học";
      })

      // 🔍 Fetch detail with auth
      .addCase(fetchCourseDetailWithAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseDetailWithAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseDetailWithAuth.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ??
          "Không thể tải chi tiết khóa học (yêu cầu đăng nhập)";
      })

      // 🧩 Fetch courses by instructor
      .addCase(fetchCoursesByInstructor.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoursesByInstructor.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorCourses = action.payload || [];
      })
      .addCase(fetchCoursesByInstructor.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.error.message ?? "Lỗi khi tải khóa học của instructor";
      })

      // ➕ Create
      .addCase(createCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Tạo khóa học thành công";
        state.courses.push(action.payload.data);
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tạo khóa học";
      })

      // ✏️ Update
      .addCase(updateCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Cập nhật thành công";
        state.courses = state.courses.map((c) =>
          c.id === action.payload.data.id ? action.payload.data : c
        );
      })
      .addCase(updateCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi cập nhật khóa học";
      })

      // 🗑️ Delete
      .addCase(deleteCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Đã xóa khóa học";
        const deletedId = action.meta.arg; // id được truyền vào thunk
        state.courses = state.courses.filter((c) => c.id !== deletedId);
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi xóa khóa học";
      })

      .addCase(fetchPopularCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPopularCourses.fulfilled, (state, action) => {
        state.loading = false;
        state.popularCourses = action.payload || [];
      })
      .addCase(fetchPopularCourses.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ??
          action.error.message ??
          "Lỗi khi tải khóa học phổ biến";
      });
  },
});

export const { clearCourseState } = coursesSlice.actions;
export default coursesSlice.reducer;
