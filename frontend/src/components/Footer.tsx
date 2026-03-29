"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Youtube,
} from "lucide-react";
import logo from "@public/logo.png";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="mt-20 mx-6 mb-8 relative">
      <div className="bg-slate-900 rounded-[4rem] px-10 py-20 overflow-hidden relative shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] border border-slate-800">
        {/* Background Decorative Element */}
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} />

        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 relative z-10">
          {/* Logo & Description */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="p-2 bg-indigo-600 rounded-2xl group-hover:rotate-6 transition-transform shadow-lg shadow-indigo-600/20">
                <Image
                  src={logo}
                  alt="EduSmart Logo"
                  width={32}
                  height={32}
                  className="invert brightness-0"
                />
              </div>
              <span className="text-xl font-black text-white tracking-widest uppercase">
                EduSmart
              </span>
            </Link>
            <p className="text-sm font-medium text-slate-400 leading-relaxed italic">
              Kiến tạo nền tảng tri thức vững chắc cho tương lai. Học tập thông minh, linh hoạt và không giới hạn cùng EduSmart Hub.
            </p>
            <div className="flex items-center gap-4">
              {[
                { icon: <Facebook />, href: "#" },
                { icon: <Instagram />, href: "#" },
                { icon: <Twitter />, href: "#" },
                { icon: <Youtube />, href: "#" },
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ y: -5, scale: 1.1 }}
                  className="w-10 h-10 flex items-center justify-center bg-white/5 border border-white/10 rounded-full text-white hover:bg-white hover:text-slate-900 transition-all duration-300 shadow-xl"
                >
                  {React.cloneElement(social.icon, { size: 18 })}
                </motion.a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Liên kết nhanh</h3>
            <ul className="space-y-4">
              {["Trang chủ", "Khóa học", "Giảng viên", "Về chúng tôi"].map((item, idx) => (
                <li key={idx}>
                  <Link href="#" className="text-sm font-bold text-slate-300 hover:text-white transition-colors duration-300 block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Thông tin liên hệ</h3>
            <ul className="space-y-5 text-sm font-bold text-slate-300">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-indigo-500 shrink-0 mt-0.5" />
                <span className="leading-relaxed">456 Đường Trí Thức, Quận 7,<br/>TP. Hồ Chí Minh</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-indigo-500 shrink-0" />
                <a href="tel:0987654321" className="hover:text-white transition-colors italic">0987 654 321</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-indigo-500 shrink-0" />
                <a href="mailto:support@edusmart.vn" className="hover:text-white transition-colors italic">support@edusmart.vn</a>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-8">
            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Liên hệ ngay</h3>
            <p className="text-xs font-medium text-slate-400 leading-relaxed">Đừng bỏ lỡ những cập nhật mới nhất về các khóa học xu hướng.</p>
            <Link
              href="/contact-us"
              className="inline-flex w-full items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-widest text-[10px] shadow-2xl shadow-indigo-600/20 transition-all duration-300 group"
            >
              Gửi yêu cầu ngay
              <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
                <Mail size={16} />
              </motion.span>
            </Link>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="mt-20 pt-10 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
            © {new Date().getFullYear()} <span className="text-slate-300">EduSmart Hub</span>. Mọi quyền được bảo lưu.
          </p>
          <div className="flex gap-8">
            {["Điều khoản", "Bảo mật", "Cookie"].map((p, i) => (
              <Link key={i} href="#" className="text-[10px] font-bold text-slate-500 hover:text-white uppercase tracking-widest transition-colors">
                {p}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};


export default Footer;
