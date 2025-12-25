"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { Loader2, BookOpen, DollarSign, User } from "lucide-react";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetail } from "@/store/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";

const CourseDetail = () => {
  const { courseId } = useParams();
  const dispatch = useDispatch<AppDispatch>();

  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    if (courseId) dispatch(fetchCourseDetail(Number(courseId)));
  }, [courseId, dispatch]);

  if (loading) return <LoadingScreen />;

  if (!currentCourse)
    return (
      <div className="text-center text-gray-500 mt-10">
        Không tìm thấy khóa học.
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white p-6 rounded-2xl shadow">
      {/* Ảnh thumbnail */}
      <div className="relative w-full h-64 rounded-lg overflow-hidden mb-6">
        <Image
          src={currentCourse.thumbnail || "/images/default-course.jpg"}
          alt={currentCourse.title}
          fill
          className="object-cover"
        />
      </div>

      {/* Tiêu đề & thông tin */}
      <h1 className="text-3xl font-bold mb-3">{currentCourse.title}</h1>

      <div className="flex items-center text-gray-600 mb-4 space-x-6">
        <div className="flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>
            {currentCourse.instructor?.fullname || "Giảng viên ẩn danh"}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-600" />
          <span className="font-semibold text-green-700">
            {currentCourse.price?.toLocaleString()}₫
          </span>
        </div>
      </div>

      {/* Mô tả khóa học */}
      <div className="prose max-w-none text-gray-700 leading-relaxed">
        {currentCourse.description ? (
          <div
            dangerouslySetInnerHTML={{
              __html: currentCourse.description,
            }}
          />
        ) : (
          <p>Chưa có mô tả cho khóa học này.</p>
        )}
      </div>

      {/* Nút */}
      <div className="mt-8 flex justify-end">
        <button className="bg-primary text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-primary/80 transition">
          <BookOpen className="w-4 h-4" />
          Bắt đầu học
        </button>
      </div>
    </div>
  );
};

export default CourseDetail;
