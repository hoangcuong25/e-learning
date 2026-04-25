"use client";

import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchMessages,
  sendMessage,
  chatWithAi,
  addLocalMessage,
  markConversationAsRead,
} from "@/store/slice/community/chatSlice";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  X,
  ChevronLeft,
  Image as ImageIcon,
  Video,
  Loader2,
  Sparkles,
  Files,
  Flag,
} from "lucide-react";
import MessageItem from "./MessageItem";
import useChatSocket from "@/hook/socket/useChatSocket";
import Image from "next/image";
import { uploadMedia } from "@/store/api/common/cloudinary.api";
import { toast } from "sonner";
import dayjs from "dayjs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportDialog } from "@/components/shared/ReportDialog";
import { ReportTargetType } from "@/constants/report.enum";
import SharedFilesModal from "./SharedFilesModal";

interface ChatWindowProps {
  onBack?: () => void;
}

import { motion, AnimatePresence } from "framer-motion";

export default function ChatWindow({ onBack }: ChatWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentConversation, messages, loading, sending, typingUsers } =
    useSelector((state: RootState) => state.chat);
  const { user } = useSelector((state: RootState) => state.user);
  const [content, setContent] = useState("");
  const [media, setMedia] = useState<
    { url: string; type: "IMAGE" | "VIDEO" }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [showSharedFiles, setShowSharedFiles] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isTypingRef = useRef(false);

  const { emitTyping } = useChatSocket({ setupListeners: false });

  useEffect(() => {
    if (currentConversation?.id) {
      dispatch(fetchMessages({ id: currentConversation.id }));

      if (currentConversation.unreadCount > 0) {
        dispatch(markConversationAsRead(currentConversation.id));
      }
    }
  }, [currentConversation?.id, currentConversation?.unreadCount, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    if (currentConversation?.id && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId !== user?.id && !lastMsg.isRead) {
        dispatch(markConversationAsRead(currentConversation.id));
      }
    }
  }, [messages, typingUsers, currentConversation?.id, user?.id, dispatch]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() && media.length === 0) return;
    if (!currentConversation || sending) return;

    try {
      if (currentConversation.type === "AI") {
        await dispatch(
          addLocalMessage({
            id: Date.now(),
            content,
            media,
            createdAt: new Date().toISOString(),
            senderId: user?.id,
            isAiResponse: false,
          }),
        );
        await dispatch(
          chatWithAi({
            content: content.trim(),
            media: media.length > 0 ? media : undefined,
          }),
        ).unwrap();
        setContent("");
        setMedia([]);
        return;
      }

      const otherParticipant = currentConversation.participants.find(
        (p: any) => p.userId !== user?.id,
      );

      if (!otherParticipant) return;

      await dispatch(
        sendMessage({
          receiverId: otherParticipant.userId,
          content: content.trim(),
          media: media.length > 0 ? media : undefined,
        }),
      ).unwrap();
      setContent("");
      setMedia([]);

      emitTyping({
        conversationId: currentConversation.id,
        receiverEmail: otherParticipant.user.email,
        isTyping: false,
      });
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleTyping = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    if (!currentConversation) return;
    if (currentConversation.type === "AI") return;

    const otherParticipant = currentConversation.participants.find(
      (p: any) => p.userId !== user?.id,
    );
    if (!otherParticipant) return;

    if (!isTypingRef.current && value.trim().length > 0) {
      emitTyping({
        conversationId: currentConversation.id,
        receiverEmail: otherParticipant.user.email,
        isTyping: true,
      });
      isTypingRef.current = true;
    }

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      emitTyping({
        conversationId: currentConversation.id,
        receiverEmail: otherParticipant.user.email,
        isTyping: false,
      });
      isTypingRef.current = false;
    }, 800);
  };

  const handleUploadClick = (type: "image" | "video") => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = type === "image" ? "image/*" : "video/*";
    input.onchange = async (e: any) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setIsUploading(true);
      try {
        const res = await uploadMedia({ file, type });
        const newMediaItem = {
          url: res.secure_url || res.url,
          type: type === "image" ? ("IMAGE" as const) : ("VIDEO" as const),
        };
        setMedia((prev) => [...prev, newMediaItem]);
      } catch (error) {
        console.error(error);
        toast.error(`Lỗi khi tải ${type} lên`);
      } finally {
        setIsUploading(false);
      }
    };
    input.click();
  };

  const removeMedia = (index: number) => {
    setMedia((prev) => prev.filter((_, i) => i !== index));
  };

  if (!currentConversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-slate-50/50 relative overflow-hidden h-full">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[100px]" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 space-y-6"
        >
          <div className="w-24 h-24 bg-indigo-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-indigo-600/20 text-white group hover:rotate-12 transition-transform duration-500">
            <Send size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
              Your Workspace Chat
            </h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto leading-relaxed">
              Select a teammate or the AI Assistant from the left to start a
              productive session.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const otherParticipant = currentConversation.participants.find(
    (p: any) => p.userId !== user?.id,
  )?.user;

  const currentTyping = typingUsers[currentConversation.id] || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-6 border-b border-slate-50 flex items-center justify-between bg-white/80 backdrop-blur-xl z-20">
        <div className="flex items-center gap-4">
          {onBack && (
            <button
              onClick={onBack}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          )}

          <div className="relative">
            {currentConversation.type === "AI" ? (
              <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/20">
                <Sparkles size={24} fill="currentColor" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 overflow-hidden relative border-2 border-white shadow-sm font-black text-slate-900 flex items-center justify-center">
                {otherParticipant?.avatar ? (
                  <Image
                    src={otherParticipant.avatar}
                    alt={otherParticipant.fullname}
                    fill
                    className="object-cover"
                  />
                ) : (
                  otherParticipant?.fullname?.[0] || "?"
                )}
              </div>
            )}
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-500 border-[3px] border-white rounded-full shadow-sm" />
          </div>

          <div>
            <h3
              className={`text-lg font-black tracking-tight ${currentConversation.type === "AI" ? "text-indigo-600" : "text-slate-900"}`}
            >
              {currentConversation.type === "AI"
                ? "Trợ lý AI"
                : otherParticipant?.fullname || "Teammate"}
            </h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
              {currentConversation.type === "AI" ? "AI hỗ trợ" : "Trực tuyến"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all outline-none">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-64 p-2 bg-white rounded-[1.5rem] shadow-2xl border-slate-100 animate-in slide-in-from-top-2"
            >
              <DropdownMenuItem
                onClick={() => setShowSharedFiles(true)}
                className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl cursor-pointer transition-all"
              >
                <Files size={16} /> Ảnh đã chia sẻ
              </DropdownMenuItem>
              {currentConversation.type !== "AI" && (
                <DropdownMenuItem
                  onClick={() => setShowReportDialog(true)}
                  className="flex items-center gap-3 px-4 py-3 text-xs font-black uppercase tracking-widest text-rose-600 hover:bg-rose-50 rounded-xl cursor-pointer transition-all"
                >
                  <Flag size={16} /> Báo cáo người dùng
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Viewport */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-hide bg-slate-50/20 relative"
      >
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.03] pointer-events-none" />

        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          let timeString: string | undefined = undefined;
          const currentMsgTime = dayjs(msg.createdAt);

          if (!prevMsg) {
            timeString = currentMsgTime.format("HH:mm");
          } else {
            const prevMsgTime = dayjs(prevMsg.createdAt);
            const diffMinutes = Math.abs(
              currentMsgTime.diff(prevMsgTime, "minute"),
            );
            if (diffMinutes >= 5) {
              timeString = currentMsgTime.isSame(prevMsgTime, "day")
                ? currentMsgTime.format("HH:mm")
                : currentMsgTime.format("DD/MM HH:mm");
            }
          }

          return (
            <MessageItem
              key={msg.id}
              message={msg}
              isMe={
                currentConversation.type === "AI"
                  ? !msg.isAiResponse
                  : msg.senderId === user?.id
              }
              isAi={msg.isAiResponse}
              timeString={timeString}
            />
          );
        })}

        {/* Indicators */}
        <AnimatePresence>
          {currentTyping.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 px-4 py-2 bg-white/50 border border-slate-100 rounded-full w-fit animate-pulse"
            >
              <div className="flex gap-1">
                {[0, 0.2, 0.4].map((d) => (
                  <motion.span
                    key={d}
                    animate={{ y: [0, -4, 0] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: d }}
                    className="w-1.5 h-1.5 bg-indigo-600 rounded-full"
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                {otherParticipant?.fullname} is typing
              </span>
            </motion.div>
          )}

          {sending && currentConversation.type === "AI" && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex items-center gap-3 px-4 py-2 bg-indigo-600 text-white rounded-full w-fit shadow-lg shadow-indigo-600/20"
            >
              <Sparkles size={14} className="animate-spin" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                AI is thinking
              </span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modern Input Area */}
      <div className="p-6 bg-white border-t border-slate-50 z-20">
        <form
          onSubmit={handleSend}
          className="max-w-5xl mx-auto flex items-end gap-3 bg-slate-50 rounded-[2.5rem] p-3 pl-5 border border-slate-100 focus-within:bg-white focus-within:shadow-xl focus-within:border-indigo-100 transition-all duration-300"
        >
          <div className="flex items-center self-center h-12 gap-1 border-r border-slate-200 pr-2 mr-2">
            <button
              type="button"
              onClick={() => handleUploadClick("image")}
              disabled={isUploading}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <ImageIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleUploadClick("video")}
              disabled={isUploading}
              className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-all"
            >
              <Video size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            <AnimatePresence>
              {media.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-wrap gap-2 p-3 bg-white/80 backdrop-blur rounded-[1.5rem] border border-slate-100 shadow-sm"
                >
                  {media.map((item, index) => (
                    <div
                      key={index}
                      className="relative w-20 h-20 rounded-xl overflow-hidden border border-slate-200 group"
                    >
                      {item.type === "IMAGE" ? (
                        <img
                          src={item.url}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center text-white">
                          <Video size={20} />
                        </div>
                      )}

                      {isUploading && (
                        <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center text-white">
                          <Loader2 className="animate-spin" size={20} />
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-1 right-1 w-6 h-6 bg-rose-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={12} />
                      </button>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            <textarea
              value={content}
              onChange={handleTyping}
              placeholder={isUploading ? "Đang xử lý files..." : "Nhắn tin..."}
              rows={1}
              disabled={isUploading}
              className="px-2 w-full bg-transparent border-none focus:ring-0 text-slate-900 font-medium placeholder:text-slate-300 py-3 scrollbar-hide resize-none min-h-[48px] max-h-40"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e as any);
                }
              }}
            />
          </div>

          <button
            type="submit"
            disabled={
              (!content.trim() && media.length === 0) || sending || isUploading
            }
            className={`w-12 h-12 rounded-full flex items-center justify-center self-center transition-all ${
              (content.trim() || media.length > 0) && !sending && !isUploading
                ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/30 hover:scale-105 active:scale-95"
                : "bg-slate-200 text-slate-400 opacity-50 cursor-not-allowed"
            }`}
          >
            {sending ? (
              <Loader2 className="animate-spin" size={20} />
            ) : (
              <Send size={20} className="ml-1" />
            )}
          </button>
        </form>
      </div>

      <ReportDialog
        open={showReportDialog}
        onOpenChange={setShowReportDialog}
        targetType={ReportTargetType.USER}
        targetId={otherParticipant?.id || 0}
      />
      <SharedFilesModal
        open={showSharedFiles}
        onOpenChange={setShowSharedFiles}
        messages={messages}
      />
    </div>
  );
}
