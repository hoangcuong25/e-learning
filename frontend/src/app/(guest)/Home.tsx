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
      <section className="mx-auto pb-4">
        <h2 className="text-2xl font-bold mb-8 text-gray-800">
          Khóa học nổi bật
        </h2>

        {popularCourses.length === 0 ? (
          <p className="text-gray-500">Hiện chưa có khóa học nổi bật nào.</p>
        ) : (
          <CourseSlider>
            {popularCourses.map((course) => (
              <motion.div
                key={course.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="w-full"
              >
                <CourseCard course={course} />
              </motion.div>
            ))}
          </CourseSlider>
        )}
      </section>

      {/* Features */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-12 rounded-2xl"
      >
        <div className="mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
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

      {/* Community Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-7xl mx-auto px-6 py-20"
      >
        {/* Stats – Social Proof */}
        <section className="px-6 mb-0">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              {
                value: "1M+",
                label: "Người dùng",
              },
              {
                value: "300K+",
                label: "Bài viết",
              },
              {
                value: "5M+",
                label: "Lượt thích",
              },
              {
                value: "2M+",
                label: "Bình luận",
              },
            ].map((item, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-6 text-center shadow-sm"
              >
                <p className="text-3xl font-bold text-gray-800">{item.value}</p>
                <p className="text-gray-500">{item.label}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="bg-blue-50 rounded-3xl p-10 flex flex-col md:flex-row items-center justify-between gap-10 shadow-sm">
          {/* Left Text */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-gray-800 mb-4 leading-snug">
              Tham gia cùng cộng đồng học viên và giảng viên toàn cầu
            </h2>
            <p className="text-gray-600 mb-6">
              Hơn{" "}
              <span className="font-semibold text-blue-600">
                1 triệu học viên
              </span>{" "}
              đang học tập mỗi ngày trên nền tảng EduSmart. Hãy trở thành một
              phần của cộng đồng năng động, chia sẻ kiến thức và phát triển sự
              nghiệp cùng nhau.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Link href="/signup">Bắt đầu học ngay</Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition"
              >
                <Link href="/signup">Trở thành giảng viên</Link>
              </motion.button>
            </div>
          </div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="flex-1 flex justify-center"
          >
            <Image
              src={banner}
              alt="EduSmart Community"
              width={500}
              height={300}
              className="rounded-2xl shadow-md object-cover"
            />
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default Home;
