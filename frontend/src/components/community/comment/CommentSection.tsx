"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "@/store/slice/community/commentSlice";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { toast } from "sonner";
import { incrementCommentCount } from "@/store/slice/community/postSlice";
import { MessageCircle, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface CommentSectionProps {
  postId: number;
  isExpanded?: boolean;
}

export default function CommentSection({
  postId,
  isExpanded = false,
}: CommentSectionProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { comments, loading } = useSelector(
    (state: RootState) => state.comment
  );
  const { user } = useSelector((state: RootState) => state.user);
  const [showComments, setShowComments] = useState(isExpanded);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<number | null>(null);

  useEffect(() => {
    if (showComments) {
      dispatch(fetchCommentsByPost({ postId }));
    }
  }, [dispatch, postId, showComments]);

  const handleCreateComment = async (content: string, parentId?: number) => {
    if (!user) {
      toast.error("Bạn cần đăng nhập để bình luận");
      return;
    }
    try {
      await dispatch(createComment({ content, postId, parentId })).unwrap();
      dispatch(incrementCommentCount(postId));
      toast.success("Đã thêm bình luận");
      dispatch(fetchCommentsByPost({ postId }));
    } catch (error: any) {
      toast.error(error?.message || "Lỗi khi thêm bình luận");
    }
  };

  const handleReply = async (commentId: number, content: string) => {
    await handleCreateComment(content, commentId);
  };

  const handleEdit = async (commentId: number, content: string) => {
    try {
      await dispatch(updateComment({ id: commentId, payload: { content } })).unwrap();
      toast.success("Đã cập nhật bình luận");
      dispatch(fetchCommentsByPost({ postId }));
    } catch (error: any) {
      toast.error(error?.message || "Lỗi khi cập nhật bình luận");
    }
  };

  const handleDelete = (commentId: number) => {
    setCommentToDelete(commentId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (commentToDelete) {
      try {
        await dispatch(deleteComment(commentToDelete)).unwrap();
        toast.success("Đã xóa bình luận");
        dispatch(fetchCommentsByPost({ postId }));
      } catch (error: any) {
        toast.error(error?.message || "Lỗi khi xóa bình luận");
      } finally {
        setDeleteDialogOpen(false);
        setCommentToDelete(null);
      }
    }
  };

  return (
    <div className="space-y-4 pt-4 border-t border-slate-800">
      {/* Comment Input */}
      <CommentInput
        postId={postId}
        onSubmit={(content) => handleCreateComment(content)}
        userAvatar={user?.avatar}
        userName={user?.fullname}
      />

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="space-y-3">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="flex gap-2.5 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-slate-800 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-14 bg-slate-800 rounded-2xl" />
                <div className="h-2 bg-slate-800 rounded w-20 ml-1" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 text-slate-600">
          <MessageCircle size={24} className="mb-2 opacity-40" />
          <p className="text-xs font-medium">Chưa có bình luận. Hãy là người đầu tiên!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments
            .filter((comment: CommentType) => !comment.parentId)
            .map((comment: CommentType) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                currentUserId={user?.id}
                onReply={handleReply}
                onEdit={handleEdit}
                onDelete={handleDelete}
                userAvatar={user?.avatar}
                userName={user?.fullname}
                depth={1}
              />
            ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteDialogOpen && (
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setDeleteDialogOpen(false);
                setCommentToDelete(null);
              }
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
                  <Trash2 size={16} className="text-red-400" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-100 tracking-tight mb-1">
                    Xác nhận xóa bình luận
                  </h3>
                  <p className="text-sm text-slate-400 leading-relaxed">
                    Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.
                  </p>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-1">
                <button
                  onClick={() => { setDeleteDialogOpen(false); setCommentToDelete(null); }}
                  className="px-4 py-2 text-sm font-black text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-xl uppercase tracking-widest transition-all"
                >
                  Hủy
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 text-sm font-black text-white bg-red-600 hover:bg-red-500 rounded-xl uppercase tracking-widest transition-all shadow-lg shadow-red-600/20"
                >
                  Xóa
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
