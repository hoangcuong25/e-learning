"use client";

import { useState } from "react";
import Image from "next/image";
import { Image as ImageIcon, Video, X, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadMedia } from "@/store/api/common/cloudinary.api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { createPost, fetchAllPosts } from "@/store/slice/community/postSlice";
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
        uploadMedia({ file, type: "image" }),
      );
      const results = await Promise.all(uploadPromises);
      const newMedia = results.map((res) => ({
        url: res.secure_url || res.url,
        type: "IMAGE" as const,
      }));
      setMedia((prev) => [...prev, ...newMedia]);
    } catch (error) {
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
        uploadMedia({ file, type: "video" }),
      );
      const results = await Promise.all(uploadPromises);
      const newMedia = results.map((res) => ({
        url: res.secure_url,
        type: "VIDEO" as const,
      }));
      setMedia((prev) => [...prev, ...newMedia]);
    } catch (error) {
      toast.error("Lỗi khi tải video lên");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const removeMedia = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      await dispatch(createPost({ content, media })).unwrap();
      await dispatch(fetchAllPosts({})).unwrap();
      toast.success("Bài viết đã được tạo thành công!");
      setContent("");
      setMedia([]);
      onOpenChange(false);
    } catch (error) {
      toast.error("Lỗi khi tạo bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto bg-slate-900 border border-slate-800 text-slate-100 shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-slate-100 font-black tracking-tight text-lg">
            Tạo bài viết mới
          </DialogTitle>
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
                className="relative group bg-slate-800 rounded-xl overflow-hidden aspect-square border border-slate-700"
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
                  className="absolute top-1.5 right-1.5 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X size={12} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center border-t border-slate-800 pt-4">
          <div className="flex gap-3">
            {/* Image Upload */}
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 cursor-pointer transition-colors ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <ImageIcon size={16} />
                <span>Ảnh</span>
              </label>
            </div>

            {/* Video Upload */}
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
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors ${
                  isUploading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <Video size={16} />
                <span>Video</span>
              </label>
            </div>

            {isUploading && (
              <span className="flex items-center gap-2 text-sm text-slate-500 animate-pulse">
                <Loader2 size={14} className="animate-spin" />
                Đang tải lên...
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 text-sm font-black text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl uppercase tracking-widest transition-all disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting || isUploading}
              className="px-5 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 size={14} className="animate-spin" />
                  Đang xử lý...
                </span>
              ) : (
                "Đăng bài"
              )}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
