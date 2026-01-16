import axiosClient from "@/lib/axiosClient";

export const getUser = async () => {
  try {
    const response = await axiosClient.get("/user/@me");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const updateUser = async (data: FormData) => {
  try {
    const response = await axiosClient.patch("/user/profile", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data.data;
  } catch (error) {
    throw error;
  }
};
