import axiosClient from "@/lib/axiosClient";

export type ApplyInstructorPayload = {
  specializationIds: number[];
  experience?: string;
  bio?: string;
};

/**
 * 📨 Gửi đơn đăng ký trở thành giảng viên
 */
export const applyInstructorApi = async (
  userId: number,
  payload: ApplyInstructorPayload
) => {
  try {
    const response = await axiosClient.post(
      `/instructor/instructor-application`,
      payload
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 🧾 Lấy danh sách tất cả đơn đăng ký giảng viên (ADMIN)
 */
export const getAllInstructorApplicationsApi = async () => {
  try {
    const response = await axiosClient.get(
      `/instructor/instructor-applications`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 🔍 Lấy chi tiết đơn đăng ký giảng viên theo User ID
 */
export const getInstructorApplicationByUserIdApi = async (userId: number) => {
  try {
    const response = await axiosClient.get(
      `/instructor/instructor-application/${userId}`
    );
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ✅ Admin duyệt đơn đăng ký giảng viên
 */
export const approveInstructorApi = async (
  userId: number,
  applicationId: number
) => {
  try {
    const response = await axiosClient.patch(`/instructor/approve-instructor`, {
      applicationId,
      userId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ❌ Admin từ chối đơn đăng ký giảng viên
 */
export const rejectInstructorApi = async (
  userId: number,
  applicationId: number
) => {
  try {
    const response = await axiosClient.patch(`/instructor/reject-instructor`, {
      userId,
      applicationId,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
