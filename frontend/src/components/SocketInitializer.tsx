"use client";

import useNotificationSocket from "@/hook/socket/useNotificationSocket";
import useChatSocket from "@/hook/socket/useChatSocket";

const SocketInitializer = () => {
  useNotificationSocket();
  useChatSocket({ setupListeners: true });

  return null;
};

export default SocketInitializer;
