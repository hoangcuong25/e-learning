// 📁 src/store/slices/quizSlice.ts
import {
  createQuizApi,
  deleteQuizApi,
  getAllQuizzesApi,
  getInstructorQuizzesApi,
  getQuizByIdApi,
  updateQuizApi,
} from "@/store/api/course/quiz.api";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

interface QuizState {
  quizzes: QuizType[];
  instructorQuizzes: QuizType[];
  currentQuiz: QuizType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: QuizState = {
  quizzes: [],
  instructorQuizzes: [],
  currentQuiz: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả quiz
export const fetchAllQuizzes = createAsyncThunk("quiz/fetchAll", async () => {
  const response = await getAllQuizzesApi();
  return response.data;
});

// 🔍 Lấy chi tiết quiz theo ID
export const fetchQuizById = createAsyncThunk(
  "quiz/fetchById",
  async (id: number) => {
    const response = await getQuizByIdApi(id);
    return response.data.data;
  }
);

// ➕ Tạo quiz mới (Instructor)
export const createQuiz = createAsyncThunk(
  "quiz/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createQuizApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tạo quiz");
    }
  }
);

// ✏️ Cập nhật quiz
export const updateQuiz = createAsyncThunk(
  "quiz/update",
  async (data: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await updateQuizApi(data.id, data.payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi cập nhật quiz");
    }
  }
);

// 🗑️ Xóa quiz
export const deleteQuiz = createAsyncThunk(
  "quiz/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteQuizApi(id);
      return { response, id };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi xóa quiz");
    }
  }
);

// 🎓 Lấy quiz của giảng viên hiện tại
export const fetchInstructorQuizzes = createAsyncThunk(
  "quiz/fetchInstructorQuizzes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getInstructorQuizzesApi();
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi tải quiz giảng viên"
      );
    }
  }
);

// 🧩 Slice
const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    clearQuizState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch all
      .addCase(fetchAllQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload.data || [];
      })
      .addCase(fetchAllQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tải danh sách quiz";
      })

      // 🔍 Fetch one
      .addCase(fetchQuizById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentQuiz = action.payload;
      })
      .addCase(fetchQuizById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể tải chi tiết quiz";
      })

      // ➕ Create
      .addCase(createQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Tạo quiz thành công";
        state.quizzes.push(action.payload.data);
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi tạo quiz";
      })

      // ✏️ Update
      .addCase(updateQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Cập nhật quiz thành công";
        state.quizzes = state.quizzes.map((q) =>
          q.id === action.payload.data.id ? action.payload.data : q
        );
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi cập nhật quiz";
      })

      // 🗑️ Delete
      .addCase(deleteQuiz.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteQuiz.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.response.message ?? "Xóa quiz thành công";
        state.quizzes = state.quizzes.filter((q) => q.id !== action.payload.id);
      })
      .addCase(deleteQuiz.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? "Lỗi khi xóa quiz";
      })

      // 🎓 Fetch instructor quizzes
      .addCase(fetchInstructorQuizzes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.instructorQuizzes = action.payload.data || [];
      })
      .addCase(fetchInstructorQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ?? "Không thể tải quiz của giảng viên";
      });
  },
});

export const { clearQuizState } = quizSlice.actions;
export default quizSlice.reducer;
