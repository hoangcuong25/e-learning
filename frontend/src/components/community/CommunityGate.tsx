"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Sparkles, PenSquare } from "lucide-react";

import banner from "@public/elearning-banner.png";
import type { RootState, AppDispatch } from "@/store";
import { fetchUser } from "@/store/slice/common/userSlice";

import { useSearchParams } from "next/navigation";
import CreatePostDialog from "./post/CreatePostDialog";

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

  if (loading) return null;

  // ─── ĐÃ ĐĂNG NHẬP → Create post prompt ─────────────────────
  if (user) {
    return (
      <div className="bg-slate-900 rounded-2xl p-5 border border-slate-800 shadow-lg">
        <p className="text-xs font-black text-indigo-400 uppercase tracking-[0.2em] mb-3">
          Chào {user.fullname} 👋
        </p>
        <div
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-3 w-full px-5 py-3.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-indigo-500/40 rounded-xl cursor-pointer transition-all duration-300 group"
        >
          <div className="w-8 h-8 rounded-full bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center flex-shrink-0">
            <PenSquare size={14} className="text-indigo-400" />
          </div>
          <span className="text-slate-400 text-sm font-medium group-hover:text-slate-300 transition-colors">
            Bạn đang nghĩ gì thế?
          </span>
        </div>

        <CreatePostDialog
          open={isOpen}
          onOpenChange={setIsOpen}
          userAvatar={user.avatar}
          userName={user.fullname}
        />
      </div>
    );
  }

  // ─── CHƯA ĐĂNG NHẬP → Hero ──────────────────────────────────
  return (
    <motion.section
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.7, ease: "circOut" }}
      className="relative bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-slate-800"
    >
      {/* Decorative blobs */}
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-blue-600/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative z-10 px-10 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-7">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">
              Cộng đồng học tập lớn nhất
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl md:text-5xl font-black text-white leading-[1.05] tracking-tighter"
          >
            Cộng đồng{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">
              EduSmart
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-slate-400 font-medium leading-relaxed"
          >
            Dòng thời gian học tập – nơi học viên và giảng viên chia sẻ kiến
            thức, thảo luận và cùng nhau phát triển.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link href="/signup">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-600/20 transition-all duration-300"
              >
                Tham gia ngay
              </motion.button>
            </Link>
            <Link href="/login">
              <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs backdrop-blur-md transition-all duration-300">
                Đăng nhập
              </button>
            </Link>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8, ease: "circOut" }}
          className="flex justify-center"
        >
          <div className="p-3 bg-white/5 backdrop-blur-2xl rounded-[2.5rem] border border-white/10 shadow-2xl">
            <Image
              src={banner}
              alt="Community Banner"
              width={480}
              height={320}
              className="rounded-[2rem] shadow-2xl object-cover"
              priority
            />
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}
