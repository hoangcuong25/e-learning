import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả bài học của một khóa học
export const getLessonsByCourseApi = async (courseId: number) => {
  const response = await axiosClient.get(`/lesson/course/${courseId}`);
  return response.data;
};

// 🧩 2. Lấy chi tiết 1 bài học
export const getLessonByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/lesson/${id}`);
  return response.data;
};

// 🧩 3. Tạo bài học mới
export const createLessonApi = async (payload: any) => {
  const response = await axiosClient.post(`/lesson`, payload);
  return response.data;
};

// 🧩 4. Cập nhật bài học
export const updateLessonApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/lesson/${id}`, payload);
  return response.data;
};

// 🧩 5. Xóa bài học
export const deleteLessonApi = async (id: number) => {
  const response = await axiosClient.delete(`/lesson/${id}`);
  return response.data;
};

// 🧩 6. Đánh dấu bài học đã hoàn thành
export const markLessonCompletedApi = async (lessonId: number) => {
  const response = await axiosClient.patch(`/lesson/progress/${lessonId}`);
  return response.data;
};
