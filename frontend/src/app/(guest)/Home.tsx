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
      <section className="mx-auto  pb-4">
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

      {/* Testimonials Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="mx-auto px-6 py-16"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 text-center mb-10">
          Xem những người khác đạt được gì thông qua học tập
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              quote:
                "Udemy được đánh giá là chương trình cấp chứng chỉ hoặc khóa học online phổ biến nhất về học cách viết code theo Khảo sát nhà phát triển Stack Overflow năm 2023.",
              footer: "Thu thập được 37.076 phản hồi",
              link: "Xem các khóa học Phát triển web",
            },
            {
              quote:
                "Udemy thực sự là yếu tố mang tính đột phá và là nền tảng dạy học tuyệt vời dành cho tôi khi chúng tôi đưa Dimensional vào cuộc sống.",
              name: "Alvin Lim",
              title: "Đồng sáng lập kỹ thuật, CTO tại Dimensional",
              link: "Xem khóa học iOS & Swift này",
            },
            {
              quote:
                "Udemy cho bạn khả năng kiên trì. Tôi đã học được chính xác những gì tôi cần biết trong thực tiễn. Những kiến thức và kỹ năng này đã giúp tôi tự phát triển bản thân và thăng tiến sự nghiệp.",
              name: "William A. Wachlin",
              title: "Chuyên viên quản lý đối tác tại Amazon Web Services",
              link: "Xem khóa học AWS này",
            },
            {
              quote:
                "Với Udemy Business, các nhân viên đã có thể kết hợp các kỹ năng mềm về công nghệ và tư vấn lại với nhau... để thúc đẩy sự nghiệp của họ phát triển.",
              name: "Ian Stevens",
              title:
                "Trưởng phòng Phát triển Năng lực, Bắc Mỹ tại Publicis Sapient",
              link: "Đọc toàn bộ câu chuyện",
            },
          ].map((item, i) => (
            <motion.div
              key={i}
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              className="bg-white rounded-2xl shadow-md p-6 flex flex-col justify-between hover:shadow-lg transition"
            >
              <p className="text-gray-700 italic mb-6">
                <span className="text-3xl text-blue-600 font-serif">“</span>
                {item.quote}
              </p>

              {item.name && (
                <div className="mt-auto">
                  <p className="font-semibold text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-500 mb-2">{item.title}</p>
                </div>
              )}

              <p className="text-blue-600 text-sm font-medium cursor-pointer hover:underline">
                {item.link} →
              </p>
            </motion.div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="#"
            className="text-blue-600 font-semibold hover:underline inline-flex items-center gap-1"
          >
            Xem tất cả các câu chuyện →
          </Link>
        </div>
      </motion.section>

      {/* Certification Section */}
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className=" mx-auto"
      >
        <div className="bg-[#1A1B25] text-white rounded-3xl p-10 flex flex-col lg:flex-row items-center gap-10">
          {/* Left Text */}
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-4 leading-snug">
              Lấy chứng chỉ và thăng tiến trong sự nghiệp
            </h2>
            <p className="text-gray-300 mb-6">
              Luyện thi các chứng chỉ với các khóa học toàn diện, bài kiểm tra
              thực hành và ưu đãi đặc biệt về voucher kỳ thi.
            </p>
            <Link
              href="#"
              className="text-blue-400 font-semibold hover:underline inline-flex items-center gap-1"
            >
              Khám phá các chứng chỉ và voucher →
            </Link>
          </div>

          {/* Right Cards */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "CompTIA",
                desc: "Đám mây, Mạng, An ninh mạng",
                img: { banner },
              },
              {
                title: "AWS",
                desc: "Đám mây, AI, Lập trình, Mạng",
                img: { banner },
              },
              {
                title: "PMI",
                desc: "Quản lý dự án và chương trình",
                img: { banner },
              },
            ].map((cert, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                whileHover={{ scale: 1.03 }}
                className="bg-[#2A2B3D] rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition"
              >
                <Image
                  src={cert.img.banner}
                  alt={cert.title}
                  width={400}
                  height={250}
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <h3 className="text-lg font-semibold">{cert.title}</h3>
                  <p className="text-gray-400 text-sm">{cert.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
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
              </span>
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
                <Link href="/register">Bắt đầu học ngay</Link>
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold border border-blue-600 hover:bg-blue-50 transition"
              >
                <Link href="/instructor/become">Trở thành giảng viên</Link>
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
