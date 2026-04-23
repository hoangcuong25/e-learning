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
import { fetchUser, logoutUser } from "@/store/slice/common/userSlice";
import { toast } from "sonner";
import LoadingScreen from "../LoadingScreen";
import { fetchUnreadCount } from "@/store/slice/common/notificationsSlice";
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
    { label: "Cộng đồng", path: "/community" },,
  ];

  if (loading) return <LoadingScreen />;

  const isActive = (path: string) =>
    path === "/" ? pathname === "/" : pathname.startsWith(path);

  return (
    <div className="sticky top-4 z-50 px-6 max-w-[1700px] mx-auto w-full mb-4">
      <motion.nav
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="bg-white/90 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.05)] border border-white/50 px-6 py-2.5 flex items-center justify-between rounded-[1.5rem]"
      >
        {/* Logo + Name */}
        <Link href="/" className="group">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-3 cursor-pointer"
          >
            <div className="p-1.5 bg-indigo-600 rounded-xl group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-100">
              <Image
                src={logo}
                alt="EduSmart Logo"
                width={32}
                height={32}
                className="invert brightness-0"
              />
            </div>
            <span className="hidden md:block text-xl font-black text-slate-900 tracking-tighter uppercase tracking-widest leading-none">
              EduSmart
            </span>
          </motion.div>
        </Link>

        {/* Menu Links - Desktop */}
        <ul className="hidden lg:flex items-center gap-10">
          {menuItems.map((item, index) => (
            <li key={index} className="relative group">
              <Link
                href={item?.path || ""}
                className={`text-[11px] font-black uppercase tracking-[0.2em] transition-all duration-300 ${
                  isActive(item?.path || "")
                    ? "text-indigo-600"
                    : "text-slate-400 hover:text-slate-900"
                }`}
              >
                {item?.label || ""}
              </Link>
              {isActive(item?.path || "") && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute -bottom-1 left-0 right-0 h-0.5 bg-indigo-600 rounded-full"
                />
              )}
            </li>
          ))}
        </ul>

        {/* User Section - Desktop */}
        <div className="hidden lg:flex items-center gap-5">
          {/* 🔹 Instructor CTA */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleClickInstructor}
            className="hidden xl:flex items-center gap-2 px-5 py-2.5 bg-slate-900 rounded-2xl group transition-all duration-300 shadow-xl shadow-slate-200 overflow-hidden relative"
          >
            <div className="absolute inset-0 bg-indigo-600 -translate-x-full group-hover:translate-x-0 transition-transform duration-500" />
            <GraduationCap className="w-4 h-4 text-white relative z-10" />
            <span className="text-[10px] font-black text-white uppercase tracking-widest relative z-10">
              {user?.role === "INSTRUCTOR"
                ? "Trang quản trị"
                : "Trở thành giảng viên"}
            </span>
          </motion.button>

          <div className="h-6 w-px bg-slate-100 mx-1" />

          {/* 🔹 Notification Bell */}
          {user && (
            <motion.div whileHover={{ scale: 1.1 }}>
              <NotificationBell />
            </motion.div>
          )}

          {/* 🔹 User dropdown */}
          {user ? (
            <div className="relative group inline-block">
              <button className="flex items-center gap-3 p-1 pr-4 bg-slate-50 border border-slate-100 rounded-full hover:bg-white hover:border-indigo-100 transition-all duration-300 shadow-sm group-hover:shadow-md">
                <Image
                  src={user.avatar || "/default-avatar.png"}
                  alt={user.fullname}
                  width={32}
                  height={32}
                  className="w-8 h-8 rounded-full object-cover border-2 border-white shadow-sm"
                />
                <span className="text-[11px] font-black text-slate-900 uppercase tracking-widest truncate max-w-[100px]">
                  {user.fullname.split(" ").slice(-1)}
                </span>
              </button>

              {/* Dropdown Menu */}
              <div className="invisible opacity-0 translate-y-2 group-hover:visible group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 absolute right-0 mt-3 w-72 z-50 rounded-[2rem] border border-slate-100 bg-white/95 backdrop-blur-xl shadow-[0_12px_48px_rgba(0,0,0,0.1)] overflow-hidden">
                <div className="px-6 py-5 bg-slate-50/50 border-b border-slate-50">
                  <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-1.5">
                    Học viên
                  </p>
                  <p className="text-sm font-black text-slate-900 truncate">
                    {user.fullname}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 truncate mt-1 group-hover:text-indigo-600 transition-colors uppercase tracking-widest">
                    {user.email}
                  </p>
                </div>

                <div className="p-3">
                  {[
                    { label: "Hồ sơ cá nhân", path: "/profile" },
                    { label: "Ví của tôi", path: "/wallet" },
                    { label: "Giỏ hàng", path: "/cart" },
                    { label: "Khóa học của mình", path: "/my-learning" },
                  ].map((link, i) => (
                    <Link
                      key={i}
                      href={link.path}
                      className="flex items-center px-4 py-3 text-[10px] font-black text-slate-500 uppercase tracking-[0.15em] hover:bg-indigo-50 hover:text-indigo-600 rounded-2xl transition-all duration-300"
                    >
                      {link.label}
                    </Link>
                  ))}
                  <div className="h-px bg-slate-50 my-2 mx-4" />
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-3 text-[10px] font-black text-rose-500 uppercase tracking-[0.15em] hover:bg-rose-50 rounded-2xl transition-all duration-300"
                  >
                    Đăng xuất ngay
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full transition-all duration-300 shadow-lg shadow-indigo-100"
              >
                <User className="w-4 h-4" />
                <span className="text-[11px] font-black uppercase tracking-widest">
                  Đăng nhập
                </span>
              </motion.div>
            </Link>
          )}
        </div>

        {/* Mobile Menu Trigger */}
        <Sheet>
          <SheetTrigger className="lg:hidden p-2 bg-slate-50 rounded-xl hover:bg-indigo-50 transition-colors">
            <Menu className="w-5 h-5 text-slate-900" />
          </SheetTrigger>
          <SheetContent
            side="right"
            className="w-[300px] border-l-0 bg-white p-0"
          >
            <div className="flex flex-col h-full">
              <div className="p-8 border-b border-slate-50">
                <Link href="/" className="flex items-center gap-3 mb-8">
                  <div className="p-1.5 bg-indigo-600 rounded-xl">
                    <Image
                      src={logo}
                      alt="Logo"
                      width={24}
                      height={24}
                      className="invert brightness-0"
                    />
                  </div>
                  <span className="text-lg font-black text-slate-900 tracking-tighter uppercase tracking-widest">
                    EduSmart
                  </span>
                </Link>

                <nav className="flex flex-col gap-6">
                  {menuItems.map((item, i) => (
                    <Link
                      key={i}
                      href={item?.path || ""}
                      className={`text-xs font-black uppercase tracking-[0.2em] ${
                        isActive(item?.path || "")
                          ? "text-indigo-600"
                          : "text-slate-400"
                      }`}
                    >
                      {item?.label || ""}
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex-1 p-8">
                {/* User mobile section */}
                {user ? (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-[2rem]">
                      <Image
                        src={user.avatar || "/default-avatar.png"}
                        alt="Avatar"
                        width={40}
                        height={40}
                        className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                      />
                      <div>
                        <p className="text-[11px] font-black text-slate-900 uppercase tracking-widest truncate max-w-[150px]">
                          {user.fullname}
                        </p>
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">
                          Học viên EduSmart
                        </p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Link
                        href="/profile"
                        className="block text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 py-2"
                      >
                        Cá nhân
                      </Link>
                      <Link
                        href="/my-learning"
                        className="block text-[10px] font-black text-slate-500 uppercase tracking-widest hover:text-indigo-600 py-2"
                      >
                        Khóa học của mình
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="block text-[10px] font-black text-rose-500 uppercase tracking-widest py-2"
                      >
                        Đăng xuất
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link
                    href="/login"
                    className="w-full block bg-indigo-600 text-white text-center py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest"
                  >
                    Đăng nhập ngay
                  </Link>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </motion.nav>
    </div>
  );
};

export default NavbarUser;
