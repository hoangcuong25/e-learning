"use client";

import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { toast } from "sonner";
import { addNewNotification } from "@/store/notificationsSlice";

interface RealtimeNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const SOCKET_SERVER_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

const useSocket = () => {
  const dispatch = useDispatch<AppDispatch>();
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // 1. Lấy token để xác thực
    const token = localStorage.getItem("access_token");
    if (!token) return;

    // 2. Thiết lập kết nối Socket
    const socket = io(SOCKET_SERVER_URL, {
      path: "/socket.io",
      auth: {
        token: token,
      },
      transports: ["websocket"],
    });

    socketRef.current = socket;

    // 3. Xử lý các sự kiện chính

    // Khi kết nối thành công
    socket.on("connect", () => {
      console.log("Socket connected successfully:", socket.id);
    });

    // Khi kết nối bị lỗi
    socket.on("connect_error", (err) => {
      console.error("Socket Connection Error:", err.message);
    });

    // 4. Lắng nghe sự kiện thông báo realtime từ Server
    // Server phải emit sự kiện này
    socket.on("newNotification", (data: RealtimeNotification) => {
      console.log("Received new notification:", data);

      const notification = {
        ...data,
        userId: (data as any).userId ?? 0,
      };

      // a) Thêm thông báo mới vào đầu danh sách Redux
      dispatch(addNewNotification(notification as any));

      // b) Tăng số lượng tin chưa đọc
      // dispatch(increaseUnreadCount());

      // c) Hiển thị thông báo toast
      toast.info(`🔔 ${data.title}`, {
        description: data.message,
        duration: 5000,
        action: {
          label: "Xem",
          onClick: () => (window.location.href = "/notifications"),
        },
      });
    });

    // 5. Cleanup khi component unmount hoặc token thay đổi
    return () => {
      console.log("Socket disconnecting...");
      socket.disconnect();
      socketRef.current = null;
    };
  }, [dispatch]);

  return socketRef.current;
};

export default useSocket;
