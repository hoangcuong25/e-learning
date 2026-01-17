"use client";

import { AppContext } from "@/context/AppContext";
import React, { useContext } from "react";
import EditProfile from "./components/EditProfile";
import { GenderEnum, GenderLabel } from "@/constants/Gender";
import { Button } from "@/components/ui/button";
import ChangePassword from "./components/ChangePassword";
import VerifyAccount from "./components/VerifyAccount";

const Profile = () => {
  const { user } = useContext(AppContext);

  const handleVerifyAccount = () => {
    // 👉 Ở đây bạn gọi API gửi email xác thực hoặc mở modal xác thực
    console.log("Verify account clicked");
  };

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4 my-3 rounded-2xl">
      <div className="max-w-5xl mx-auto bg-white rounded-2xl shadow-lg p-8">
        {/* Header */}
        <div className="flex items-center gap-6 border-b pb-6">
          <img
            src={user?.avatar || "/default-avatar.png"}
            alt="avatar"
            className="w-28 h-28 rounded-full border-4 border-emerald-500 object-cover"
          />
          <div>
            <h1 className="text-2xl font-bold text-gray-800">
              {user?.fullname || "Chưa cập nhật"}
            </h1>
            <p className="text-gray-600">
              Thành viên từ:{" "}
              {user?.createdAt ? new Date(user.createdAt).getFullYear() : "N/A"}
            </p>

            {/* Các nút hành động */}
            <div className="flex flex-wrap gap-3 mt-3">
              <EditProfile />
              <ChangePassword />
              {!user?.isVerified && <VerifyAccount />}
            </div>
          </div>
        </div>

        {/* Thông tin cá nhân */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Thông tin cá nhân
            </h2>
            <ul className="space-y-2 text-gray-600">
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
                <span className="font-medium">Tuổi:</span>{" "}
                {user?.age || "Chưa cập nhật"}
              </li>
              <li>
                <span className="font-medium">Trạng thái xác thực:</span>{" "}
                {user?.isVerified ? (
                  <span className="text-emerald-600 font-medium">
                    Đã xác thực
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    Chưa xác thực
                  </span>
                )}
              </li>
              <li>
                <span className="font-medium">Vai trò:</span>{" "}
                {user?.role || "USER"}
              </li>
            </ul>
          </div>

          {/* Thông tin đặt sân */}
          <div className="bg-gray-50 p-5 rounded-xl shadow-sm">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Thông tin đặt sân
            </h2>
            <ul className="space-y-2 text-gray-600">
              <li>
                <span className="font-medium">Tổng số lần đặt:</span> 0
              </li>
              <li>
                <span className="font-medium">Đã hủy:</span> 0
              </li>
              <li>
                <span className="font-medium">Sân yêu thích:</span> N/A
              </li>
            </ul>
          </div>
        </div>

        {/* Thống kê */}
        <div className="mt-8 grid grid-cols-3 gap-4 text-center">
          <div className="bg-emerald-50 p-4 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-emerald-600">0</h3>
            <p className="text-gray-600">Lượt đặt</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-emerald-600">0</h3>
            <p className="text-gray-600">Lượt hủy</p>
          </div>
          <div className="bg-emerald-50 p-4 rounded-xl shadow-sm">
            <h3 className="text-xl font-bold text-emerald-600">0</h3>
            <p className="text-gray-600">Sân yêu thích</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
