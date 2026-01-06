import axiosClient from "@/lib/axiosClient";

// 1. Get instructor overview statistics
export const getOverviewApi = async () => {
  const response = await axiosClient.get("/instructor-analytics/overview");
  return response.data;
};

// 2. Get instructor daily statistics
export const getDailyStatsApi = async (params?: {
  startDate?: string;
  endDate?: string;
}) => {
  const response = await axiosClient.get("/instructor-analytics/daily-stats", {
    params,
  });
  return response.data;
};

// 3. Get analytics for all instructor courses
export const getCourseAnalyticsApi = async () => {
  const response = await axiosClient.get("/instructor-analytics/courses");
  return response.data;
};

// 4. Get instructor earnings history
export const getEarningsHistoryApi = async (params?: {
  page?: number;
  limit?: number;
}) => {
  const response = await axiosClient.get("/instructor-analytics/earnings", {
    params,
  });
  return response.data;
};

// 5. Get enrollment statistics
export const getEnrollmentStatsApi = async () => {
  const response = await axiosClient.get(
    "/instructor-analytics/enrollment-stats"
  );
  return response.data;
};
