"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Code2,
  Keyboard,
  GitBranch,
  Terminal,
  Cpu,
  Zap,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const features = [
  {
    title: "Giải thuật toán",
    description:
      "Rèn luyện tư duy logic qua hàng trăm bài tập thuật toán từ cơ bản đến nâng cao.",
    icon: <Code2 className="w-8 h-8" />,
    color: "from-blue-500 to-cyan-400",
    path: "/smart-hub/algorithms",
    tag: "Trending",
  },
  {
    title: "Luyện gõ 10 ngón",
    description:
      "Cải thiện tốc độ và độ chính xác khi gõ phím với các bài tập thực hành tối ưu.",
    icon: <Keyboard className="w-8 h-8" />,
    color: "from-purple-500 to-pink-400",
    path: "/smart-hub/typing",
    tag: "New",
  },
  {
    title: "Học sử dụng Git",
    description:
      "Làm chủ quy trình làm việc chuyên nghiệp với Git và GitHub qua hướng dẫn thực tế.",
    icon: <GitBranch className="w-8 h-8" />,
    color: "from-orange-500 to-yellow-400",
    path: "/smart-hub/git",
    tag: "Essential",
  },
];

const SmartHubPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-7xl mx-auto space-y-16">
        {/* Hero Section */}
        <section className="text-center space-y-6 pt-8">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold text-slate-900 tracking-tight"
          >
            Smart{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
              Hub
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-600 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
          >
            Nơi hội tụ các công cụ và tài nguyên đặc biệt giúp bạn nâng tầm kỹ
            năng lập trình và làm việc chuyên nghiệp.
          </motion.p>
        </section>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, transition: { duration: 0.2 } }}
            >
              <Link href={feature.path} className="group block h-full">
                <div className="relative h-full bg-white rounded-3xl p-8 border border-slate-200 shadow-sm hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-300 overflow-hidden">
                  {/* Decorative Gradient Background */}
                  <div
                    className={`absolute -right-8 -top-8 w-32 h-32 bg-gradient-to-br ${feature.color} opacity-5 blur-2xl group-hover:opacity-10 transition-opacity`}
                  />

                  <div className="relative space-y-6">
                    {/* Icon & Tag */}
                    <div className="flex justify-between items-start">
                      <div
                        className={`p-4 rounded-2xl bg-gradient-to-br ${feature.color} text-white shadow-lg shadow-blue-500/10`}
                      >
                        {feature.icon}
                      </div>
                      <span className="px-3 py-1 text-xs font-bold bg-slate-100 text-slate-500 rounded-full border border-slate-200">
                        {feature.tag}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="space-y-3">
                      <h3 className="text-2xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 leading-relaxed text-sm lg:text-base">
                        {feature.description}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="pt-4 flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                      Bắt đầu khám phá <ArrowRight className="ml-2 w-4 h-4" />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA / Branding */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="text-center pt-8 border-t border-slate-200"
        >
          <p className="text-slate-400 text-sm italic">
            "Học không bao giờ đủ, thực hành không bao giờ thừa." — EduSmart
            Team
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SmartHubPage;
