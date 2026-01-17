// src/store/userSlice.ts
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { getUser } from "@/api/user.api";
import { LogoutApi } from "@/api/auth.api";
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";

// 🧠 Type cho user
interface UserState {
  user: UserType | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  user: null,
  loading: false,
  error: null,
};

// 🪄 Async action: Fetch user
export const fetchUser = createAsyncThunk("user/fetchUser", async () => {
  const response = await getUser();
  return response;
});

// 🚪 Async action: Logout
export const logoutUser = createAsyncThunk(
  "user/logoutUser",
  async (router: AppRouterInstance) => {
    localStorage.removeItem("access_token");
    await LogoutApi();
    router.push("/login");
  }
);

// 🧩 Slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserType | null>) => {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message ?? "Error fetching user";
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  },
});

export const { setUser } = userSlice.actions;
export default userSlice.reducer;
