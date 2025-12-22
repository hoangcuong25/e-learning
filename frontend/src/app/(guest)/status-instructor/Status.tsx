"use client";

import React, { useEffect, useState } from "react";
import { Loader2, CheckCircle, XCircle, Clock } from "lucide-react";

type InstructorStatus = "PENDING" | "APPROVED" | "REJECTED";

const InstructorStatusPage = () => {
  const [status, setStatus] = useState<InstructorStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Giả lập fetch API lấy trạng thái từ backend
    setTimeout(() => {
      // 👉 Thay bằng API thật, ví dụ: fetch("/api/instructor/status")
      const mockStatus: InstructorStatus = "PENDING";
      setStatus(mockStatus);
      setLoading(false);
    }, 1000);
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
        <p className="text-gray-500 mt-3">Đang tải trạng thái...</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (status) {
      case "PENDING":
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <Clock className="w-12 h-12 text-yellow-500" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Đơn của bạn đang chờ phê duyệt
            </h2>
            <p className="text-gray-600 max-w-md">
              Cảm ơn bạn đã gửi đơn đăng ký trở thành giảng viên. Chúng tôi sẽ
              xem xét và phản hồi trong vòng 1-3 ngày làm việc.
            </p>
          </div>
        );

      case "APPROVED":
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <CheckCircle className="w-12 h-12 text-green-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Chúc mừng bạn đã trở thành giảng viên!
            </h2>
            <p className="text-gray-600 max-w-md">
              Tài khoản của bạn đã được kích hoạt chế độ giảng viên. Bạn có thể
              bắt đầu tạo khóa học ngay bây giờ!
            </p>
            <a
              href="/instructor/dashboard"
              className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Đi tới bảng điều khiển
            </a>
          </div>
        );

      case "REJECTED":
        return (
          <div className="flex flex-col items-center text-center space-y-4">
            <XCircle className="w-12 h-12 text-red-600" />
            <h2 className="text-2xl font-semibold text-gray-800">
              Đơn đăng ký của bạn bị từ chối
            </h2>
            <p className="text-gray-600 max-w-md">
              Rất tiếc! Đơn đăng ký của bạn chưa được chấp thuận. Bạn có thể
              chỉnh sửa thông tin và gửi lại đơn đăng ký.
            </p>
            <a
              href="/instructor/apply"
              className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Gửi lại đơn đăng ký
            </a>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4">
      <div className="bg-white shadow-md rounded-2xl p-10 max-w-lg w-full">
        {renderContent()}
      </div>
    </div>
  );
};

export default InstructorStatusPage;
