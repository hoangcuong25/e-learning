"use client";

import React, { useEffect } from "react";
import { GraduationCap, Menu, User } from "lucide-react";
import Image from "next/image";
import { motion } from "framer-motion";
import logo from "@public/logo.png";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter, usePathname } from "next/navigation";
import { fetchUser, logoutUser } from "@/store/slice/userSlice";
import { toast } from "sonner";
import LoadingScreen from "../LoadingScreen";
import { fetchUnreadCount } from "@/store/slice/notificationsSlice";
import NotificationBell from "./NotificationBell";
import { VisuallyHidden } from "../ui/visually-hidden";

const NavbarUser = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(fetchUser());
      dispatch(fetchUnreadCount());
    }
  }, [dispatch]);

  const handleLogout = async () => {
    dispatch(logoutUser());
    router.push("/login");
    toast.success("Đăng xuất thành công");
  };

  const handleClickInstructor = () => {
    if (user?.role === "INSTRUCTOR") {
      router.push("/instructor/dashboard");
    } else {
      router.push("/become-instructor");
    }
  };

  const menuItems = [
    { label: "Trang chủ", path: "/" },
    { label: "Khóa học", path: "/courses" },
    { label: "Cộng đồng", path: "/community" },
    { label: "Smart Hub", path: "/smart-hub" },
  ];

  if (loading) return <LoadingScreen />;

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
        <span className="hidden md:block text-xl font-bold text-blue-600 tracking-wide">
          EduSmart
        </span>
      </motion.div>

      {/* Menu Links - Desktop */}
      <ul className="hidden lg:flex items-center gap-8 text-sm font-medium">
        {menuItems.map((item, index) => {
          const isActive =
            item.path === "/"
              ? pathname === "/"
              : pathname.startsWith(item.path);

          return (
            <motion.li
              key={index}
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
              className={`cursor-pointer transition-all duration-200 ${
                isActive
                  ? "text-blue-600 font-semibold border-b-2 border-blue-600 pb-1"
                  : "text-gray-700 hover:text-blue-600"
              }`}
            >
              <Link href={item.path}>{item.label}</Link>
            </motion.li>
          );
        })}
      </ul>

      {/* Mobile Menu */}
      <Sheet>
        <SheetTrigger className="lg:hidden">
          <motion.div whileTap={{ scale: 0.9 }}>
            <Menu className="w-6 h-6 text-gray-600 cursor-pointer hover:text-blue-600 transition-colors duration-200" />
          </motion.div>
        </SheetTrigger>

        <SheetContent side="left" className="w-72 px-2.5">
          <SheetHeader className="flex flex-col items-start gap-4 mb-6">
            <VisuallyHidden>
              <SheetTitle>Menu</SheetTitle>
            </VisuallyHidden>
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
              <span className="text-lg font-bold text-blue-600">EduSmart</span>
            </motion.div>
          </SheetHeader>

          {/* Menu Items - Mobile */}
          <nav className="flex flex-col gap-4 text-gray-700 font-medium">
            {menuItems.map((item, index) => {
              const isActive =
                item.path === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.path);

              return (
                <motion.span
                  key={index}
                  whileHover={{ x: 5, color: "#4f46e5" }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className={`cursor-pointer transition-colors ${
                    isActive ? "text-blue-600 font-semibold" : ""
                  }`}
                >
                  <Link href={item.path}>{item.label}</Link>
                </motion.span>
              );
            })}
          </nav>

          {/* User Actions - Mobile */}
          <div className="mt-6 flex flex-col gap-3">
            <motion.div whileHover={{ scale: 1.05 }}>
              <div
                onClick={handleClickInstructor}
                className="flex items-center justify-center gap-2 px-4 py-2 rounded-full border border-blue-300 bg-blue-50 hover:bg-blue-100 transition cursor-pointer md:flex hidden"
              >
                <GraduationCap className="w-5 h-5 text-blue-700" />
                <span className="text-sm font-semibold text-blue-700">
                  Giảng dạy trên EduSmart
                </span>
              </div>
            </motion.div>

            {/* 🔹 Notification Bell (Mobile) */}
            {user && (
              <div className="flex items-center gap-2 px-2 py-1">
                <NotificationBell />
              </div>
            )}

            {/* 🔹 User info */}
            {user ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition duration-200"
                onClick={() => router.push("/profile")}
              >
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullname}
                  width={28}
                  height={28}
                  className="w-7 h-7 rounded-full object-cover border border-blue-400/40"
                />
                <span className="text-sm font-medium text-blue-600">
                  {user.fullname}
                </span>
              </motion.button>
            ) : (
              <motion.div whileHover={{ scale: 1.05 }}>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full hover:bg-blue-500/20 transition duration-200"
                >
                  <User className="w-5 h-5 text-blue-600" />
                  <span className="text-blue-600 text-sm font-semibold">
                    Đăng nhập
                  </span>
                </Link>
              </motion.div>
            )}
          </div>
        </SheetContent>
      </Sheet>

      {/* User Section - Desktop */}
      <div className="hidden lg:flex items-center gap-5">
        {/* 🔹 Giảng dạy */}
        <motion.div whileHover={{ scale: 1.05 }}>
          <div
            onClick={handleClickInstructor}
            className="
              flex items-center justify-center gap-2
              px-2 xl:px-4 py-2
              rounded-full
              border border-blue-300
              bg-blue-50 hover:bg-blue-100
              transition cursor-pointer
            "
          >
            <GraduationCap className="w-5 h-5 text-blue-700" />
            <span className="hidden xl:block text-sm font-semibold text-blue-700">
              Giảng dạy trên EduSmart
            </span>
          </div>
        </motion.div>

        {/* 🔹 Notification Bell (Desktop) */}
        {user && (
          <motion.div whileHover={{ scale: 1.1 }}>
            <NotificationBell />
          </motion.div>
        )}

        {/* 🔹 User dropdown */}
        {user ? (
          <div className="relative group inline-block">
            <button className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full hover:bg-blue-100 transition duration-200">
              <Image
                src={user.avatar || "/default-avatar.png"}
                alt={user.fullname}
                width={24}
                height={24}
                className="w-6 h-6 rounded-full object-cover"
              />
              <span className="text-sm font-medium text-blue-600">
                {user.fullname}
              </span>
            </button>

            {/* Dropdown */}
            <div
              className="
                invisible opacity-0 translate-y-1
                group-hover:visible group-hover:opacity-100 group-hover:translate-y-0
                transition-all duration-200 ease-out
                absolute right-0 mt-2 w-72 z-50
                rounded-2xl border border-gray-200 bg-white/95 backdrop-blur-md shadow-2xl
              "
            >
              {/* Header user info */}
              <div className="flex items-center gap-3 px-5 py-4 border-b border-gray-100">
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullname}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover border border-blue-200"
                />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.fullname}
                  </p>
                  <p className="text-xs text-gray-500 truncate">{user.email}</p>
                </div>
              </div>

              {/* Menu links */}
              <div className="py-2 flex flex-col">
                <Link
                  href="/profile"
                  className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-md"
                >
                  Hồ sơ của tôi
                </Link>

                <Link
                  href="/wallet"
                  className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-md"
                >
                  Ví của tôi
                </Link>

                <Link
                  href="/cart"
                  className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-md"
                >
                  Giỏ hàng của tôi
                </Link>

                <Link
                  href="/my-learning"
                  className="block px-5 py-2.5 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition rounded-md"
                >
                  Khóa học của tôi
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full text-left px-5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition rounded-md font-medium"
                >
                  Đăng xuất
                </button>
              </div>
            </div>
          </div>
        ) : (
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-400/30 rounded-full hover:bg-blue-500/20 transition duration-200"
          >
            <User className="w-5 h-5 text-blue-600" />
            <span className="text-blue-600 text-sm font-semibold">
              Đăng nhập
            </span>
          </Link>
        )}
      </div>
    </motion.nav>
  );
};

export default NavbarUser;
