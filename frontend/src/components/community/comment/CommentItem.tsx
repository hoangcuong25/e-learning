"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { MoreHorizontal, Trash2, Edit2, Reply } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentInput from "./CommentInput";

dayjs.extend(relativeTime);
dayjs.locale("vi");

interface CommentItemProps {
  comment: CommentType;
  currentUserId?: number;
  onReply: (commentId: number, content: string) => void;
  onEdit: (commentId: number, content: string) => void;
  onDelete: (commentId: number) => void;
  userAvatar?: string;
  userName?: string;
  depth?: number; // Track nesting level
}

export default function CommentItem({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  userAvatar,
  userName,
  depth = 1, // Default to level 1
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = currentUserId === comment.userId;
  const canReply = depth < 3; // Only allow reply if depth is less than 3

  const handleReply = (content: string) => {
    onReply(comment.id, content);
    setIsReplying(false);
  };

  const handleEdit = () => {
    if (editContent.trim()) {
      onEdit(comment.id, editContent);
      setIsEditing(false);
    }
  };

  return (
    <div className="space-y-3">
      <div className="flex gap-3">
        <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden relative flex-shrink-0">
          {comment.user?.avatar ? (
            <Image
              src={comment.user.avatar}
              alt={comment.user.fullname || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xs font-bold">
              {comment.user?.fullname?.[0] || "U"}
            </div>
          )}
        </div>

        <div className="flex-1">
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <div className="flex items-center justify-between mb-1">
              <p className="font-semibold text-sm text-gray-800">
                {comment.user?.fullname || "Người dùng ẩn danh"}
              </p>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-gray-400 hover:text-gray-600 outline-none">
                      <MoreHorizontal size={16} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-40">
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer"
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      <span>Chỉnh sửa</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(comment.id)}
                      className="cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      <span>Xóa</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-2">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full px-3 py-1 bg-white rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 text-xs bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditContent(comment.content);
                    }}
                    className="px-3 py-1 text-xs text-gray-600 hover:text-gray-800"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-700">{comment.content}</p>
            )}
          </div>

          <div className="flex items-center gap-4 mt-1 px-2 text-xs text-gray-500">
            <span>{dayjs(comment.createdAt).fromNow()}</span>
            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="hover:text-blue-600 font-medium"
              >
                Trả lời
              </button>
            )}
          </div>

          {isReplying && (
            <div className="mt-3">
              <CommentInput
                postId={comment.postId}
                parentId={comment.id}
                onSubmit={handleReply}
                placeholder={`Trả lời ${comment.user?.fullname}...`}
                userAvatar={userAvatar}
                userName={userName}
                autoFocus
                onCancel={() => setIsReplying(false)}
              />
            </div>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-4 border-l-2 border-gray-200">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  currentUserId={currentUserId}
                  onReply={onReply}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  userAvatar={userAvatar}
                  userName={userName}
                  depth={depth + 1} // Increment depth for nested replies
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
