"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseRatings } from "@/store/slice/courseRatingSlice";
import { Star } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface RatingTabsProps {
  courseId: number;
  averageRating: number;
  totalRating: number;
}

const RatingTabs = ({
  courseId,
  averageRating,
  totalRating,
}: RatingTabsProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { ratings, pagination, loading } = useSelector(
    (state: RootState) => state.courseRating
  );

  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  // Fetch ratings when component mounts or page changes
  useEffect(() => {
    dispatch(
      fetchCourseRatings({
        courseId,
        page: currentPage,
        limit,
      })
    );
  }, [dispatch, courseId, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Stats */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <Star className="text-yellow-500 fill-yellow-500" size={22} />
          <h2 className="text-xl font-semibold text-gray-800">
            Đánh giá khóa học
          </h2>
        </div>

        {/* Average + Total Ratings */}
        <div className="p-4 bg-gray-50 rounded-lg border flex items-center gap-6">
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
            <div className="font-medium">{totalRating || 0} lượt đánh giá</div>
            <div className="text-gray-500">
              Trung bình: {averageRating ? Number(averageRating).toFixed(1) : 0}
              /5
            </div>
          </div>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-6">
          <p className="text-blue-500 animate-pulse">Đang tải đánh giá...</p>
        </div>
      )}

      {/* No rating */}
      {!loading && (!ratings || ratings.length === 0) && (
        <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-xl border">
          Chưa có đánh giá nào cho khóa học này.
        </div>
      )}

      {/* Ratings list */}
      {!loading && ratings?.length > 0 && (
        <div className="space-y-5">
          {ratings.map((rating: any) => (
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
          page={currentPage}
          onChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default RatingTabs;
