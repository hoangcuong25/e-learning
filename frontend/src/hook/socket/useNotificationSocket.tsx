"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { addNewNotification } from "@/store/slice/notificationsSlice";
import useBaseSocket from "./useBaseSocket";

interface RealtimeNotification {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

const useNotificationSocket = () => {
  const dispatch = useDispatch<AppDispatch>();

  // 1. CHỈ GỌI useBaseSocket để khởi tạo và quản lý kết nối
  const socket = useBaseSocket("/notifications");

  useEffect(() => {
    if (!socket) return;

    // 2. Định nghĩa hàm xử lý sự kiện
    const handleNewNotification = (data: RealtimeNotification) => {

      const notification = {
        ...data,
        userId: (data as any).userId ?? 0,
      };

      dispatch(addNewNotification(notification as any));
    };

    // 3. Lắng nghe sự kiện nghiệp vụ
    socket.on("newNotification", handleNewNotification);

    // 4. Cleanup listener cụ thể
    return () => {
      socket.off("newNotification", handleNewNotification);
    };
  }, [socket, dispatch]);

  // Trả về socket instance (hoặc null)
  return socket;
};

export default useNotificationSocket;
