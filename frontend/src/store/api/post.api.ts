import axiosClient from "@/lib/axiosClient";

// 🧩 1. Lấy tất cả bài viết (có phân trang + filter)
export const getAllPostsApi = async (params?: any) => {
  const response = await axiosClient.get("/community/posts", { params });
  return response.data;
};

// 🧩 2. Lấy chi tiết bài viết theo ID
export const getPostDetailApi = async (id: number) => {
  const response = await axiosClient.get(`/community/posts/${id}`);
  return response.data;
};

// 🧩 3. Tạo bài viết mới
export const createPostApi = async (payload: any) => {
  const response = await axiosClient.post("/community/posts", payload);
  return response.data;
};

// 🧩 4. Cập nhật bài viết
export const updatePostApi = async (id: number, payload: any) => {
  const response = await axiosClient.patch(`/community/posts/${id}`, payload);
  return response.data;
};

// 🧩 5. Xóa bài viết
export const deletePostApi = async (id: number) => {
  const response = await axiosClient.delete(`/community/posts/${id}`);
  return response.data;
};

// 🧩 6. Toggle like bài viết
export const toggleLikePostApi = async (id: number) => {
  const response = await axiosClient.post(`/community/posts/${id}/like`);
  return response.data;
};

// 🧩 7. Chia sẻ bài viết
export const sharePostApi = async (id: number, content?: string) => {
  const response = await axiosClient.post(`/community/posts/${id}/share`, {
    content,
  });
  return response.data;
};
