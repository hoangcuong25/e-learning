import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả khóa học (có phân trang + filter)
export const getAllCoursesApi = async (params?: PaginationParams) => {
  const response = await axiosClient.get("/course", { params });
  return response.data;
};

// 🧩 2. Lấy chi tiết khóa học theo ID
export const getCourseDetailApi = async (id: number) => {
  const response = await axiosClient.get(`/course/${id}`);
  return response.data;
};

// 🧩 3. Lấy chi tiết khóa học theo ID (instructor)
export const getCourseByIdApi = async (id: number) => {
  const response = await axiosClient.get(`/course/${id}/instructor`);
  return response.data;
};

// 🧩 4. Tạo khóa học mới (Instructor / Admin)
export const createCourseApi = async (payload: FormData) => {
  const response = await axiosClient.post("/course", payload, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// 🧩 5. Cập nhật khóa học
export const updateCourseApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(
    `/course/instructor/course/${id}`,
    payload,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// 🧩 6. Xóa khóa học
export const deleteCourseApi = async (id: number) => {
  const response = await axiosClient.delete(`/course/instructor/course/${id}`);
  return response.data;
};

// 🧩 7. Lấy tất cả khóa học của instructor theo Instructor ID
export const getCoursesByInstructorApi = async () => {
  const response = await axiosClient.get(`/course/instructors/me/courses`);
  return response.data;
};

// 🧩 8. Lấy chi tiết khóa học (bao gồm enrollment - yêu cầu user đăng nhập)
export const getCourseDetailWithAuthApi = async (id: number) => {
  const response = await axiosClient.get(`/course/${id}/detail`);
  return response.data;
};

// 🧩 9. Rate a course
export const rateCourseApi = async (
  courseId: number,
  rating: number,
  text: string
) => {
  const response = await axiosClient.post(`/course/${courseId}/rating`, {
    rating,
    text,
  });
  return response.data;
};

// 🧩 10. Increase course view
export const increaseCourseViewApi = async (courseId: number) => {
  const response = await axiosClient.post(`/course/${courseId}/view`);
  return response.data;
};
