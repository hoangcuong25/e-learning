"use client";

import React, { useEffect, useState } from "react";
import { MessageCircle, Star } from "lucide-react";
import { RateDialog } from "../course/RateDialog";
import { toast } from "sonner";
import { rateCourseApi } from "@/store/api/courses.api";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchMyEnrollments } from "@/store/slice/enrollmentsSlice";
import { useParams } from "next/navigation";
import { fetchCourseRatings } from "@/store/slice/coursesSlice";
import LessonDiscussion from "./LessonDiscussion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface LessonContentTabsProps {
  currentLesson: any;
  activeTab: any;
  setActiveTab: any;
  totalRating: any;
  averageRating: any;
}

const tabClasses = {
  base: "px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200",
  active: "border-blue-600 text-blue-600",
  inactive:
    "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
};

const LessonContentTabs: React.FC<LessonContentTabsProps> = ({
  currentLesson,
  activeTab,
  setActiveTab,
  totalRating,
  averageRating,
}) => {
  const { courseRatings, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const params = useParams();
  const courseId = Number(params.courseId);

  const [isRating, setIsRating] = useState(false);
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

    setIsRating(true);

    try {
      const response = await rateCourseApi(courseId, rating, text);

      toast.success("Đánh giá khóa học thành công!");

      dispatch(fetchMyEnrollments());
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || "Đã xảy ra lỗi khi đánh giá.";
      toast.error(errorMessage);
    } finally {
      setIsRating(false);
      setOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mt-8">
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 px-6">
        <nav className="flex space-x-4">
          <button
            onClick={() => setActiveTab("overview")}
            className={`${tabClasses.base} ${
              activeTab === "overview" ? tabClasses.active : tabClasses.inactive
            }`}
          >
            Tổng quan
          </button>

          <button
            onClick={() => setActiveTab("qna")}
            className={`${tabClasses.base} ${
              activeTab === "qna" ? tabClasses.active : tabClasses.inactive
            }`}
          >
            Hỏi đáp
          </button>

          {/* TAB ĐÁNH GIÁ  */}
          <button
            onClick={() => setActiveTab("review")}
            className={`${tabClasses.base} ${
              activeTab === "review" ? tabClasses.active : tabClasses.inactive
            }`}
          >
            Đánh giá
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {/* OVERVIEW */}
        {activeTab === "overview" && (
          <div id="overview-tab">
            {currentLesson.chapter && (
              <div className="mb-4 text-sm text-gray-500">
                <span className="font-medium text-gray-700">Thuộc chương:</span>{" "}
                <span className="text-gray-600">
                  {currentLesson.chapter.title}
                </span>
              </div>
            )}

            <h2 className="text-2xl font-semibold text-gray-900 mb-4">
              {currentLesson.title}
            </h2>

            {currentLesson.content ? (
              <div
                className="prose max-w-none text-gray-700 leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: currentLesson.content,
                }}
              />
            ) : (
              <p className="text-gray-500">Chưa có mô tả cho bài học này.</p>
            )}
          </div>
        )}

        {/* Q&A */}
        {activeTab === "qna" && (
          <div id="qna-tab">
            <div className="flex items-center gap-2 mb-4 text-xl font-semibold text-gray-800">
              <MessageCircle size={20} className="text-orange-500" />
              Hỏi đáp (Q&A)
            </div>

            <p className="text-gray-600 mb-6">
              Bạn có thắc mắc gì về bài học này không? Hãy đăng câu hỏi của bạn!
            </p>

            <LessonDiscussion lessonId={currentLesson.id} />
          </div>
        )}

        {/* TAB ĐÁNH GIÁ (REVIEW) */}
        {activeTab === "review" && (
          <div id="review-tab" className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Star
                      className="text-yellow-500 fill-yellow-500"
                      size={22}
                    />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Đánh giá khóa học
                    </h2>
                  </div>
                </div>

                {/* Average + Total Ratings */}
                <div className="mt-4 p-4 bg-gray-50 rounded-lg border flex items-center gap-6">
                  {/* Average Rating Big Number */}
                  <div className="text-center">
                    <div className="text-4xl font-bold text-yellow-600">
                      {averageRating || 0}
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
                      Trung bình: {averageRating || 0}/5
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
            <RateDialog
              open={open}
              setOpen={setOpen}
              onSubmit={handleRateCourse}
            />

            {/* Loading */}
            {loading && (
              <div className="flex justify-center py-6">
                <p className="text-blue-500 animate-pulse">
                  Đang tải đánh giá...
                </p>
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
                        <AvatarImage src={rating.user.avatar} />
                        <AvatarFallback>
                          {rating.user.fullname ? rating.user.fullname[0] : "U"}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="font-semibold text-gray-800">
                          {rating.user.fullname || "Người dùng ẩn danh"}
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
                      {new Date(rating.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LessonContentTabs;
