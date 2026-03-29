"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Flag,
  Copy,
  X,
} from "lucide-react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";

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
  const [expandedComments, setExpandedComments] = useState<Set<number>>(
    new Set()
  );
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const [sharePostId, setSharePostId] = useState<number | null>(null);
  const [shareCaption, setShareCaption] = useState("");

  // Edit State
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<any | null>(null);

  const view = searchParams.get("view");

  useEffect(() => {
    // My posts
    if (view === "my_posts" && user) {
      dispatch(fetchAllPosts({ authorId: user.id }));
      return;
    }

    // Default fetch
    dispatch(fetchAllPosts({}));
  }, [dispatch, view, user]);

  const handleLike = (id: number) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để thực hiện hành động này");
      return;
    }
    dispatch(toggleLikePost(id));
  };

  const toggleComments = (postId: number) => {
    setExpandedComments((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
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
            <div
              className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => router.push(`/community/user/${post.author?.id}`)}
            >
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
            <PostActions
              post={post}
              currentUser={user}
              onEdit={handleEditPost}
              onDelete={handleDeletePost}
            />
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

          {/* Shared Post Content */}
          {post.type === "SHARE" && post.originalPost && (
            <div
              className="mt-3 border border-gray-200 rounded-xl overflow-hidden hover:border-blue-200 transition-colors cursor-pointer"
              onClick={() =>
                router.push(`/community/post/${post.originalPost.id}`)
              }
            >
              <div className="p-4 bg-gray-50/50">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden relative">
                    {post.originalPost.author?.avatar ? (
                      <Image
                        src={post.originalPost.author.avatar}
                        alt={post.originalPost.author.fullname || "User"}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xs font-bold">
                        {post.originalPost.author?.fullname?.[0] || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">
                      {post.originalPost.author?.fullname ||
                        "Người dùng ẩn danh"}
                    </p>
                    <p className="text-xs text-gray-500">
                      {post.originalPost.createdAt
                        ? dayjs(post.originalPost.createdAt).fromNow()
                        : "Vừa xong"}
                    </p>
                  </div>
                </div>

                <div className="text-gray-700 text-sm">
                  <div
                    className="prose max-w-none line-clamp-3"
                    dangerouslySetInnerHTML={{
                      __html: post.originalPost.content,
                    }}
                  />
                </div>
              </div>

              {/* Original Post Media */}
              {post.originalPost.media &&
                post.originalPost.media.length > 0 && (
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
                          className="relative aspect-video bg-gray-100"
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
          )}

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

            <button
              onClick={() => toggleComments(post.id)}
              className={`flex items-center gap-2 px-2 py-1 rounded-lg transition-colors ${
                expandedComments.has(post.id)
                  ? "text-blue-600 bg-blue-50"
                  : "hover:text-blue-600 hover:bg-blue-50"
              }`}
            >
              <MessageCircle size={18} />
              <span>{post._count?.comments || 0}</span>
            </button>

            <button
              onClick={() => handleShare(post.id)}
              className="flex items-center gap-2 px-2 py-1 rounded-lg hover:text-blue-600 hover:bg-blue-50 transition-colors"
            >
              <Share2 size={18} />
              <span>Chia sẻ</span>
            </button>
          </div>

          {/* Comment Section */}
          {expandedComments.has(post.id) && (
            <CommentSection postId={post.id} isExpanded={true} />
          )}
        </article>
      ))}

      {/* Share Dialog */}
      {shareDialogOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-semibold text-gray-800">
                Chia sẻ bài viết
              </h3>
              <button
                onClick={() => {
                  setShareDialogOpen(false);
                  setShareCaption("");
                  setSharePostId(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Thêm lời nhắn (không bắt buộc)
              </label>
              <textarea
                value={shareCaption}
                onChange={(e) => setShareCaption(e.target.value)}
                placeholder="Bạn nghĩ gì về bài viết này?"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
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
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmShare}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Chia sẻ
              </button>
            </div>
          </div>
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
