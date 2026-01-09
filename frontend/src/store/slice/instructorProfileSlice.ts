import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getMyProfileApi,
  updateMyProfileApi,
  getInstructorProfileApi,
} from "@/store/api/instructorProfile.api";

interface InstructorProfile {
  id: number;
  userId: number;
  bio?: string;
  experience?: string;
  user?: {
    id: number;
    fullname: string;
    email: string;
    avatar: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

interface InstructorProfileState {
  profile: InstructorProfile | null;
  publicProfile: InstructorProfile | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: InstructorProfileState = {
  profile: null,
  publicProfile: null,
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Get current profile
export const fetchMyProfile = createAsyncThunk(
  "instructorProfile/fetchMyProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMyProfileApi();
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch profile");
    }
  }
);

// ✏️ Update profile
export const updateMyProfile = createAsyncThunk(
  "instructorProfile/updateMyProfile",
  async (data: { bio?: string; experience?: string }, { rejectWithValue }) => {
    try {
      const response = await updateMyProfileApi(data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to update profile"
      );
    }
  }
);

// 🔍 Get public profile by ID
export const fetchInstructorProfile = createAsyncThunk(
  "instructorProfile/fetchById",
  async (userId: number, { rejectWithValue }) => {
    try {
      const response = await getInstructorProfileApi(userId);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch instructor profile"
      );
    }
  }
);

const instructorProfileSlice = createSlice({
  name: "instructorProfile",
  initialState,
  reducers: {
    clearProfileState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch My Profile
      .addCase(fetchMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Error fetching profile";
      })

      // Update My Profile
      .addCase(updateMyProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
        state.successMessage = "Profile updated successfully";
      })
      .addCase(updateMyProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Error updating profile";
      })

      // Fetch Public Profile
      .addCase(fetchInstructorProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInstructorProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.publicProfile = action.payload;
      })
      .addCase(fetchInstructorProfile.rejected, (state, action: any) => {
        state.loading = false;
        state.error =
          action.payload?.message ||
          action.error.message ||
          "Error fetching instructor profile";
      });
  },
});

export const { clearProfileState } = instructorProfileSlice.actions;
export default instructorProfileSlice.reducer;
