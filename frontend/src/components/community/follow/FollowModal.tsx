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
    if (open) {
      setPage(1);
    }
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
    // Refresh the list after follow/unfollow
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
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      );
    }

    if (!users || users.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <UserPlus size={48} className="mb-4 opacity-50" />
          <p>
            {followType === "followers"
              ? "Chưa có người theo dõi"
              : "Chưa theo dõi ai"}
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {users.map((user: any, index: number) => {
          const isLastItem = index === users.length - 1;
          const isCurrentUser = currentUser?.id === user.id;

          return (
            <div
              key={user.id}
              ref={isLastItem ? lastUserRef : null}
              className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <Link
                href={`/community/user/${user.id}`}
                onClick={() => onOpenChange(false)}
                className="flex items-center gap-3 flex-1 cursor-pointer"
              >
                <div className="relative w-10 h-10 rounded-full overflow-hidden bg-gray-200">
                  {user.avatar ? (
                    <Image
                      src={user.avatar}
                      alt={`user-${user?.fullName}`}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <UserPlus size={20} />
                    </div>
                  )}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{user.fullName}</p>
                  <p className="text-sm text-gray-500">@{user.email}</p>
                </div>
              </Link>

              {!isCurrentUser && (
                <button
                  onClick={() => handleFollowToggle(user.id)}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                    ${
                      user.isFollowing
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }
                  `}
                >
                  {user.isFollowing ? (
                    <>
                      <UserCheck size={16} />
                      Đang theo dõi
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Theo dõi
                    </>
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
      <div className="fixed inset-0 z-[999] flex items-center justify-center">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={() => onOpenChange(false)}
        />

        {/* Modal */}
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg mx-4 max-h-[80vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Theo dõi</h2>
            <button
              onClick={() => onOpenChange(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Tab Header - Display only */}
          <div className="flex border-b border-gray-200">
            <div
              onClick={() => setFollowType("followers")}
              className={`
              flex-1 py-3 text-sm font-medium text-center transition-all cursor-pointer
              ${
                followType === "followers"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }
            `}
            >
              Người theo dõi
            </div>
            <div
              onClick={() => setFollowType("following")}
              className={`
              flex-1 py-3 text-sm font-medium text-center transition-all cursor-pointer
              ${
                followType === "following"
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-500"
              }
            `}
            >
              Đang theo dõi
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            {renderUserList()}
          </div>
        </div>
      </div>
    </Portal>
  );
}
