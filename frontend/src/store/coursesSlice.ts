import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllCoursesApi,
  getCourseByIdApi,
  createCourseApi,
  updateCourseApi,
  deleteCourseApi,
  getCoursesByInstructorApi,
} from "@/api/courses.api";

// 🧱 State
interface CourseState {
  courses: CourseType[];
  currentCourse: CourseType | null;
  instructorCourses: CourseType[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: CourseState = {
  courses: [],
  currentCourse: null,
  instructorCourses: [],
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả khóa học
export const fetchAllCourses = createAsyncThunk("course/fetchAll", async () => {
  const response = await getAllCoursesApi();
  return response.data;
});

// 🔍 Lấy chi tiết khóa học theo ID
export const fetchCourseById = createAsyncThunk(
  "course/fetchById",
  async (id: number) => {
    const response = await getCourseByIdApi(id);
    return response.data;
  }
);

// 🧩 Lấy tất cả khóa học của instructor
export const fetchCoursesByInstructor = createAsyncThunk(
  "course/fetchByInstructor",
  async () => {
    const response = await getCoursesByInstructorApi();

    console.log(response.data);
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
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tải danh sách khóa học";
      })

      // 🔍 Fetch one
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
      });
  },
});

export const { clearCourseState } = coursesSlice.actions;
export default coursesSlice.reducer;
