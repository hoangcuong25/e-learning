"use client";

import React from "react";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const page = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-16 px-6 rounded-2xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            Liên hệ với chúng tôi
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Hãy để lại thông tin, đội ngũ
            chăm sóc khách hàng sẽ liên hệ lại sớm nhất có thể.
          </p>
        </header>

        {/* Contact Info */}
        <section className="grid md:grid-cols-3 gap-8 mb-16">
          {[
            {
              icon: (
                <MapPin className="w-8 h-8 text-emerald-500 mb-3 mx-auto" />
              ),
              title: "Địa chỉ",
              info: "123 Đường ABC, Quận 1, TP. Hồ Chí Minh",
            },
            {
              icon: <Phone className="w-8 h-8 text-emerald-500 mb-3 mx-auto" />,
              title: "Điện thoại",
              info: "+84 123 456 789",
            },
            {
              icon: <Mail className="w-8 h-8 text-emerald-500 mb-3 mx-auto" />,
              title: "Email",
              info: "support@company.com",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white shadow-md rounded-2xl p-6 text-center hover:shadow-lg transition"
            >
              {item.icon}
              <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
              <p className="text-gray-600">{item.info}</p>
            </div>
          ))}
        </section>

        {/* Contact Form & Map */}
        <section className="grid md:grid-cols-2 gap-10">
          {/* Form */}
          <div className="bg-white shadow-lg rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Gửi tin nhắn
            </h2>
            <form className="space-y-5">
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Họ và tên
                </label>
                <input
                  type="text"
                  placeholder="Nhập họ và tên"
                  autoComplete="name"
                  aria-label="Họ và tên"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Nhập email"
                  autoComplete="email"
                  aria-label="Email"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
              <div>
                <label className="block text-gray-700 text-sm mb-2">
                  Nội dung
                </label>
                <textarea
                  placeholder="Nhập tin nhắn của bạn..."
                  rows={5}
                  aria-label="Nội dung tin nhắn"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-500 text-white py-2.5 rounded-lg hover:bg-emerald-600 transition font-medium"
              >
                Gửi ngay
              </button>
            </form>
          </div>

          {/* Map & Working Hours */}
          <div>
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.5020187137284!2d106.70042331526062!3d10.776530992321273!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x31752f3e1234567%3A0x89abcdef12345678!2zMTIzIMSQxrDGoW5nIEFCRCwgUXXhuq1uIDEsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaA!5e0!3m2!1svi!2s!4v1685000000000!5m2!1svi!2s"
              width="100%"
              height="300"
              className="rounded-2xl border"
              loading="lazy"
              allowFullScreen
            ></iframe>

            <div className="mt-6 bg-white shadow-md rounded-2xl p-6">
              <Clock className="w-6 h-6 text-emerald-500 mb-2" />
              <h3 className="font-semibold text-lg mb-1">Giờ làm việc</h3>
              <p className="text-gray-600">Thứ 2 - Thứ 6: 08:00 - 18:00</p>
              <p className="text-gray-600">Thứ 7: 08:00 - 12:00</p>
              <p className="text-gray-600">Chủ nhật: Nghỉ</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default page;
