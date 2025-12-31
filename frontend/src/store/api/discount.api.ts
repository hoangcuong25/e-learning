import axiosClient from "@/lib/axiosClient";

// 🧾 1. Lấy tất cả discount campaigns (Public)
export const getAllDiscountsApi = async (params?: any) => {
  const response = await axiosClient.get("/discount", { params });
  return response.data;
};

// 🔍 2. Lấy chi tiết discount campaign theo ID (Public)
export const getDiscountByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/discount/${id}`);
  return response.data;
};

// ➕ 3. Tạo mới discount campaign (Admin)
export const createDiscountApi = async (payload: any) => {
  const response = await axiosClient.post("/discount", payload);
  return response.data;
};

// ✏️ 4. Cập nhật discount campaign (Admin)
export const updateDiscountApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/discount/${id}`, payload);
  return response.data;
};

// 🗑️ 5. Xóa discount campaign (Admin)
export const deleteDiscountApi = async (id: number) => {
  const response = await axiosClient.delete(`/discount/${id}`);
  return response.data;
};

// 🔄 6. Toggle trạng thái kích hoạt discount campaign (Admin)
export const toggleDiscountStatusApi = async (id: number) => {
  const response = await axiosClient.patch(`/discount/${id}/toggle`);
  return response.data;
};
