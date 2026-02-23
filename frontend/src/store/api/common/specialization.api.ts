import axiosClient from "@/lib/axiosClient";

export type CreateSpecializationPayload = {
  name: string;
  desc: string;
};

export type UpdateSpecializationPayload = {
  name?: string;
  desc?: string;
};

/**
 * 🧾 Lấy danh sách tất cả chuyên ngành
 */
export const getAllSpecializationsApi = async () => {
  try {
    const response = await axiosClient.get("/specialization");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 🔍 Lấy chi tiết chuyên ngành theo ID
 */
export const getSpecializationByIdApi = async (id: number) => {
  try {
    const response = await axiosClient.get(`/specialization/${id}`);
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

/**
 * ➕ Tạo chuyên ngành mới (Admin)
 */
export const createSpecializationApi = async (
  payload: CreateSpecializationPayload
) => {
  try {
    const response = await axiosClient.post("/specialization", payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 📝 Cập nhật chuyên ngành (Admin)
 */
export const updateSpecializationApi = async (
  id: number,
  payload: UpdateSpecializationPayload
) => {
  try {
    const response = await axiosClient.patch(`/specialization/${id}`, payload);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 🗑️ Xóa chuyên ngành (Admin)
 */
export const deleteSpecializationApi = async (id: number) => {
  try {
    const response = await axiosClient.delete(`/specialization/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 👨‍🏫 Lấy danh sách chuyên ngành của giảng viên
 */
export const getSpecializationsByInstructorIdApi = async (
  instructorId: number
) => {
  try {
    const response = await axiosClient.get(
      `/specialization/instructor/${instructorId}`
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * 📋 Lấy danh sách chuyên ngành cho admin (có phân trang)
 */
export const getSpecializationsForAdminApi = async (params: {
  page?: number;
  limit?: number;
  sortBy?: string;
  order?: "asc" | "desc";
  search?: string;
}) => {
  try {
    const response = await axiosClient.get("/specialization/admin/list", {
      params,
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
