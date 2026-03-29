"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchConversations,
  getAiConversation,
  setCurrentConversation,
} from "@/store/slice/community/chatSlice";
import Image from "next/image";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import "dayjs/locale/vi";
import { X, Sparkles } from "lucide-react";

dayjs.extend(relativeTime);
dayjs.locale("vi");

import { motion, AnimatePresence } from "framer-motion";

export default function ChatList() {
  const dispatch = useDispatch<AppDispatch>();
  const { conversations, currentConversation, loading } = useSelector(
    (state: RootState) => state.chat
  );
  const { user } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    dispatch(fetchConversations({ page: 1, limit: 20 }));
  }, [dispatch]);

  const handleSelectConversation = (conv: any) => {
    dispatch(setCurrentConversation(conv));
  };

  const handleSelectAiConversation = () => {
    dispatch(getAiConversation());
  };

  if (loading && conversations.length === 0) {
    return (
      <div className="p-8 space-y-6">
        <div className="h-8 w-32 bg-slate-100 rounded-lg animate-pulse mb-8" />
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 animate-pulse px-4 border-b border-slate-50 pb-6">
            <div className="w-14 h-14 bg-slate-100 rounded-2xl" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-4 bg-slate-100 rounded w-3/4" />
              <div className="h-3 bg-slate-100 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white relative">
      {/* Header Section */}
      <div className="p-8 pb-4">
         <h2 className="text-3xl font-black text-slate-900 tracking-tighter mb-1">Messages</h2>
         <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Inbox Control Center</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 space-y-2 pb-8">
        {/* AI Assistant Entry */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSelectAiConversation}
          className={`
            relative p-5 rounded-[2rem] cursor-pointer transition-all border border-transparent overflow-hidden group
            ${
              currentConversation?.id === "ai"
                ? "bg-slate-900 shadow-xl shadow-slate-900/10"
                : "bg-indigo-50/50 hover:bg-indigo-50"
            }
          `}
        >
          {/* Animated Background for AI */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-10 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:rotate-12 transition-transform duration-500">
              <Sparkles size={22} fill="currentColor" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline mb-0.5">
                <h3 className={`text-sm font-black tracking-tight ${currentConversation?.id === "ai" ? "text-white" : "text-indigo-600"}`}>
                  AI EduSmart
                </h3>
                <div className="flex items-center gap-1 text-[8px] font-black uppercase tracking-widest text-indigo-400 bg-indigo-400/10 px-2 py-0.5 rounded-full">
                  <div className="w-1 h-1 bg-indigo-400 rounded-full animate-pulse" />
                  Bot
                </div>
              </div>
              <p className={`text-[10px] font-medium truncate italic ${currentConversation?.id === "ai" ? "text-slate-400" : "text-slate-500"}`}>
                Gợi ý học tập cá nhân hóa...
              </p>
            </div>
          </div>
        </motion.div>

        <div className="h-px bg-slate-50 mx-4 my-2" />

        {conversations.length === 0 ? (
          <div className="py-20 text-center space-y-3">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto text-slate-300">
                <X size={24} />
             </div>
             <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">No conversations yet</p>
          </div>
        ) : (
          conversations.map((conv) => {
            const otherParticipant = conv.participants.find(
              (p: any) => p.userId !== user?.id
            )?.user;

            const isSelected = currentConversation?.id === conv.id;
            const lastMsg = conv.lastMessage;

            return (
              <motion.div
                key={conv.id}
                whileHover={{ x: 4 }}
                onClick={() => handleSelectConversation(conv)}
                className={`
                  flex items-center gap-4 p-4 rounded-[2rem] cursor-pointer transition-all relative border border-transparent
                  ${
                    isSelected 
                      ? "bg-slate-50/80 border-slate-100" 
                      : "hover:bg-slate-50"
                  }
                `}
              >
                {/* Active Indicator */}
                {isSelected && (
                  <motion.div 
                    layoutId="chatIndicator"
                    className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-8 bg-indigo-600 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                <div className="relative flex-shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-50 overflow-hidden relative border-2 border-white shadow-sm">
                    {otherParticipant?.avatar ? (
                      <Image
                        src={otherParticipant.avatar}
                        alt={otherParticipant.fullname}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-slate-900 text-white font-black text-xl">
                        {otherParticipant?.fullname?.[0] || "?"}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3 className={`text-sm font-black tracking-tight truncate ${isSelected ? "text-indigo-600" : "text-slate-900"}`}>
                      {otherParticipant?.fullname || "Học viên"}
                    </h3>
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest whitespace-nowrap">
                      {conv.updatedAt ? dayjs(conv.updatedAt).fromNow(true) : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5">
                    <p className={`text-[11px] font-medium truncate flex-1 mr-3 ${isSelected ? "text-slate-600" : "text-slate-400"}`}>
                      {typeof lastMsg === "string"
                        ? lastMsg
                        : lastMsg?.content ||
                          (lastMsg?.media?.length
                            ? lastMsg.media[0].type === "IMAGE"
                              ? "[Hình ảnh]"
                              : "[Video]"
                            : "New chat started")}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="flex-shrink-0 bg-slate-900 text-white text-[9px] font-black px-2 py-0.5 rounded-full shadow-lg shadow-slate-900/20">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
