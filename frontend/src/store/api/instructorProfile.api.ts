import axiosClient from "@/lib/axiosClient";

// 1. Get current instructor profile (@me)
export const getMyProfileApi = async () => {
  const response = await axiosClient.get("/instructor/profile/@me");
  return response.data; // data here usually returns the object directly or wraps it
};

// 2. Update current instructor profile (@me)
export const updateMyProfileApi = async (body: {
  bio?: string;
  experience?: string;
}) => {
  const response = await axiosClient.patch("/instructor/profile/@me", body);
  return response.data;
};

// 3. Get instructor profile by ID
export const getInstructorProfileApi = async (userId: number) => {
  const response = await axiosClient.get(`/instructor/profile/${userId}`);
  return response.data;
};
