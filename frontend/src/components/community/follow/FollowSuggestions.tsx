"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchFollowSuggestions,
  followUser,
  unfollowUser,
} from "@/store/slice/community/followSlice";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Users } from "lucide-react";
import Link from "next/link";

export default function FollowSuggestions() {
  const dispatch = useDispatch<AppDispatch>();
  const { suggestions, loading } = useSelector(
    (state: RootState) => state.follow
  );

  useEffect(() => {
    dispatch(fetchFollowSuggestions({ page: 1, limit: 5 }));
  }, [dispatch]);

  const handleFollowToggle = async (userId: number) => {
    const user = suggestions.find((u: any) => u.id === userId);
    const isFollowing = user?.isFollowing || false;
    if (isFollowing) {
      await dispatch(unfollowUser(userId));
    } else {
      await dispatch(followUser(userId));
    }

    dispatch(fetchFollowSuggestions({ page: 1, limit: 5 }));
  };

  return (
    <aside className="hidden lg:block lg:col-span-3 space-y-8">
      <div className="space-y-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <h3 className="font-semibold text-gray-800 mb-3">Gợi ý theo dõi</h3>

          {loading && (
            <div className="flex justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
            </div>
          )}

          {!loading && suggestions.length === 0 && (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p className="text-sm">Chưa có gợi ý theo dõi</p>
            </div>
          )}

          {!loading && suggestions.length > 0 && (
            <ul className="space-y-3">
              {suggestions.map((user: any) => (
                <li
                  key={user.id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center justify-between gap-3 flex-1 min-w-0">
                    <Link
                      href={`/community/user/${user.id}`}
                      className="flex items-center gap-3 flex-1 min-w-0 group cursor-pointer"
                    >
                      {/* Avatar */}
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarImage
                          src={user.avatar}
                          alt={user.fullname || "User avatar"}
                        />
                        <AvatarFallback>
                          {user.fullname?.charAt(0).toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-gray-800 font-medium text-sm truncate group-hover:text-blue-600 transition-colors">
                          {user.fullname || "Unknown User"}
                        </p>
                        {user.email && (
                          <p className="text-gray-500 text-xs truncate">
                            {user.email}
                          </p>
                        )}
                      </div>
                    </Link>
                  </div>
                  {/* Follow Button */}
                  <button
                    onClick={() => handleFollowToggle(user.id)}
                    className={`text-sm font-medium px-3 py-1 rounded-lg transition-colors flex-shrink-0 ${
                      user.isFollowing
                        ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                        : "bg-blue-600 text-white hover:bg-blue-700"
                    }`}
                  >
                    {user.isFollowing ? "Đang theo dõi" : "Theo dõi"}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
