"use client";

import React, { useEffect } from "react";
import { Menu, User } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@public/logo.png";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import { fetchUser, logoutUser } from "@/store/user/userSlice";

const NavbarUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(fetchUser());
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutUser(router));
  };

  if (loading) return <p>Loading...</p>;

  return (
    <motion.nav
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="bg-white/80 backdrop-blur-md shadow-xl border border-gray-200 px-6 py-3 flex items-center justify-between sticky top-0 z-50 max-w-[1700px] mx-auto rounded-2xl"
    >
      {/* Logo + Name */}
      <motion.div
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="flex items-center gap-3 cursor-pointer"
      >
        <Link href="/">
          <Image
            src={logo}
            alt="EduSmart Logo"
            width={45}
            height={45}
            className="rounded-full"
          />
        </Link>
        <span className="hidden md:block text-xl font-bold text-indigo-600 tracking-wide">
          EduSmart
        </span>
      </motion.div>

      {/* Menu Links - Desktop */}
      <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
        {[
          { label: "Trang chủ", path: "/" },
          { label: "Khóa học", path: "courses" },
          { label: "Lộ trình học", path: "my-learning" },
          { label: "Liên hệ", path: "contact-us" },
        ].map((item, index) => (
          <motion.li
            key={index}
            whileHover={{ scale: 1.1, color: "#4f46e5" }}
            transition={{ type: "spring", stiffness: 300 }}
            className="text-gray-700 cursor-pointer"
          >
            <Link href={`/${item.path}`}>{item.label}</Link>
          </motion.li>
        ))}
      </ul>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:text-indigo-600 transition-colors duration-200" />
          </motion.div>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 px-2.5">
          <SheetHeader className="flex flex-col items-start gap-4 mb-6">
            {/* Logo + Tên */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-3 cursor-pointer"
            >
              <Image
                src={logo}
                alt="EduSmart Logo"
                width={40}
                height={40}
                className="rounded-full"
              />
              <span className="text-lg font-bold text-indigo-600">
                EduSmart
              </span>
            </motion.div>
          </SheetHeader>

          {/* Menu Items */}
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            {[
              { label: "Trang chủ", path: "/" },
              { label: "Khóa học", path: "courses" },
              { label: "Lộ trình học", path: "my-learning" },
              { label: "Liên hệ", path: "contact" },
            ].map((item, index) => (
              <motion.span
                key={index}
                whileHover={{ x: 5, color: "#4f46e5" }}
                transition={{ type: "spring", stiffness: 300 }}
                className="cursor-pointer"
              >
                <Link href={`/${item.path}`}>{item.label}</Link>
              </motion.span>
            ))}
          </nav>

          {/* User Actions */}
          <div className="mt-6 flex flex-col gap-3">
            {/* User info / login */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition duration-200"
              >
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullname}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover border border-indigo-400/40"
                />
                <span className="text-sm font-medium text-indigo-600">
                  {user.fullname}
                </span>
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-400/30 rounded-full hover:bg-indigo-500/20 transition duration-200"
                >
                  <User className="w-5 h-5 text-indigo-600" />
                  <span className="text-indigo-600 text-sm font-semibold">
                    Đăng nhập
                  </span>
                </Link>
              </motion.div>
            )}

            {/* Notifications */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="flex items-center gap-2 px-3 py-2 bg-indigo-100/50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-5 h-5 text-indigo-600"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.25 18.75a1.5 1.5 0 11-3 0m6-6V9a6 6 0 10-12 0v3l-1.5 3h15l-1.5-3z"
                />
              </svg>
              <span className="text-indigo-600 text-sm font-medium cursor-pointer">
                Thông báo
              </span>
            </motion.button>
          </div>
        </SheetContent>
      </Sheet>

      {/* User Section - Desktop */}
      <div className="hidden lg:flex items-center gap-5">
        {user ? (
          <div className="relative group inline-block">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-100 rounded-full hover:bg-indigo-100 transition duration-200">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.fullname}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-indigo-600">
                {user.fullname}
              </span>
            </button>

            {/* Dropdown */}
            <div
              className="
                invisible opacity-0 translate-y-1
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-150
                absolute right-0 mt-2 w-56 z-50
                rounded-xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-lg
              "
            >
              <div className="px-4 py-3">
                <p className="text-sm font-semibold text-gray-800 truncate">
                  {user.fullname}
                </p>
                <p className="text-xs text-gray-500 truncate">{user.email}</p>
              </div>
              <div className="py-1">
                <Link
                  href="/profile"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Hồ sơ học viên
                </Link>
                <Link
                  href="/my-learning"
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50"
                >
                  Khóa học của tôi
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-400/30 rounded-full hover:bg-indigo-500/20 transition duration-200"
          >
            <User className="w-5 h-5 text-indigo-600" />
            <span className="text-indigo-600 text-sm font-semibold">
              Đăng nhập
            </span>
          </Link>
        )}

        {/* Notifications */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          className="relative flex items-center gap-2 px-3 py-1.5 bg-indigo-100/50 border border-indigo-200 rounded-full hover:bg-indigo-100 transition duration-200"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-5 h-5 text-indigo-600"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M14.25 18.75a1.5 1.5 0 11-3 0m6-6V9a6 6 0 10-12 0v3l-1.5 3h15l-1.5-3z"
            />
          </svg>
          <span className="text-indigo-600 text-sm font-medium cursor-pointer">
            Thông báo
          </span>

          {/* Badge số lượng */}
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full">
            3
          </span>
        </motion.button>
      </div>
    </motion.nav>
  );
};

export default NavbarUser;
