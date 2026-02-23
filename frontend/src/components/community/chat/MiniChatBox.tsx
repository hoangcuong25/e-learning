"use client";

import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { setCurrentConversation } from "@/store/slice/community/chatSlice";
import ChatList from "./ChatList";
import ChatWindow from "./ChatWindow";
import { X } from "lucide-react";
import Link from "next/link";

interface MiniChatBoxProps {
  onClose: () => void;
}

export default function MiniChatBox({ onClose }: MiniChatBoxProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentConversation, conversations } = useSelector(
    (state: RootState) => state.chat
  );
  const [view, setView] = useState<"list" | "chat">("list");

  useEffect(() => {
    if (currentConversation) {
      setView("chat");
    } else {
      setView("list");
    }
  }, [currentConversation]);

  const handleBack = () => {
    dispatch(setCurrentConversation(null));
    setView("list");
  };

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce(
      (acc, conv) => acc + (conv.unreadCount || 0),
      0
    );
  }, [conversations]);

  return (
    <div className="w-[350px] h-[500px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-300">
      {/* Custom Header for List View */}
      {view === "list" && (
        <div className="p-3 border-b border-gray-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-gray-800">Tin nhắn</h2>
            {totalUnreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm">
                {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
              </span>
            )}
          </div>

          <Link href="/messages">
            <button className="p-1 hover:bg-gray-100 rounded-full transition-colors">
              <p className="text-xs font-medium text-blue-600">Trung tâm</p>
            </button>
          </Link>

          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={18} className="text-gray-500" />
          </button>
        </div>
      )}

      {/* Content */}
      <div className="flex-1 overflow-hidden relative">
        {view === "list" ? (
          <div className="h-full">
            <ChatList />
          </div>
        ) : (
          <ChatWindow onBack={handleBack} />
        )}
      </div>
    </div>
  );
}
