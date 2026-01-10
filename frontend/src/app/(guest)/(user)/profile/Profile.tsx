"use client";

import EditProfile from "@/components/user/EditProfile";
import ChangePassword from "@/components/user/ChangePassword";
import VerifyAccount from "@/components/user/VerifyAccount";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { GenderEnum, GenderLabel } from "@/constants/gender.enum";
import Image from "next/image";

export default function ProfilePage() {
  const { user } = useSelector((state: RootState) => state.user);

  return (
    <div className="bg-white shadow-md rounded-2xl p-8 border border-gray-100 animate-fadeInUp">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-6 border-b border-gray-200 pb-6">
        <Image
          src={user?.avatar || "/default-avatar.png"}
          alt="avatar"
          width={112}
          height={112}
          className="w-28 h-28 rounded-full border-4 border-primary object-cover shadow-sm"
        />
        <div className="text-center md:text-left">
          <h1 className="text-3xl font-bold text-gray-800">
            {user?.fullname || "Chưa cập nhật"}
          </h1>
          <p className="text-gray-600">
            Thành viên từ năm:{" "}
            {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
          </p>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3 mt-4 justify-center md:justify-start">
            <EditProfile />
            <ChangePassword />
            {!user?.isVerified && <VerifyAccount />}
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            🧩 Thông tin cá nhân
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              <span className="font-medium">Email:</span> {user?.email || ""}
            </li>
            <li>
              <span className="font-medium">Số điện thoại:</span>{" "}
              {user?.phone || "Chưa cập nhật"}
            </li>
            <li>
              <span className="font-medium">Địa chỉ:</span>{" "}
              {user?.address || "Chưa cập nhật"}
            </li>
            <li>
              <span className="font-medium">Giới tính:</span>{" "}
              {user?.gender
                ? GenderLabel[user.gender as GenderEnum]
                : "Chưa cập nhật"}
            </li>
            <li>
              <span className="font-medium">Ngày sinh:</span>{" "}
              {user?.dob
                ? new Date(user.dob).toLocaleDateString("vi-VN")
                : "Chưa cập nhật"}
            </li>
            <li>
              <span className="font-medium">Trạng thái xác thực:</span>{" "}
              {user?.isVerified ? (
                <span className="text-blue-600 font-medium">
                  ✅ Đã xác thực
                </span>
              ) : (
                <span className="text-red-500 font-medium">
                  ⚠️ Chưa xác thực
                </span>
              )}
            </li>
            <li>
              <span className="font-medium">Vai trò:</span>{" "}
              {user?.role?.toUpperCase() || "USER"}
            </li>
          </ul>
        </div>

        <div className="bg-blue-50 p-6 rounded-xl border border-blue-100">
          <h2 className="text-xl font-semibold text-blue-700 mb-4">
            🎓 Thông tin học tập
          </h2>
          <ul className="space-y-2 text-gray-700 text-sm md:text-base">
            <li>
              <span className="font-medium">Số khóa học đã tham gia:</span> 0
            </li>
            <li>
              <span className="font-medium">Hoàn thành:</span> 0
            </li>
            <li>
              <span className="font-medium">Khóa học yêu thích:</span> N/A
            </li>
          </ul>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-8 grid grid-cols-3 gap-4 text-center">
        <div className="bg-blue-100 p-4 rounded-xl">
          <h3 className="text-2xl font-bold text-blue-700">0</h3>
          <p className="text-gray-700 text-sm">Khóa học</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl">
          <h3 className="text-2xl font-bold text-blue-700">0</h3>
          <p className="text-gray-700 text-sm">Hoàn thành</p>
        </div>
        <div className="bg-blue-100 p-4 rounded-xl">
          <h3 className="text-2xl font-bold text-blue-700">N/A</h3>
          <p className="text-gray-700 text-sm">Yêu thích</p>
        </div>
      </div>

      {/* Animation */}
      <style jsx>{`
        @keyframes fadeInUp {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.6s ease-out;
        }
      `}</style>
    </div>
  );
}
