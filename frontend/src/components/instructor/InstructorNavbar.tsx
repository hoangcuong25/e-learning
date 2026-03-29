"use client";

import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { logoutUser, fetchUser } from "@/store/slice/common/userSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import NotificationBell from "@/components/user/NotificationBell";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetTitle,
} from "@/components/ui/sheet";
import { VisuallyHidden } from "@/components/ui/visually-hidden";
import InstructorSidebar from "./InstructorSidebar";
import { useRouter } from "next/navigation";
import {
  LogOut,
  User,
  Menu,
  Search,
  Bell,
  Settings,
  DollarSign,
} from "lucide-react";
import LoadingScreen from "../LoadingScreen";
import { Input } from "../ui/input";

const InstructorNavbar = () => {
  const { user, loading } = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser());
    router.push("/login");
  };

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="h-20 border-b border-slate-100 bg-white/80 backdrop-blur-md px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
      {/* Left side - Menu & Search */}
      <div className="flex items-center gap-6 flex-1">
        <Sheet>
          <SheetTrigger asChild>
            <button className="xl:hidden p-2.5 hover:bg-slate-100 rounded-xl transition-all active:scale-95">
              <Menu className="w-5 h-5 text-slate-600" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="p-0 border-r-0 w-80 bg-slate-950"
          >
            <VisuallyHidden>
              <SheetTitle>Instructor Menu</SheetTitle>
            </VisuallyHidden>
            <div className="h-full overflow-hidden">
              <InstructorSidebar />
            </div>
          </SheetContent>
        </Sheet>

        {/* Search Bar - Professional look */}
        <div className="hidden md:flex items-center relative max-w-sm w-full group text-slate-900 font-bold text-xl">
          <div className="text-indigo-600">Trang giảng viên</div>
        </div>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1 bg-slate-50 p-1 rounded-xl border border-slate-100">
          <NotificationBell />
          <button className="p-2.5 text-slate-500 hover:text-indigo-600 hover:bg-white rounded-lg transition-all active:scale-95">
            <Settings className="w-4.5 h-4.5" />
          </button>
        </div>

        <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block" />

        <DropdownMenu>
          <DropdownMenuTrigger className="outline-none flex items-center gap-3 p-1.5 pr-3 hover:bg-slate-50 rounded-2xl transition-all group">
            <Avatar className="h-10 w-10 ring-2 ring-transparent group-hover:ring-indigo-100 transition-all shadow-sm">
              <AvatarImage
                src={user?.avatar}
                alt={user?.fullname}
                className="object-cover"
              />
              <AvatarFallback className="bg-indigo-600 text-white font-bold text-xs">
                {user?.fullname?.charAt(0)?.toUpperCase() || "I"}
              </AvatarFallback>
            </Avatar>
            <div className="hidden sm:flex flex-col items-start">
              <span className="text-sm font-bold text-slate-900 leading-tight line-clamp-1">
                {user?.fullname}
              </span>
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                Giảng viên
              </span>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-64 p-2 rounded-2xl shadow-2xl border-slate-100"
          >
            <DropdownMenuLabel className="p-3">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-bold text-slate-900 leading-none">
                  {user?.fullname}
                </p>
                <p className="text-xs font-medium text-slate-500 truncate">
                  {user?.email}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem
              onClick={() => router.push("/instructor/profile")}
              className="p-3 rounded-xl cursor-pointer font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <User className="mr-3 h-4.5 w-4.5" />
              <span>Hồ sơ cá nhân</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/instructor/earnings")}
              className="p-3 rounded-xl cursor-pointer font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              <DollarSign className="mr-3 h-4.5 w-4.5" />
              <span>Thu nhập & Giao dịch</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-slate-50" />
            <DropdownMenuItem
              onClick={handleLogout}
              className="p-3 rounded-xl text-red-600 focus:text-red-700 focus:bg-red-50 cursor-pointer font-bold"
            >
              <LogOut className="mr-3 h-4.5 w-4.5" />
              <span>Đăng xuất hệ thống</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default InstructorNavbar;
