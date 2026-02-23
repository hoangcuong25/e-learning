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
      <div className="p-4 space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex gap-3 animate-pulse">
            <div className="w-12 h-12 bg-gray-200 rounded-full" />
            <div className="flex-1 space-y-2 py-1">
              <div className="h-4 bg-gray-200 rounded w-3/4" />
              <div className="h-3 bg-gray-200 rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto border-r border-gray-100">
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* AI Assistant Entry */}
        <div
          onClick={handleSelectAiConversation}
          className={`
            flex items-center gap-3 p-4 cursor-pointer transition-all border-b border-gray-100
            ${
              currentConversation?.id === "ai"
                ? "bg-blue-50/50 border-r-2 border-blue-600"
                : "bg-gradient-to-r from-blue-50/50 to-purple-50/50 hover:from-blue-100/50 hover:to-purple-100/50"
            }
          `}
        >
          <div className="relative flex-shrink-0">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white shadow-md shadow-blue-200">
              <Sparkles size={24} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex justify-between items-baseline mb-1">
              <h3 className="text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                AI EduSmart
              </h3>
            </div>
            <p className="text-xs text-gray-600 truncate italic">
              Hỏi đáp thông minh về bài học...
            </p>
          </div>
        </div>

        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">
            Chưa có hội thoại nào
          </div>
        ) : (
          conversations.map((conv) => {
            // Find the other participant
            const otherParticipant = conv.participants.find(
              (p: any) => p.userId !== user?.id
            )?.user;

            const isSelected = currentConversation?.id === conv.id;
            const lastMsg = conv.lastMessage;

            return (
              <div
                key={conv.id}
                onClick={() => handleSelectConversation(conv)}
                className={`
                  flex items-center gap-3 p-4 cursor-pointer transition-all hover:bg-gray-50
                  ${
                    isSelected ? "bg-blue-50/50 border-r-2 border-blue-600" : ""
                  }
                `}
              >
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full bg-blue-100 overflow-hidden relative">
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
                  {/* Status indicator could go here */}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-1">
                    <h3
                      className={`text-sm font-semibold truncate ${
                        isSelected ? "text-blue-600" : "text-gray-900"
                      }`}
                    >
                      {otherParticipant?.fullname || "Người dùng"}
                    </h3>
                    <span className="text-[10px] text-gray-400 whitespace-nowrap">
                      {conv.updatedAt
                        ? dayjs(conv.updatedAt).fromNow(true)
                        : ""}
                    </span>
                  </div>
                  <div className="flex justify-between items-center mt-1">
                    <p className="text-xs text-gray-500 truncate flex-1 mr-2">
                      {typeof lastMsg === "string"
                        ? lastMsg
                        : lastMsg?.content ||
                          (lastMsg?.media?.length
                            ? lastMsg.media[0].type === "IMAGE"
                              ? "[Hình ảnh]"
                              : "[Video]"
                            : "Hội thoại mới")}
                    </p>
                    {conv.unreadCount > 0 && (
                      <div className="flex-shrink-0 bg-red-500 text-white text-[10px] font-bold min-w-[18px] h-[18px] rounded-full flex items-center justify-center px-1 shadow-sm animate-in zoom-in duration-300">
                        {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
