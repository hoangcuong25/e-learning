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
  Layers,
  Flag,
} from "lucide-react";

const SidebarAdmin = () => {
  const pathname = usePathname();

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
    {
      href: "/admin/specializations",
      label: "Chuyên ngành",
      icon: Layers,
    },
    {
      href: "/admin/course-reports",
      label: "Báo cáo",
      icon: Flag,
    },
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
    </aside>
  );
};

export default SidebarAdmin;
