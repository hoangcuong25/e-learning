"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { fetchMyEnrollments } from "@/store/slice/course/enrollmentsSlice";
import { BookOpen, Layers, Eye, Star } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { createRating } from "@/store/slice/course/courseRatingSlice";
import { toast } from "sonner";
import { RateDialog } from "@/components/course/RateDialog";
import { CourseMoreActions } from "@/components/course/CourseMoreActions";

export default function MyLearningPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { myEnrollments, loading, error } = useSelector(
    (state: RootState) => state.enrollment
  );

  const [isRating, setIsRating] = useState(false);

  const [openRateDialog, setOpenRateDialog] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchMyEnrollments());
  }, [dispatch]);

  const formatDuration = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    let result = "";
    if (hours > 0) result += `${hours} giờ`;
    if (remainingMinutes > 0 || hours === 0) {
      if (hours > 0) result += " ";
      result += `${remainingMinutes} phút`;
    }
    return result.trim() || "0 phút";
  };

  const handleRateCourse = async (rating: number, text: string) => {
    if (!selectedCourseId) {
      toast.error("Không tìm thấy khóa học để đánh giá.");
      return;
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      toast.error("Đánh giá không hợp lệ. Vui lòng nhập số từ 1 đến 5.");
      return;
    }

    setIsRating(true);

    try {
      await dispatch(
        createRating({ courseId: selectedCourseId, rating, text })
      ).unwrap();

      toast.success("Đánh giá khóa học thành công!");

      // Cập nhật lại danh sách enrollments
      dispatch(fetchMyEnrollments());
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Đã xảy ra lỗi khi đánh giá.";
      toast.error(errorMessage);
    } finally {
      setIsRating(false);
      setSelectedCourseId(null); // reset after done
    }
  };

  if (loading && myEnrollments.length === 0) return <LoadingScreen />;

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
          <BookOpen className="w-10 h-10 text-blue-500" />
          <p>Khóa học của tôi</p> ({myEnrollments.length})
        </div>
      </h1>
      <div className="grid grid-cols-1 gap-6">
        {myEnrollments.map((enrollment) => {
          const course = enrollment.course;

          const ratingCount = course?.totalRating ?? 0;
          const averageRating = (course?.averageRating ?? 0).toFixed(1);
          const viewCount = course?._count?.courseView ?? 0;

          return (
            <div
              key={enrollment.id}
              className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition duration-300"
            >
              <div className="sm:w-1/3 w-full relative aspect-video sm:aspect-auto">
                <Image
                  src={course?.thumbnail || "/default-course.png"}
                  alt={course?.title ?? "Thumbnail"}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover"
                />
              </div>

              {/* Content */}
              <div className="sm:w-2/3 p-4 sm:p-6 flex flex-col justify-between">
                <div>
                  <Link
                    href={`/learn/${course?.id}`}
                    className="text-xl font-bold text-gray-800 hover:text-blue-600 transition duration-200"
                  >
                    {course?.title}
                  </Link>

                  {/* Giảng viên & Chương */}
                  <div className="flex items-center gap-4 text-sm mt-1">
                    <p className="text-gray-500">
                      GV:{" "}
                      <span className="font-medium">
                        {course?.instructor?.fullname}
                      </span>
                    </p>
                    <div className="flex items-center text-gray-600 font-medium">
                      <Layers className="w-4 h-4 mr-1 text-yellow-500" />
                      <span>{course?._count?.chapter ?? 0} chương</span>
                    </div>
                  </div>

                  {/* Specializations */}
                  {(course?.specializations?.length ?? 0) > 0 && (
                    <div className="flex flex-wrap gap-2 mt-3">
                      {course?.specializations?.map((cs, index) => (
                        <span
                          key={`${course.id}-${cs.specialization.id}-${index}`}
                          className="px-3 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full"
                        >
                          {cs.specialization.name}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Views & Ratings */}
                  <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      <span>{viewCount} lượt xem</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 text-yellow-400" />
                      <span>
                        {averageRating} ({ratingCount} đánh giá)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Progress */}
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
                    />
                  </div>
                </div>

                {course && course?.courseRating?.length > 0 && (
                  <div className="mt-3 flex items-center text-sm text-green-600 font-medium">
                    <Star className="w-4 h-4 text-yellow-400 mr-1" />
                    Bạn đã đánh giá:{" "}
                    <span className="ml-1 font-semibold">
                      {course?.courseRating[0].rating} ⭐
                    </span>
                  </div>
                )}

                {/* Stats & Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center flex-wrap gap-2">
                  <div className="text-sm text-gray-500 flex items-center gap-3">
                    <span>🕒 {formatDuration(course?.duration ?? 0)}</span>
                  </div>
                  <div className="flex gap-2 items-center flex-wrap">
                    <Link
                      href={`/learn/${course?.id}`}
                      className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition duration-200"
                    >
                      {enrollment.progress === 100 ? "Xem lại" : "Tiếp tục học"}
                    </Link>

                    <button
                      type="button"
                      className="px-4 py-2 bg-yellow-400 text-white text-sm font-medium rounded-lg hover:bg-yellow-500 transition duration-200"
                      onClick={() => {
                        setSelectedCourseId(Number(course?.id));
                        setOpenRateDialog(true);
                      }}
                    >
                      Đánh giá
                    </button>

                    <CourseMoreActions
                      enrollmentId={enrollment.id}
                      courseId={Number(course?.id)}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        <RateDialog
          open={openRateDialog}
          setOpen={setOpenRateDialog}
          onSubmit={handleRateCourse}
        />
      </div>

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
