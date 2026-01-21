import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getLessonsByCourseApi,
  getLessonByIdApi,
  createLessonApi,
  updateLessonApi,
  deleteLessonApi,
} from "@/api/lesson.api";

interface LessonState {
  lessons: LessonType[];
  currentLesson: LessonType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: LessonState = {
  lessons: [],
  currentLesson: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Thunk: Lấy tất cả bài học của một khóa học
export const fetchLessonsByCourse = createAsyncThunk(
  "lessons/fetchByCourse",
  async (courseId: number) => {
    const response = await getLessonsByCourseApi(courseId);
    return response.data;
  }
);

// 🧩 Thunk: Lấy chi tiết 1 bài học
export const fetchLessonById = createAsyncThunk(
  "lessons/fetchById",
  async (id: number) => {
    const response = await getLessonByIdApi(id);
    return response.data;
  }
);

// 🧩 Thunk: Tạo mới bài học
export const createLesson = createAsyncThunk(
  "lessons/create",
  async (payload: FormData) => {
    const response = await createLessonApi(payload);
    return response;
  }
);

// 🧩 Thunk: Cập nhật bài học
export const updateLesson = createAsyncThunk(
  "lessons/update",
  async (data: { id: number; payload: any }) => {
    const response = await updateLessonApi(data.id, data.payload);
    return response;
  }
);

// 🧩 Thunk: Xóa bài học
export const deleteLesson = createAsyncThunk(
  "lessons/delete",
  async (id: number) => {
    const response = await deleteLessonApi(id);
    return { id, response };
  }
);

// 🧱 Slice
const lessonsSlice = createSlice({
  name: "lessons",
  initialState,
  reducers: {
    clearLessonMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📘 Fetch by course
      .addCase(fetchLessonsByCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchLessonsByCourse.fulfilled,
        (state, action: PayloadAction<LessonType[]>) => {
          state.loading = false;
          state.lessons = action.payload;
        }
      )
      .addCase(fetchLessonsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tải bài học";
      })

      // 📘 Create
      .addCase(createLesson.fulfilled, (state, action) => {
        state.lessons.push(action.payload);
        state.successMessage = "Tạo bài học thành công!";
      })

      // 📘 Update
      .addCase(updateLesson.fulfilled, (state, action) => {
        const index = state.lessons.findIndex(
          (l) => l.id === action.payload.id
        );
        if (index !== -1) state.lessons[index] = action.payload;
        state.successMessage = "Cập nhật bài học thành công!";
      })

      // 📘 Delete
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.lessons = state.lessons.filter((l) => l.id !== action.payload.id);
        state.successMessage = "Xóa bài học thành công!";
      });
  },
});

export const { clearLessonMessages } = lessonsSlice.actions;
export default lessonsSlice.reducer;
