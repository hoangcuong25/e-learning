"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket, ManagerOptions, SocketOptions } from "socket.io-client";
import { toast } from "sonner";
import axiosClient from "@/lib/axiosClient";

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_WEBSOCKET_URL || "ws://localhost:4000";

const refreshAccessTokenForSocket = async (): Promise<string | null> => {
  try {
    const response = await axiosClient.get(`auth/refresh-token`, {
      withCredentials: true,
      skipAuthRefresh: true,
    } as any);

    const newAccessToken = response.data.data;
    if (newAccessToken) {
      localStorage.setItem("access_token", newAccessToken);
      return newAccessToken;
    }
    return null;
  } catch (refreshError) {
    localStorage.removeItem("access_token");
    toast.error("Phiên làm việc đã hết hạn. Vui lòng đăng nhập lại.");
    window.location.href = "/login";
    return null;
  }
};

const useBaseSocket = (namespace: string): Socket | null => {
  const socketRef = useRef<Socket | null>(null);
  const [socketState, setSocketState] = useState<Socket | null>(null);

  const attemptReconnect = useCallback(
    async (socket: Socket) => {
      const newAccessToken = await refreshAccessTokenForSocket();
      if (newAccessToken) {
        socket.io.opts.query = { token: newAccessToken };
        socket.connect();
      }
    },
    [namespace]
  );

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const socket = io(`${SOCKET_SERVER_URL}${namespace}`, {
      path: "/socket.io",
      query: { token },
      transports: ["websocket"],
      reconnection: false,
    });

    socketRef.current = socket;
    setSocketState(socket);

    socket.on("connect_error", (err) => {
      if (err.message === "TokenExpired") {
        socket.disconnect();
        attemptReconnect(socket);
      }
    });

    return () => {
      socket.disconnect();
    };
  }, [namespace, attemptReconnect]);

  return socketState;
};

export default useBaseSocket;
