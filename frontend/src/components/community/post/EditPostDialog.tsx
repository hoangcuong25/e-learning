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

  // Load post data when dialog opens
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

  const handleSubmit = async () => {
    if (!content.trim()) return;
    setIsSubmitting(true);
    try {
      // For shared posts, we don't send media updates, only content
      const payload = isSharedPost ? { content } : { content, media };

      await dispatch(updatePost({ id: post.id, payload })).unwrap();

      toast.success("Cập nhật bài viết thành công!");
      onOpenChange(false);
    } catch (error) {
      console.error("Failed to update post:", error);
      toast.error("Lỗi khi cập nhật bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white rounded-xl shadow-xl animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b shrink-0">
          <h2 className="text-lg font-semibold text-gray-900">
            Chỉnh sửa bài viết
          </h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-1 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="mb-4">
            <RichTextEditor value={content} onChange={setContent} />
          </div>

          {/* Media Previews - Only for normal posts */}
          {!isSharedPost && media.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mb-4">
              {media.map((item, index) => (
                <div
                  key={index}
                  className="relative group bg-gray-100 rounded-lg overflow-hidden aspect-square"
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
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center p-4 border-t bg-gray-50 rounded-b-xl shrink-0">
          <div className="flex gap-4">
            {/* Upload Triggers - Only for normal posts */}
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-green-50 text-green-600 cursor-pointer transition-colors ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <ImageIcon size={20} />
                    <span className="text-sm font-medium">Ảnh</span>
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
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 text-red-600 cursor-pointer transition-colors ${
                      isUploading ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    <Video size={20} />
                    <span className="text-sm font-medium">Video</span>
                  </label>
                </div>
              </>
            )}

            {isUploading && (
              <span className="flex items-center gap-2 text-sm text-gray-500 animate-pulse">
                Đang tải lên...
              </span>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting || isUploading}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Hủy
            </button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || isSubmitting || isUploading}
              className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors min-w-[100px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                "Cập nhật"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
