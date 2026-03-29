"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  BookOpen,
  Users,
  DollarSign,
  Brain,
  TicketPercent,
  UserCog,
  LayoutDashboard,
} from "lucide-react";
import Image from "next/image";
import logo from "@public/logo.png";

const InstructorSidebar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: "/instructor/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/instructor/courses", label: "Khóa học", icon: BookOpen },
    { href: "/instructor/quizzes", label: "Quản lý Quiz", icon: Brain },
    {
      href: "/instructor/coupons",
      label: "Mã giảm giá",
      icon: TicketPercent,
    },
    { href: "/instructor/students", label: "Học viên", icon: Users },
    { href: "/instructor/earnings", label: "Doanh thu", icon: DollarSign },
    { href: "/instructor/profile", label: "Hồ sơ", icon: UserCog },
  ];

  return (
    <aside className="w-full h-full bg-slate-950 text-slate-300 flex flex-col p-6 shadow-2xl xl:rounded-r-3xl border-r border-slate-800 xl:w-72 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-indigo-600/10 blur-3xl -translate-x-1/2 -translate-y-1/2 rounded-full" />
      
      {/* Logo Section */}
      <div className="relative z-10 flex items-center gap-3 mb-12 px-2">
        <div className="p-2 bg-indigo-600 rounded-xl shadow-lg shadow-indigo-500/20">
            <Image src={logo} alt="Logo" width={28} height={28} className="brightness-200" />
        </div>
        <div>
            <h1 className="text-xl font-extrabold text-white tracking-tight leading-none">
              Edu<span className="text-indigo-500">Smart</span>
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">Instructor Pro</p>
        </div>
      </div>

      {/* Navigation section */}
      <div className="relative z-10 space-y-1">
        <p className="text-xs font-bold text-slate-600 uppercase tracking-widest px-4 mb-4">Menu chính</p>
        <nav className="flex flex-col gap-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const isActive = pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group/item ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-600/20"
                    : "hover:bg-slate-900 hover:text-white"
                }`}
              >
                <Icon className={`w-5 h-5 transition-transform group-hover/item:scale-110 ${isActive ? "text-white" : "text-slate-500 group-hover/item:text-indigo-400"}`} />
                <span className="font-medium text-[15px]">{label}</span>
                {isActive && (
                    <div className="ml-auto w-1.5 h-1.5 bg-white rounded-full shadow-[0_0_8px_white]" />
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Bottom section (Optional: Pro badge or logout hint) */}
      <div className="mt-auto relative z-10 pt-6 border-t border-slate-900">
         <div className="p-4 bg-slate-900/50 rounded-2xl border border-slate-800/50 backdrop-blur-sm">
            <p className="text-xs text-slate-400 leading-relaxed font-medium">Cần hỗ trợ? Truy cập Trung tâm Trợ giúp của chúng tôi.</p>
            <button className="mt-3 text-xs text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Xem tài liệu →</button>
         </div>
      </div>
    </aside>
  );
};

export default InstructorSidebar;
