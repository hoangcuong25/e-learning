import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAlgorithmCategoriesApi,
  getAlgorithmProblemsApi,
  getAlgorithmProblemBySlugApi,
  submitAlgorithmApi,
  getSubmissionStatusApi,
  getMySubmissionsApi,
} from "@/store/api/common/algorithm.api";

interface AlgorithmState {
  categories: AlgorithmCategoryType[];
  problems: AlgorithmProblemType[];
  currentProblem: AlgorithmProblemType | null;
  submissions: AlgorithmSubmissionType[];
  currentSubmission: AlgorithmSubmissionType | null;
  loading: boolean;
  submitting: boolean;
  error: string | null;
}

const initialState: AlgorithmState = {
  categories: [],
  problems: [],
  currentProblem: null,
  submissions: [],
  currentSubmission: null,
  loading: false,
  submitting: false,
  error: null,
};

// 🚀 Thunks
export const fetchAlgorithmCategories = createAsyncThunk(
  "algorithm/fetchCategories",
  async () => {
    const response = await getAlgorithmCategoriesApi();
    return response.data;
  }
);

export const fetchAlgorithmProblems = createAsyncThunk(
  "algorithm/fetchProblems",
  async (params: {
    categoryId?: number;
    difficulty?: string;
    search?: string;
  }) => {
    const response = await getAlgorithmProblemsApi(params);
    return response.data;
  }
);

export const fetchAlgorithmProblemBySlug = createAsyncThunk(
  "algorithm/fetchProblemBySlug",
  async (slug: string) => {
    const response = await getAlgorithmProblemBySlugApi(slug);
    return response.data;
  }
);

export const submitAlgorithm = createAsyncThunk(
  "algorithm/submit",
  async (
    body: { problemId: number; code: string; language: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await submitAlgorithmApi(body);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi nộp bài");
    }
  }
);

export const fetchSubmissionStatus = createAsyncThunk(
  "algorithm/fetchSubmissionStatus",
  async (id: number) => {
    const response = await getSubmissionStatusApi(id);
    return response.data;
  }
);

export const fetchMySubmissions = createAsyncThunk(
  "algorithm/fetchMySubmissions",
  async (params: { problemId?: number }) => {
    const response = await getMySubmissionsApi(params);
    return response.data;
  }
);

// 🧩 Slice
const algorithmSlice = createSlice({
  name: "algorithm",
  initialState,
  reducers: {
    clearAlgorithmError: (state) => {
      state.error = null;
    },
    resetCurrentProblem: (state) => {
      state.currentProblem = null;
      state.currentSubmission = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Categories
      .addCase(fetchAlgorithmCategories.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlgorithmCategories.fulfilled, (state, action) => {
        state.loading = false;
        state.categories = action.payload;
      })
      .addCase(fetchAlgorithmCategories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi khi tải danh mục";
      })

      // Problems
      .addCase(fetchAlgorithmProblems.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlgorithmProblems.fulfilled, (state, action) => {
        state.loading = false;
        state.problems = action.payload;
      })

      // Problem Detail
      .addCase(fetchAlgorithmProblemBySlug.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAlgorithmProblemBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProblem = action.payload;
      })

      // Submission
      .addCase(submitAlgorithm.pending, (state) => {
        state.submitting = true;
      })
      .addCase(submitAlgorithm.fulfilled, (state, action) => {
        state.submitting = false;
        state.currentSubmission = action.payload;
      })
      .addCase(submitAlgorithm.rejected, (state, action) => {
        state.submitting = false;
        state.error = action.payload as string;
      })

      // Status
      .addCase(fetchSubmissionStatus.fulfilled, (state, action) => {
        state.currentSubmission = action.payload;
      })

      // My Submissions
      .addCase(fetchMySubmissions.fulfilled, (state, action) => {
        state.submissions = action.payload;
      });
  },
});

export const { clearAlgorithmError, resetCurrentProblem } =
  algorithmSlice.actions;
export default algorithmSlice.reducer;
