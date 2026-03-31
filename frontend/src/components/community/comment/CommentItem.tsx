"use client";

import { useState } from "react";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { MoreHorizontal, Trash2, Edit2, CornerDownRight } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import CommentInput from "./CommentInput";
import { motion, AnimatePresence } from "framer-motion";

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
  depth?: number;
}

export default function CommentItem({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  userAvatar,
  userName,
  depth = 1,
}: CommentItemProps) {
  const [isReplying, setIsReplying] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(comment.content);

  const isOwner = currentUserId === comment.userId;
  const canReply = depth < 3;

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
    <div className="space-y-2">
      <div className="flex gap-2.5">
        {/* Avatar */}
        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-indigo-600/20 border border-indigo-500/20 flex-shrink-0 mt-0.5">
          {comment.user?.avatar ? (
            <Image
              src={comment.user.avatar}
              alt={comment.user.fullname || "User"}
              fill
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xs font-black">
              {comment.user?.fullname?.[0]?.toUpperCase() || "U"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Comment bubble */}
          <div className="bg-slate-800 border border-slate-700/60 rounded-2xl rounded-tl-sm px-4 py-3 inline-block max-w-full">
            <div className="flex items-center justify-between gap-3 mb-1">
              <p className="text-xs font-black text-slate-200">
                {comment.user?.fullname || "Người dùng ẩn danh"}
              </p>
              {isOwner && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="text-slate-600 hover:text-slate-400 outline-none transition-colors -mr-1">
                      <MoreHorizontal size={14} />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-36 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl text-sm"
                  >
                    <DropdownMenuItem
                      onClick={() => setIsEditing(true)}
                      className="cursor-pointer text-slate-300 hover:text-white hover:bg-slate-800 focus:bg-slate-800 focus:text-white rounded-lg mx-1 my-0.5"
                    >
                      <Edit2 className="mr-2 h-3.5 w-3.5 text-indigo-400" />
                      Chỉnh sửa
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(comment.id)}
                      className="cursor-pointer text-red-400 hover:text-red-300 hover:bg-red-500/10 focus:bg-red-500/10 focus:text-red-300 rounded-lg mx-1 my-0.5"
                    >
                      <Trash2 className="mr-2 h-3.5 w-3.5" />
                      Xóa
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>

            {/* Content / Edit mode */}
            {isEditing ? (
              <div className="space-y-2 min-w-[200px]">
                <input
                  type="text"
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleEdit();
                    if (e.key === "Escape") { setIsEditing(false); setEditContent(comment.content); }
                  }}
                  className="w-full px-3 py-1.5 bg-slate-700 border border-slate-600 rounded-lg text-sm text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                  autoFocus
                />
                <div className="flex gap-2">
                  <button
                    onClick={handleEdit}
                    className="px-3 py-1 text-xs font-black bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg uppercase tracking-wider transition-all"
                  >
                    Lưu
                  </button>
                  <button
                    onClick={() => { setIsEditing(false); setEditContent(comment.content); }}
                    className="px-3 py-1 text-xs font-black text-slate-500 hover:text-slate-300 transition-colors uppercase tracking-wider"
                  >
                    Hủy
                  </button>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-300 leading-relaxed">{comment.content}</p>
            )}
          </div>

          {/* Meta row */}
          <div className="flex items-center gap-3 mt-1.5 px-1">
            <span className="text-[11px] text-slate-600">
              {dayjs(comment.createdAt).fromNow()}
            </span>
            {canReply && (
              <button
                onClick={() => setIsReplying(!isReplying)}
                className="text-[11px] font-black text-slate-500 hover:text-indigo-400 uppercase tracking-wider transition-colors"
              >
                Trả lời
              </button>
            )}
          </div>

          {/* Reply input */}
          <AnimatePresence>
            {isReplying && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="mt-2.5 overflow-hidden"
              >
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
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3 space-y-3 pl-3 border-l-2 border-slate-800">
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
                  depth={depth + 1}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
