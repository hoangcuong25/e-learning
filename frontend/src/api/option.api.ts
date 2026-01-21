import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả option của 1 câu hỏi
export const getOptionsByQuestionApi = async (questionId: number) => {
  const response = await axiosClient.get(`/options/question/${questionId}`);
  return response.data;
};

// 🧩 2. Lấy chi tiết 1 option
export const getOptionByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/options/${id}`);
  return response.data;
};

// 🧩 3. Tạo mới 1 option
export const createOptionApi = async (payload: any) => {
  const response = await axiosClient.post(`/options`, payload);
  return response.data;
};

// 🧩 4. Tạo nhiều option (bulk)
export const createManyOptionsApi = async (payload: any) => {
  const response = await axiosClient.post(`/options/bulk`, payload);
  return response.data;
};

// 🧩 5. Cập nhật option
export const updateOptionApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/options/${id}`, payload);
  return response.data;
};

// 🧩 6. Xóa option
export const deleteOptionApi = async (id: number) => {
  const response = await axiosClient.delete(`/options/${id}`);
  return response.data;
};
