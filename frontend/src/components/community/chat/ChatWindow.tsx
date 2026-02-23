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

      // Mark as read if there are unread messages
      if (currentConversation.unreadCount > 0) {
        dispatch(markConversationAsRead(currentConversation.id));
      }
    }
  }, [currentConversation?.id, currentConversation?.unreadCount, dispatch]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }

    // Auto mark as read when new messages arrive while chat is open
    if (currentConversation?.id && messages.length > 0) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg.senderId !== user?.id && !lastMsg.isRead) {
        dispatch(markConversationAsRead(currentConversation.id));
      }
    }
  }, [messages, typingUsers, currentConversation?.id, user?.id, dispatch]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || !currentConversation || sending) return;

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
          })
        );
        await dispatch(
          chatWithAi({
            content: content.trim(),
            media: media.length > 0 ? media : undefined,
          })
        ).unwrap();
        setContent("");
        setMedia([]);
        return;
      }

      const otherParticipant = currentConversation.participants.find(
        (p: any) => p.userId !== user?.id
      );

      if (!otherParticipant) return;

      await dispatch(
        sendMessage({
          receiverId: otherParticipant.userId,
          content: content.trim(),
          media: media.length > 0 ? media : undefined,
        })
      ).unwrap();
      setContent("");
      setMedia([]);

      // Emit stop typing
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
      (p: any) => p.userId !== user?.id
    );
    if (!otherParticipant) return;

    // Nếu chưa emit typing → emit true
    if (!isTypingRef.current && value.trim().length > 0) {
      emitTyping({
        conversationId: currentConversation.id,
        receiverEmail: otherParticipant.user.email,
        isTyping: true,
      });
      isTypingRef.current = true;
    }

    // Reset timeout mỗi lần gõ
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
    }, 800); // 800ms
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
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50/50 p-6 text-center">
        <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mb-4 text-blue-600">
          <Send size={40} />
        </div>
        <h3 className="text-xl font-bold text-gray-800">
          Chào mừng đến với Chat!
        </h3>
        <p className="text-gray-500 max-w-sm mt-2">
          Hãy chọn một hội thoại để bắt đầu kết nối với cộng đồng.
        </p>
      </div>
    );
  }

  const otherParticipant = currentConversation.participants.find(
    (p: any) => p.userId !== user?.id
  )?.user;

  const currentTyping = typingUsers[currentConversation.id] || [];

  return (
    <div className="flex-1 flex flex-col h-full bg-white relative">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-white shadow-sm z-10">
        <div className="flex items-center gap-3">
          {onBack && (
            <button
              onClick={onBack}
              className="p-1 mr-1 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-all"
            >
              <ChevronLeft size={24} />
            </button>
          )}
          {currentConversation.type === "AI" ? (
            <div className="relative flex-shrink-0">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
                <Sparkles size={20} />
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-blue-100 overflow-hidden relative">
              {otherParticipant?.avatar ? (
                <Image
                  src={otherParticipant.avatar}
                  alt={otherParticipant.fullname}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white font-bold">
                  {otherParticipant?.fullname?.[0] || "U"}
                </div>
              )}
            </div>
          )}
          <div>
            <h3
              className={`text-sm font-bold ${
                currentConversation.type === "AI"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
                  : "text-gray-900"
              }`}
            >
              {currentConversation.type === "AI"
                ? "AI EduSmart"
                : otherParticipant?.fullname || "Người dùng"}
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full transition-all outline-none">
                <MoreVertical size={20} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 p-1 bg-white rounded-xl shadow-xl border border-gray-100"
            >
              <DropdownMenuItem
                onClick={() => setShowSharedFiles(true)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
              >
                <Files size={16} className="text-gray-500" />
                <span>Xem các file đã gửi</span>
              </DropdownMenuItem>
              {currentConversation.type !== "AI" && (
                <DropdownMenuItem
                  onClick={() => setShowReportDialog(true)}
                  className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg cursor-pointer transition-colors"
                >
                  <Flag size={16} className="text-red-500 hover:text-red-600" />
                  <span className="text-red-500 hover:text-red-600">
                    Báo cáo người dùng
                  </span>
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-2 scrollbar-hide bg-gray-50/30"
      >
        {messages.map((msg, index) => {
          const prevMsg = messages[index - 1];
          let timeString: string | undefined = undefined;

          const currentMsgTime = dayjs(msg.createdAt);

          if (!prevMsg) {
            // First message always shows time
            timeString = currentMsgTime.format("HH:mm");
          } else {
            const prevMsgTime = dayjs(prevMsg.createdAt);
            const diffMinutes = Math.abs(
              currentMsgTime.diff(prevMsgTime, "minute")
            );

            if (diffMinutes >= 5) {
              if (currentMsgTime.isSame(prevMsgTime, "day")) {
                timeString = currentMsgTime.format("HH:mm");
              } else if (currentMsgTime.isSame(prevMsgTime, "year")) {
                timeString = currentMsgTime.format("DD/MM HH:mm");
              } else {
                timeString = currentMsgTime.format("DD/MM/YYYY HH:mm");
              }
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

        {currentTyping.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-gray-400 italic py-2 animate-pulse">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-gray-400 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            {otherParticipant?.fullname} đang soạn tin...
          </div>
        )}

        {sending && currentConversation.type === "AI" && (
          <div className="flex items-center gap-2 text-xs text-blue-500 italic py-2 animate-pulse">
            <div className="flex gap-1">
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" />
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="w-1 h-1 bg-blue-500 rounded-full animate-bounce [animation-delay:0.4s]" />
            </div>
            AI EduSmart đang suy nghĩ...
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-100 bg-white">
        <form
          onSubmit={handleSend}
          className="flex items-end gap-2 bg-gray-50 p-2 rounded-2xl border border-gray-100 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-100 transition-all"
        >
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleUploadClick("image")}
              disabled={isUploading}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full transition-colors"
              title="Gửi ảnh"
            >
              <ImageIcon size={20} />
            </button>
            <button
              type="button"
              onClick={() => handleUploadClick("video")}
              disabled={isUploading}
              className="p-2 text-gray-400 hover:text-blue-600 rounded-full transition-colors"
              title="Gửi video"
            >
              <Video size={20} />
            </button>
          </div>

          <div className="flex-1 flex flex-col gap-2">
            {media.length > 0 && (
              <div className="flex flex-wrap gap-2 p-2 bg-gray-100 rounded-lg">
                {media.map((item, index) => (
                  <div
                    key={index}
                    className="relative w-20 h-20 rounded-md overflow-hidden bg-white border border-gray-200"
                  >
                    {item.type === "IMAGE" ? (
                      <img
                        src={item.url}
                        className="w-full h-full object-cover"
                        alt="Preview"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full flex items-center justify-center bg-gray-800 text-white"
                      />
                    )}

                    {/* Overlay loading */}
                    {isUploading && (
                      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                        <Loader2 className="w-5 h-5 text-white animate-spin" />
                      </div>
                    )}

                    {!isUploading && (
                      <button
                        type="button"
                        onClick={() => removeMedia(index)}
                        className="absolute top-0.5 right-0.5 bg-black/50 text-white rounded-full p-0.5 hover:bg-red-500"
                      >
                        <X size={12} />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
            <textarea
              value={content}
              onChange={handleTyping}
              placeholder={isUploading ? "Đang tải lên..." : "Nhập tin nhắn..."}
              rows={1}
              disabled={isUploading}
              className="w-full bg-transparent border-none focus:ring-0 text-sm p-2 resize-none max-h-32"
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
            className={`
              p-2.5 rounded-xl transition-all
              ${
                (content.trim() || media.length > 0) && !sending && !isUploading
                  ? "bg-blue-600 text-white shadow-blue-200 shadow-lg hover:bg-blue-700"
                  : "bg-gray-200 text-gray-400 cursor-not-allowed"
              }
            `}
          >
            <Send size={18} />
          </button>
        </form>
      </div>

      {/* Modals */}
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
