import axiosClient from "@/lib/axiosClient";

export type CreateCommentPayload = {
  content: string;
  postId: number;
  parentId?: number;
};

export type UpdateCommentPayload = {
  content: string;
};

// 1. Tạo comment mới
export const createCommentApi = async (payload: CreateCommentPayload) => {
  const response = await axiosClient.post("/community/comments", payload);
  return response.data;
};

// 2. Lấy danh sách comment theo post (có phân trang)
export const getCommentsByPostApi = async (
  postId: number,
  params?: PaginationParams
) => {
  const response = await axiosClient.get(
    `/community/posts/${postId}/comments`,
    { params }
  );
  return response.data;
};

// 3. Cập nhật comment
export const updateCommentApi = async (
  id: number,
  payload: UpdateCommentPayload
) => {
  const response = await axiosClient.patch(
    `/community/comments/${id}`,
    payload
  );
  return response.data;
};

// 4. Xóa comment
export const deleteCommentApi = async (id: number) => {
  const response = await axiosClient.delete(`/community/comments/${id}`);
  return response.data;
};
