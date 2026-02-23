import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAllQuestionsApi,
  getQuestionByIdApi,
  createQuestionApi,
  updateQuestionApi,
  deleteQuestionApi,
  saveQuestionApi,
} from "@/store/api/course/question.api";

interface QuestionState {
  questions: QuestionType[];
  currentQuestion: QuestionType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: QuestionState = {
  questions: [],
  currentQuestion: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Lấy tất cả câu hỏi
export const fetchAllQuestions = createAsyncThunk(
  "questions/fetchAll",
  async () => {
    const response = await getAllQuestionsApi();
    return response.data;
  }
);

// 🧩 Lấy chi tiết câu hỏi
export const fetchQuestionById = createAsyncThunk(
  "questions/fetchById",
  async (id: number) => {
    const response = await getQuestionByIdApi(id);
    return response.data;
  }
);

// 🧩 Tạo mới câu hỏi
export const createQuestion = createAsyncThunk(
  "questions/create",
  async (payload: any) => {
    const response = await createQuestionApi(payload);
    return response.data.data;
  }
);

// 🧩 Cập nhật câu hỏi
export const updateQuestion = createAsyncThunk(
  "questions/update",
  async (data: { id: number; payload: any }) => {
    const response = await updateQuestionApi(data.id, data.payload);
    return response;
  }
);

// 🧩 Xóa câu hỏi
export const deleteQuestion = createAsyncThunk(
  "questions/delete",
  async (id: number) => {
    const response = await deleteQuestionApi(id);
    return { id, response };
  }
);

// 🧩 Lưu câu hỏi (tạo mới options)
export const saveQuestion = createAsyncThunk(
  "questions/saveQuestion",
  async (data: { id: number; payload: any }) => {
    const response = await saveQuestionApi(data.id, data.payload);
    return response;
  }
);

// 🧱 Slice
const questionsSlice = createSlice({
  name: "questions",
  initialState,
  reducers: {
    clearQuestionMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📘 Fetch all
      .addCase(fetchAllQuestions.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchAllQuestions.fulfilled,
        (state, action: PayloadAction<QuestionType[]>) => {
          state.loading = false;
          state.questions = action.payload;
        }
      )
      .addCase(fetchAllQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tải danh sách câu hỏi";
      })

      // 📘 Fetch by ID
      .addCase(
        fetchQuestionById.fulfilled,
        (state, action: PayloadAction<QuestionType>) => {
          state.currentQuestion = action.payload;
        }
      )

      // 📘 Create
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.push(action.payload);
        state.successMessage = "Tạo câu hỏi thành công!";
      })

      // 📘 Update
      .addCase(updateQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q.id === action.payload.id
        );
        if (index !== -1) state.questions[index] = action.payload;
        state.successMessage = "Cập nhật câu hỏi thành công!";
      })

      // 📘 Delete
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter(
          (q) => q.id !== action.payload.id
        );
        state.successMessage = "Xóa câu hỏi thành công!";
      })

      // 📘 Save Question
      .addCase(saveQuestion.fulfilled, (state, action) => {
        const index = state.questions.findIndex(
          (q) => q.id === action.payload.id
        );
        if (index !== -1) {
          state.questions[index] = action.payload;
        } else {
          state.questions.push(action.payload);
        }
        state.successMessage = "Lưu câu hỏi thành công!";
      });
  },
});

export const { clearQuestionMessages } = questionsSlice.actions;
export default questionsSlice.reducer;
