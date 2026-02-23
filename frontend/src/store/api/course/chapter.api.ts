import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả chapter của một khóa học
export const getChaptersByCourseApi = async (courseId: number) => {
  const response = await axiosClient.get(`/chapter/course/${courseId}`);
  return response.data;
};

// 🧩 2. Lấy chi tiết 1 chapter
export const getChapterByIdApi = async (courseId: number, id: number) => {
  const response = await axiosClient.get(`/chapter/${id}/course/${courseId}`);
  return response.data;
};

// 🧩 3. Tạo chapter mới
export const createChapterApi = async (courseId: number, payload: any) => {
  const response = await axiosClient.post(
    `/chapter/course/${courseId}`,
    payload
  );
  return response.data;
};

// 🧩 4. Cập nhật chapter
export const updateChapterApi = async (
  courseId: number,
  id: number,
  payload: any
) => {
  const response = await axiosClient.patch(
    `/chapter/${id}/course/${courseId}`,
    payload
  );
  return response.data;
};

// 🧩 5. Xóa chapter
export const deleteChapterApi = async (courseId: number, id: number) => {
  const response = await axiosClient.delete(
    `/chapter/${id}/course/${courseId}`
  );
  return response.data;
};
