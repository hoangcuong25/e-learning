"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";

import banner from "@public/elearning-banner.png";
import type { RootState, AppDispatch } from "@/store";
import { fetchUser } from "@/store/slice/userSlice";

import { useSearchParams } from "next/navigation";
import CreatePostDialog from "./CreatePostDialog";

export default function CommunityGate() {
  const dispatch = useDispatch<AppDispatch>();
  const searchParams = useSearchParams();
  const { user, loading } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (token && !user) {
      dispatch(fetchUser());
    }
  }, [dispatch, user]);

  const currentView = searchParams.get("view") || "explore";

  // ⏳ Đang check login
  if (loading) return null;

  // 🔓 ĐÃ ĐĂNG NHẬP → HIỂN THỊ CREATE POST + TABS
  if (user) {
    return (
      <section className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-2xl p-5 shadow-sm">
          <p className="font-semibold text-gray-800 mb-3">
            Chào {user.fullname} 👋
          </p>
          <div className="flex gap-2">
            <div
              onClick={() => setIsOpen(true)}
              className="flex-1 border rounded-xl px-4 py-3 bg-gray-50 text-gray-500 cursor-pointer hover:bg-gray-100 transition-colors"
            >
              Bạn đang nghĩ gì thế?
            </div>
          </div>
        </div>

        <CreatePostDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          userAvatar={user.avatar}
          userName={user.fullname}
        />
      </section>
    );
  }

  // 🔒 CHƯA ĐĂNG NHẬP → HIỂN THỊ HERO + TABS
  return (
    <section className="w-full">
      <div className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-3xl overflow-hidden shadow-lg mx-auto max-w-7xl px-6 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Cộng đồng EduSmart
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            Dòng thời gian học tập – nơi học viên và giảng viên chia sẻ kiến
            thức.
          </p>

          <div className="flex gap-4">
            <Link
              href="/signup"
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold"
            >
              Tham gia ngay
            </Link>
            <Link
              href="/login"
              className="border border-white/70 px-6 py-3 rounded-lg font-semibold"
            >
              Đăng nhập
            </Link>
          </div>
        </div>

        <div className="flex justify-center">
          <Image
            src={banner}
            alt="Community Banner"
            width={520}
            height={360}
            className="rounded-2xl shadow-xl object-cover"
            priority
          />
        </div>
      </div>
    </section>
  );
}
