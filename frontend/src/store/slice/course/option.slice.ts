import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getOptionsByQuestionApi,
  getOptionByIdApi,
  createOptionApi,
  createManyOptionsApi,
  updateOptionApi,
  deleteOptionApi,
} from "@/store/api/course/option.api";

interface OptionState {
  options: OptionType[];
  currentOption: OptionType | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: OptionState = {
  options: [],
  currentOption: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧩 Lấy tất cả option theo questionId
export const fetchOptionsByQuestion = createAsyncThunk(
  "options/fetchByQuestion",
  async (questionId: number) => {
    const response = await getOptionsByQuestionApi(questionId);
    return response.data;
  }
);

// 🧩 Lấy chi tiết option
export const fetchOptionById = createAsyncThunk(
  "options/fetchById",
  async (id: number) => {
    const response = await getOptionByIdApi(id);
    return response.data;
  }
);

// 🧩 Tạo mới 1 option
export const createOption = createAsyncThunk(
  "options/create",
  async (payload: any) => {
    const response = await createOptionApi(payload);
    return response;
  }
);

// 🧩 Tạo nhiều option
export const createManyOptions = createAsyncThunk(
  "options/createMany",
  async (payload: any) => {
    const response = await createManyOptionsApi(payload);
    return response;
  }
);

// 🧩 Cập nhật option
export const updateOption = createAsyncThunk(
  "options/update",
  async (data: { id: number; payload: any }) => {
    const response = await updateOptionApi(data.id, data.payload);
    return response;
  }
);

// 🧩 Xóa option
export const deleteOption = createAsyncThunk(
  "options/delete",
  async (id: number) => {
    const response = await deleteOptionApi(id);
    return { id, response };
  }
);

// 🧱 Slice
const optionSlice = createSlice({
  name: "options",
  initialState,
  reducers: {
    clearOptionMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 📘 Fetch by question
      .addCase(fetchOptionsByQuestion.pending, (state) => {
        state.loading = true;
      })
      .addCase(
        fetchOptionsByQuestion.fulfilled,
        (state, action: PayloadAction<OptionType[]>) => {
          state.loading = false;
          state.options = action.payload;
        }
      )
      .addCase(fetchOptionsByQuestion.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Lỗi tải option";
      })

      // 📘 Create single
      .addCase(createOption.fulfilled, (state, action) => {
        state.options.push(action.payload);
        state.successMessage = "Tạo option thành công!";
      })

      // 📘 Create many
      .addCase(createManyOptions.fulfilled, (state) => {
        state.successMessage = "Tạo nhiều option thành công!";
      })

      // 📘 Update
      .addCase(updateOption.fulfilled, (state, action) => {
        const index = state.options.findIndex(
          (o) => o.id === action.payload.id
        );
        if (index !== -1) state.options[index] = action.payload;
        state.successMessage = "Cập nhật option thành công!";
      })

      // 📘 Delete
      .addCase(deleteOption.fulfilled, (state, action) => {
        state.options = state.options.filter((o) => o.id !== action.payload.id);
        state.successMessage = "Xóa option thành công!";
      });
  },
});

export const { clearOptionMessages } = optionSlice.actions;
export default optionSlice.reducer;
