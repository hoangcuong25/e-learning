"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { fetchMyEnrollments } from "@/store/enrollmentsSlice";
import { BookOpen, Layers } from "lucide-react"; // Import Layers icon
import LoadingScreen from "@/components/LoadingScreen";

// ... (Các phần formatDuration, LoadingScreen, Error Handling không thay đổi) ...

export default function MyLearningPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { myEnrollments, loading, error } = useSelector(
    (state: RootState) => state.enrollment
  );

  // Tải danh sách khóa học đã đăng ký khi component được mount
  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  // Hàm chuyển đổi thời lượng (phút) thành giờ/phút
  const formatDuration = (minutes: number): string => {
    // ... (code formatDuration) ...
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = "";
    if (hours > 0) {
      result += `${hours} giờ`;
    }
    if (remainingMinutes > 0 || hours === 0) {
      if (hours > 0) result += " ";
      result += `${remainingMinutes} phút`;
    }
    return result.trim() || "0 phút";
  };

  if (loading && myEnrollments.length === 0) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="p-8 text-center text-red-500 bg-red-100 border border-red-200 rounded-lg">
        Lỗi: {error}
      </div>
    );
  }

  if (myEnrollments.length === 0) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Bạn chưa tham gia khóa học nào! 😟
        </h2>
        <p className="text-gray-500 mb-6">
          Hãy bắt đầu hành trình học tập bằng cách khám phá các khóa học hấp
          dẫn.
        </p>
        <Link
          href="/courses"
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
        >
          Khám phá Khóa học
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white shadow-md rounded-2xl border border-gray-100 animate-fadeInUp">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">
        <div className="flex gap-5 items-center">
          <BookOpen className="w-10 h-10   text-blue-500" />
          <p>Khóa học của tôi</p> ({myEnrollments.length})
        </div>
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {myEnrollments &&
          myEnrollments.map((enrollment) => (
            <div
              key={enrollment.id}
              className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
            >
              {/* Thumbnail và Link */}
              <div className="sm:w-1/3 w-full relative aspect-video sm:aspect-auto">
                <Image
                  src={enrollment.course?.thumbnail || "/default-course.png"}
                  alt={enrollment.course?.title ?? "Thumbnail"}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/learn/${enrollment.course?.id}`}
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-200"
                  >
                    {enrollment.course?.title}
                  </Link>

                  {/* Giảng viên & Số chương */}
                  <div className="flex items-center gap-4 text-sm mt-1">
                    <p className="text-gray-500">
                      GV:{" "}
                      <span className="font-medium">
                        {enrollment.course?.instructor?.fullname}
                      </span>
                    </p>
                    {/*  HIỂN THỊ SỐ CHAPTER */}
                    <div className="flex items-center text-gray-600 font-medium">
                      <Layers className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>
                        {(enrollment.course?._count?.chapter as number) ?? 0}{" "}
                        chương
                      </span>
                    </div>
                  </div>

                  {/* PECIALIZATION */}
                  {enrollment.course?.specializations &&
                    enrollment.course.specializations.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {enrollment.course.specializations.map((cs) => (
                          <span
                            key={cs.specialization.id}
                            className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                          >
                            {cs.specialization.name}
                          </span>
                        ))}
                      </div>
                    )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between items-center text-sm mb-1">
                    <span className="font-medium text-gray-700">
                      Tiến độ học tập
                    </span>
                    <span className="font-semibold text-blue-600">
                      {Math.round(enrollment.progress)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full"
                      style={{ width: `${enrollment.progress}%` }}
                    ></div>
                  </div>
                </div>

                {/* Stats & Button */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <div className="text-sm text-gray-500">
                    <span className="mr-3">
                      🕒 {formatDuration(enrollment.course?.duration ?? 0)}
                    </span>
                  </div>
                  <Link
                    href={`/learn/${enrollment.course?.id}/${enrollment.course?.chapter?.[0]?.lessons?.[0]?.id}`}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                  >
                    {enrollment.progress === 100 ? "Xem lại" : "Tiếp tục học"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
      </div>
      {/* Animation Styles */}
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
