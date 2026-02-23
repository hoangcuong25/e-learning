import axiosClient from "@/lib/axiosClient";

// 🧩 1. Follow a user
export const followUserApi = async (id: number) => {
  const response = await axiosClient.post(`/community/follow/${id}`);
  return response.data;
};

// 🧩 2. Unfollow a user
export const unfollowUserApi = async (id: number) => {
  const response = await axiosClient.delete(`/community/follow/${id}`);
  return response.data;
};

// 🧩 3. Get followers of a user
export const getFollowersApi = async (id: number, params?: any) => {
  const response = await axiosClient.get(`/community/follow/${id}/followers`, {
    params,
  });
  return response.data;
};

// 🧩 4. Get who a user is following
export const getFollowingApi = async (id: number, params?: any) => {
  const response = await axiosClient.get(`/community/follow/${id}/following`, {
    params,
  });
  return response.data;
};

// 🧩 5. Check if current user is following target user
export const isFollowingApi = async (id: number) => {
  const response = await axiosClient.get(
    `/community/follow/${id}/is-following`
  );
  return response.data;
};

// 🧩 6. Get follow suggestions
export const getFollowSuggestionsApi = async (params?: any) => {
  const response = await axiosClient.get("/community/follow/suggestions", {
    params,
  });
  return response.data;
};
