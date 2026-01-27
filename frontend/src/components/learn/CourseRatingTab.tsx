"use client";

import React, { useState } from "react";
import { Star } from "lucide-react";
import { RateDialog } from "../course/RateDialog";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchMyEnrollments } from "@/store/slice/enrollmentsSlice";
import { useParams } from "next/navigation";
import {
  fetchCourseRatings,
  createRating,
} from "@/store/slice/courseRatingSlice";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/components/ui/pagination";

interface CourseRatingTabProps {
  totalRating: number;
  averageRating: number;
}

const CourseRatingTab: React.FC<CourseRatingTabProps> = ({
  totalRating,
  averageRating,
}) => {
  const {
    ratings: courseRatings,
    loading,
    pagination,
  } = useSelector((state: RootState) => state.courseRating);

  const params = useParams();
  const courseId = Number(params.courseId);

  const [open, setOpen] = useState(false);
  const dispatch = useDispatch<AppDispatch>();

  const handleRateCourse = async (rating: number, text: string) => {
    if (!courseId) {
      toast.error("Không tìm thấy khóa học để đánh giá.");
      return;
    }

    if (isNaN(rating) || rating < 1 || rating > 5) {
      toast.error("Đánh giá không hợp lệ. Vui lòng nhập số từ 1 đến 5.");
      return;
    }

    try {
      await dispatch(createRating({ courseId, rating, text })).unwrap();

      toast.success("Đánh giá khóa học thành công!");

      dispatch(fetchMyEnrollments());
      dispatch(
        fetchCourseRatings({ courseId, params: { page: 1, limit: 10 } })
      );
    } catch (err: any) {
      const errorMessage = err || "Đã xảy ra lỗi khi đánh giá.";
      toast.error(errorMessage);
    } finally {
      setOpen(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      dispatch(
        fetchCourseRatings({ courseId, params: { page: newPage, limit: 10 } })
      );
    }
  };

  return (
    <div id="review-tab" className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={22} />
            <h2 className="text-xl font-semibold text-gray-800">
              Đánh giá khóa học
            </h2>
          </div>

          {/* Average + Total Ratings */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border flex items-center gap-6">
            {/* Average Rating Big Number */}
            <div className="text-center">
              <div className="text-4xl font-bold text-yellow-600">
                {averageRating ? Number(averageRating).toFixed(1) : 0}
              </div>
              <div className="flex items-center justify-center mt-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className="text-yellow-500"
                    fill={
                      i < (averageRating ? Math.round(averageRating) : 0)
                        ? "currentColor"
                        : "none"
                    }
                  />
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px h-12 bg-gray-300"></div>

            {/* Total rating */}
            <div className="text-gray-700 text-sm">
              <div className="font-medium">
                {totalRating || 0} lượt đánh giá
              </div>
              <div className="text-gray-500">
                Trung bình:{" "}
                {averageRating ? Number(averageRating).toFixed(1) : 0}/5
              </div>
            </div>
          </div>
        </div>

        <button
          type="button"
          className="px-4 py-2 bg-yellow-400 text-white text-sm font-medium rounded-lg 
      hover:bg-yellow-500 transition duration-200"
          onClick={() => setOpen(true)}
        >
          Viết đánh giá
        </button>
      </div>

      {/* Rate Dialog */}
      <RateDialog open={open} setOpen={setOpen} onSubmit={handleRateCourse} />

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-6">
          <p className="text-blue-500 animate-pulse">Đang tải đánh giá...</p>
        </div>
      )}

      {/* No rating */}
      {!loading && (!courseRatings || courseRatings.length === 0) && (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border">
          Chưa có đánh giá nào cho khóa học này.
        </div>
      )}

      {/* Ratings list */}
      {!loading && courseRatings?.length > 0 && (
        <div className="space-y-5">
          {courseRatings.map((rating: any) => (
            <div
              key={rating.id}
              className="bg-white border rounded-xl shadow-sm p-5 hover:shadow-md transition"
            >
              <div className="flex items-center gap-3 mb-2">
                {/* Avatar */}
                <Avatar className="w-10 h-10">
                  <AvatarImage src={rating.user?.avatar} />
                  <AvatarFallback>
                    {rating.user?.fullname ? rating.user.fullname[0] : "U"}
                  </AvatarFallback>
                </Avatar>

                <div>
                  <div className="font-semibold text-gray-800">
                    {rating.user?.fullname || "Người dùng ẩn danh"}
                  </div>

                  {/* Rating Stars */}
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < rating.rating ? "currentColor" : "none"}
                        stroke="currentColor"
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2">
                      {rating.rating}/5
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-gray-700 leading-relaxed mb-2">
                "{rating.text}"
              </p>

              <p className="text-xs text-gray-400">
                {new Date(rating.createdAt).toLocaleDateString("vi-VN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <Pagination
          total={pagination.totalPages}
          page={pagination.page}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default CourseRatingTab;
