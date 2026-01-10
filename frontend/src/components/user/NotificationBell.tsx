"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import { Bell, Trash2, Info } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import {
  deleteNotification,
  fetchNotifications,
  loadMoreNotifications,
  markAllAsRead,
  markAsRead,
} from "@/store/slice/notificationsSlice";

const NotificationBell = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const loadMoreTriggerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();
  const {
    notifications,
    unreadCount,
    loading,
    loadingMore,
    nextCursor,
    hasMore,
  } = useSelector((state: RootState) => state.notification);

  const toggleDropdown = () => {
    const newState = !isOpen;
    setIsOpen(newState);

    if (newState) {
      dispatch(fetchNotifications({ limit: 10 }));
    }
  };

  // Click outside
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

  // Load more
  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && nextCursor) {
      dispatch(loadMoreNotifications({ cursor: nextCursor, limit: 10 }));
    }
  }, [hasMore, loadingMore, nextCursor, dispatch]);

  useEffect(() => {
    if (!isOpen || !loadMoreTriggerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) handleLoadMore();
      },
      {
        root: scrollContainerRef.current,
        threshold: 0.1,
      }
    );

    observer.observe(loadMoreTriggerRef.current);
    return () => observer.disconnect();
  }, [isOpen, handleLoadMore]);

  const handleClickNotification = (
    id: number,
    isRead: boolean,
    link?: string
  ) => {
    if (!isRead) dispatch(markAsRead(id));
    if (link) {
      router.push(link);
      setIsOpen(false);
    }
  };

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
      {/* 🔔 Bell Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        onClick={toggleDropdown}
        className="
          relative flex items-center gap-2
          px-2 xl:px-3 py-1.5
          bg-blue-100/50 border border-blue-200
          rounded-full hover:bg-blue-100 transition
        "
      >
        <Bell className="w-5 h-5 text-blue-600" />
        <span className="max-xl:hidden text-blue-600 text-sm font-medium">
          Thông báo
        </span>

        {unreadCount > 0 && (
          <span
            className="absolute -top-1 -right-1 min-w-[1.25rem] h-5 px-1
                     flex items-center justify-center
                     text-[10px] font-bold text-white
                     bg-red-500 rounded-full"
          >
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute left-0 lg:left-auto lg:right-0 mt-2
              w-80 lg:w-96
              bg-white rounded-2xl
              shadow-xl border border-gray-200
              overflow-hidden z-50
            "
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50/50">
              <h3 className="font-semibold text-gray-800">Thông báo</h3>
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-xs text-blue-600 hover:underline font-medium"
                >
                  Đánh dấu đã đọc hết
                </button>
              )}
            </div>

            {/* List */}
            <div
              ref={scrollContainerRef}
              className="max-h-[400px] overflow-y-auto custom-scrollbar"
            >
              {loading && notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500 text-sm">
                  Đang tải...
                </div>
              ) : notifications.length > 0 ? (
                <div>
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        handleClickNotification(item.id, item.isRead, item.link)
                      }
                      className={`relative flex gap-3 p-4 cursor-pointer border-b group transition
                        ${
                          item.isRead
                            ? "bg-white hover:bg-gray-50"
                            : "bg-blue-50/60"
                        }`}
                    >
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center
                        bg-blue-100 text-blue-600"
                      >
                        <Info className="w-5 h-5" />
                      </div>

                      <div className="flex-1 pr-6">
                        <p
                          className={`text-sm ${
                            !item.isRead && "font-semibold"
                          }`}
                        >
                          {item.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                          {item.message}
                        </p>
                        <span className="text-[10px] text-gray-400 block mt-2">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>

                      {!item.isRead && (
                        <span className="absolute top-4 right-4 w-2.5 h-2.5 bg-blue-500 rounded-full" />
                      )}

                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="absolute bottom-2 right-2 p-1.5 text-gray-400 hover:text-red-500
                                   opacity-0 group-hover:opacity-100 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {hasMore && <div ref={loadMoreTriggerRef} className="h-1" />}
                  {loadingMore && (
                    <div className="p-4 text-center text-gray-500 text-sm">
                      Đang tải thêm...
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-8 text-center text-gray-500">
                  Chưa có thông báo
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;
