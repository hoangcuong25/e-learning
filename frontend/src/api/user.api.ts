import axiosClient from "@/lib/axiosClient";

export const getUser = async () => {
  try {
    const response = await axiosClient.get("/user/@me");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
