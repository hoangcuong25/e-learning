"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { Send, Image as ImageIcon, Video, X } from "lucide-react";

import banner from "@public/elearning-banner.png";
import type { RootState, AppDispatch } from "@/store";
import { fetchUser } from "@/store/slice/userSlice";
import { createPost } from "@/store/slice/postSlice";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import RichTextEditor from "../RichTextEditor";
import { Button } from "@/components/ui/button";
import { uploadMedia } from "@/store/api/cloudinary.api";

export default function CommunityGate() {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [media, setMedia] = useState<
    { url: string; type: "IMAGE" | "VIDEO" }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

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
      setIsOpen(false);
      toast.success("Bài viết đã được tạo thành công!");
    } catch (error) {
      console.error("Failed to create post:", error);
      toast.error("Lỗi khi tạo bài viết");
    } finally {
      setIsSubmitting(false);
    }
  };

  // ⏳ Đang check login
  if (loading) return null;

  // 🔓 ĐÃ ĐĂNG NHẬP → HIỂN THỊ CREATE POST
  if (user) {
    return (
      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-3">
            Chào {user.fullname} 👋
          </p>
          <div className="flex gap-2">
            <div
              onClick={() => setIsOpen(true)}
              className="flex-1 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              Bạn đang nghĩ gì thế?
            </div>  
          </div>
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
                  onClick={() => setIsOpen(false)}
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
      </section>
    );
  }

  // 🔒 CHƯA ĐĂNG NHẬP → HIỂN THỊ HERO
  return (
    <section className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-3xl overflow-hidden shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cộng đồng EduSmart
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            Dòng thời gian học tập – nơi học viên và giảng viên chia sẻ kiến
            thức.
          </p>

          <div className="flex gap-4">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
            >
              Tham gia ngay
            </Link>
            <Link
              href="/login"
              className="border border-white/70 px-6 py-3 rounded-lg font-semibold"
            >
              Đăng nhập
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src={banner}
            alt="Community Banner"
            width={520}
            height={360}
            className="rounded-2xl shadow-xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
