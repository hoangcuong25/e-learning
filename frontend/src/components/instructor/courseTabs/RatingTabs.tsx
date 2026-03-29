"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseRatings } from "@/store/slice/course/courseRatingSlice";
import { Star, MessageSquare } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";

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
    (state: RootState) => state.courseRating,
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
      }),
    );
  }, [dispatch, courseId, currentPage]);

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && pagination && newPage <= pagination.totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <div className="space-y-12">
      {/* ─── RATING OVERVIEW HEADER ──────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="md:col-span-1 rounded-[2.5rem] border-none shadow-sm bg-slate-900 text-white p-10 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Star size={80} className="fill-white" />
          </div>
          <div className="relative z-10 space-y-4">
            <div className="text-6xl font-black tracking-tighter">
              {averageRating ? Number(averageRating).toFixed(1) : "0.0"}
            </div>
            <div className="flex items-center justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  size={20}
                  className={
                    i < Math.round(averageRating || 0)
                      ? "text-amber-400 fill-amber-400"
                      : "text-slate-700 fill-slate-700"
                  }
                />
              ))}
            </div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 pt-2">
              Trung bình đánh giá
            </p>
          </div>
        </Card>

        <Card className="md:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white p-10 flex flex-col justify-center space-y-6">
          <div>
            <h3 className="text-2xl font-black text-slate-900 leading-none">
              Phản hồi từ học viên
            </h3>
            <p className="text-slate-400 font-medium text-sm mt-2">
              Dựa trên {totalRating || 0} lượt đánh giá thực tế từ người học.
            </p>
          </div>
        </Card>
      </div>

      {/* ─── REVIEWS LIST ─────────────────────────────── */}
      <div className="space-y-8">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
            Danh sách nhận xét
          </h4>
          {loading && (
            <p className="text-[10px] font-black text-indigo-600 animate-pulse uppercase tracking-widest">
              Đang đồng bộ dữ liệu...
            </p>
          )}
        </div>

        {!loading && (!ratings || ratings.length === 0) ? (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100 italic font-bold">
            <MessageSquare className="w-12 h-12 text-slate-100 mb-4" />
            <p className="text-slate-400">Chưa có đánh giá nào được gửi đến.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {ratings?.map((rating: any) => (
              <Card
                key={rating.id}
                className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all duration-500"
              >
                <div className="flex flex-col sm:flex-row items-start gap-6">
                  {/* User Avatar & Info */}
                  <div className="flex items-center gap-4 shrink-0">
                    <Avatar className="w-14 h-14 rounded-2xl border-4 border-slate-50 shadow-sm group-hover:scale-105 transition-transform">
                      <AvatarImage
                        src={rating.user?.avatar}
                        className="object-cover"
                      />
                      <AvatarFallback className="bg-indigo-600 text-white font-black">
                        {rating.user?.fullname ? rating.user.fullname[0] : "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="sm:hidden">
                      <h5 className="font-black text-slate-900 text-sm leading-tight">
                        {rating.user?.fullname || "Ẩn danh"}
                      </h5>
                      <div className="flex items-center gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={10}
                            className={
                              i < rating.rating
                                ? "text-amber-400 fill-amber-400"
                                : "text-slate-200 fill-slate-200"
                            }
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="hidden sm:flex items-center justify-between">
                      <h5 className="font-black text-slate-900 text-lg leading-tight">
                        {rating.user?.fullname || "Học viên ẩn danh"}
                      </h5>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                      </span>
                    </div>

                    <div className="hidden sm:flex items-center space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          size={14}
                          className={
                            i < rating.rating
                              ? "text-amber-400 fill-amber-400"
                              : "text-slate-100 fill-slate-100"
                          }
                        />
                      ))}
                    </div>

                    <p className="text-slate-700 leading-relaxed font-medium text-sm pr-8 italic">
                      "{rating.text}"
                    </p>

                    <div className="sm:hidden text-[10px] font-black text-slate-300 uppercase tracking-widest pt-2">
                      Gửi ngày{" "}
                      {new Date(rating.createdAt).toLocaleDateString("vi-VN")}
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* ─── PAGINATION ────────────────────────────────── */}
      {pagination && pagination.totalPages > 1 && (
        <div className="flex justify-center pt-10">
          <Pagination
            total={pagination.totalPages}
            page={currentPage}
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default RatingTabs;
