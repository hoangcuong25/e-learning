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
  MapPin,
  Calendar,
  MessageCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";
import FollowModal from "./follow/FollowModal";
import { toast } from "sonner";

interface UserProfileProps {
  userId: number;
}

export default function UserWall({ userId }: UserProfileProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading: postsLoading } = useSelector(
    (state: RootState) => state.post
  );

  const {
    user: currentUser,
    userWatching,
    loading: userLoading,
  } = useSelector((state: RootState) => state.user);

  const router = useRouter();

  const [followModalOpen, setFollowModalOpen] = useState(false);
  const [followType, setFollowType] = useState<"followers" | "following">(
    "followers"
  );

  // Get profile user from posts (first post's author)
  const profileUserId = posts[0]?.author?.id;

  // Check if current user is viewing their own profile
  const isOwnProfile = currentUser?.id === userId;

  useEffect(() => {
    // Fetch posts by this user
    dispatch(fetchAllPosts({ authorId: userId }));

    // Fetch user wall
    dispatch(fetchUserWall(profileUserId));
  }, [dispatch, userId, profileUserId]);

  const handleFollowToggle = async () => {
    if (!currentUser) {
      toast.error("Bạn cần đăng nhập để theo dõi người dùng");
      return;
    }

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
      // Refresh posts to get updated isFollowing status
      dispatch(fetchAllPosts({ authorId: userId }));
    } catch (error) {
      toast.error("Có lỗi xảy ra");
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
    } catch (error) {
      console.error("Failed to create conversation:", error);
      toast.error("Có lỗi xảy ra khi tạo cuộc trò chuyện");
    }
  };

  const handleFollowersClick = () => {
    setFollowType("followers");
    setFollowModalOpen(true);
  };

  const handleFollowingClick = () => {
    setFollowType("following");
    setFollowModalOpen(true);
  };

  if (userLoading && posts.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
          Đang tải thông tin người dùng...
        </div>
      </div>
    );
  }

  if (!userLoading && !userWatching) {
    return (
      <div className="max-w-4xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-8 text-center text-gray-500 shadow-sm">
          Không tìm thấy người dùng
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-sm p-8 mb-6">
        <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
          {/* Avatar */}
          <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
            {userWatching?.avatar ? (
              <Image
                src={userWatching.avatar}
                alt={userWatching.fullname || "User"}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-600 text-white text-4xl font-bold">
                {userWatching?.fullname?.[0] || "U"}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1">
            <div className="flex flex-col md:flex-row md:items-center gap-4 mb-3">
              <h1 className="text-2xl font-bold text-gray-800">
                {userWatching?.fullname || "Người dùng ẩn danh"}
              </h1>
            </div>

            {/* Stats */}
            <div className="flex gap-6 text-sm text-gray-600 mb-4">
              <button
                onClick={handleFollowersClick}
                className="hover:text-blue-600 transition-colors"
              >
                Người theo dõi
              </button>
              <button
                onClick={handleFollowingClick}
                className="hover:text-blue-600 transition-colors"
              >
                Đang theo dõi
              </button>
              <div>
                <span className="font-semibold text-gray-800">
                  {posts.length}
                </span>{" "}
                Bài viết
              </div>
            </div>

            <div className="flex justify-between items-center">
              {/* Additional Info */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                {userWatching?.email && (
                  <div className="flex items-center gap-1">
                    <span>📧</span>
                    <span>{userWatching.email}</span>
                  </div>
                )}
                {userWatching?.role && (
                  <div className="flex items-center gap-1">
                    <span>
                      {userWatching.role === "INSTRUCTOR"
                        ? "👨‍🏫"
                        : userWatching.role === "ADMIN"
                        ? "👑"
                        : "👤"}
                    </span>
                    <span>
                      {userWatching.role === "INSTRUCTOR"
                        ? "Giảng viên"
                        : userWatching.role === "ADMIN"
                        ? "Quản trị viên"
                        : "Học viên"}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Follow & Message Buttons */}
            {!isOwnProfile && currentUser && (
              <div className="flex items-center justify-between gap-2 mt-4">
                <button
                  onClick={handleMessageClick}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <MessageCircle size={16} />
                  Nhắn tin
                </button>

                <button
                  onClick={handleFollowToggle}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    userWatching?.isFollowing
                      ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                      : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {userWatching?.isFollowing ? (
                    <>
                      <UserCheck size={16} />
                      Đã theo dõi
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} />
                      Theo dõi
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Posts Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-gray-800 px-2">
          Bài viết của {userWatching?.fullname || "người dùng"}
        </h2>
        <CommunityFeed />
      </div>

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
