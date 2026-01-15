import React from "react";

const Profile = () => {
    return (
        <div className="min-h-screen bg-gray-100 py-10 px-4 my-3 rounded-2xl">
            <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
                {/* Header */}
                <div className="flex items-center gap-6 border-b pb-6">
                    <img
                        src="/default-avatar.png"
                        alt="avatar"
                        className="w-28 h-28 rounded-full border-4 border-emerald-500 object-cover"
                    />
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Nguyễn Văn A</h1>
                        <p className="text-gray-600">Thành viên từ: 2023</p>
                        <button className="mt-3 px-4 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition">
                            Chỉnh sửa hồ sơ
                        </button>
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Thông tin cá nhân</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li><span className="font-medium">Email:</span> nguyenvana@example.com</li>
                            <li><span className="font-medium">Số điện thoại:</span> +84 912 345 678</li>
                            <li><span className="font-medium">Địa chỉ:</span> Hà Nội, Việt Nam</li>
                        </ul>
                    </div>

                    {/* Thông tin đặt sân */}
                    <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
                        <h2 className="text-lg font-semibold text-gray-700 mb-3">Thông tin đặt sân</h2>
                        <ul className="space-y-2 text-gray-600">
                            <li><span className="font-medium">Tổng số lần đặt:</span> 25</li>
                            <li><span className="font-medium">Đã hủy:</span> 2</li>
                            <li><span className="font-medium">Sân yêu thích:</span> Sân Cầu Lông ABC</li>
                        </ul>
                    </div>
                </div>

                {/* Thống kê */}
                <div className="mt-8 grid grid-cols-3 gap-4 text-center">
                    <div className="bg-emerald-50 p-4 rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold text-emerald-600">25</h3>
                        <p className="text-gray-600">Lượt đặt</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold text-emerald-600">2</h3>
                        <p className="text-gray-600">Lượt hủy</p>
                    </div>
                    <div className="bg-emerald-50 p-4 rounded-xl shadow-sm">
                        <h3 className="text-xl font-bold text-emerald-600">5</h3>
                        <p className="text-gray-600">Sân yêu thích</p>
                    </div>
                </div>

                {/* Lịch sử đặt sân gần đây */}
                <div className="mt-8">
                    <h2 className="text-lg font-semibold text-gray-700 mb-4">Lịch sử đặt sân gần đây</h2>
                    <div className="overflow-x-auto">
                        <table className="w-full border border-gray-200 rounded-lg text-gray-700">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="p-3 text-left">Ngày</th>
                                    <th className="p-3 text-left">Sân</th>
                                    <th className="p-3 text-left">Khung giờ</th>
                                    <th className="p-3 text-left">Trạng thái</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="border-t">
                                    <td className="p-3">15/08/2025</td>
                                    <td className="p-3">Sân A</td>
                                    <td className="p-3">18:00 - 19:00</td>
                                    <td className="p-3 text-emerald-600 font-medium">Hoàn tất</td>
                                </tr>
                                <tr className="border-t">
                                    <td className="p-3">10/08/2025</td>
                                    <td className="p-3">Sân B</td>
                                    <td className="p-3">19:00 - 20:00</td>
                                    <td className="p-3 text-red-500 font-medium">Đã hủy</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
