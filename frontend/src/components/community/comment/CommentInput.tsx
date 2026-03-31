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

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (content.trim()) {
        onSubmit(content);
        setContent("");
      }
    }
    if (e.key === "Escape" && onCancel) {
      onCancel();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
      {/* Avatar */}
      <div className="relative w-8 h-8 rounded-full overflow-hidden bg-indigo-600/20 border border-indigo-500/20 flex-shrink-0">
        {userAvatar ? (
          <Image src={userAvatar} alt={userName || "User"} fill className="object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-xs font-black">
            {userName?.[0]?.toUpperCase() || "U"}
          </div>
        )}
      </div>

      {/* Input + actions */}
      <div className="flex-1 flex items-center gap-2 bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 focus-within:border-indigo-500/60 focus-within:ring-1 focus-within:ring-indigo-500/20 transition-all">
        <input
          type="text"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className="flex-1 bg-transparent text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none"
        />

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="text-xs text-slate-600 hover:text-slate-400 font-semibold transition-colors flex-shrink-0"
          >
            Hủy
          </button>
        )}

        <button
          type="submit"
          disabled={!content.trim()}
          className="p-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white disabled:opacity-30 disabled:cursor-not-allowed transition-all flex-shrink-0"
        >
          <Send size={12} />
        </button>
      </div>
    </form>
  );
}
