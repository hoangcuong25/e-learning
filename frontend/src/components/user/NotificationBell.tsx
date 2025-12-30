"use client";

import React, { useState, useRef, useEffect } from "react";
import { Bell, Trash2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Link from "next/link";
import {
  deleteNotification,
  fetchNotifications,
  markAllAsRead,
  markAsRead,
} from "@/store/notificationsSlice";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { notifications, unreadCount, loading } = useSelector(
    (state: RootState) => state.notification
  );

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      dispatch(fetchNotifications({ page: 1, limit: 10 }));
    }
  };

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Xử lý đọc tin
  const handleRead = (id: number, isRead: boolean) => {
    if (!isRead) {
      dispatch(markAsRead(id));
    }
  };

  // Xử lý xóa tin
  const handleDelete = (e: React.MouseEvent, id: number) => {
    e.stopPropagation();
    dispatch(deleteNotification(id));
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* --- Button Bell  --- */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={toggleDropdown}
        className="flex items-center gap-2 px-3 py-1.5 bg-blue-100/50 border border-blue-200 rounded-full hover:bg-blue-100 transition duration-200 outline-none"
      >
        <Bell className="w-5 h-5 text-blue-600" />

        <span className="text-blue-600 text-sm font-medium cursor-pointer hidden sm:block">
          Thông báo
        </span>

        {unreadCount > 0 && (
          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 text-[10px] font-bold text-white bg-red-500 rounded-full ml-1">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-80 md:w-96 bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden z-50"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium hover:underline"
                >
                  Đánh dấu đã đọc hết
                </button>
              )}
            </div>

            {/* List Notifications */}
            <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
              {loading && notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Đang tải...
                </div>
              ) : notifications.length > 0 ? (
                <div className="flex flex-col">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => handleRead(item.id, item.isRead)}
                      className={`relative flex gap-3 p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-50 transition-colors group ${
                        !item.isRead ? "bg-blue-50/60" : "bg-white"
                      }`}
                    >
                      {/* Icon */}
                      <div className="flex-shrink-0 mt-1">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            !item.isRead
                              ? "bg-blue-100 text-blue-600"
                              : "bg-gray-100 text-gray-500"
                          }`}
                        >
                          <Info className="w-5 h-5" />
                        </div>
                      </div>

                      {/* Content */}
                      <div className="flex-1 pr-6">
                        <p
                          className={`text-sm ${
                            !item.isRead
                              ? "font-semibold text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-gray-400 mt-2 block">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>

                      {/* Dot unread */}
                      {!item.isRead && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-500 rounded-full ring-2 ring-white" />
                      )}

                      {/* Delete button */}
                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Xóa thông báo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 px-4 text-gray-500">
                  <Bell className="w-12 h-12 text-gray-300 mb-3" />
                  <p className="text-sm">Bạn chưa có thông báo nào</p>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-2 border-t border-gray-100 bg-gray-50 text-center">
              <Link
                href="/notifications"
                className="text-sm text-blue-600 hover:text-blue-800 font-medium block py-1"
                onClick={() => setIsOpen(false)}
              >
                Xem tất cả
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
