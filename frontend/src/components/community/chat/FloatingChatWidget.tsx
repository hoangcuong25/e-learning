"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchConversations,
  setMiniChatOpen,
} from "@/store/slice/community/chatSlice";
import { MessageCircle } from "lucide-react";
import MiniChatBox from "./MiniChatBox";
import { AnimatePresence, motion } from "framer-motion";

export default function FloatingChatWidget() {
  const dispatch = useDispatch<AppDispatch>();
  const { isMiniChatOpen, conversations } = useSelector(
    (state: RootState) => state.chat
  );

  useEffect(() => {
    // Luôn fetch conversations để cập nhật số tin nhắn chưa đọc global
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  const totalUnreadCount = useMemo(() => {
    return conversations.reduce(
      (acc, conv) => acc + (conv.unreadCount || 0),
      0
    );
  }, [conversations]);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      <AnimatePresence>
        {isMiniChatOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.2 }}
            className="pointer-events-auto origin-bottom-right"
          >
            <MiniChatBox onClose={() => dispatch(setMiniChatOpen(false))} />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => dispatch(setMiniChatOpen(!isMiniChatOpen))}
        className={`
          pointer-events-auto relative
          w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300
          ${
            isMiniChatOpen
              ? "bg-gray-200 text-gray-600 rotate-90"
              : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-110"
          }
        `}
      >
        <MessageCircle size={28} />

        <AnimatePresence>
          {!isMiniChatOpen && totalUnreadCount > 0 && (
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold min-w-[20px] h-[20px] rounded-full flex items-center justify-center px-1 border-2 border-white shadow-sm"
            >
              {totalUnreadCount > 99 ? "99+" : totalUnreadCount}
            </motion.div>
          )}
        </AnimatePresence>
      </button>
    </div>
  );
}
