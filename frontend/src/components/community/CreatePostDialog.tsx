"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Video, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RichTextEditor from "../RichTextEditor";
import { uploadMedia } from "@/store/api/cloudinary.api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { createPost } from "@/store/slice/postSlice";
import { toast } from "sonner";

interface CreatePostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userAvatar?: string;
  userName?: string;
}

export default function CreatePostDialog({
  open,
  onOpenChange,
  userAvatar,
  userName,
}: CreatePostDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<
    { url: string; type: "IMAGE" | "VIDEO" }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadMedia({ file, type: "image" })
      );
      const results = await Promise.all(uploadPromises);

      const newMedia = results.map((res) => ({
        url: res.secure_url || res.url,
        type: "IMAGE" as const,
      }));

      setMedia((prev) => [...prev, ...newMedia]);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải ảnh lên");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const handleUploadVideo = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = Array.from(files).map((file) =>
        uploadMedia({ file, type: "video" })
      );
      const results = await Promise.all(uploadPromises);

      const newMedia = results.map((res) => ({
        url: res.secure_url,
        type: "VIDEO" as const,
      }));

      setMedia((prev) => [...prev, ...newMedia]);
    } catch (error) {
      console.error(error);
      toast.error("Lỗi khi tải video lên");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleCreatePost = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await dispatch(createPost({ content, media })).unwrap();
      setContent("");
      setMedia([]);
      onOpenChange(false);
      toast.success("Bài viết đã được tạo thành công!");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Lỗi khi tạo bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tạo bài viết mới</DialogTitle>
        </DialogHeader>

        <div className="my-4">
          <RichTextEditor value={content} onChange={setContent} />
        </div>

        {/* Media Previews */}
        {media.length > 0 && (
          <div className="grid grid-cols-3 gap-2 mb-4">
            {media.map((item, index) => (
              <div
                key={index}
                className="relative group bg-gray-100 rounded-md overflow-hidden aspect-square"
              >
                {item.type === "IMAGE" ? (
                  <Image
                    src={item.url}
                    alt="Upload preview"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <video
                    src={item.url}
                    className="w-full h-full object-cover"
                    controls
                  />
                )}
                <button
                  onClick={() => removeMedia(index)}
                  className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1 hover:bg-red-500 transition-colors"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center border-t pt-4">
          <div className="flex gap-4">
            {/* Image Upload Trigger */}
            <div>
              <input
                type="file"
                id="image-upload"
                accept="image/*"
                multiple
                onChange={handleUploadImage}
                className="hidden"
                disabled={isUploading}
              />
              <label
                htmlFor="image-upload"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-600 cursor-pointer transition-colors ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ImageIcon size={20} />
                <span className="text-sm font-medium">Ảnh</span>
              </label>
            </div>

            {/* Video Upload Trigger */}
            <div>
              <input
                type="file"
                id="video-upload"
                accept="video/*"
                multiple
                onChange={handleUploadVideo}
                className="hidden"
                disabled={isUploading}
              />
              <label
                htmlFor="video-upload"
                className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer transition-colors ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Video size={20} />
                <span className="text-sm font-medium">Video</span>
              </label>
            </div>

            {isUploading && (
              <span className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                Đang tải lên...
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploading}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCreatePost}
              disabled={!content.trim() || isSubmitting || isUploading}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Đang đăng..." : "Đăng bài"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
