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
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) return;
    dispatch(fetchDailyMissions());
    timerRef.current = setInterval(() => {
      dispatch(updateMissionProgress(1))
        .unwrap()
        .then((res) => {
           if (res.totalReward && res.totalReward > 0) {
             toast.success(`🎉 Chúc mừng! Bạn vừa hoàn thành nhiệm vụ và nhận được ${new Intl.NumberFormat('vi-VN').format(res.totalReward)} Learncoin!`);
           }
        })
        .catch((error) => console.error("Lỗi cập nhật nhiệm vụ:", error));
    }, 60000);

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
    { label: "Hồ sơ của tôi", href: "/profile", icon: <User className="w-5 h-5" /> },
    { label: "Ví của tôi", href: "/wallet", icon: <Wallet className="w-5 h-5" /> },
    { label: "Giỏ hàng của tôi", href: "/cart", icon: <ShoppingCart className="w-5 h-5" /> },
    { label: "Khóa học của tôi", href: "/my-learning", icon: <BookOpen className="w-5 h-5" /> },
    { label: "Nhiệm vụ hàng ngày", href: "/mission", icon: <Target className="w-5 h-5" /> },
  ];

  return (
    <div className="w-full bg-white rounded-[2.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.06)] border border-slate-100 p-8 lg:p-10 space-y-10 overflow-hidden">
      {/* User Info Hero */}
      <div className="flex items-center gap-5 pb-8 border-b border-slate-50">
        <div className="relative group">
          <div className="absolute -inset-1 bg-indigo-500 rounded-full blur opacity-25 group-hover:opacity-50 transition duration-1000" />
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="User avatar"
            width={64}
            height={64}
            className="relative rounded-full border-2 border-white object-cover w-14 h-14 lg:w-16 lg:h-16 shadow-lg shadow-indigo-500/10"
          />
          <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-white rounded-full" />
        </div>
        <div className="min-w-0">
          <p className="text-lg font-black text-slate-900 truncate tracking-tight">
            {user?.fullname || "Người dùng"}
          </p>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">
            {user?.email}
          </p>
        </div>
      </div>

      {/* Navigation List */}
      <nav className="flex flex-col gap-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                  flex items-center gap-4 px-6 py-4
                  text-sm rounded-2xl whitespace-nowrap transition-all duration-300 group
                  ${
                    isActive
                      ? "bg-indigo-600 text-white font-black shadow-xl shadow-indigo-600/20 translate-x-1"
                      : "text-slate-600 hover:bg-slate-50 hover:text-indigo-600 hover:translate-x-1"
                  }
                `}
            >
              <span className={`transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-600'}`}>
                {item.icon}
              </span>
              <span className="font-bold tracking-tight">{item.label}</span>
            </Link>
          );
        })}

        <div className="pt-4 mt-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-4 px-6 py-4 text-sm text-red-600 bg-red-50/50 hover:bg-red-50 rounded-2xl transition-all duration-300 font-black group hover:scale-[1.02] hover:translate-x-1 border border-red-100/50"
          >
            <LogOut className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="tracking-tight">Đăng xuất hệ thống</span>
          </button>
        </div>
      </nav>
    </div>
  );
};


export default UserSidebar;
