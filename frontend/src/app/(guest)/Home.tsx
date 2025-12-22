"use client";
import React from "react";
import Image from "next/image";
import { BookOpen, Clock, Users, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

import banner from "@public/elearning-banner.png";

const fadeUp = {
  hidden: { opacity: 0, y: 50 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const Home = () => {
  return (
    <div className="space-y-16 my-4">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-gradient-to-r from-blue-700 to-blue-500 text-white rounded-2xl shadow-lg overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8">
          {/* Text */}
          <div className="flex-1">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
              Học tập mọi lúc, phát triển không ngừng cùng EduSmart
            </h1>
            <p className="text-lg mb-6">
              Nền tảng học trực tuyến giúp bạn tiếp cận hàng trăm khóa học chất
              lượng từ các giảng viên hàng đầu.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
            >
              <Link href="/courses">Khám phá khóa học</Link>
            </motion.button>
          </div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1"
          >
            <Image
              src={banner}
              alt="E-Learning Banner"
              width={500}
              height={300}
              className="rounded-xl shadow-lg object-cover w-[500px] h-96"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Featured Courses */}
      <section className="max-w-7xl mx-auto px-6">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Khóa học nổi bật
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3].map((course) => (
            <motion.div
              key={course}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
            >
              <Image
                src={banner}
                alt={`Course ${course}`}
                width={400}
                height={250}
                className="w-full h-56 object-cover"
              />
              <div className="p-4">
                <h3 className="text-lg font-semibold">
                  Khóa học Lập trình Web {course}
                </h3>
                <p className="text-gray-500 text-sm">
                  Giảng viên: Nguyễn Văn A
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-blue-600 font-bold">499.000đ</span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
                  >
                    <Link href={`/course/${course}`}>Xem chi tiết</Link>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-12 rounded-2xl"
      >
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <BookOpen className="text-blue-600 w-12 h-12 mb-4" />
            <h4 className="font-bold text-lg mb-2">Học linh hoạt</h4>
            <p className="text-gray-600">
              Học bất cứ lúc nào, bất cứ nơi đâu chỉ với một thiết bị kết nối
              Internet.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <Clock className="text-blue-600 w-12 h-12 mb-4" />
            <h4 className="font-bold text-lg mb-2">Tiết kiệm thời gian</h4>
            <p className="text-gray-600">
              Không cần di chuyển — chỉ cần đăng nhập và bắt đầu học ngay.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            className="flex flex-col items-center text-center"
          >
            <GraduationCap className="text-blue-600 w-12 h-12 mb-4" />
            <h4 className="font-bold text-lg mb-2">Chứng chỉ uy tín</h4>
            <p className="text-gray-600">
              Nhận chứng chỉ hoàn thành khóa học được công nhận và chia sẻ dễ
              dàng.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
