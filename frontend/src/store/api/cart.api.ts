import axiosClient from "@/lib/axiosClient";

//  1. Lấy giỏ hàng người dùng
export const getCartApi = async () => {
  const response = await axiosClient.get("/cart");
  return response.data;
};

//  2. Thêm khóa học vào giỏ hàng
export const addCourseToCartApi = async (courseId: number) => {
  const response = await axiosClient.post(`/cart/add/${courseId}`);
  return response.data;
};

//  3. Xóa 1 khóa học khỏi giỏ hàng
export const removeCourseFromCartApi = async (courseId: number) => {
  const response = await axiosClient.delete(`/cart/remove/${courseId}`);
  return response.data;
};

//  4. Xóa toàn bộ giỏ hàng
export const clearCartApi = async () => {
  const response = await axiosClient.delete(`/cart/clear`);
  return response.data;
};
