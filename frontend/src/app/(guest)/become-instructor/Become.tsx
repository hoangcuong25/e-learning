"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { ArrowRight } from "lucide-react";
import NavbarUser from "@/components/user/NavbarUser";

export default function BecomeInstructorPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-white mt-4">
      {/* 🌟 HERO SECTION */}
      <section className="relative bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-24 px-6 rounded-2xl mt-4">
        <div className="max-w-5xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Chia sẻ kiến thức của bạn. Trở thành giảng viên hôm nay!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg mb-8 max-w-2xl mx-auto"
          >
            Hàng ngàn học viên đang tìm kiếm những khóa học tuyệt vời từ bạn.
            Hãy bắt đầu hành trình giảng dạy và kiếm thu nhập cùng chúng tôi.
          </motion.p>

          <Button
            size="lg"
            className="bg-white text-indigo-600 font-semibold hover:bg-gray-100"
            onClick={() => router.push("/apply-instructor")}
          >
            Bắt đầu ngay <ArrowRight className="ml-2 w-5 h-5" />
          </Button>
        </div>
      </section>

      {/* 💎 BENEFITS SECTION */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Vì sao nên trở thành giảng viên?
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Tự do & linh hoạt",
                desc: "Tạo khóa học theo cách của bạn, vào thời gian phù hợp với bạn.",
              },
              {
                title: "Thu nhập hấp dẫn",
                desc: "Nhận phần thưởng xứng đáng với công sức giảng dạy của bạn.",
              },
              {
                title: "Ảnh hưởng tích cực",
                desc: "Chia sẻ kiến thức, giúp người khác phát triển sự nghiệp.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white shadow-lg rounded-2xl p-8 border hover:shadow-xl transition"
              >
                <h3 className="text-xl font-semibold text-indigo-600 mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ⚙️ HOW IT WORKS SECTION */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-10 text-gray-800">
            Chỉ với 3 bước đơn giản
          </h2>

          <div className="grid md:grid-cols-3 gap-10">
            {[
              {
                step: "1",
                title: "Tạo tài khoản giảng viên",
                desc: "Điền thông tin cơ bản và hoàn tất hồ sơ của bạn.",
              },
              {
                step: "2",
                title: "Tạo khóa học đầu tiên",
                desc: "Chuẩn bị nội dung, video và bài giảng hấp dẫn.",
              },
              {
                step: "3",
                title: "Xuất bản & bắt đầu giảng dạy",
                desc: "Khóa học của bạn sẽ hiển thị đến hàng ngàn học viên.",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                viewport={{ once: true }}
                className="bg-white border rounded-2xl p-8 shadow-sm hover:shadow-md transition"
              >
                <div className="w-12 h-12 flex items-center justify-center bg-indigo-600 text-white rounded-full mx-auto text-xl font-bold mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 🚀 FINAL CTA SECTION */}
      <section className="bg-indigo-600 text-white py-16 px-6 text-center">
        <h2 className="text-3xl font-bold mb-6">
          Sẵn sàng bắt đầu hành trình giảng dạy?
        </h2>
        <p className="text-lg mb-8">
          Hãy đăng ký ngay để trở thành một phần của cộng đồng giảng viên.
        </p>
        <Button
          size="lg"
          className="bg-white text-indigo-600 hover:bg-gray-100 font-semibold"
          onClick={() => router.push("/apply-instructor")}
        >
          Trở thành giảng viên ngay <ArrowRight className="ml-2 w-5 h-5" />
        </Button>
      </section>
    </div>
  );
}
