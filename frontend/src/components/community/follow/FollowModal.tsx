"use client";

import { X, UserPlus, UserCheck } from "lucide-react";
import { useEffect, useState, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchFollowers,
  fetchFollowing,
  followUser,
  unfollowUser,
} from "@/store/slice/community/followSlice";
import Image from "next/image";
import Link from "next/link";
import Portal from "@/components/ui/Portal";
import { motion, AnimatePresence } from "framer-motion";

interface FollowModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  followType: "followers" | "following";
  setFollowType: (type: "followers" | "following") => void;
  userId: number;
}

export default function FollowModal({
  open,
  onOpenChange,
  followType,
  setFollowType,
  userId,
}: FollowModalProps) {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [page, setPage] = useState(1);

  const dispatch = useDispatch<AppDispatch>();
  const { followers, following, loading, pagination } = useSelector(
    (state: RootState) => state.follow
  );
  const { user: currentUser } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (!open || !userId) return;
    const params = { page, limit: 10 };
    if (followType === "followers") {
      dispatch(fetchFollowers({ id: userId, params }));
    } else {
      dispatch(fetchFollowing({ id: userId, params }));
    }
  }, [open, followType, userId, page, dispatch]);

  useEffect(() => {
    if (open) setPage(1);
  }, [open, followType]);

  const lastUserRef = useCallback(
    (node: HTMLDivElement | null) => {
      if (loading) return;
      if (observerRef.current) observerRef.current.disconnect();
      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pagination &&
          page < pagination.totalPages
        ) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observerRef.current.observe(node);
    },
    [loading, pagination, page]
  );

  const handleFollowToggle = async (targetUserId: number) => {
    const users = followType === "followers" ? followers : following;
    const user = users.find((u: any) => u.id === targetUserId);
    const isFollowing = user?.isFollowing || false;
    if (isFollowing) {
      await dispatch(unfollowUser(targetUserId));
    } else {
      await dispatch(followUser(targetUserId));
    }
    if (followType === "followers") {
      dispatch(fetchFollowers({ id: userId }));
    } else {
      dispatch(fetchFollowing({ id: userId }));
    }
  };

  const renderUserList = () => {
    const users = followType === "followers" ? followers : following;

    if (loading) {
      return (
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="flex items-center justify-between p-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-800" />
                <div className="space-y-2">
                  <div className="h-3 bg-slate-800 rounded w-28" />
                  <div className="h-2 bg-slate-800 rounded w-20" />
                </div>
              </div>
              <div className="h-8 w-20 bg-slate-800 rounded-xl" />
            </div>
          ))}
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-14 text-slate-500">
          <div className="w-14 h-14 bg-slate-800 rounded-3xl flex items-center justify-center mb-4">
            <UserPlus size={24} className="text-slate-600" />
          </div>
          <p className="text-sm font-semibold">
            {followType === "followers" ? "Chưa có người theo dõi" : "Chưa theo dõi ai"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-1">
        {users.map((user: any, index: number) => {
          const isLastItem = index === users.length - 1;
          const isCurrentUser = currentUser?.id === user.id;

          return (
            <div
              key={user.id}
              ref={isLastItem ? lastUserRef : null}
              className="flex items-center justify-between px-3 py-3 rounded-xl hover:bg-slate-800/60 transition-colors"
            >
              <Link
                href={`/community/user/${user.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 flex-1 min-w-0"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-indigo-600/20 border border-indigo-500/20 flex-shrink-0">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={user.fullname || "User"}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-indigo-400 font-black text-sm">
                      {user.fullname?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-slate-200 text-sm truncate hover:text-indigo-400 transition-colors">
                    {user.fullname || user.fullName}
                  </p>
                  <p className="text-xs text-slate-500 truncate">@{user.email}</p>
                </div>
              </Link>

              {!isCurrentUser && (
                <button
                  onClick={() => handleFollowToggle(user.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all flex-shrink-0 ${
                    user.isFollowing
                      ? "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                      : "bg-indigo-600 text-white hover:bg-indigo-500 shadow-md shadow-indigo-600/20"
                  }`}
                >
                  {user.isFollowing ? (
                    <><UserCheck size={12} />Đang theo dõi</>
                  ) : (
                    <><UserPlus size={12} />Theo dõi</>
                  )}
                </button>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  if (!open) return null;

  return (
    <Portal>
      <AnimatePresence>
        <div className="fixed inset-0 z-[999] flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={() => onOpenChange(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2 }}
            className="relative bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl w-full max-w-lg max-h-[80vh] flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 shrink-0">
              <h2 className="text-lg font-black text-slate-100 tracking-tight">Theo dõi</h2>
              <button
                onClick={() => onOpenChange(false)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-all"
              >
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-800 shrink-0">
              {(["followers", "following"] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setFollowType(type)}
                  className={`flex-1 py-3 text-xs font-black uppercase tracking-widest text-center transition-all relative ${
                    followType === type
                      ? "text-indigo-400"
                      : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {type === "followers" ? "Người theo dõi" : "Đang theo dõi"}
                  {followType === type && (
                    <motion.div
                      layoutId="followTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-500"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-3 py-3">
              {renderUserList()}
            </div>
          </motion.div>
        </div>
      </AnimatePresence>
    </Portal>
  );
}
