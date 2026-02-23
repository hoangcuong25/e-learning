"use client";

import { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  receiveNewMessage,
  addNewConversation,
  setTypingStatus,
} from "@/store/slice/community/chatSlice";
import useBaseSocket from "./useBaseSocket";

interface RealtimeMessage {
  id: number;
  content: string;
  senderId: number;
  conversationId: number;
  createdAt: string;
}

interface TypingData {
  conversationId: number;
  senderEmail: string;
  isTyping: boolean;
}

const useChatSocket = (options: { setupListeners?: boolean } = {}) => {
  const { setupListeners = false } = options;
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const socket = useBaseSocket("/chat");

  useEffect(() => {
    if (!socket || !user || !setupListeners) return;

    const handleNewMessage = (message: RealtimeMessage) => {
      dispatch(receiveNewMessage({ message, currentUserId: user.id }));
    };

    const handleNewConversation = (conversation: any) => {
      dispatch(addNewConversation(conversation));
    };

    const handleUserTyping = (data: TypingData) => {
      dispatch(
        setTypingStatus({
          conversationId: data.conversationId,
          email: data.senderEmail,
          isTyping: data.isTyping,
        })
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("newConversation", handleNewConversation);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("newConversation", handleNewConversation);
      socket.off("userTyping", handleUserTyping);
    };
  }, [socket, dispatch, user, setupListeners]);

  const emitTyping = useCallback(
    (data: {
      conversationId: number;
      receiverEmail: string;
      isTyping: boolean;
    }) => {
      if (socket) {
        socket.emit("typing", data);
      }
    },
    [socket]
  );

  return { socket, emitTyping };
};

export default useChatSocket;
