"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  GraduationCap,
  LogOut,
  Home,
  Tag,
  Layers,
  Flag,
  LayoutDashboard,
  LogOut as LogoutIcon,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { logoutUser } from "@/store/slice/common/userSlice";

const SidebarAdmin = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Tổng quan", icon: LayoutDashboard },
    { href: "/admin/courses", label: "Khóa học", icon: BookOpen },
    { href: "/admin/students", label: "Học viên", icon: Users },
    {
      href: "/admin/instructors",
      label: "Giảng viên",
      icon: GraduationCap,
    },
    {
      href: "/admin/coupon",
      label: "Mã giảm giá",
      icon: Tag,
    },
    {
      href: "/admin/specializations",
      label: "Chuyên ngành",
      icon: Layers,
    },
    {
      href: "/admin/reports",
      label: "Báo cáo",
      icon: Flag,
    },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
      {/* Brand Logo */}
      <div className="p-8 border-b border-slate-800/50 flex flex-col items-center">
        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-600/30 mb-4 transform -rotate-6 transition-transform hover:rotate-0 duration-300">
          <BookOpen className="text-white w-7 h-7" />
        </div>
        <h1 className="text-xl font-black text-white tracking-tighter">
          EDUSMART <span className="text-indigo-500">ADMIN</span>
        </h1>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto py-8 px-4 space-y-2 custom-scrollbar">
        <p className="px-4 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-4">
          Hệ thống
        </p>
        
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link key={href} href={href} className="block relative group">
              {isActive && (
                <motion.div
                  layoutId="sidebar-active"
                  className="absolute inset-0 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-600/20"
                  transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                />
              )}
              <div
                className={`flex items-center gap-3 px-5 py-3.5 relative z-10 transition-colors duration-300 rounded-2xl ${
                  isActive
                    ? "text-white"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                }`}
              >
                <Icon
                  size={18}
                  className={isActive ? "text-white" : "text-slate-500 group-hover:text-indigo-400 transition-colors"}
                />
                <span className="text-sm font-bold tracking-tight">{label}</span>
                
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,0.8)]"
                  />
                )}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer / Logout */}
      <div className="p-6 border-t border-slate-800/50">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-5 py-3.5 rounded-2xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all duration-300 group"
        >
          <LogoutIcon size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="text-sm font-bold tracking-tight uppercase tracking-widest text-[10px]">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
};

export default SidebarAdmin;
