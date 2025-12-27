import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả coupon (Admin)
export const getAllCouponsApi = async (params?: any) => {
  const response = await axiosClient.get("/coupon", { params });
  return response.data;
};

// 🧩 2. Lấy chi tiết coupon theo ID
export const getCouponByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/coupon/${id}`);
  return response.data;
};

// 🧩 3. Tạo coupon mới (Instructor)
export const createCouponApi = async (payload: any) => {
  const response = await axiosClient.post("/coupon", payload);
  return response.data;
};

// 🧩 4. Cập nhật coupon (Instructor)
export const updateCouponApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/coupon/${id}`, payload);
  return response.data;
};

// 🧩 5. Xóa coupon (Instructor)
export const deleteCouponApi = async (id: number) => {
  const response = await axiosClient.delete(`/coupon/${id}`);
  return response.data;
};

// 🧩 6. Áp dụng coupon (Student/User)
export const applyCouponApi = async (code: string, courseId: number) => {
  const response = await axiosClient.post(`/coupon/${code}/apply`, {
    courseId,
  });
  return response.data;
};

// 🧩 7. Lấy coupon của instructor hiện tại
export const getInstructorCouponsApi = async () => {
  const response = await axiosClient.get("/coupon/instructor/me");
  return response.data;
};

// 🧩 8.  Admin tạo coupon  link với DiscountCampaign)
export const createCouponDiscountByAdminApi = async (payload: any) => {
  const response = await axiosClient.post("/coupon/admin", payload);
  return response.data;
};
