import axiosClient from "@/lib/axiosClient";

export const upload = async (file: any) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axiosClient.post("/cloudinary/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};
