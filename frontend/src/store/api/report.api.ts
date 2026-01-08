import axiosClient from "@/lib/axiosClient";

export interface CreateReportPayload {
  courseId: number;
  title: string;
  description?: string;
  type?: string; // Assuming string for enum to avoid strict dependency on missing frontend enum
}

// 1. User gửi report
export const createReportApi = async (payload: CreateReportPayload) => {
  const response = await axiosClient.post("/report", payload);
  return response.data;
};

// 2. Admin xem tất cả report (có phân trang + filter)
export const getAllReportsApi = async (params?: {
  page?: number;
  limit?: number;
  type?: string;
}) => {
  const response = await axiosClient.get("/report", { params });
  return response.data;
};

// 3. Admin xem chi tiết 1 report
export const getReportDetailApi = async (id: number) => {
  const response = await axiosClient.get(`/report/${id}`);
  return response.data;
};

// 4. Admin xóa report
export const deleteReportApi = async (id: number) => {
  const response = await axiosClient.delete(`/report/${id}`);
  return response.data;
};
