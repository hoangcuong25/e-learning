import axiosClient from "@/lib/axiosClient";

export interface MissionType {
  id: number;
  title: string;
  description: string;
  type: string;
  requirement: number;
  rewardAmount: number;
  isActive: boolean;
  progress: number;
  isCompleted: boolean;
}

export interface UpdateMissionProgressResponse {
  message?: string;
  data?: {
    totalReward: number;
    updatedMissions: {
      missionId: number;
      progress: number;
      isCompleted: boolean;
    }[];
  };
  totalReward?: number;
  updatedMissions?: {
    missionId: number;
    progress: number;
    isCompleted: boolean;
  }[];
}

// 🧩 Lấy danh sách nhiệm vụ hàng ngày
export const getDailyMissionsApi = async () => {
    const response = await axiosClient.get("/mission/daily");
    return response.data;
  };
  
  // 🧩 Cập nhật tiến độ nhiệm vụ
  export const updateMissionProgressApi = async (minutes: number) => {
    const response = await axiosClient.post("/mission/update-progress", { minutes });
    return response.data;
  };
  
