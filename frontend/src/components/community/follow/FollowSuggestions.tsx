"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchFollowSuggestions,
  followUser,
  unfollowUser,
} from "@/store/slice/community/followSlice";
import { Users, UserPlus, UserCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded-lg bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center">
          <Users size={12} className="text-indigo-400" />
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
          Gợi ý theo dõi
        </p>
      </div>

      {/* Loading skeletons */}
      {loading && (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-3 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-slate-800 flex-shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-2.5 bg-slate-800 rounded w-24" />
                  <div className="h-2 bg-slate-800 rounded w-16" />
                </div>
              </div>
              <div className="h-7 w-16 bg-slate-800 rounded-lg" />
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && suggestions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-6 text-slate-600">
          <Users className="w-8 h-8 mb-2 opacity-40" />
          <p className="text-xs font-medium">Chưa có gợi ý</p>
        </div>
      )}

      {/* Suggestions list */}
      {!loading && suggestions.length > 0 && (
        <ul className="space-y-2">
          {suggestions.map((user: any, i: number) => (
            <motion.li
              key={user.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="flex items-center justify-between gap-2"
            >
              {/* Avatar + Info */}
              <Link
                href={`/community/user/${user.id}`}
                className="flex items-center gap-2.5 flex-1 min-w-0 group"
              >
                <div className="relative w-9 h-9 rounded-full overflow-hidden bg-indigo-600/20 border border-indigo-500/20 flex-shrink-0">
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
                  <p className="text-sm font-bold text-slate-300 truncate group-hover:text-indigo-400 transition-colors">
                    {user.fullname || "Unknown"}
                  </p>
                  {user.email && (
                    <p className="text-[11px] text-slate-600 truncate">
                      {user.email}
                    </p>
                  )}
                </div>
              </Link>

              {/* Follow button */}
              <button
                onClick={() => handleFollowToggle(user.id)}
                className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-black uppercase tracking-wide transition-all flex-shrink-0 ${
                  user.isFollowing
                    ? "bg-slate-800 text-slate-400 hover:bg-slate-700 border border-slate-700"
                    : "bg-indigo-600/20 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/30"
                }`}
              >
                {user.isFollowing ? (
                  <><UserCheck size={11} />Đang theo dõi</>
                ) : (
                  <><UserPlus size={11} />Theo dõi</>
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Divider + footer hint */}
      {!loading && suggestions.length > 0 && (
        <div className="pt-1 border-t border-slate-800">
          <p className="text-[10px] text-slate-600 text-center font-medium">
            Khám phá thêm người dùng trong cộng đồng
          </p>
        </div>
      )}
    </div>
  );
}
