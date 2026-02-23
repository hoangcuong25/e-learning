import axiosClient from "@/lib/axiosClient";

// 💳 1. Gửi yêu cầu nạp tiền (User)
export const createDepositApi = async (payload: any) => {
  const response = await axiosClient.post("/payment/deposit", payload);
  return response.data;
};

// 💰 2. Lấy lịch sử giao dịch của user (nạp/rút)
export const getMyTransactionsApi = async (params?: { type?: string }) => {
  const response = await axiosClient.get("/payment/history", { params });
  return response.data;
};

// 🧾 3. Lấy chi tiết giao dịch theo ID
export const getTransactionDetailApi = async (id: number) => {
  const response = await axiosClient.get(`/payment/${id}`);
  return response.data;
};

// 🛠️ 4. (Admin) Lấy tất cả giao dịch
export const getAllTransactionsApi = async (params?: any) => {
  const response = await axiosClient.get("/payment/admin/all", { params });
  return response.data;
};

// ⚙️ 5. (Webhook từ Sepay) — thường không gọi từ frontend
export const sendWebhookMockApi = async (payload: any) => {
  // chỉ dùng cho test nội bộ (nếu cần mô phỏng webhook)
  const response = await axiosClient.post("/payment/webhook", payload);
  return response.data;
};
