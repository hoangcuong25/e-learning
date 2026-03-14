import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getDailyMissionsApi, updateMissionProgressApi, MissionType, UpdateMissionProgressResponse } from "@/store/api/mission/mission.api";

// 🧱 State
interface MissionState {
  missions: MissionType[];
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: MissionState = {
  missions: [],
  loading: false,
  error: null,
  successMessage: null,
};

// 🧾 Lấy tất cả nhiệm vụ hàng ngày
export const fetchDailyMissions = createAsyncThunk(
  "mission/fetchDaily",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getDailyMissionsApi();
      return response;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Lỗi khi tải danh sách nhiệm vụ");
    }
  }
);

// ✏️ Cập nhật tiến độ nhiệm vụ
export const updateMissionProgress = createAsyncThunk(
  "mission/updateProgress",
  async (minutes: number, { rejectWithValue }) => {
    try {
        const response = await updateMissionProgressApi(minutes);
        return response as UpdateMissionProgressResponse;
    } catch (error: any) {
        return rejectWithValue(error.response?.data || "Lỗi khi cập nhật tiến độ");
    }
  }
);

// 🧩 Slice
const missionSlice = createSlice({
  name: "mission",
  initialState,
  reducers: {
    clearMissionState: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 🧾 Fetch Daily Missions
      .addCase(fetchDailyMissions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDailyMissions.fulfilled, (state, action) => {
        state.loading = false;
        state.missions = action.payload?.data || action.payload || [];
      })
      .addCase(fetchDailyMissions.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) ?? action.error.message ?? "Lỗi khi tải danh sách nhiệm vụ";
      })

      // ✏️ Update Progress
      .addCase(updateMissionProgress.pending, (state) => {
        
      })
      .addCase(updateMissionProgress.fulfilled, (state, action) => {
        const updatedMissions = action.payload?.data?.updatedMissions || action.payload?.updatedMissions || [];
        
        updatedMissions.forEach((updated: any) => {
            const missionIndex = state.missions.findIndex(m => m.id === updated.missionId);
            if(missionIndex !== -1) {
                state.missions[missionIndex].progress = updated.progress;
                state.missions[missionIndex].isCompleted = updated.isCompleted;
            }
        });
      })
      .addCase(updateMissionProgress.rejected, (state, action) => {
        state.error = (action.payload as string) ?? action.error.message ?? "Lỗi cập nhật tiến độ";
      });
  },
});

export const { clearMissionState } = missionSlice.actions;
export default missionSlice.reducer;
