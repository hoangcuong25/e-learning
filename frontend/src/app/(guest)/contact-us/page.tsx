"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { motion } from "framer-motion";

const ContactUsPage = () => {
  return (
    <div className="min-h-screen pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-7xl mx-auto bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
      >
        <div className="grid lg:grid-cols-2">
          {/* Left: Contact Info & Map */}
          <div className="p-10 lg:p-20 bg-slate-50 space-y-16">
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600"
              >
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Liên hệ trực tiếp</span>
              </motion.div>
              
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight tracking-tighter">
                Chúng tôi luôn <br/> <span className="text-indigo-600 underline decoration-indigo-200 decoration-8 underline-offset-4">lắng nghe</span> bạn
              </h1>
              <p className="text-lg text-slate-500 font-medium leading-relaxed max-w-md">
                Đừng ngần ngại liên hệ với EduSmart nếu bạn có bất kỳ thắc mắc hay góp ý nào. Đội ngũ của chúng tôi sẽ phản hồi trong vòng 24 giờ làm việc.
              </p>
            </div>

            <div className="grid gap-6">
              {[
                { icon: MapPin, title: "Trụ sở chính", info: "456 Đường Trí Thức, Quận 7, TP. HCM" },
                { icon: Phone, title: "Hotline hỗ trợ", info: "0987 654 321" },
                { icon: Mail, title: "Email hỗ trợ", info: "support@edusmart.vn" }
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex gap-5 p-6 bg-white rounded-3xl shadow-sm border border-slate-100 group transition-all duration-300"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                    <item.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{item.title}</h4>
                    <p className="text-slate-900 font-black">{item.info}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Map Placeholder or IFrame */}
            <div className="rounded-[2.5rem] overflow-hidden border border-slate-200 shadow-2xl h-80 relative group">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5020187137284!2d106.70042331526062!3d10.776530992321273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3e1234567%3A0x89abcdef12345678!2zMTIzIMSQxrDGoW5nIEFCRCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1685000000000!5m2!1svi!2s"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
              />
              <div className="absolute inset-0 bg-indigo-600/5 pointer-events-none group-hover:opacity-0 transition-opacity" />
            </div>
          </div>

          {/* Right: Form */}
          <div className="p-10 lg:p-20 space-y-12">
            <div className="space-y-4">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Gửi tin nhắn cho EduSmart</h3>
               <p className="text-sm text-slate-500 font-medium">Chúng tôi sẽ xử lý thông tin của bạn một cách bảo mật nhất.</p>
            </div>

            <form className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">Họ và tên</label>
                  <input
                    type="text"
                    placeholder="Nguyễn Văn A"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-300"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">Địa chỉ Email</label>
                  <input
                    type="email"
                    placeholder="nva@example.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-300"
                  />
                </div>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">Chủ đề quan tâm</label>
                <select className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium text-slate-500">
                   <option>Hỗ trợ học tập</option>
                   <option>Hợp tác giảng dạy</option>
                   <option>Khiếu nại/Góp ý</option>
                   <option>Vấn đề thanh toán</option>
                </select>
              </div>

              <div className="space-y-3">
                <label className="text-[10px] font-black text-slate-950 uppercase tracking-widest ml-1">Nội dung chi tiết</label>
                <textarea
                  rows={6}
                  placeholder="Bạn đang quan tâm đến vấn đề gì..."
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:bg-white focus:border-indigo-500 transition-all outline-none font-medium placeholder:text-slate-300 resize-none"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-xs shadow-2xl shadow-indigo-600/20 transition-all duration-300 flex items-center justify-center gap-3 group"
              >
                Gửi yêu cầu ngay
                <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </motion.button>
            </form>

            <div className="pt-12 border-t border-slate-100 grid md:grid-cols-2 gap-8">
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 transition-colors">
                  <Clock size={18} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Giờ làm việc</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">08:00 - 18:00 (Hàng ngày)</p>
                </div>
              </div>
              <div className="flex items-center gap-4 group">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600 transition-colors">
                  <Phone size={18} />
                </div>
                <div>
                  <h5 className="text-[10px] font-black text-slate-900 uppercase tracking-widest">Hotline 24/7</h5>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">+84 1900 8888</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ContactUsPage;
