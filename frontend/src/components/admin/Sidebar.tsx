"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Users,
  GraduationCap,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Tag,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { logoutUser, fetchUser } from "@/store/slice/userSlice";
import { toast } from "sonner";

const SidebarAdmin = () => {
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(logoutUser());

    router.push("/login");
    toast.success("Đăng xuất thành công");
  };

  const navItems = [
    { href: "/admin/dashboard", label: "Trang chủ", icon: Home },
    { href: "/admin/courses", label: "Quản lý khóa học", icon: BookOpen },
    { href: "/admin/students", label: "Quản lý học viên", icon: Users },
    {
      href: "/admin/instructors",
      label: "Quản lý giảng viên",
      icon: GraduationCap,
    },
    {
      href: "/admin/discount-campaigns",
      label: "Quản lý chiến dịch",
      icon: Tag,
    },
    { href: "/admin/revenue", label: "Doanh thu", icon: DollarSign },
    { href: "/admin/reports", label: "Báo cáo thống kê", icon: BarChart3 },
    { href: "/admin/settings", label: "Cài đặt hệ thống", icon: Settings },
  ];

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-600 to-indigo-700 text-white flex flex-col p-6 shadow-xl rounded-2xl">
      {/* Logo */}
      <h1 className="text-2xl font-bold mb-10 text-center tracking-wide">
        EduSmart Admin
      </h1>

      {/* Navigation */}
      <nav className="flex flex-col gap-2">
        {navItems.map(({ href, label, icon: Icon }) => {
          const isActive = pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg transition-all duration-200 ${
                isActive
                  ? "bg-white text-blue-700 font-semibold shadow-md"
                  : "hover:bg-blue-500/70 hover:translate-x-1"
              }`}
            >
              <Icon className="w-5 h-5" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="mt-auto pt-10 border-t border-blue-400">
        <Button
          variant="outline"
          className="w-full text-blue-700 bg-white hover:bg-blue-50 font-medium flex items-center justify-center gap-2"
          onClick={handleLogout}
        >
          <LogOut className="w-4 h-4" />
          Đăng xuất
        </Button>
      </div>
    </aside>
  );
};

export default SidebarAdmin;
