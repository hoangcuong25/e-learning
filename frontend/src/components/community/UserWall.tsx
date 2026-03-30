"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllPosts } from "@/store/slice/community/postSlice";
import { followUser, unfollowUser } from "@/store/slice/community/followSlice";
import { fetchUserWall } from "@/store/slice/common/userSlice";
import {
  findOrCreateConversation,
  setMiniChatOpen,
} from "@/store/slice/community/chatSlice";
import CommunityFeed from "./post/CommunityFeed";
import Image from "next/image";
import {
  UserPlus,
  UserCheck,
  MessageCircle,
  Users,
  FileText,
  GraduationCap,
  Crown,
  User,
  Mail,
} from "lucide-react";
import { useRouter } from "next/navigation";
import FollowModal from "./follow/FollowModal";
import { toast } from "sonner";
import { motion } from "framer-motion";

interface UserProfileProps {
  userId: number;
}

export default function UserWall({ userId }: UserProfileProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.post,
  );
  const {
    user: currentUser,
    userWatching,
    loading: userLoading,
  } = useSelector((state: RootState) => state.user);

  const router = useRouter();

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followType, setFollowType] = useState<"followers" | "following">(
    "followers",
  );
  const [isFollowLoading, setIsFollowLoading] = useState(false);

  const profileUserId = posts[0]?.author?.id;
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    dispatch(fetchAllPosts({ authorId: userId }));
    dispatch(fetchUserWall(profileUserId));
  }, [dispatch, userId, profileUserId]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập để theo dõi người dùng");
      return;
    }
    setIsFollowLoading(true);
    try {
      if (userWatching?.isFollowing) {
        await dispatch(unfollowUser(userId)).unwrap();
        dispatch(fetchUserWall(profileUserId));
        toast.success("Đã bỏ theo dõi");
      } else {
        await dispatch(followUser(userId)).unwrap();
        dispatch(fetchUserWall(profileUserId));
        toast.success("Đã theo dõi");
      }
      dispatch(fetchAllPosts({ authorId: userId }));
    } catch {
      toast.error("Có lỗi xảy ra");
    } finally {
      setIsFollowLoading(false);
    }
  };

  const handleMessageClick = async () => {
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập để nhắn tin");
      return;
    }
    try {
      await dispatch(findOrCreateConversation(userId)).unwrap();
      dispatch(setMiniChatOpen(true));
    } catch {
      toast.error("Có lỗi xảy ra khi tạo cuộc trò chuyện");
    }
  };

  const getRoleBadge = (role?: string) => {
    if (role === "INSTRUCTOR")
      return {
        label: "Giảng viên",
        icon: GraduationCap,
        color: "text-amber-400 bg-amber-500/10 border-amber-500/20",
      };
    if (role === "ADMIN")
      return {
        label: "Quản trị viên",
        icon: Crown,
        color: "text-rose-400 bg-rose-500/10 border-rose-500/20",
      };
    return {
      label: "Học viên",
      icon: User,
      color: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    };
  };

  // ─── Loading state ─────────────────────────────────────────
  if (userLoading && posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 space-y-5">
        {/* Skeleton header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 animate-pulse">
          <div className="flex gap-6 items-start">
            <div className="w-24 h-24 rounded-full bg-slate-800 flex-shrink-0" />
            <div className="flex-1 space-y-3 pt-2">
              <div className="h-5 bg-slate-800 rounded-lg w-48" />
              <div className="h-3 bg-slate-800 rounded-lg w-32" />
              <div className="flex gap-4 mt-4">
                <div className="h-8 bg-slate-800 rounded-lg w-24" />
                <div className="h-8 bg-slate-800 rounded-lg w-24" />
              </div>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl h-40 animate-pulse" />
      </div>
    );
  }

  // ─── Not found ─────────────────────────────────────────────
  if (!userLoading && !userWatching) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-slate-900 border-2 border-dashed border-slate-800 rounded-2xl p-12 text-center">
          <div className="w-16 h-16 bg-slate-800 rounded-3xl flex items-center justify-center mx-auto mb-4">
            <User className="w-8 h-8 text-slate-600" />
          </div>
          <p className="text-slate-400 font-semibold">
            Không tìm thấy người dùng
          </p>
        </div>
      </div>
    );
  }

  const roleBadge = getRoleBadge(userWatching?.role);
  const RoleIcon = roleBadge.icon;

  return (
    <div className="max-w-4xl mx-auto px-6 space-y-6">
      {/* ─── Profile Header ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl"
      >
        {/* Cover gradient */}
        <div className="h-28 relative bg-gradient-to-r from-slate-800 via-indigo-950/60 to-slate-800 overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/15 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/4" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-600/10 rounded-full blur-[50px] translate-y-1/2 -translate-x-1/4" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="px-8 pb-8">
          {/* Avatar — positioned over cover */}
          <div className="flex flex-col md:flex-row gap-6 items-start md:items-end -mt-12">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-slate-900 shadow-2xl bg-indigo-600/20">
                {userWatching?.avatar ? (
                  <Image
                    src={userWatching.avatar}
                    alt={userWatching.fullname || "User"}
                    fill
                    className="object-cover rounded-full"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-indigo-600 text-white text-3xl font-black">
                    {userWatching?.fullname?.[0] || "U"}
                  </div>
                )}
              </div>
              {/* Role badge dot */}
              <div className="absolute -bottom-1 -right-1 w-7 h-7 bg-slate-900 rounded-full border-2 border-slate-900 flex items-center justify-center">
                <RoleIcon size={14} className={roleBadge.color.split(" ")[0]} />
              </div>
            </div>

            {/* Name */}
            <div className="flex-1 pt-4 md:pt-0 flex flex-col md:flex-row md:items-end justify-between gap-4 w-full">
              <div className="mb-2">
                <h1 className="text-2xl font-black text-white tracking-tight mb-4">
                  {userWatching?.fullname || "Người dùng ẩn danh"}
                </h1>
                <div className="flex flex-wrap items-center gap-2 mt-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider border ${roleBadge.color}`}
                  >
                    <RoleIcon size={11} />
                    {roleBadge.label}
                  </span>
                  {userWatching?.email && (
                    <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                      <Mail size={11} />
                      {userWatching.email}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          {!isOwnProfile && currentUser && (
            <div className="flex items-center gap-2 mt-8">
              <button
                onClick={handleMessageClick}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 uppercase tracking-wide transition-all duration-200"
              >
                <MessageCircle size={14} />
                Nhắn tin
              </button>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={handleFollowToggle}
                disabled={isFollowLoading}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black uppercase tracking-wide transition-all duration-200 disabled:opacity-60 ${
                  userWatching?.isFollowing
                    ? "bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700"
                    : "bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20"
                }`}
              >
                {userWatching?.isFollowing ? (
                  <>
                    <UserCheck size={14} />
                    Đã theo dõi
                  </>
                ) : (
                  <>
                    <UserPlus size={14} />
                    Theo dõi
                  </>
                )}
              </motion.button>
            </div>
          )}

          {/* Stats row */}
          <div className="flex items-center gap-1 mt-6 border-t border-slate-800 pt-5">
            <button
              onClick={() => {
                setFollowType("followers");
                setFollowModalOpen(true);
              }}
              className="flex flex-col items-center px-6 py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 group"
            >
              <span className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                {userWatching?._count?.followers ?? "—"}
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-0.5">
                Người theo dõi
              </span>
            </button>

            <div className="w-px h-10 bg-slate-800" />

            <button
              onClick={() => {
                setFollowType("following");
                setFollowModalOpen(true);
              }}
              className="flex flex-col items-center px-6 py-3 rounded-xl hover:bg-slate-800 transition-all duration-200 group"
            >
              <span className="text-xl font-black text-white group-hover:text-indigo-400 transition-colors">
                {userWatching?._count?.following ?? "—"}
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-0.5">
                Đang theo dõi
              </span>
            </button>

            <div className="w-px h-10 bg-slate-800" />

            <div className="flex flex-col items-center px-6 py-3">
              <span className="text-xl font-black text-white">
                {posts.length}
              </span>
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] mt-0.5">
                Bài viết
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── Posts Section ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="space-y-5"
      >
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl">
            <FileText size={14} className="text-indigo-400" />
            <h2 className="text-xs font-black text-slate-300 uppercase tracking-[0.15em]">
              Bài viết của {userWatching?.fullname || "người dùng"}
            </h2>
          </div>
        </div>
        <CommunityFeed />
      </motion.div>

      {/* Follow Modal */}
      <FollowModal
        open={followModalOpen}
        onOpenChange={setFollowModalOpen}
        followType={followType}
        setFollowType={setFollowType}
        userId={userId}
      />
    </div>
  );
}
