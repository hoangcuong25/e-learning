"use client";

import React from "react";
import Image from "next/image";
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
    <footer className="bg-[#0f172a] text-white py-8 px-4 md:py-12 md:px-20 rounded-2xl mt-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 md:gap-10 text-center md:text-left">
        {/* Logo & Description */}
        <div>
          <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
            <Image
              src={logo}
              alt="E-Learning Logo"
              width={48}
              height={48}
              className="rounded-full"
            />
            <span className="text-xl font-semibold tracking-wide">
              E-Learning Hub
            </span>
          </div>
          <p className="text-sm text-blue-100 leading-relaxed">
            Nền tảng học trực tuyến hiện đại giúp bạn phát triển kỹ năng mọi
            lúc, mọi nơi. Học tập chủ động – Tương tác – Hiệu quả.
          </p>
        </div>

        {/* Quick Links */}
        <nav>
          <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
          <ul className="space-y-2 text-blue-100">
            {["Trang chủ", "Khóa học", "Giảng viên", "Liên hệ"].map(
              (item, idx) => (
                <li
                  key={idx}
                  className="hover:text-white cursor-pointer transition duration-200"
                >
                  {item}
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Contact */}
        <address className="not-italic">
          <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
          <ul className="space-y-3 text-blue-100">
            <li className="flex items-center justify-center md:justify-start gap-2">
              <MapPin className="w-4 h-4 shrink-0" />
              <span>456 Đường Trí Thức, TP. Hồ Chí Minh</span>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <Phone className="w-4 h-4 shrink-0" />
              <a
                href="tel:0987654321"
                className="hover:text-white transition duration-200"
              >
                0987 654 321
              </a>
            </li>
            <li className="flex items-center justify-center md:justify-start gap-2">
              <Mail className="w-4 h-4 shrink-0" />
              <a
                href="mailto:support@elearning.vn"
                className="hover:text-white transition duration-200"
              >
                support@elearning.vn
              </a>
            </li>
          </ul>
        </address>

        {/* Social Media */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h3>
          <div className="flex justify-center md:justify-start gap-4">
            {[
              { icon: <Facebook />, href: "#" },
              { icon: <Instagram />, href: "#" },
              { icon: <Twitter />, href: "#" },
              { icon: <Youtube />, href: "#" },
            ].map((social, index) => (
              <a
                key={index}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 bg-white text-blue-700 rounded-full hover:bg-blue-100 transition transform hover:scale-110"
              >
                {React.cloneElement(social.icon, { className: "w-5 h-5" })}
              </a>
            ))}
          </div>

          <Link
            href="/contact-us"
            className="
              inline-flex items-center gap-2
              mt-4
              px-4 py-2
              rounded-full
              bg-blue-600 text-white
              text-sm font-semibold
              hover:bg-blue-700
              shadow-md hover:shadow-lg
              transition-all duration-200
              hover:-translate-y-0.5
            "
          >
            Liên hệ ngay
          </Link>
        </div>
      </div>

      {/* Divider & Copyright */}
      <div className="mt-10 border-t border-blue-500 pt-5 text-center text-blue-200 text-sm">
        © {new Date().getFullYear()}{" "}
        <span className="font-medium text-white">E-Learning Hub</span>. All
        rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
