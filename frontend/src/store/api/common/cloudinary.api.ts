import axiosClient from "@/lib/axiosClient";

export async function getSignature(folder: string = "videos") {
  const res = await axiosClient.get("cloudinary/signature?folder=" + folder);

  return res.data.data;
}

type UploadType = "image" | "video";

interface UploadOptions {
  file: File;
  type: UploadType;
  folder?: string;
}

export async function uploadMedia({ file, type, folder }: UploadOptions) {
  const uploadFolder = folder ?? (type === "video" ? "videos" : "images");

  const { timestamp, signature, apiKey, cloudName } = await getSignature(
    uploadFolder
  );

  const formData = new FormData();
  formData.append("file", file);
  formData.append("api_key", apiKey);
  formData.append("timestamp", timestamp.toString());
  formData.append("signature", signature);
  formData.append("folder", uploadFolder);

  const resourceType = type === "video" ? "video" : "image";

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) {
    throw new Error(`Upload ${type} failed`);
  }

  return res.json();
}
