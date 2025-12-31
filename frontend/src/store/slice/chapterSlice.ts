import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getChaptersByCourseApi,
  getChapterByIdApi,
  createChapterApi,
  updateChapterApi,
  deleteChapterApi,
} from "@/store/api/chapter.api";

interface ChapterState {
  chapters: ChapterType[];
  currentChapter: ChapterType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ChapterState = {
  chapters: [],
  currentChapter: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Lấy tất cả chapter của course
export const fetchChaptersByCourse = createAsyncThunk(
  "chapters/fetchByCourse",
  async (courseId: number) => {
    const response = await getChaptersByCourseApi(courseId);
    return response.data;
  }
);

// 🧩 Lấy chi tiết 1 chapter
export const fetchChapterById = createAsyncThunk(
  "chapters/fetchById",
  async ({ courseId, id }: { courseId: number; id: number }) => {
    const response = await getChapterByIdApi(courseId, id);
    return response.data;
  }
);

// 🧩 Tạo chapter mới
export const createChapter = createAsyncThunk(
  "chapters/create",
  async ({ courseId, payload }: { courseId: number; payload: any }) => {
    const response = await createChapterApi(courseId, payload);
    return response;
  }
);

// 🧩 Cập nhật chapter
export const updateChapter = createAsyncThunk(
  "chapters/update",
  async ({
    courseId,
    id,
    payload,
  }: {
    courseId: number;
    id: number;
    payload: any;
  }) => {
    const response = await updateChapterApi(courseId, id, payload);
    return response;
  }
);

// 🧩 Xóa chapter
export const deleteChapter = createAsyncThunk(
  "chapters/delete",
  async ({ courseId, id }: { courseId: number; id: number }) => {
    const response = await deleteChapterApi(courseId, id);
    return { id, response };
  }
);

// 🧱 Slice
const chapterSlice = createSlice({
  name: "chapters",
  initialState,
  reducers: {
    clearChapterMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📘 Fetch all
      .addCase(fetchChaptersByCourse.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchChaptersByCourse.fulfilled,
        (state, action: PayloadAction<ChapterType[]>) => {
          state.loading = false;
          state.chapters = action.payload;
        }
      )
      .addCase(fetchChaptersByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tải chapter";
      })

      // 📘 Fetch one
      .addCase(fetchChapterById.fulfilled, (state, action) => {
        state.currentChapter = action.payload;
      })

      // 📘 Create
      .addCase(createChapter.fulfilled, (state, action) => {
        state.chapters.push(action.payload);
        state.successMessage = "Tạo chương thành công!";
      })

      // 📘 Update
      .addCase(updateChapter.fulfilled, (state, action) => {
        const index = state.chapters.findIndex(
          (c) => c.id === action.payload.id
        );
        if (index !== -1) state.chapters[index] = action.payload;
        state.successMessage = "Cập nhật chương thành công!";
      })

      // 📘 Delete
      .addCase(deleteChapter.fulfilled, (state, action) => {
        state.chapters = state.chapters.filter(
          (c) => c.id !== action.payload.id
        );
        state.successMessage = "Xóa chương thành công!";
      });
  },
});

export const { clearChapterMessages } = chapterSlice.actions;
export default chapterSlice.reducer;
