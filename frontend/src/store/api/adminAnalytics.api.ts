import axiosClient from "@/lib/axiosClient";

// Admin analytics - Overview
export const getAdminOverviewApi = async () => {
  const response = await axiosClient.get("/admin/analytics/overview");
  return response.data;
};
