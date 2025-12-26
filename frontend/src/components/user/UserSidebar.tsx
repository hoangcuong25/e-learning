"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { LogOut, ShoppingCart, User, BookOpen } from "lucide-react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { logoutUser } from "@/store/userSlice";

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
      icon: <User className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Giỏ hàng của tôi",
      href: "/cart",
      icon: <ShoppingCart className="w-5 h-5 text-indigo-500" />,
    },
    {
      label: "Khóa học của tôi",
      href: "/my-learning",
      icon: <BookOpen className="w-5 h-5 text-indigo-500" />,
    },
  ];

  return (
    <motion.aside
      initial={{ x: -20, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-xs bg-white rounded-2xl shadow-lg border border-gray-200 p-6"
    >
      {/* User info */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="User avatar"
          width={48}
          height={48}
          className="rounded-full border border-indigo-200 object-cover"
        />
        <div>
          <p className="text-sm font-semibold text-gray-800">
            {user?.fullname || "Người dùng"}
          </p>
          <p className="text-xs text-gray-500">{user?.email}</p>
        </div>
      </div>

      {/* Menu list */}
      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 rounded-xl hover:bg-indigo-50 hover:text-indigo-600 transition"
          >
            {item.icon}
            {item.label}
          </Link>
        ))}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 rounded-xl hover:bg-red-50 transition font-medium mt-2"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </nav>
    </motion.aside>
  );
};

export default UserSidebar;
