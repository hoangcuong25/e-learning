import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả quiz
export const getAllQuizzesApi = async () => {
  const response = await axiosClient.get("/quiz");
  return response.data;
};

// 🧩 2. Lấy chi tiết quiz theo ID (bao gồm câu hỏi & đáp án)
export const getQuizByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/quiz/${id}`);
  return response.data;
};

// 🧩 3. Tạo quiz mới (chỉ giảng viên)
export const createQuizApi = async (payload: any) => {
  const response = await axiosClient.post("/quiz", payload);
  return response.data;
};

// 🧩 4. Cập nhật quiz (chỉ giảng viên)
export const updateQuizApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/quiz/${id}`, payload);
  return response.data;
};

// 🧩 5. Xóa quiz (chỉ giảng viên)
export const deleteQuizApi = async (id: number) => {
  const response = await axiosClient.delete(`/quiz/${id}`);
  return response.data;
};

// 🧩 6. Lấy quiz theo instructorId (dành cho giảng viên)
export const getInstructorQuizzesApi = async () => {
  const response = await axiosClient.get("/quiz/instructor/quizzes");
  return response.data;
};
