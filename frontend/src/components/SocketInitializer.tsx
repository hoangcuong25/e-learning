"use client";

import useNotificationSocket from "@/hook/socket/useNotificationSocket"

const SocketInitializer = () => {
  useNotificationSocket();

  return null;
};

export default SocketInitializer;
