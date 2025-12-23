import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả câu hỏi
export const getAllQuestionsApi = async () => {
  const response = await axiosClient.get(`/question`);
  return response.data;
};

// 🧩 2. Lấy chi tiết 1 câu hỏi (bao gồm các lựa chọn)
export const getQuestionByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/question/${id}`);
  return response.data;
};

// 🧩 3. Tạo câu hỏi mới
export const createQuestionApi = async (payload: any) => {
  const response = await axiosClient.post(`/question`, payload);
  return response.data;
};

// 🧩 4. Cập nhật câu hỏi
export const updateQuestionApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/question/${id}`, payload);
  return response.data;
};

// 🧩 5. Xóa câu hỏi
export const deleteQuestionApi = async (id: number) => {
  const response = await axiosClient.delete(`/question/${id}`);
  return response.data;
};
