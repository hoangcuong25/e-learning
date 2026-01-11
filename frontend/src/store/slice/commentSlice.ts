import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createCommentApi,
  CreateCommentPayload,
  deleteCommentApi,
  getCommentsByPostApi,
  updateCommentApi,
  UpdateCommentPayload,
} from "../api/comment.api";

interface CommentState {
  comments: CommentType[];
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

const initialState: CommentState = {
  comments: [],
  pagination: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy comment của bài viết
export const fetchCommentsByPost = createAsyncThunk(
  "comment/fetchByPost",
  async (
    { postId, params }: { postId: number; params?: PaginationParams },
    { rejectWithValue }
  ) => {
    try {
      const response = await getCommentsByPostApi(postId, params);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tải bình luận");
    }
  }
);

// ➕ Tạo comment
export const createComment = createAsyncThunk(
  "comment/create",
  async (payload: CreateCommentPayload, { rejectWithValue }) => {
    try {
      const response = await createCommentApi(payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tạo bình luận");
    }
  }
);

// ✏️ Cập nhật comment
export const updateComment = createAsyncThunk(
  "comment/update",
  async (
    { id, payload }: { id: number; payload: UpdateCommentPayload },
    { rejectWithValue }
  ) => {
    try {
      const response = await updateCommentApi(id, payload);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi cập nhật bình luận");
    }
  }
);

// 🗑️ Xóa comment
export const deleteComment = createAsyncThunk(
  "comment/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deleteCommentApi(id);
      return { id, message: response.message };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi xóa bình luận");
    }
  }
);

const commentSlice = createSlice({
  name: "comment",
  initialState,
  reducers: {
    clearCommentState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    addRealtimeComment: (state, action) => {
      state.comments.unshift(action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch comments
      .addCase(fetchCommentsByPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCommentsByPost.fulfilled, (state, action) => {
        state.loading = false;
        state.comments = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi tải bình luận";
      })

      // ➕ Create comment
      .addCase(createComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Bình luận thành công";
        // Logic update state:
        // 1. Nếu comment mới, trả về comment object -> unshift vào list
        // Backend tra ve: { message: "...", data: Comment }
        if (action.payload.data) {
          state.comments.unshift(action.payload.data);
        }
      })
      .addCase(createComment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi tạo bình luận";
      })

      // ✏️ Update comment
      .addCase(updateComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateComment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Cập nhật bình luận thành công";
        if (action.payload.data) {
          const index = state.comments.findIndex(
            (c) => c.id === action.payload.data.id
          );
          if (index !== -1) {
            state.comments[index] = action.payload.data;
          }
        }
      })
      .addCase(updateComment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi cập nhật bình luận";
      })

      // 🗑️ Delete comment
      .addCase(deleteComment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Xóa bình luận thành công";
        state.comments = state.comments.filter(
          (c) => c.id !== action.payload.id
        );
      })
      .addCase(deleteComment.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi xóa bình luận";
      });
  },
});

export const { clearCommentState, addRealtimeComment } = commentSlice.actions;
export default commentSlice.reducer;
