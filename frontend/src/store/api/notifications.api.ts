import axiosClient from "@/lib/axiosClient";

export interface FindNotificationsParams {
  cursor?: string; // ISO timestamp của notification cuối cùng
  limit?: number;
  isRead?: boolean;
}

// 🧩 1. Lấy danh sách thông báo (cursor-based pagination + filter)
export const getNotificationsApi = async (params?: FindNotificationsParams) => {
  const response = await axiosClient.get("/notifications", { params });
  return response.data;
};

// 🧩 2. Lấy số lượng thông báo chưa đọc
export const getUnreadCountApi = async () => {
  const response = await axiosClient.get("/notifications/count");
  return response.data;
};

// 🧩 3. Đánh dấu tất cả là đã đọc
export const markAllAsReadApi = async () => {
  const response = await axiosClient.patch("/notifications/read-all");
  return response.data;
};

// 🧩 4. Đánh dấu một thông báo là đã đọc
export const markAsReadApi = async (id: number) => {
  const response = await axiosClient.patch(`/notifications/${id}/read`);
  return response.data;
};

// 🧩 5. Xóa thông báo
export const deleteNotificationApi = async (id: number) => {
  const response = await axiosClient.delete(`/notifications/${id}`);
  return response.data;
};
