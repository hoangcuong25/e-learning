"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, ShoppingCart, User, BookOpen, Wallet } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { logoutUser } from "@/store/slice/userSlice";

const UserSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const router = useRouter();

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
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-2 lg:gap-3 px-3 py-2 lg:px-4 lg:py-2.5 text-sm text-gray-700 bg-gray-50 lg:bg-transparent rounded-xl hover:bg-blue-50 hover:text-blue-600 transition whitespace-nowrap flex-shrink-0 border border-gray-100 lg:border-none"
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}

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
