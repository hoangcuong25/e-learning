"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import Image from "next/image";

interface CommentInputProps {
  postId: number;
  parentId?: number;
  onSubmit: (content: string) => void;
  placeholder?: string;
  userAvatar?: string;
  userName?: string;
  autoFocus?: boolean;
  onCancel?: () => void;
}

export default function CommentInput({
  postId,
  parentId,
  onSubmit,
  placeholder = "Viết bình luận...",
  userAvatar,
  userName,
  autoFocus = false,
  onCancel,
}: CommentInputProps) {
  const [content, setContent] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (content.trim()) {
      onSubmit(content);
      setContent("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3 items-start">
      <div className="w-8 h-8 rounded-full bg-blue-100 overflow-hidden relative flex-shrink-0">
        {userAvatar ? (
          <Image
            src={userAvatar}
            alt={userName || "User"}
            fill
            className="object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-xs font-bold">
            {userName?.[0] || "U"}
          </div>
        )}
      </div>
      <div className="flex-1 flex gap-2">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={!content.trim()}
          className="p-2 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <Send size={16} />
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800"
          >
            Hủy
          </button>
        )}
      </div>
    </form>
  );
}
