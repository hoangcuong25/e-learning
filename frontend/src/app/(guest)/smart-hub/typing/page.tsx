"use client";

import React from "react";
import { motion } from "framer-motion";
import { Keyboard, ArrowLeft, Timer, Target, Zap, Clock } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const TypingPage = () => {
  return (
    <div className="min-h-screen bg-slate-50 py-12 px-6">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Back Navigation */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link
            href="/smart-hub"
            className="inline-flex items-center text-slate-500 hover:text-purple-600 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Quay lại Smart Hub
          </Link>
        </motion.div>

        {/* Hero */}
        <section className="bg-white rounded-[2.5rem] p-10 md:p-16 border border-slate-200 shadow-xl shadow-purple-500/5 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -mr-20 -mt-20" />

          <div className="relative grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase tracking-wider">
                <Keyboard className="w-3.5 h-3.5" /> Typing Master
              </div>
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-tight">
                Luyện gõ <br />{" "}
                <span className="text-purple-600">Phím Tốc Độ</span>
              </h1>
              <p className="text-slate-600 text-lg leading-relaxed">
                Tăng tốc độ code và soạn thảo văn bản. Theo dõi chỉ số WPM (Word
                Per Minute) và độ chính xác của bạn theo thời gian.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-6 rounded-2xl text-lg font-bold shadow-lg shadow-purple-600/20">
                  Bắt đầu kiểm tra <Zap className="ml-2 w-5 h-5 fill-current" />
                </Button>
                <Button
                  variant="outline"
                  className="px-8 py-6 rounded-2xl text-lg font-bold border-slate-200 hover:bg-slate-50"
                >
                  Luyện theo bài tập
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {[
                {
                  label: "WPM trung bình",
                  count: "0",
                  icon: <Timer className="w-5 h-5" />,
                  color: "bg-purple-50 text-purple-600",
                },
                {
                  label: "Độ chính xác",
                  count: "0%",
                  icon: <Target className="w-5 h-5" />,
                  color: "bg-indigo-50 text-indigo-600",
                },
                {
                  label: "Thời gian luyện",
                  count: "0h",
                  icon: <Clock className="w-5 h-5" />,
                  color: "bg-blue-50 text-blue-600",
                },
                {
                  label: "Xếp hạng",
                  count: "-",
                  icon: <Zap className="w-5 h-5" />,
                  color: "bg-pink-50 text-pink-600",
                },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className={`${stat.color} p-6 rounded-3xl flex flex-col items-center justify-center text-center space-y-2`}
                >
                  <div className="p-2 bg-white/50 rounded-xl">{stat.icon}</div>
                  <div className="text-2xl font-black">{stat.count}</div>
                  <div className="text-[10px] font-bold uppercase opacity-80 leading-tight">
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Info Box */}
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              title: "Gõ 10 ngón",
              desc: "Kỹ thuật gõ không cần nhìn bàn phím giúp bạn tập trung hơn vào code.",
            },
            {
              title: "Bài tập Code",
              desc: "Luyện gõ các cú pháp ngôn ngữ lập trình phổ biến (JS, Python, TS).",
            },
            {
              title: "Bảng vàng",
              desc: "Cạnh tranh vị trí dẫn đầu với các học viên khác tại EduSmart.",
            },
          ].map((item, i) => (
            <div
              key={i}
              className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm"
            >
              <h4 className="font-bold text-slate-900 mb-2">{item.title}</h4>
              <p className="text-sm text-slate-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TypingPage;
