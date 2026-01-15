import React from "react";
import Image from "next/image";
import logo from "@public/logo.png";
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter, Youtube } from "lucide-react";

const Footer = () => {
    return (
        <footer className="bg-green-600 text-white py-10 px-6 md:px-20 rounded-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">

                {/* Logo & Description */}
                <div>
                    <div className="flex items-center gap-3 mb-4">
                        <Image src={logo} alt="Logo" width={50} height={50} className="rounded-full" />
                        <span className="text-lg font-bold tracking-wide">
                            Badminton Booking
                        </span>
                    </div>
                    <p className="text-sm text-green-100">
                        Nền tảng đặt sân cầu lông nhanh chóng, tiện lợi và dễ dàng.
                    </p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Liên kết nhanh</h3>
                    <ul className="space-y-2 text-green-100">
                        <li className="hover:text-white cursor-pointer transition">Trang chủ</li>
                        <li className="hover:text-white cursor-pointer transition">Đặt sân</li>
                        <li className="hover:text-white cursor-pointer transition">Lịch sử đặt</li>
                        <li className="hover:text-white cursor-pointer transition">Liên hệ</li>
                    </ul>
                </div>

                {/* Contact */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Liên hệ</h3>
                    <ul className="space-y-3 text-green-100">
                        <li className="flex items-center gap-2">
                            <MapPin className="w-4 h-4" /> 123 Đường ABC, Hà Nội
                        </li>
                        <li className="flex items-center gap-2">
                            <Phone className="w-4 h-4" /> 0123 456 789
                        </li>
                        <li className="flex items-center gap-2">
                            <Mail className="w-4 h-4" /> support@badminton.vn
                        </li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-lg font-semibold mb-4">Kết nối với chúng tôi</h3>
                    <div className="flex gap-4">
                        <a
                            href="#"
                            className="p-2 bg-white text-green-600 rounded-full hover:bg-green-100 transition transform hover:scale-110"
                        >
                            <Facebook className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="p-2 bg-white text-green-600 rounded-full hover:bg-green-100 transition transform hover:scale-110"
                        >
                            <Instagram className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="p-2 bg-white text-green-600 rounded-full hover:bg-green-100 transition transform hover:scale-110"
                        >
                            <Twitter className="w-5 h-5" />
                        </a>
                        <a
                            href="#"
                            className="p-2 bg-white text-green-600 rounded-full hover:bg-green-100 transition transform hover:scale-110"
                        >
                            <Youtube className="w-5 h-5" />
                        </a>
                    </div>
                </div>
            </div>

            {/* Bottom Copyright */}
            <div className="mt-10 border-t border-green-500 pt-5 text-center text-green-200 text-sm">
                © {new Date().getFullYear()} Badminton Booking. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
