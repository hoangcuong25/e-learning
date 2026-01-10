import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllPostsApi,
  getPostDetailApi,
  createPostApi,
  updatePostApi,
  deletePostApi,
  toggleLikePostApi,
  sharePostApi,
} from "@/store/api/post.api";

interface PostState {
  posts: PostType[];
  currentPost: PostType | null;
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

const initialState: PostState = {
  posts: [],
  currentPost: null,
  pagination: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả bài viết
export const fetchAllPosts = createAsyncThunk(
  "post/fetchAll",
  async (params?: any) => {
    const response = await getAllPostsApi(params);
    return response.data;
  }
);

// 🔍 Lấy chi tiết bài viết
export const fetchPostDetail = createAsyncThunk(
  "post/fetchDetail",
  async (id: number) => {
    const response = await getPostDetailApi(id);
    return response.data;
  }
);

// ➕ Tạo bài viết mới
export const createPost = createAsyncThunk(
  "post/create",
  async (payload: any, { rejectWithValue }) => {
    try {
      const response = await createPostApi(payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi tạo bài viết");
    }
  }
);

// ✏️ Cập nhật bài viết
export const updatePost = createAsyncThunk(
  "post/update",
  async (data: { id: number; payload: any }, { rejectWithValue }) => {
    try {
      const response = await updatePostApi(data.id, data.payload);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi cập nhật bài viết");
    }
  }
);

// 🗑️ Xóa bài viết
export const deletePost = createAsyncThunk(
  "post/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await deletePostApi(id);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi xóa bài viết");
    }
  }
);

// ❤️ Toggle like
export const toggleLikePost = createAsyncThunk(
  "post/toggleLike",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await toggleLikePostApi(id);
      return { id, data: response.data };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi like bài viết");
    }
  }
);

// 📢 Chia sẻ bài viết
export const sharePost = createAsyncThunk(
  "post/share",
  async (data: { id: number; content?: string }, { rejectWithValue }) => {
    try {
      const response = await sharePostApi(data.id, data.content);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi chia sẻ bài viết");
    }
  }
);

// 🧩 Slice
const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {
    clearPostState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch all
      .addCase(fetchAllPosts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllPosts.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Lỗi khi tải danh sách bài viết";
      })

      // 🔍 Fetch detail
      .addCase(fetchPostDetail.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPostDetail.fulfilled, (state, action) => {
        state.loading = false;
        state.currentPost = action.payload;
      })
      .addCase(fetchPostDetail.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Không thể tải chi tiết bài viết";
      })

      // ➕ Create
      .addCase(createPost.pending, (state) => {
        state.loading = true;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.message ?? "Tạo bài viết thành công";
        state.posts.unshift(action.payload.data);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi tạo bài viết";
      })

      // ✏️ Update
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(updatePost.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Cập nhật thành công";
        state.posts = state.posts.map((p) =>
          p.id === action.payload.data.id ? action.payload.data : p
        );
        if (state.currentPost?.id === action.payload.data.id) {
          state.currentPost = action.payload.data;
        }
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi cập nhật bài viết";
      })

      // 🗑️ Delete
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload.message ?? "Đã xóa bài viết";
        const deletedId = action.meta.arg;
        state.posts = state.posts.filter((p) => p.id !== deletedId);
        if (state.currentPost?.id === deletedId) {
          state.currentPost = null;
        }
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi xóa bài viết";
      })

      // ❤️ Toggle Like
      .addCase(toggleLikePost.fulfilled, (state, action) => {
        const postId = action.payload.id;
        const post = state.posts.find((p) => p.id === postId);
        if (post) {
          post.isLiked = !post.isLiked;
          if (post._count) {
            post._count.likes = post.isLiked
              ? post._count.likes + 1
              : post._count.likes - 1;
          }
        }

        if (state.currentPost && state.currentPost.id === postId) {
          state.currentPost.isLiked = !state.currentPost.isLiked;
          if (state.currentPost._count) {
            state.currentPost._count.likes = state.currentPost.isLiked
              ? state.currentPost._count.likes + 1
              : state.currentPost._count.likes - 1;
          }
        }
      })
      .addCase(toggleLikePost.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi like bài viết";
      })

      // 📢 Share
      .addCase(sharePost.pending, (state) => {
        state.loading = true;
      })
      .addCase(sharePost.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = "Chia sẻ bài viết thành công";
        // Add shared post to list if applicable
        state.posts.unshift(action.payload.data);
      })
      .addCase(sharePost.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi chia sẻ bài viết";
      });
  },
});

export const { clearPostState } = postSlice.actions;
export default postSlice.reducer;
