import axiosClient from "@/lib/axiosClient";

export const createRatingApi = async (data: any) => {
  const response = await axiosClient.post("/rating", data);
  return response.data;
};

export const getRatingsApi = async (params: any) => {
  const response = await axiosClient.get("/rating", { params });
  return response.data;
};

export const getRatingDetailApi = async (id: number) => {
  const response = await axiosClient.get(`/rating/${id}`);
  return response.data;
};

export const updateRatingApi = async (id: number, data: any) => {
  const response = await axiosClient.patch(`/rating/${id}`, data);
  return response.data;
};

export const deleteRatingApi = async (id: number) => {
  const response = await axiosClient.delete(`/rating/${id}`);
  return response.data;
};
