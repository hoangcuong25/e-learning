import { Injectable } from "@nestjs/common";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryResponse } from "./cloudinary-response";

@Injectable()
export class CloudinaryService {
  // ✅ Upload ảnh hoặc video nhỏ
  uploadFile(
    file: Express.Multer.File,
    folder = "uploads",
    resourceType: "auto" | "image" | "video" = "auto"
  ): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: resourceType,
        },
        (error, result) => {
          if (error) return reject(error);
          if (result) return resolve(result);
          reject(new Error("Upload result is undefined"));
        }
      );
      const streamifier = require("streamifier");
      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }

  // ✅ Upload video lớn (chunked upload)
  async uploadLargeVideo(
    file: Express.Multer.File,
    folder = "videos"
  ): Promise<CloudinaryResponse> {
    if (!file.path)
      throw new Error(
        "File path is missing (use diskStorage for large videos)"
      );

    return cloudinary.uploader.upload_large(file.path, {
      resource_type: "video",
      folder,
      chunk_size: 20_000_000, // 20MB mỗi chunk
      timeout: 600000, // 10 phút
    });
  }
}
