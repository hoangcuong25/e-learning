"use client";

import { Metadata } from "next";
import { ArrowRight, Star, Globe, TrendingUp, CheckCircle, Award } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function Page() {
  return (
    <div className="min-h-screen bg-white">
      {/* 🌟 PREMIUM HERO SECTION */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden bg-slate-900 px-6 py-24 mx-6 rounded-[3.5rem] mt-6 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.2)]">
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/4" />
        
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full text-indigo-400"
          >
            <span className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em]">Join our global faculty</span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter"
          >
            Chia sẻ tri thức. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-indigo-600">Kiến tạo tương lai.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Hàng ngàn học viên đang chờ đợi những trải nghiệm học tập đột phá từ bạn. 
            Bắt đầu hành trình giảng dạy chuyên nghiệp cùng EduSmart ngay hôm nay.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Link href="/apply-instructor">
              <Button
                size="lg"
                className="h-16 px-12 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-2xl shadow-indigo-600/40 transition-all uppercase tracking-widest text-[11px] gap-3"
              >
                Bắt đầu giảng dạy <ArrowRight size={18} />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* 💎 BENEFITS SECTION */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto space-y-20">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Đặc quyền của giảng viên
             </h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Tại sao bạn nên chọn EduSmart?</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Tự do sáng tạo",
                desc: "Xây dựng giáo án và phong cách giảng dạy mang đậm dấu ấn cá nhân của riêng bạn.",
                icon: <Globe className="w-8 h-8" />,
                color: "bg-indigo-50 text-indigo-600"
              },
              {
                title: "Thu nhập đột phá",
                desc: "Hệ thống chia sẻ doanh thu minh bạch, công bằng dựa trên giá trị bạn mang lại.",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "bg-emerald-50 text-emerald-600"
              },
              {
                title: "Cộng đồng tinh hoa",
                desc: "Kết nối với mạng lưới chuyên gia hàng đầu và tiếp cận hàng vạn học viên tiềm năng.",
                icon: <Star className="w-8 h-8" />,
                color: "bg-amber-50 text-amber-600"
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500"
              >
                <div className={`w-20 h-20 ${item.color} rounded-[1.5rem] flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500 shadow-sm`}>
                  {item.icon}
                </div>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-4 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ HOW IT WORKS SECTION */}
      <section className="py-32 px-6 bg-slate-50 overflow-hidden relative">
        <div className="max-w-7xl mx-auto space-y-20 relative z-10">
          <div className="text-center space-y-4">
             <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter">
                Quy trình 3 bước chuyên nghiệp
             </h2>
             <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">Dễ dàng bắt đầu trong vòng 24h</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 relative">
             {/* Dynamic connector line for desktop */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-px border-t-2 border-dashed border-slate-200 -z-10" />
            
            {[
              {
                step: "01",
                title: "Gửi đơn đăng ký",
                desc: "Hoàn thiện hồ sơ năng lực và lĩnh vực chuyên môn của bạn gửi cho đội ngũ EduSmart."
              },
              {
                step: "02",
                title: "Phỏng vấn & Đào tạo",
                desc: "Trao đổi về định hướng nội dung và tham gia các buổi hướng dẫn sử dụng nền tảng."
              },
              {
                step: "03",
                title: "Sản xuất & Xuất bản",
                desc: "Xây dựng khóa học chất lượng cao và bắt đầu lan tỏa tri thức đến cộng đồng."
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="relative bg-white p-10 rounded-[2.5rem] shadow-sm border border-slate-100 flex flex-col items-center text-center space-y-6"
              >
                <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center text-xl font-black tracking-tighter shadow-xl shadow-slate-900/10">
                  {item.step}
                </div>
                <div className="space-y-4">
                  <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">
                    {item.title}
                  </h3>
                  <p className="text-slate-500 font-medium leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-32">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-slate-900 rounded-[4rem] p-12 md:p-24 flex flex-col lg:flex-row items-center justify-between gap-16 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.3)] relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          
          <div className="flex-1 space-y-8 relative z-10 text-center lg:text-left">
            <h2 className="text-4xl md:text-6xl font-black text-white leading-[1.1] tracking-tighter">
              Sẵn sàng để <br />
              <span className="text-indigo-500">tỏa sáng?</span>
            </h2>
            <p className="text-lg text-slate-400 font-medium max-w-md">
              Gia nhập đội ngũ giảng viên hàng đầu và cùng chúng tôi thay đổi cách thế giới học tập.
            </p>
          </div>

          <div className="relative z-10">
            <Link href="/apply-instructor">
              <Button
                size="lg"
                className="h-20 px-16 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-3xl shadow-2xl transition-all uppercase tracking-[0.2em] text-[11px] group-hover:scale-105"
              >
                Trở thành giảng viên ngay
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>
    </div>
  );
}

