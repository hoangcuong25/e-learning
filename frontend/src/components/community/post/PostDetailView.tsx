"use client";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  ArrowLeft,
  X,
} from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

dayjs.extend(relativeTime);
dayjs.locale("vi");

import type { AppDispatch, RootState } from "@/store";
import {
  toggleLikePost,
  sharePost,
  deletePost,
} from "@/store/slice/community/postSlice";
import { toast } from "sonner";
import CommentSection from "../comment/CommentSection";
import PostActions from "./PostActions";
import EditPostDialog from "./EditPostDialog";

interface PostDetailViewProps {
  post: any;
}

export default function PostDetailView({ post }: PostDetailViewProps) {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user } = useSelector((state: RootState) => state.user);

  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [shareCaption, setShareCaption] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const handleLike = (id: number) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thực hiện hành động này");
      return;
    }
    dispatch(toggleLikePost(id));
  };

  const handleShare = () => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để chia sẻ bài viết");
      return;
    }
    setShareDialogOpen(true);
  };

  const confirmShare = async () => {
    try {
      await dispatch(
        sharePost({ id: post.id, content: shareCaption })
      ).unwrap();
      toast.success("Đã chia sẻ bài viết thành công");
      setShareDialogOpen(false);
      setShareCaption("");
    } catch (error) {
      toast.error("Không thể chia sẻ bài viết");
    }
  };

  const handleEditPost = (post: any) => {
    setEditingPost(post);
    setEditDialogOpen(true);
  };

  const handleDeletePost = async (post: any) => {
    try {
      await dispatch(deletePost(post.id)).unwrap();
      toast.success("Đã xóa bài viết");
      router.push("/community");
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  if (!post) return null;

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-2">
        <button
          onClick={() => router.back()}
          className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all shadow-lg"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-black text-white tracking-tight">Chi tiết bài viết</h1>
      </div>

      <motion.article
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-slate-900 rounded-3xl border border-slate-800 shadow-2xl overflow-hidden"
      >
        {/* Post Header */}
        <div className="flex items-center justify-between px-6 pt-6">
          <div
            className="flex items-center gap-4 cursor-pointer group"
            onClick={() => router.push(`/community/user/${post.author?.id}`)}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 overflow-hidden relative flex-shrink-0">
              {post.author?.avatar ? (
                <Image
                  src={post.author.avatar}
                  alt={post.author.fullname || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-lg">
                  {post.author?.fullname?.[0] || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="font-black text-slate-100 text-base group-hover:text-indigo-400 transition-colors">
                {post.author?.fullname || "Người dùng ẩn danh"}
              </p>
              <p className="text-xs text-slate-500 font-medium">
                {post.createdAt ? dayjs(post.createdAt).fromNow() : "Vừa xong"}
              </p>
            </div>
          </div>
          <PostActions
            post={post}
            currentUser={user}
            onEdit={handleEditPost}
            onDelete={handleDeletePost}
          />
        </div>

        {/* Content */}
        <div className="px-6 pt-6 pb-4">
          <div
            className="prose prose-invert prose-md max-w-none text-slate-200 leading-relaxed text-lg"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
        </div>

        {/* Shared Post content if type === SHARE */}
        {post.type === "SHARE" && post.originalPost && (
          <div className="mx-6 mb-4">
            <div
              className="border border-slate-800 rounded-2xl overflow-hidden hover:border-indigo-500/40 transition-all cursor-pointer bg-slate-800/30 group/shared"
              onClick={() => router.push(`/community/post/${post.originalPost.id}`)}
            >
              <div className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-8 rounded-xl bg-indigo-600/20 overflow-hidden relative border border-indigo-500/30 flex-shrink-0">
                    {post.originalPost.author?.avatar ? (
                      <Image
                        src={post.originalPost.author.avatar}
                        alt={post.originalPost.author.fullname || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xs font-bold">
                        {post.originalPost.author?.fullname?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-bold text-slate-200 text-sm group-hover/shared:text-indigo-400 transition-colors">
                      {post.originalPost.author?.fullname || "Người dùng ẩn danh"}
                    </p>
                    <p className="text-[10px] text-slate-500">
                      {post.originalPost.createdAt
                        ? dayjs(post.originalPost.createdAt).fromNow()
                        : "Vừa xong"}
                    </p>
                  </div>
                </div>
                <div
                  className="prose prose-invert prose-sm max-w-none text-slate-400 text-base"
                  dangerouslySetInnerHTML={{ __html: post.originalPost.content }}
                />
              </div>

              {post.originalPost.media && post.originalPost.media.length > 0 && (
                <div
                  className={`grid gap-1 ${
                    post.originalPost.media.length === 1
                      ? "grid-cols-1"
                      : "grid-cols-2"
                  }`}
                >
                  {post.originalPost.media.slice(0, 4).map((media: any, index: number) => (
                    <div
                      key={index}
                      className="relative aspect-video bg-slate-800"
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
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Media */}
        {post.media && post.media.length > 0 && (
          <div
            className={`mx-6 mb-6 grid gap-3 rounded-2xl overflow-hidden ${
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
                className="relative aspect-video bg-slate-800 rounded-2xl overflow-hidden cursor-zoom-in"
              >
                {media.type === "IMAGE" ? (
                  <Image
                    src={media.url}
                    alt="Post media"
                    fill
                    className="object-cover hover:scale-105 transition-transform duration-700"
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

        {/* Action Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-black transition-all duration-300 ${
                post.isLiked
                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "text-slate-400 hover:text-white hover:bg-slate-800"
              }`}
            >
              <Heart
                size={20}
                className={post.isLiked ? "fill-current" : ""}
              />
              <span>{post._count?.likes || 0}</span>
            </button>

            <div className="flex items-center gap-2.5 px-4 py-2.5 rounded-2xl text-sm font-black text-indigo-400 bg-indigo-500/10">
              <MessageCircle size={20} />
              <span>{post._count?.comments || 0}</span>
            </div>
          </div>

          <button
            onClick={handleShare}
            className="flex items-center gap-2.5 px-5 py-2.5 rounded-2xl text-sm font-black text-slate-400 hover:text-white hover:bg-slate-800 transition-all duration-300"
          >
            <Share2 size={20} />
            <span className="hidden sm:inline">Chia sẻ</span>
          </button>
        </div>

        {/* Comment Section Integration */}
        <div className="px-6 pb-8 pt-2 border-t border-slate-800/50">
          <CommentSection postId={post.id} isExpanded={true} />
        </div>
      </motion.article>

      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-[60] p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-8 space-y-6 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-black text-slate-100 tracking-tight">
                Chia sẻ bài viết
              </h3>
              <button
                onClick={() => {
                  setShareDialogOpen(false);
                  setShareCaption("");
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Thêm lời nhắn (Không bắt buộc)
              </label>
              <textarea
                value={shareCaption}
                onChange={(e) => setShareCaption(e.target.value)}
                placeholder="Cùng chia sẻ suy nghĩ của bạn về bài viết này..."
                className="w-full px-5 py-4 bg-slate-800/50 border border-slate-700 text-slate-200 placeholder:text-slate-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500/40 focus:border-indigo-500/40 resize-none transition-all text-sm leading-relaxed"
                rows={4}
              />
            </div>

            <div className="flex gap-4 justify-end pt-2">
              <button
                onClick={() => {
                  setShareDialogOpen(false);
                  setShareCaption("");
                }}
                className="px-6 py-3 text-xs font-black text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-2xl transition-all uppercase tracking-widest"
              >
                Hủy bỏ
              </button>
              <button
                onClick={confirmShare}
                className="px-8 py-3 text-xs font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-2xl transition-all shadow-xl shadow-indigo-600/20 uppercase tracking-widest"
              >
                Chia sẻ ngay
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Edit Dialog */}
      <EditPostDialog
        open={editDialogOpen}
        onOpenChange={(open) => {
          setEditDialogOpen(open);
          if (!open) setEditingPost(null);
        }}
        post={editingPost}
      />
    </div>
  );
}
