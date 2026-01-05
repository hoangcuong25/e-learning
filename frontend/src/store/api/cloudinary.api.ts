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

export async function getSignature(folder: string = "videos") {
  const res = await axiosClient.get("cloudinary/signature?folder=" + folder);

  return res.data.data;
}

export async function uploadVideo(file: File) {
  const { timestamp, signature, apiKey, cloudName, folder } =
    await getSignature("videos");

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", folder);

  // Gửi trực tiếp lên Cloudinary 
  const upload = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!upload.ok) throw new Error("Failed to upload video");

  return upload.json();
}
