"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, Clock, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import banner from "@public/elearning-banner.png";
import CourseCard from "@/components/course/CourseCard";
import CourseSlider from "@/components/course/CourseSlider";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = ({ popularCourses }: { popularCourses: CourseType[] }) => {
  return (
    <div className="space-y-24 pb-20">
      {/* ─── HERO SECTION ──────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, ease: "circOut" }}
        className="relative bg-slate-900 rounded-[3.5rem] overflow-hidden shadow-[0_48px_96px_-24px_rgba(0,0,0,0.5)] border border-slate-800"
      >
        {/* Background Decorative Elements */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="relative z-10 max-w-7xl mx-auto px-10 py-24 md:py-32 flex flex-col lg:flex-row items-center gap-16">
          <div className="flex-1 space-y-8 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
            >
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Nền tảng học tập thế hệ mới</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-5xl md:text-7xl font-black text-white leading-[1.05] tracking-tighter"
            >
              Phát triển <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">bứt phá</span> <br className="hidden md:block" />
              cùng EduSmart
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-lg text-slate-400 font-medium max-w-xl mx-auto lg:mx-0 leading-relaxed"
            >
              Tiếp cận nguồn tri thức tinh hoa từ các chuyên gia hàng đầu. <br className="hidden md:block" />
              Học tập thông minh, linh hoạt và nhận chứng chỉ quốc tế.
            </motion.p>

            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.6 }}
               className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-5 pt-4"
            >
              <Link href="/courses">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-2xl shadow-indigo-600/20 transition-all duration-300"
                >
                  Khám phá khóa học
                </motion.button>
              </Link>
              <Link href="/signup">
                <button className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-2xl font-black uppercase tracking-widest text-xs backdrop-blur-md transition-all duration-300">
                  Đăng ký miễn phí
                </button>
              </Link>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: "circOut" }}
            className="flex-1 relative"
          >
            <div className="relative z-10 p-4 bg-white/5 backdrop-blur-2xl rounded-[3rem] border border-white/10 shadow-2xl">
              <Image
                src={banner}
                alt="EduSmart Hero"
                className="rounded-[2.5rem] shadow-2xl object-cover w-full h-[450px] transition-transform hover:scale-[1.02] duration-700"
                priority
              />
            </div>
            {/* Float badges */}
            <div className="absolute -top-6 -right-6 p-6 bg-white rounded-3xl shadow-2xl hidden md:block">
               <Users className="text-indigo-600 w-8 h-8" />
            </div>
            <div className="absolute -bottom-6 -left-6 p-6 bg-slate-800 rounded-3xl shadow-2xl border border-slate-700 hidden md:block">
               <GraduationCap className="text-white w-8 h-8" />
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ─── FEATURED COURSES ──────────────────────────── */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-end justify-between gap-6 mb-12">
          <div className="space-y-2">
            <h4 className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.3em]">Top Rated</h4>
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">Khóa học nổi bật nhất</h2>
          </div>
          <Link href="/courses" className="text-[10px] font-black text-slate-400 uppercase tracking-widest hover:text-indigo-600 transition-colors border-b-2 border-slate-100 pb-1">
            Xem tất cả khóa học
          </Link>
        </div>

        {popularCourses.length === 0 ? (
          <div className="py-20 flex flex-col items-center justify-center bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
             <p className="text-slate-400 font-bold italic">Dữ liệu khóa học đang được cập nhật...</p>
          </div>
        ) : (
          <CourseSlider>
            {popularCourses.map((course) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                whileHover={{ y: -10 }}
                transition={{ duration: 0.5 }}
                className="p-2"
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </CourseSlider>
        )}
      </section>

      {/* ─── FEATURES GRID ─────────────────────────────── */}
      <section className="bg-slate-900 rounded-[4rem] py-24 mx-6 overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zM34 90c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zm56-76c1.105 0 2-.895 2-2s-.895-2-2-2-2 .895-2 2 .895 2 2 2zM12 86c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm28-65c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm23-11c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm-45 78c3.314 0 6-2.686 6-6s-2.686-6-6-6-6 2.686-6 6 2.686 6 6 6zm54 13c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zM9 26c8.837 0 16-7.163 16-16S17.837-6 9-6-7 1.163-7 10s7.163 16 16 16zm80 35c8.837 0 16-7.163 16-16s-7.163-16-16-16-16 7.163-16 16 7.163 16 16 16z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")` }} />

        <div className="max-w-7xl mx-auto px-10 grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
          {[
            { icon: BookOpen, title: "Học linh hoạt", desc: "Học bất cứ lúc nào, mọi nơi chỉ với một kết nối Internet." },
            { icon: Clock, title: "Tiết kiệm thời gian", desc: "Tối ưu lộ trình học tập, không cần di chuyển hay chờ đợi." },
            { icon: GraduationCap, title: "Chứng chỉ uy tín", desc: "Chứng nhận giá trị, được công nhận bởi hàng ngàn nhà tuyển dụng." }
          ].map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 }}
              className="group p-10 bg-white/5 backdrop-blur-md rounded-[3rem] border border-white/5 hover:bg-white/10 hover:border-indigo-500/30 transition-all duration-500 text-center"
            >
              <div className="w-20 h-20 mx-auto bg-indigo-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-2xl shadow-indigo-600/20">
                <feature.icon className="text-white w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-white mb-3 tracking-tight">{feature.title}</h4>
              <p className="text-slate-400 font-medium text-sm leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── SOCIAL PROOF stats ────────────────────────── */}
      <section className="max-w-7xl mx-auto px-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { value: "1M+", label: "Học viên năng động" },
            { value: "300K+", label: "Khóa học chất lượng" },
            { value: "500+", label: "Giảng viên hàng đầu" },
            { value: "98%", label: "Tỷ lệ hài lòng" }
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-8 bg-white rounded-[2.5rem] border border-slate-50 shadow-[0_12px_24px_rgba(0,0,0,0.02)] text-center group hover:bg-slate-900 transition-all duration-500"
            >
              <p className="text-4xl font-black text-indigo-600 group-hover:text-white transition-colors tracking-tighter mb-1">{item.value}</p>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest group-hover:text-slate-500">{item.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── COMMUNITY CALL TO ACTION ───────────────────── */}
      <motion.section
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 relative"
      >
        <div className="bg-slate-900 rounded-[4rem] p-12 md:p-20 flex flex-col lg:flex-row items-center justify-between gap-16 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.5)] relative overflow-hidden group border border-slate-800">
          {/* Enhanced Mesh Gradient Background */}
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 pointer-events-none" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />
          
          <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full"
            >
              <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.2em]">Cộng đồng học tập lớn nhất</span>
            </motion.div>

            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tight">
              Bắt đầu hành trình <br /> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-blue-400">bứt phá</span> ngay hôm nay
            </h2>
            <p className="text-slate-400 text-lg font-medium leading-relaxed max-w-lg mx-auto lg:mx-0">
               Trở thành một phần của hệ sinh thái EduSmart để kết nối với hàng triệu học viên và kiến tạo lộ trình sự nghiệp tương lai.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-5 justify-center lg:justify-start pt-4">
              <Link href="/signup">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-600/20 transition-all duration-300"
                >
                  Tham gia miễn phí
                </motion.button>
              </Link>
              <Link href="/become-instructor">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-10 py-5 bg-white/5 text-white border border-white/10 rounded-[1.5rem] font-black uppercase tracking-widest text-[10px] backdrop-blur-md hover:bg-white/10 transition-all duration-300"
                >
                  Trở thành giảng viên
                </motion.button>
              </Link>
            </div>
          </div>

          <motion.div
            whileHover={{ scale: 1.05, rotate: -2 }}
            transition={{ type: "spring", stiffness: 300 }}
            className="flex-1 max-w-[450px] relative z-10"
          >
            <div className="p-3 bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl">
              <Image
                src={banner}
                alt="EduSmart Community"
                className="rounded-[2.5rem] shadow-2xl object-cover w-full h-[360px] grayscale-[0.2] hover:grayscale-0 transition-all duration-700"
              />
            </div>
            {/* Decoration */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-600/30 rounded-full blur-[60px] animate-pulse" />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};


export default Home;
