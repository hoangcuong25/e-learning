import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  followUserApi,
  unfollowUserApi,
  getFollowersApi,
  getFollowingApi,
  isFollowingApi,
  getFollowSuggestionsApi,
} from "@/store/api/community/follow.api";

interface FollowState {
  followers: any[];
  following: any[];
  suggestions: any[];
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

const initialState: FollowState = {
  followers: [],
  following: [],
  suggestions: [],
  pagination: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Theo dõi người dùng
export const followUser = createAsyncThunk(
  "follow/followUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await followUserApi(id);
      return { id, data: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi theo dõi");
    }
  }
);

// 🧾 Bỏ theo dõi người dùng
export const unfollowUser = createAsyncThunk(
  "follow/unfollowUser",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await unfollowUserApi(id);
      return { id, data: response };
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Lỗi khi bỏ theo dõi");
    }
  }
);

// 🔍 Lấy danh sách người theo dõi
export const fetchFollowers = createAsyncThunk(
  "follow/fetchFollowers",
  async (data: { id: number; params?: any }, { rejectWithValue }) => {
    try {
      const response = await getFollowersApi(data.id, data.params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy danh sách người theo dõi"
      );
    }
  }
);

// 🔍 Lấy danh sách đang theo dõi
export const fetchFollowing = createAsyncThunk(
  "follow/fetchFollowing",
  async (data: { id: number; params?: any }, { rejectWithValue }) => {
    try {
      const response = await getFollowingApi(data.id, data.params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy danh sách đang theo dõi"
      );
    }
  }
);

// 🔍 Kiểm tra trạng thái theo dõi
export const checkFollowStatus = createAsyncThunk(
  "follow/checkFollowStatus",
  async (id: number, { rejectWithValue }) => {
    try {
      const response = await isFollowingApi(id);
      return { id, isFollowing: response.data?.isFollowing || false };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi kiểm tra trạng thái theo dõi"
      );
    }
  }
);

// 🔍 Lấy gợi ý theo dõi
export const fetchFollowSuggestions = createAsyncThunk(
  "follow/fetchSuggestions",
  async (params: any, { rejectWithValue }) => {
    try {
      const response = await getFollowSuggestionsApi(params);
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Lỗi khi lấy gợi ý theo dõi"
      );
    }
  }
);

// 🧩 Slice
const followSlice = createSlice({
  name: "follow",
  initialState,
  reducers: {
    clearFollowState: (state) => {
      state.error = null;
      state.successMessage = null;
      state.followers = [];
      state.following = [];
      state.suggestions = [];
      state.pagination = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Follow User
      .addCase(followUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(followUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.data.message ?? "Theo dõi thành công";
        // Update isFollowing in followers/following/suggestions arrays
        state.followers = state.followers.map((u) =>
          u.id === action.payload.id ? { ...u, isFollowing: true } : u
        );
        state.following = state.following.map((u) =>
          u.id === action.payload.id ? { ...u, isFollowing: true } : u
        );
        state.suggestions = state.suggestions.map((u) =>
          u.id === action.payload.id ? { ...u, isFollowing: true } : u
        );
      })
      .addCase(followUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi theo dõi";
      })

      // Unfollow User
      .addCase(unfollowUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(unfollowUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage =
          action.payload.data.message ?? "Bỏ theo dõi thành công";
        // Update isFollowing in followers/following/suggestions arrays
        state.followers = state.followers.map((u) =>
          u.id === action.payload.id ? { ...u, isFollowing: false } : u
        );
        state.following = state.following.map((u) =>
          u.id === action.payload.id ? { ...u, isFollowing: false } : u
        );
        state.suggestions = state.suggestions.map((u) =>
          u.id === action.payload.id ? { ...u, isFollowing: false } : u
        );
      })
      .addCase(unfollowUser.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Lỗi khi bỏ theo dõi";
      })

      // Fetch Followers
      .addCase(fetchFollowers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.loading = false;

        const newUsers = action.payload.data.data || [];
        const pagination = action.payload.data.pagination;

        if (pagination?.currentPage === 1) {
          state.followers = newUsers;
        } else {
          state.followers = [...state.followers, ...newUsers];
        }

        state.pagination = pagination || null;
      })
      .addCase(fetchFollowers.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Lỗi khi lấy danh sách người theo dõi";
      })

      // Fetch Following
      .addCase(fetchFollowing.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.loading = false;

        const newUsers = action.payload.data.data || [];
        const pagination = action.payload.data.pagination;

        if (pagination?.currentPage === 1) {
          state.following = newUsers;
        } else {
          state.following = [...state.following, ...newUsers];
        }

        state.pagination = pagination || null;
      })
      .addCase(fetchFollowing.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Lỗi khi lấy danh sách đang theo dõi";
      })

      // Check Follow Status - Removed, use isFollowing from user objects directly

      // Fetch Suggestions
      .addCase(fetchFollowSuggestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowSuggestions.fulfilled, (state, action) => {
        state.loading = false;
        // The API returns the array directly in action.payload.data
        // due to TransformInterceptor wrapping it.
        state.suggestions = action.payload.data || [];
        state.pagination = action.payload.pagination || null;
      })
      .addCase(fetchFollowSuggestions.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) || "Lỗi khi lấy gợi ý theo dõi";
      });
  },
});

export const { clearFollowState } = followSlice.actions;
export default followSlice.reducer;
