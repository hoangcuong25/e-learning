"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Image as ImageIcon, Video, X, Loader2 } from "lucide-react";
import RichTextEditor from "@/components/RichTextEditor";
import { uploadMedia } from "@/store/api/common/cloudinary.api";
import { useDispatch } from "react-redux";
import type { AppDispatch } from "@/store";
import { updatePost } from "@/store/slice/community/postSlice";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface EditPostDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: any;
}

export default function EditPostDialog({
  open,
  onOpenChange,
  post,
}: EditPostDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [media, setMedia] = useState<
    { url: string; type: "IMAGE" | "VIDEO" }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    if (open && post) {
      setContent(post.content);
      setMedia(post.media || []);
    }
  }, [open, post]);

  const isSharedPost = post?.type === "SHARE";

  const handleUploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setIsUploading(true);
    try {
      const results = await Promise.all(
        Array.from(files).map((file) => uploadMedia({ file, type: "image" }))
      );
      setMedia((prev) => [
        ...prev,
        ...results.map((res) => ({
          url: res.secure_url || res.url,
          type: "IMAGE" as const,
        })),
      ]);
    } catch {
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
      const results = await Promise.all(
        Array.from(files).map((file) => uploadMedia({ file, type: "video" }))
      );
      setMedia((prev) => [
        ...prev,
        ...results.map((res) => ({
          url: res.secure_url,
          type: "VIDEO" as const,
        })),
      ]);
    } catch {
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
      const payload = isSharedPost ? { content } : { content, media };
      await dispatch(updatePost({ id: post.id, payload })).unwrap();
      toast.success("Cập nhật bài viết thành công!");
      onOpenChange(false);
    } catch {
      toast.error("Lỗi khi cập nhật bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
          <h2 className="text-lg font-black text-slate-100 tracking-tight">
            Chỉnh sửa bài viết
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto flex-1">
          <div className="mb-4">
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {!isSharedPost && media.length > 0 && (
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center px-5 py-4 border-t border-slate-800 bg-slate-900/80 rounded-b-2xl shrink-0">
          <div className="flex gap-3">
            {!isSharedPost && (
              <>
                <div>
                  <input
                    type="file"
                    id="edit-image-upload"
                    accept="image/*"
                    multiple
                    onChange={handleUploadImage}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="edit-image-upload"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-emerald-400 hover:bg-emerald-500/10 cursor-pointer transition-colors ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ImageIcon size={16} />
                    <span>Ảnh</span>
                  </label>
                </div>
                <div>
                  <input
                    type="file"
                    id="edit-video-upload"
                    accept="video/*"
                    multiple
                    onChange={handleUploadVideo}
                    className="hidden"
                    disabled={isUploading}
                  />
                  <label
                    htmlFor="edit-video-upload"
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 cursor-pointer transition-colors ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Video size={16} />
                    <span>Video</span>
                  </label>
                </div>
              </>
            )}
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
              className="inline-flex items-center gap-2 px-5 py-2 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-indigo-600/20 disabled:opacity-50 disabled:cursor-not-allowed min-w-[100px] justify-center"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Đang lưu...
                </>
              ) : (
                "Cập nhật"
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
