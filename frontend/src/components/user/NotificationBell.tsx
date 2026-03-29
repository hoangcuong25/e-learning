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
} from "@/store/slice/common/notificationsSlice";

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
        whileHover={{ scale: 1.1, rotate: 10 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleDropdown}
        className="relative p-2.5 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-white hover:border-indigo-100 transition-all duration-300 shadow-sm group"
      >
        <Bell className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        
        {unreadCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[1.25rem] h-5 px-1 flex items-center justify-center text-[10px] font-black text-white bg-indigo-600 rounded-full border-2 border-white shadow-lg shadow-indigo-100">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </motion.button>

      {/* Dropdown container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.95 }}
            transition={{ duration: 0.3, ease: "circOut" }}
            className="absolute right-0 mt-4 w-80 lg:w-[420px] bg-white/95 backdrop-blur-xl rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.15)] border border-slate-100 overflow-hidden z-50 origin-top-right mb-10"
          >
            {/* Header */}
            <div className="px-8 py-6 bg-slate-50/50 border-b border-slate-50 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Thông báo</h3>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{unreadCount} tin nhắn mới</p>
              </div>
              {unreadCount > 0 && (
                <button
                  onClick={() => dispatch(markAllAsRead())}
                  className="text-[10px] font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-700 transition-colors"
                >
                  Đọc hết
                </button>
              )}
            </div>

            {/* List Container */}
            <div
              ref={scrollContainerRef}
              className="max-h-[480px] overflow-y-auto custom-scrollbar"
            >
              {loading && notifications.length === 0 ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                   <div className="w-12 h-12 border-4 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
                   <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Đang cập nhật...</p>
                </div>
              ) : notifications.length > 0 ? (
                <div className="p-3 space-y-1">
                  {notifications.map((item) => (
                    <div
                      key={item.id}
                      onClick={() =>
                        handleClickNotification(item.id, item.isRead, item.link)
                      }
                      className={`relative flex gap-4 p-5 cursor-pointer rounded-3xl transition-all duration-300 group
                        ${item.isRead ? "bg-white hover:bg-slate-50" : "bg-indigo-50/40 hover:bg-indigo-50/60"}`}
                    >
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm
                        ${item.isRead ? "bg-slate-50 text-slate-400" : "bg-white text-indigo-600 shadow-indigo-100"}`}
                      >
                        <Info className="w-6 h-6" />
                      </div>

                      <div className="flex-1 space-y-1 min-w-0 pr-6">
                        <p className={`text-sm leading-tight transition-colors ${item.isRead ? "text-slate-600 font-medium" : "text-slate-900 font-black"}`}>
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-400 font-medium line-clamp-2 leading-relaxed">
                          {item.message}
                        </p>
                        <span className="text-[10px] font-bold text-slate-300 block pt-1 uppercase tracking-wider">
                          {formatTime(item.createdAt)}
                        </span>
                      </div>

                      {!item.isRead && (
                        <div className="absolute top-6 right-6 w-2.5 h-2.5 bg-indigo-600 rounded-full shadow-lg shadow-indigo-100" />
                      )}

                      <button
                        onClick={(e) => handleDelete(e, item.id)}
                        className="absolute bottom-4 right-4 p-2 text-slate-300 hover:text-rose-500 bg-white shadow-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}

                  {hasMore && <div ref={loadMoreTriggerRef} className="h-4" />}
                  {loadingMore && (
                    <div className="py-6 flex justify-center">
                       <div className="w-6 h-6 border-2 border-slate-100 border-t-indigo-500 rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-24 px-10 text-center space-y-4">
                  <div className="w-16 h-16 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto">
                     <Bell className="w-8 h-8 text-slate-200" />
                  </div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-loose">
                    Tuyệt vời! Bạn không có <br/> thông báo mới nào
                  </p>
                </div>
              )}
            </div>
            
            <div className="px-8 py-5 bg-slate-50/30 border-t border-slate-50 text-center">
               <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">EduSmart Intelligence</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


export default NotificationBell;
