import axiosClient from "@/lib/axiosClient";

// 1. Lấy danh sách danh mục thuật toán
export const getAlgorithmCategoriesApi = async () => {
  const response = await axiosClient.get("/algorithm/categories");
  return response.data;
};

// 2. Lấy danh sách bài tập thuật toán
export const getAlgorithmProblemsApi = async (params: {
  categoryId?: number;
  difficulty?: string;
  search?: string;
}) => {
  const response = await axiosClient.get("/algorithm/problems", { params });
  return response.data;
};

// 3. Lấy chi tiết bài tập theo slug
export const getAlgorithmProblemBySlugApi = async (slug: string) => {
  const response = await axiosClient.get(`/algorithm/problems/${slug}`);
  return response.data;
};

// 4. Nộp bài giải
export const submitAlgorithmApi = async (body: {
  problemId: number;
  code: string;
  language: string;
}) => {
  const response = await axiosClient.post("/algorithm/submissions", body);
  return response.data;
};

// 5. Kiểm tra trạng thái nộp bài
export const getSubmissionStatusApi = async (id: number) => {
  const response = await axiosClient.get(`/algorithm/submissions/status/${id}`);
  return response.data;
};

// 6. Lấy lịch sử nộp bài cá nhân
export const getMySubmissionsApi = async (params: { problemId?: number }) => {
  const response = await axiosClient.get("/algorithm/my-submissions", {
    params,
  });
  return response.data;
};
