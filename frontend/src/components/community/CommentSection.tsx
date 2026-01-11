"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "@/store";
import {
  fetchCommentsByPost,
  createComment,
  updateComment,
  deleteComment,
} from "@/store/slice/commentSlice";
import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import { toast } from "sonner";

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
      await dispatch(
        createComment({
          content,
          postId,
          parentId,
        })
      ).unwrap();
      toast.success("Đã thêm bình luận");
      // Refresh comments
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
      await dispatch(
        updateComment({
          id: commentId,
          payload: { content },
        })
      ).unwrap();
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
    <div className="space-y-4 border-t border-gray-100 pt-4">
      {/* Comment Input */}
      <CommentInput
        postId={postId}
        onSubmit={(content) => handleCreateComment(content)}
        userAvatar={user?.avatar}
        userName={user?.fullname}
      />

      {/* Comments List */}
      {loading && comments.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-4">
          Đang tải bình luận...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center text-sm text-gray-500 py-4">
          Chưa có bình luận nào. Hãy là người đầu tiên!
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
                depth={1} // Start at depth 1 for top-level comments
              />
            ))}
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteDialogOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setDeleteDialogOpen(false);
              setCommentToDelete(null);
            }
          }}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Xác nhận xóa bình luận
              </h3>
              <p className="text-sm text-gray-500 mt-2">
                Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn
                tác.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  setDeleteDialogOpen(false);
                  setCommentToDelete(null);
                }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
