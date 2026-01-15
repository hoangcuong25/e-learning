"use client";
import React from "react";
import Image from "next/image";
import { CalendarDays, MapPin, Users } from "lucide-react";
import { motion } from "framer-motion";

const fadeUp = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

import banner from "@public/badminton-court.png"
import Link from "next/link";

const Home = () => {
    return (
        <div className="space-y-16 my-4">
            {/* Hero Section */}
            <motion.section
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="bg-gradient-to-r from-green-600 to-green-400 text-white rounded-2xl shadow-lg overflow-hidden"
            >
                <div className="max-w-7xl mx-auto px-6 py-16 flex flex-col md:flex-row items-center gap-8">
                    {/* Text */}
                    <div className="flex-1">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                            Đặt sân cầu lông nhanh chóng, tiện lợi
                        </h1>
                        <p className="text-lg mb-6">
                            Chỉ với vài cú click, bạn đã có ngay sân để cùng bạn bè hoặc đội nhóm luyện tập và thi đấu.
                        </p>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-white text-green-600 px-6 py-3 rounded-lg font-semibold shadow hover:bg-gray-100 transition"
                        >
                            Đặt sân ngay
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
                            alt="Badminton Court"
                            width={500}
                            height={300}
                            className="rounded-xl shadow-lg object-cover w-[500px] h-96"
                        />
                    </motion.div>
                </div>
            </motion.section>

            {/* Featured Courts */}
            <section className="max-w-7xl mx-auto px-6">
                <h2 className="text-2xl font-bold mb-8 text-gray-800">Sân nổi bật</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[1, 2, 3].map((court, i) => (
                        <motion.div
                            key={court}
                            variants={fadeUp}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, amount: 0.2 }}
                            whileHover={{ scale: 1.03 }}
                            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer"
                        >
                            <Image
                                src={banner}
                                alt={`Court ${court}`}
                                width={400}
                                height={250}
                                className="w-full h-56 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-lg font-semibold">Sân Cầu Lông {court}</h3>
                                <p className="text-gray-500 text-sm">Quận Hoàn Kiếm, Hà Nội</p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-green-600 font-bold">150.000đ/giờ</span>
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
                                    >
                                        <Link href={`/court/${court}`}>
                                            Xem chi tiết
                                        </Link>
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
                        <CalendarDays className="text-green-600 w-12 h-12 mb-4" />
                        <h4 className="font-bold text-lg mb-2">Đặt lịch nhanh</h4>
                        <p className="text-gray-600">
                            Đặt sân chỉ trong 30 giây, tiết kiệm thời gian của bạn.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="flex flex-col items-center text-center"
                    >
                        <MapPin className="text-green-600 w-12 h-12 mb-4" />
                        <h4 className="font-bold text-lg mb-2">Vị trí thuận tiện</h4>
                        <p className="text-gray-600">
                            Hệ thống sân trải khắp các quận, dễ dàng lựa chọn.
                        </p>
                    </motion.div>
                    <motion.div
                        variants={fadeUp}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, amount: 0.2 }}
                        className="flex flex-col items-center text-center"
                    >
                        <Users className="text-green-600 w-12 h-12 mb-4" />
                        <h4 className="font-bold text-lg mb-2">Phù hợp mọi đối tượng</h4>
                        <p className="text-gray-600">
                            Từ người mới bắt đầu đến vận động viên chuyên nghiệp.
                        </p>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
};

export default Home;
