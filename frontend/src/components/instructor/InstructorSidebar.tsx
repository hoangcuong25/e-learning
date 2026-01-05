"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  BookOpen,
  Users,
  DollarSign,
  Brain,
  TicketPercent,
} from "lucide-react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { fetchUser } from "@/store/slice/userSlice";
import Image from "next/image";
import logo from "@public/logo.png";

const InstructorSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();

  const pathname = usePathname();

  const navItems = [
    { href: "/instructor/dashboard", label: "Trang chủ", icon: Home },
    { href: "/instructor/courses", label: "Khóa học của tôi", icon: BookOpen },
    { href: "/instructor/quizzes", label: "Quản lý Quiz", icon: Brain },
    {
      href: "/instructor/coupons",
      label: "Quản lý Coupon",
      icon: TicketPercent,
    },
    { href: "/instructor/students", label: "Học viên", icon: Users },
    { href: "/instructor/earnings", label: "Thu nhập", icon: DollarSign },
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(fetchUser());
  }, [dispatch]);

  return (
    <aside className="w-64 bg-gradient-to-b from-blue-500 to-indigo-600 text-white flex flex-col p-6 shadow-xl rounded-2xl">
      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-10">
        <Image src={logo} alt="Logo" width={32} height={32} />
        <h1 className="text-2xl font-bold tracking-wide">
          EduSmart Instructor
        </h1>
      </div>

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
                  ? "bg-white text-blue-700 font-semibold shadow-md scale-[1.02]"
                  : "hover:bg-blue-400/40 hover:translate-x-1"
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

export default InstructorSidebar;
