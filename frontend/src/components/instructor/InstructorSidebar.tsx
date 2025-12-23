"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Home,
  BookOpen,
  Users,
  FileText,
  DollarSign,
  Settings,
  LogOut,
  Brain,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchUser, logoutUser } from "@/store/userSlice";
import { toast } from "sonner";
import Image from "next/image";
import logo from "@public/logo.png";
import LoadingScreen from "../LoadingScreen";

const InstructorSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.user);

  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    dispatch(logoutUser());
    router.push("/login");
    toast.success("Đăng xuất thành công");
  };

  const navItems = [
    { href: "/instructor/dashboard", label: "Trang chủ", icon: Home },
    { href: "/instructor/courses", label: "Khóa học của tôi", icon: BookOpen },
    { href: "/instructor/quizzes", label: "Quản lý Quiz", icon: Brain },
    { href: "/instructor/students", label: "Học viên", icon: Users },
    {
      href: "/instructor/applications",
      label: "Đơn ứng tuyển",
      icon: FileText,
    },
    { href: "/instructor/earnings", label: "Thu nhập", icon: DollarSign },
    { href: "/instructor/settings", label: "Cài đặt", icon: Settings },
  ];

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token) dispatch(fetchUser());
  }, [dispatch]);

  if (loading) return <LoadingScreen />;

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

      {/* Footer */}
      <div className="mt-auto pt-10 border-t border-blue-300">
        <div className="flex items-center gap-3 mb-4">
          <Image
            src={user?.avatar || "/default-avatar.png"}
            alt="Instructor Avatar"
            width={40}
            height={40}
            className="rounded-full object-cover"
          />
          <div>
            <p className="font-semibold text-sm">{user?.fullname}</p>
            <p className="text-xs text-blue-100">Instructor</p>
          </div>
        </div>

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

export default InstructorSidebar;
