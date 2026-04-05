"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchUser, logoutUser } from "@/store/slice/common/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { Menu, LogOut, User, Bell, Search, Settings, LayoutGrid } from "lucide-react";
import SidebarAdmin from "./Sidebar";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import LoadingScreen from "@/components/LoadingScreen";
import { motion } from "framer-motion";

const AdminNavbar = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  if (loading) return null;

  return (
    <header className="h-20 bg-slate-950/80 backdrop-blur-xl border-b border-slate-900 px-8 flex items-center justify-between sticky top-0 z-50">
      {/* Left section: Nav & Mobile menu */}
      <div className="flex items-center gap-6">
        <Sheet>
          <SheetTrigger asChild>
            <button className="xl:hidden p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all duration-200">
              <Menu size={20} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="p-4 border-r border-slate-800 bg-slate-950 w-80">
            <VisuallyHidden>
              <SheetTitle>Admin Navigation Menu</SheetTitle>
            </VisuallyHidden>
            <div className="h-full">
              <SidebarAdmin />
            </div>
          </SheetContent>
        </Sheet>

        <div className="hidden sm:flex flex-col">
          <h2 className="text-sm font-black text-white tracking-widest uppercase">
            Hệ thống quản trị
          </h2>
          <p className="text-[10px] font-medium text-slate-500 uppercase tracking-widest mt-0.5">
            EduSmart Education Ecosystem
          </p>
        </div>
      </div>

      {/* Right section: Search & Profile */}
      <div className="flex items-center gap-5">
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-slate-900 border border-slate-800 rounded-xl group transition-all duration-300 focus-within:border-indigo-500/50 focus-within:ring-4 focus-within:ring-indigo-500/10">
          <Search size={16} className="text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            type="text"
            placeholder="Tìm kiếm nhanh..."
            className="bg-transparent border-none outline-none text-xs text-slate-300 placeholder:text-slate-600 w-48 transition-all"
          />
        </div>

        <button className="relative p-2.5 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-xl transition-all hover:bg-slate-800 group">
          <Bell size={18} className="group-hover:rotate-12 transition-transform" />
          <span className="absolute top-2.5 right-2.5 w-1.5 h-1.5 bg-indigo-500 rounded-full border border-slate-950 ring-2 ring-indigo-500/20" />
        </button>

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex items-center gap-3 pl-2 pr-1 py-1 rounded-2xl border border-slate-800 bg-slate-900/50 hover:bg-slate-900 transition-all cursor-pointer">
              <div className="hidden sm:flex flex-col items-end mr-1">
                <span className="text-xs font-black text-white tracking-tight">{user?.fullname || "Admin"}</span>
                <span className="text-[9px] font-bold text-indigo-400 uppercase tracking-widest">Administrator</span>
              </div>
              <Avatar className="w-9 h-9 border-2 border-indigo-500/20 shadow-xl">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-gradient-to-br from-indigo-600 to-blue-700 text-white font-black text-xs">
                  {user?.fullname?.charAt(0)?.toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </motion.div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-64 bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-2 mt-2">
            <DropdownMenuLabel className="mb-2">
              <div className="flex flex-col space-y-1 p-2">
                <p className="text-xs font-black text-white uppercase tracking-widest">Tài khoản</p>
                <p className="text-[11px] text-slate-500 truncate">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-800 mx-2" />
            <DropdownMenuItem className="flex items-center gap-2 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-all">
              <User size={16} className="text-indigo-400" />
              <span className="text-xs font-bold tracking-tight">Hồ sơ cá nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex items-center gap-2 p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl cursor-pointer transition-all">
              <Settings size={16} className="text-indigo-400" />
              <span className="text-xs font-bold tracking-tight">Cài đặt hệ thống</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-800 mx-2" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="flex items-center gap-2 p-3 text-rose-400 hover:text-white hover:bg-rose-500/20 rounded-xl cursor-pointer transition-all"
            >
              <LogOut size={16} />
              <span className="text-xs font-black tracking-widest uppercase">Đăng xuất</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default AdminNavbar;
