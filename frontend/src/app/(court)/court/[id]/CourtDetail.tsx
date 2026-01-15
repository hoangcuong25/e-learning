import React from "react";
import { Star } from "lucide-react";

const CourtDetail = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-8 my-3 rounded-2xl">
            {/* Banner */}
            <div className="w-full h-80 relative">
                <img
                    src="/badminton-court.jpg"
                    alt="Sân cầu lông"
                    className="w-full h-full object-cover rounded-2xl shadow-lg"
                />
                <div className="absolute inset-0 bg-green-300 bg-opacity-30 rounded-2xl"></div>
                <h1 className="absolute bottom-6 left-8 text-4xl font-bold text-white drop-shadow-lg">
                    Sân Cầu Lông GreenSport
                </h1>
            </div>

            {/* Content */}
            <div className="max-w-5xl mx-auto px-6 mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Info */}
                    <div>
                        <div className="flex items-center gap-2 text-yellow-500">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={20} fill="gold" stroke="gold" />
                            ))}
                            <span className="text-gray-600 ml-2">(128 đánh giá)</span>
                        </div>
                        <p className="text-gray-500 mt-2">
                            📍 123 Đường Lê Lợi, Quận 1, TP. Hồ Chí Minh
                        </p>
                    </div>

                    {/* Description */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-green-600">Giới thiệu</h2>
                        <p className="text-gray-700 leading-relaxed">
                            Sân cầu lông GreenSport được thiết kế theo tiêu chuẩn thi đấu quốc tế,
                            với sàn gỗ chống trơn trượt, hệ thống chiếu sáng hiện đại và không gian rộng rãi, thoáng mát.
                            Đây là địa điểm lý tưởng cho cả luyện tập và thi đấu chuyên nghiệp.
                        </p>
                    </div>

                    {/* Facilities */}
                    <div>
                        <h2 className="text-xl font-semibold mb-3 text-green-600">Tiện ích</h2>
                        <ul className="list-disc list-inside text-gray-700 space-y-1">
                            <li>Bãi đỗ xe miễn phí</li>
                            <li>Phòng thay đồ sạch sẽ</li>
                            <li>Khu vực nghỉ ngơi, uống nước</li>
                            <li>Dịch vụ cho thuê vợt & cầu</li>
                        </ul>
                    </div>
                </div>

                {/* Right Column - Booking */}
                <div className="bg-white rounded-xl shadow-lg p-6 h-fit sticky top-6">
                    <h3 className="text-lg font-semibold mb-4">Giá thuê</h3>
                    <p className="text-3xl font-bold text-green-600 mb-6">120.000đ / giờ</p>
                    <button className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold shadow transition duration-200 transform hover:scale-105">
                        Đặt sân ngay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CourtDetail;
