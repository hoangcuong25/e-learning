import axiosClient from "@/lib/axiosClient";

// 🧾 1. Lấy tất cả enrollment (có thể dùng cho admin hoặc instructor)
export const getAllEnrollmentsApi = async (params?: PaginationParams) => {
  const response = await axiosClient.get("/enrollment", { params });
  return response.data;
};

// 🧾 2. Lấy chi tiết enrollment theo ID
export const getEnrollmentDetailApi = async (id: number) => {
  const response = await axiosClient.get(`/enrollment/${id}`);
  return response.data;
};

// 🧩 3. Lấy tất cả enrollment của user hiện tại
export const getMyEnrollmentsApi = async () => {
  const response = await axiosClient.get("/enrollment/me");
  return response.data;
};

// 🧩 4. Đăng ký khóa học (user enroll vào course) — thêm couponCode optional
export const createEnrollmentApi = async (
  courseId: number,
  couponCode?: string
) => {
  // gửi body vì controller expect @Body("couponCode")
  const response = await axiosClient.post(`/enrollment/${courseId}`, {
    couponCode: couponCode ?? null,
  });
  return response.data;
};

// 🧩 5. Hủy enrollment (rời khóa học)
export const cancelEnrollmentApi = async (id: number) => {
  const response = await axiosClient.delete(`/enrollment/${id}`);
  return response.data;
};
