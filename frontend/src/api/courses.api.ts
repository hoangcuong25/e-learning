import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả khóa học
export const getAllCoursesApi = async () => {
  const response = await axiosClient.get("/course");
  return response.data; // Trả về danh sách khóa học
};

// 🧩 2. Lấy chi tiết khóa học theo ID
export const getCourseByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/course/${id}`);
  return response.data;
};

// 🧩 3. Tạo khóa học mới (Instructor / Admin)
export const createCourseApi = async (payload: FormData) => {
  const response = await axiosClient.post("/course", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 🧩 4. Cập nhật khóa học
export const updateCourseApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/course/${id}`, payload);
  return response.data;
};

// 🧩 5. Xóa khóa học
export const deleteCourseApi = async (id: number) => {
  const response = await axiosClient.delete(`/course/${id}`);
  return response.data;
};

// 🧩 6. Lấy tất cả khóa học của instructor theo Instructor ID
export const getCoursesByInstructorApi = async () => {
  const response = await axiosClient.get(`/course/instructors/me/courses`);
  return response.data;
};
