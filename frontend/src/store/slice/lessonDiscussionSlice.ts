import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getQuestionsApi,
  createQuestionApi,
  createAnswerApi,
  createReplyApi,
  deleteQuestionApi,
  deleteAnswerApi,
  deleteMyQuestionApi,
  deleteMyAnswerApi,
} from "@/store/api/lessonDiscussion.api";

interface LessonDiscussionState {
  questions: DiscussionQuestionType[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: LessonDiscussionState = {
  questions: [],
  loading: false,
  error: null,
  successMessage: null,
};

// Thunks

export const fetchQuestions = createAsyncThunk(
  "lessonDiscussion/fetchQuestions",
  async (lessonId: number) => {
    const response = await getQuestionsApi(lessonId);
    return response.data;
  }
);

export const createQuestion = createAsyncThunk(
  "lessonDiscussion/createQuestion",
  async ({ lessonId, content }: { lessonId: number; content: string }) => {
    const response = await createQuestionApi(lessonId, content);
    return response.data;
  }
);

export const createAnswer = createAsyncThunk(
  "lessonDiscussion/createAnswer",
  async ({ questionId, content }: { questionId: number; content: string }) => {
    const response = await createAnswerApi(questionId, content);
    return { questionId, answer: response.data };
  }
);

export const createReply = createAsyncThunk(
  "lessonDiscussion/createReply",
  async ({ answerId, questionId, content }: { answerId: number; questionId: number; content: string }) => {
    const response = await createReplyApi(answerId, content);
    return { answerId, questionId, reply: response.data };
  }
);

export const deleteQuestion = createAsyncThunk(
  "lessonDiscussion/deleteQuestion",
  async (id: number) => {
    await deleteQuestionApi(id);
    return id;
  }
);

export const deleteAnswer = createAsyncThunk(
  "lessonDiscussion/deleteAnswer",
  async ({ id, questionId, answerId }: { id: number; questionId: number; answerId?: number }) => {
    await deleteAnswerApi(id);
    return { id, questionId, answerId };
  }
);

export const deleteMyQuestion = createAsyncThunk(
  "lessonDiscussion/deleteMyQuestion",
  async (id: number) => {
    await deleteMyQuestionApi(id);
    return id;
  }
);

export const deleteMyAnswer = createAsyncThunk(
  "lessonDiscussion/deleteMyAnswer",
  async ({ id, questionId, answerId }: { id: number; questionId: number; answerId?: number }) => {
    await deleteMyAnswerApi(id);
    return { id, questionId, answerId };
  }
);

// Slice
const lessonDiscussionSlice = createSlice({
  name: "lessonDiscussion",
  initialState,
  reducers: {
    clearDiscussionMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Questions
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to load questions";
      })

      // Create Question
      .addCase(createQuestion.fulfilled, (state, action) => {
        state.questions.unshift(action.payload);
        state.successMessage = "Question posted successfully!";
      })

      // Create Answer
      .addCase(createAnswer.fulfilled, (state, action) => {
        const question = state.questions.find((q) => q.id === action.payload.questionId);
        if (question) {
          if (!question.answers) question.answers = [];
          question.answers.push(action.payload.answer);
        }
        state.successMessage = "Answer posted successfully!";
      })

      // Create Reply
      .addCase(createReply.fulfilled, (state, action) => {
        const question = state.questions.find((q) => q.id === action.payload.questionId);
        if (question) {
          const answer = question.answers.find((a) => a.id === action.payload.answerId);
          if (answer) {
            if (!answer.replies) answer.replies = [];
            answer.replies.push(action.payload.reply);
          }
        }
        state.successMessage = "Reply posted successfully!";
      })

      // Delete Question
      .addCase(deleteQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((q) => q.id !== action.payload);
        state.successMessage = "Question deleted successfully!";
      })

      // Delete Answer/Reply
      .addCase(deleteAnswer.fulfilled, (state, action) => {
        const { id, questionId, answerId } = action.payload;
        const question = state.questions.find((q) => q.id === questionId);
        
        if (question) {
          if (answerId) {
            // Deleting a reply
            const answer = question.answers.find((a) => a.id === answerId);
            if (answer) {
              answer.replies = answer.replies.filter((r) => r.id !== id);
            }
          } else {
            // Deleting an answer
            question.answers = question.answers.filter((a) => a.id !== id);
          }
        }
        state.successMessage = "Deleted successfully!";
      })

      // Delete My Question
      .addCase(deleteMyQuestion.fulfilled, (state, action) => {
        state.questions = state.questions.filter((q) => q.id !== action.payload);
        state.successMessage = "Question deleted successfully!";
      })

      // Delete My Answer/Reply
      .addCase(deleteMyAnswer.fulfilled, (state, action) => {
        const { id, questionId, answerId } = action.payload;
        const question = state.questions.find((q) => q.id === questionId);
        
        if (question) {
          if (answerId) {
            // Deleting a reply
            const answer = question.answers.find((a) => a.id === answerId);
            if (answer) {
              answer.replies = answer.replies.filter((r) => r.id !== id);
            }
          } else {
            // Deleting an answer
            question.answers = question.answers.filter((a) => a.id !== id);
          }
        }
        state.successMessage = "Deleted successfully!";
      });
  },
});

export const { clearDiscussionMessages } = lessonDiscussionSlice.actions;
export default lessonDiscussionSlice.reducer;
