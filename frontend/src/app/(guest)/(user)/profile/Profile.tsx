"use client";

import EditProfile from "@/components/user/EditProfile";
import ChangePassword from "@/components/user/ChangePassword";
import VerifyAccount from "@/components/user/VerifyAccount";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GenderEnum, GenderLabel } from "@/constants/gender.enum";
import Image from "next/image";
import ActivityHeatmap from "@/components/user/ActivityHeatmap";

import { motion } from "framer-motion";
import {
  User,
  Wallet,
  BookOpen,
  CheckCircle,
  AlertCircle,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);

  const stats = [
    {
      label: "Khóa học",
      value: user?.enrollmentCount ?? 0,
      icon: <BookOpen size={20} />,
      color: "text-indigo-600",
      bg: "bg-indigo-50",
    },
    {
      label: "Hoàn thành",
      value: user?.completedCount ?? 0,
      icon: <CheckCircle size={20} />,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "Trong giỏ",
      value: user?.cartCount ?? 0,
      icon: <Wallet size={20} />,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "circOut" }}
      className="space-y-12 pb-20"
    >
      {/* 🌟 HERO SECTION */}
      <section className="bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 p-10 lg:p-16 relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000" />

        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <motion.div
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative"
          >
            <div className="absolute -inset-2 bg-indigo-500 rounded-full blur opacity-10" />
            <Image
              src={user?.avatar || "/default-avatar.png"}
              alt="avatar"
              width={160}
              height={160}
              className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-8 border-white object-cover shadow-2xl shadow-indigo-500/10"
            />
            {user?.isVerified && (
              <div className="absolute bottom-2 right-2 w-10 h-10 bg-white rounded-2xl flex items-center justify-center shadow-lg text-indigo-600 border border-indigo-50">
                <ShieldCheck size={20} />
              </div>
            )}
          </motion.div>

          <div className="flex-1 text-center md:text-left space-y-6">
            <div className="space-y-2">
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
                {user?.fullname || "Chưa cập nhật"}
              </h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mt-4">
                <div className="flex items-center gap-2 px-4 py-1.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <Calendar size={12} className="text-indigo-600" />
                  Joined{" "}
                  {user?.createdAt
                    ? new Date(user.createdAt).getFullYear()
                    : "N/A"}
                </div>
                {user?.isVerified ? (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full text-[10px] font-black text-emerald-600 uppercase tracking-widest">
                    Account Verified
                  </div>
                ) : (
                  <div className="flex items-center gap-2 px-4 py-1.5 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-black text-amber-600 uppercase tracking-widest">
                    Verification Pending
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-4 justify-center md:justify-start pt-2">
              <EditProfile />
              <ChangePassword />
              {!user?.isVerified && <VerifyAccount />}
            </div>
          </div>
        </div>
      </section>

      {/* 📊 STATS GRID */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-between group hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-500"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tighter">
                {stat.value}
              </h3>
            </div>
            <div
              className={`${stat.bg} ${stat.color} p-4 rounded-2xl group-hover:scale-110 transition-transform duration-500`}
            >
              {stat.icon}
            </div>
          </motion.div>
        ))}
      </section>

      {/* 🗺️ ACTIVITY & INFO */}
      <div className="grid lg:grid-cols-2 gap-8 items-start">
        <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm space-y-10">
          <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            <div className="w-2 h-8 bg-indigo-600 rounded-full" />
            Thông tin cá nhân
          </h3>

          <div className="grid gap-6">
            {[
              { label: "Email", value: user?.email, icon: <Mail size={18} /> },
              {
                label: "Số điện thoại",
                value: user?.phone || "Chưa cập nhật",
                icon: <Phone size={18} />,
              },
              {
                label: "Địa chỉ",
                value: user?.address || "Chưa cập nhật",
                icon: <MapPin size={18} />,
              },
              {
                label: "Ngày sinh",
                value: user?.dob
                  ? new Date(user.dob).toLocaleDateString("vi-VN")
                  : "Chưa cập nhật",
                icon: <Calendar size={18} />,
              },
              {
                label: "Giới tính",
                value: user?.gender
                  ? GenderLabel[user.gender as GenderEnum]
                  : "Chưa cập nhật",
                icon: <User size={18} />,
              },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-5 p-5 bg-slate-50/50 border border-slate-50 rounded-2xl hover:bg-slate-50 transition-colors group"
              >
                <div className="p-3 bg-white text-slate-400 group-hover:text-indigo-600 rounded-xl shadow-sm transition-colors">
                  {item.icon}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">
                    {item.label}
                  </p>
                  <p className="text-slate-900 font-bold tracking-tight truncate">
                    {item.value}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="space-y-8">
          <section className="bg-white p-10 rounded-[3rem] border border-slate-100 shadow-sm">
            <ActivityHeatmap />
          </section>

          <section className="bg-slate-900 p-10 rounded-[3rem] shadow-xl text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500 opacity-20 rounded-full blur-2xl translate-x-1/2 -translate-y-1/2" />
            <div className="relative z-10 space-y-6">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-indigo-400">
                <AlertCircle size={24} />
              </div>
              <div className="space-y-2">
                <h4 className="text-xl font-black tracking-tight">
                  Cần hỗ trợ?
                </h4>
                <p className="text-slate-400 text-sm font-medium leading-relaxed">
                  Nếu bạn gặp bất kỳ vấn đề gì về tài khoản hoặc bảo mật, hãy
                  liên hệ ngay với đội ngũ hỗ trợ kỹ thuật.
                </p>
              </div>
              <Link
                href="/contact-us"
                className="h-14 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-black text-[10px] uppercase tracking-widest transition-all cursor-pointer"
              >
                Gửi yêu cầu hỗ trợ
              </Link>
            </div>
          </section>
        </div>
      </div>
    </motion.div>
  );
}
