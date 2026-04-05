"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  X,
} from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { motion } from "framer-motion";

dayjs.extend(relativeTime);
dayjs.locale("vi");

import type { AppDispatch, RootState } from "@/store";
import {
  fetchAllPosts,
  toggleLikePost,
  sharePost,
  deletePost,
} from "@/store/slice/community/postSlice";
import { toast } from "sonner";
import CommentSection from "../comment/CommentSection";
import PostActions from "./PostActions";
import EditPostDialog from "./EditPostDialog";

import { useSearchParams, useRouter } from "next/navigation";

export default function CommunityFeed() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { posts, loading } = useSelector((state: RootState) => state.post);
  const { user } = useSelector((state: RootState) => state.user);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);

  const [sharePostId, setSharePostId] = useState<number | null>(null);
  const [shareCaption, setShareCaption] = useState("");

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const view = searchParams.get("view");

  useEffect(() => {
    if (view === "my_posts" && user) {
      dispatch(fetchAllPosts({ authorId: user.id }));
      return;
    }
    dispatch(fetchAllPosts({}));
  }, [dispatch, view, user]);

  const handleLike = (id: number) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thực hiện hành động này");
      return;
    }
    dispatch(toggleLikePost(id));
  };



  const handleShare = (postId: number) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để chia sẻ bài viết");
      return;
    }
    setSharePostId(postId);
    setShareDialogOpen(true);
  };

  const confirmShare = async () => {
    if (sharePostId === null) return;
    try {
      await dispatch(
        sharePost({ id: sharePostId, content: shareCaption })
      ).unwrap();
      await dispatch(fetchAllPosts({})).unwrap();
      toast.success("Đã chia sẻ bài viết thành công");
      setShareDialogOpen(false);
      setShareCaption("");
      setSharePostId(null);
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
    } catch (error) {
      toast.error("Lỗi khi xóa bài viết");
    }
  };

  if (loading && posts.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl p-10 text-center border border-slate-800 shadow-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500 mx-auto mb-3" />
        <p className="text-slate-500 text-sm font-medium">
          Đang tải bảng tin...
        </p>
      </div>
    );
  }

  if (!loading && posts.length === 0) {
    return (
      <div className="bg-slate-900 rounded-2xl p-12 text-center border-2 border-dashed border-slate-800 shadow-lg">
        <div className="w-16 h-16 bg-indigo-600/10 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <MessageCircle className="w-8 h-8 text-indigo-500/50" />
        </div>
        <p className="text-slate-400 font-semibold">
          Chưa có bài viết nào.
        </p>
        <p className="text-slate-600 text-sm mt-1">
          Hãy là người đầu tiên chia sẻ!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {posts.map((post, idx) => (
        <motion.article
          key={post.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.05, duration: 0.4 }}
          className="bg-slate-900 rounded-2xl border border-slate-800 shadow-lg overflow-hidden hover:border-slate-700 transition-all duration-300"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5">
            <div
              className="flex items-center gap-3 cursor-pointer group"
              onClick={() => router.push(`/community/user/${post.author?.id}`)}
            >
              <div className="w-10 h-10 rounded-full bg-indigo-600/20 border border-indigo-500/30 overflow-hidden relative flex-shrink-0">
                {post.author?.avatar ? (
                  <Image
                    src={post.author.avatar}
                    alt={post.author.fullname || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white font-bold text-sm">
                    {post.author?.fullname?.[0] || "U"}
                  </div>
                )}
              </div>
              <div>
                <p className="font-bold text-slate-100 text-sm group-hover:text-indigo-400 transition-colors">
                  {post.author?.fullname || "Người dùng ẩn danh"}
                </p>
                <p className="text-xs text-slate-500">
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
          <div
            className="px-5 pt-4 pb-2 cursor-pointer group/content"
            onClick={() => router.push(`/community/post/${post.id}`)}
          >
            <div
              className={`prose prose-invert prose-sm max-w-none text-slate-300 leading-relaxed group-hover/content:text-slate-100 transition-colors ${
                post.type === "SHARE" ? "mb-1" : ""
              }`}
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </div>


          {/* Shared Post */}
          {post.type === "SHARE" && post.originalPost && (
            <div className="mx-5 mb-3">
              <div
                className="border border-slate-700 rounded-xl overflow-hidden hover:border-indigo-500/40 transition-colors cursor-pointer bg-slate-800/50"
                onClick={() =>
                  router.push(`/community/post/${post.originalPost.id}`)
                }
              >
                <div className="p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-7 h-7 rounded-full bg-indigo-600/20 overflow-hidden relative border border-indigo-500/30 flex-shrink-0">
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
                      <p className="font-bold text-slate-200 text-xs">
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
                    className="prose prose-invert prose-xs max-w-none text-slate-400 line-clamp-3 text-sm"
                    dangerouslySetInnerHTML={{ __html: post.originalPost.content }}
                  />
                </div>

                {post.originalPost.media && post.originalPost.media.length > 0 && (
                  <div
                    className={`grid gap-0.5 ${
                      post.originalPost.media.length === 1
                        ? "grid-cols-1"
                        : "grid-cols-2"
                    }`}
                  >
                    {post.originalPost.media
                      .slice(0, 4)
                      .map((media: any, index: number) => (
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
                              controls
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
              className={`mx-5 mb-3 grid gap-1.5 rounded-xl overflow-hidden ${
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
                  className="relative aspect-video bg-slate-800 rounded-xl overflow-hidden"
                >
                  {media.type === "IMAGE" ? (
                    <Image
                      src={media.url}
                      alt="Post media"
                      fill
                      className="object-cover hover:scale-105 transition-transform duration-500"
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
          <div className="flex items-center justify-between px-5 py-3 border-t border-slate-800 mt-1">
            <button
              onClick={() => handleLike(post.id)}
              className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                post.isLiked
                  ? "text-red-400 bg-red-500/10 hover:bg-red-500/20"
                  : "text-slate-500 hover:text-slate-300 hover:bg-slate-800"
              }`}
            >
              <Heart
                size={16}
                className={post.isLiked ? "fill-current" : ""}
              />
              <span>{post._count?.likes || 0}</span>
            </button>

            <button
              onClick={() => router.push(`/community/post/${post.id}`)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-200"
            >
              <MessageCircle size={16} />
              <span>{post._count?.comments || 0}</span>
            </button>


            <button
              onClick={() => handleShare(post.id)}
              className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-300 hover:bg-slate-800 transition-all duration-200"
            >
              <Share2 size={16} />
              <span>Chia sẻ</span>
            </button>
          </div>


        </motion.article>
      ))}

      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-black text-slate-100 tracking-tight">
                Chia sẻ bài viết
              </h3>
              <button
                onClick={() => {
                  setShareDialogOpen(false);
                  setShareCaption("");
                  setSharePostId(null);
                }}
                className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black text-slate-400 uppercase tracking-[0.15em]">
                Thêm lời nhắn (không bắt buộc)
              </label>
              <textarea
                value={shareCaption}
                onChange={(e) => setShareCaption(e.target.value)}
                placeholder="Bạn nghĩ gì về bài viết này?"
                className="w-full px-4 py-3 bg-slate-800 border border-slate-700 text-slate-200 placeholder:text-slate-500 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 resize-none transition-all"
                rows={4}
              />
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShareDialogOpen(false);
                  setShareCaption("");
                  setSharePostId(null);
                }}
                className="px-5 py-2.5 text-sm font-black text-slate-400 hover:text-slate-200 bg-slate-800 hover:bg-slate-700 rounded-xl transition-all uppercase tracking-widest"
              >
                Hủy
              </button>
              <button
                onClick={confirmShare}
                className="px-5 py-2.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl transition-all shadow-lg shadow-indigo-600/20 uppercase tracking-widest"
              >
                Chia sẻ
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
