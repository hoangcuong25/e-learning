"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Flag,
  Copy,
} from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

dayjs.extend(relativeTime);
dayjs.locale("vi");

import type { AppDispatch, RootState } from "@/store";
import { fetchAllPosts, toggleLikePost } from "@/store/slice/postSlice";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function CommunityFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading } = useSelector((state: RootState) => state.post);
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchAllPosts({}));
  }, [dispatch]);

  const handleLike = (id: number) => {
    dispatch(toggleLikePost(id));
  };

  if (loading && posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
        Đang tải bảng tin...
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
        Chưa có bài viết nào. Hãy là người đầu tiên chia sẻ!
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {posts.map((post) => (
        <article
          key={post.id}
          className="bg-white rounded-2xl p-6 shadow-sm space-y-4 hover:shadow-md transition-shadow duration-200"
        >
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden relative">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.fullname || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                    {post.author?.fullname?.[0] || "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {post.author?.fullname || "Người dùng ẩn danh"}
                </p>
                <p className="text-xs text-gray-500">
                  {post.createdAt
                    ? dayjs(post.createdAt).fromNow()
                    : "Vừa xong"}
                </p>
              </div>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="text-gray-400 hover:text-gray-600 outline-none">
                  <MoreHorizontal size={20} />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  onClick={() => {
                    toast.info("Chức năng báo cáo đang được phát triển");
                  }}
                  className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                >
                  <Flag className="mr-2 h-4 w-4" />
                  <span>Báo cáo bài viết</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(
                      `${window.location.origin}/community/post/${post.id}`
                    );
                    toast.success("Đã sao chép liên kết");
                  }}
                  className="cursor-pointer"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  <span>Sao chép liên kết</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Content */}
          <div className="text-gray-700 whitespace-pre-wrap">
            <div
              className="prose max-w-none text-sm"
              dangerouslySetInnerHTML={{
                __html: post.content,
              }}
            />
          </div>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <div
              className={`grid gap-2 mt-4 ${
                post.media.length === 1
                  ? "grid-cols-1"
                  : post.media.length === 2
                  ? "grid-cols-2"
                  : "grid-cols-3"
              }`}
            >
              {post.media.map((media: any, index: number) => (
                <div
                  key={index}
                  className="relative aspect-video rounded-xl overflow-hidden bg-gray-100"
                >
                  {media.type === "IMAGE" ? (
                    <Image
                      src={media.url}
                      alt="Post media"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <video
                      src={media.url}
                      controls
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-4 text-gray-500 text-sm">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${
                post.isLiked
                  ? "text-red-500 hover:bg-red-50"
                  : "hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <Heart size={18} className={post.isLiked ? "fill-current" : ""} />
              <span>{post._count?.likes || 0}</span>
            </button>

            <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <MessageCircle size={18} />
              <span>{post._count?.comments || 0}</span>
            </button>

            <button className="flex items-center gap-2 px-2 py-1 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors">
              <Share2 size={18} />
              <span>Chia sẻ</span>
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
