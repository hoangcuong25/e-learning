"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, ShoppingCart, User, BookOpen, Wallet, Target } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { logoutUser } from "@/store/slice/common/userSlice";
import { updateMissionProgress, fetchDailyMissions } from "@/store/slice/mission/missionSlice";

const UserSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const router = useRouter();
  const pathname = usePathname();
  
  // Ref để lưu trữ timer nhằm clear khi unmount
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Hiệu ứng theo dõi thời gian online
  useEffect(() => {
    // Chỉ bật tracking nếu user đã đăng nhập
    if (!user) return;

    // Lấy trước dữ liệu phòng khi user không vào tab Nhiệm vụ
    dispatch(fetchDailyMissions());

    timerRef.current = setInterval(() => {
      // Mỗi 1 phút (60,000 ms) gửi request 1 lần để cập nhật 1 phút vào CSDL
      dispatch(updateMissionProgress(1))
        .unwrap()
        .then((res) => {
           // Nếu user vừa đạt mốc và nhận thưởng, hiện thông báo cho xôm!
           if (res.totalReward && res.totalReward > 0) {
             toast.success(`🎉 Chúc mừng! Bạn vừa hoàn thành nhiệm vụ và nhận được ${new Intl.NumberFormat('vi-VN').format(res.totalReward)} Learncoin!`);
           }
        })
        .catch((error) => console.error("Lỗi cập nhật nhiệm vụ:", error));
    }, 60000); // 60,000ms = 1 phút

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [dispatch, user]);

  const handleLogout = async () => {
    dispatch(logoutUser());

    router.push("/login");
    toast.success("Đăng xuất thành công");
  };

  const menuItems = [
    {
      label: "Hồ sơ của tôi",
      href: "/profile",
      icon: <User className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Ví của tôi",
      href: "/wallet",
      icon: <Wallet className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Giỏ hàng của tôi",
      href: "/cart",
      icon: <ShoppingCart className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Khóa học của tôi",
      href: "/my-learning",
      icon: <BookOpen className="w-5 h-5 text-blue-500" />,
    },
    {
      label: "Nhiệm vụ",
      href: "/mission",
      icon: <Target className="w-5 h-5 text-blue-500" />,
    },
  ];

  return (
    <div className="w-full lg:max-w-xs bg-transparent lg:bg-white lg:rounded-2xl lg:shadow-lg lg:border lg:border-gray-200 p-0 lg:p-6">
      {/* User info */}
      <div className="flex items-center gap-3 mb-4 lg:mb-6 lg:pb-4 lg:border-b border-gray-100">
        <div className="relative shrink-0">
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User avatar"
            width={48}
            height={48}
            className="rounded-full border border-blue-200 object-cover w-10 h-10 lg:w-12 lg:h-12"
          />
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-gray-800 truncate">
            {user?.fullname || "Người dùng"}
          </p>
          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Menu list */}
      <nav className="flex flex-row lg:flex-col gap-2 lg:gap-1 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                  flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-2.5
                  text-sm rounded-xl whitespace-nowrap flex-shrink-0 transition
                  ${
                    isActive
                      ? "bg-blue-100 text-blue-600 font-semibold"
                      : "text-gray-700 bg-gray-50 lg:bg-transparent hover:bg-blue-50 hover:text-blue-600"
                  }
                  border border-gray-100 lg:border-none
                `}
            >
              {item.icon}
              <span>{item.label}</span>
            </Link>
          );
        })}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-2.5 text-sm text-red-600 bg-red-50 lg:bg-transparent rounded-xl hover:bg-red-50 transition font-medium lg:mt-2 whitespace-nowrap flex-shrink-0 border border-red-100 lg:border-none"
        >
          <LogOut className="w-5 h-5" />
          <span>Đăng xuất</span>
        </button>
      </nav>
    </div>
  );
};

export default UserSidebar;
