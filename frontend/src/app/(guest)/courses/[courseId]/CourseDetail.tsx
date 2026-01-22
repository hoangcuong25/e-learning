"use client";

import React, { useEffect } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { BookOpen, DollarSign, User } from "lucide-react";
import { motion } from "framer-motion";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetail } from "@/store/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import CourseSidebar from "@/components/course/CourseSidebar";

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
    <motion.div
      className="max-w-6xl mx-auto mt-10 px-4 lg:px-0 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* MAIN CONTENT */}
      <div className="bg-white p-6 rounded-2xl shadow-lg">
        {/* Ảnh thumbnail */}
        <motion.div
          className="relative w-full h-64 rounded-xl overflow-hidden mb-6"
          initial={{ scale: 0.95 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Image
            src={currentCourse.thumbnail || "/images/default-course.jpg"}
            alt={currentCourse.title}
            fill
            className="object-cover"
          />
        </motion.div>

        {/* Tiêu đề */}
        <h1 className="text-3xl font-bold mb-3 text-gray-900 leading-tight">
          {currentCourse.title}
        </h1>

        {/* Thông tin */}
        <div className="flex flex-wrap items-center text-gray-600 mb-5 gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>
              {currentCourse.instructor?.fullname || "Giảng viên ẩn danh"}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-semibold text-blue-500">
              {currentCourse.price?.toLocaleString()}₫
            </span>
          </div>
        </div>

        <hr className="border-gray-200 mb-5" />

        {/* Mô tả khóa học */}
        <div className="prose max-w-none text-gray-700 leading-relaxed mb-10">
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

        {/* Danh sách chương */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Các chương học
          </h2>

          {currentCourse.chapter && currentCourse.chapter.length > 0 ? (
            <ul className="space-y-4">
              {currentCourse.chapter.map(
                (chapter: ChapterType, index: number) => (
                  <motion.li
                    key={chapter.id}
                    className="p-4 border rounded-2xl bg-gray-50 hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <details className="group">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div>
                          <h3 className="text-lg font-semibold text-gray-800">
                            {chapter.title}
                          </h3>
                          {chapter.description && (
                            <p className="text-gray-600 text-sm mt-1">
                              {chapter.description}
                            </p>
                          )}
                        </div>

                        <span className="text-sm text-gray-500 transition-transform group-open:rotate-180">
                          ▼
                        </span>
                      </summary>

                      {/* Danh sách bài học */}
                      <motion.ul
                        className="mt-4 space-y-2 pl-4"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        transition={{ duration: 0.3 }}
                      >
                        {chapter.lessons && chapter.lessons.length > 0 ? (
                          chapter.lessons.map((lesson: LessonType) => (
                            <li
                              key={lesson.id}
                              className="flex items-center justify-between bg-white p-3 rounded-xl border hover:bg-blue-50 transition-colors"
                            >
                              <div className="flex items-center gap-2">
                                <BookOpen className="w-4 h-4 text-blue-500" />
                                <span className="text-gray-800 font-medium">
                                  {lesson.title}
                                </span>
                              </div>
                              <span className="text-sm text-gray-500">
                                {lesson.duration
                                  ? `${lesson.duration} phút`
                                  : "Chưa có thời lượng"}
                              </span>
                            </li>
                          ))
                        ) : (
                          <p className="text-gray-500 text-sm">
                            Chưa có bài học trong chương này.
                          </p>
                        )}
                      </motion.ul>
                    </details>
                  </motion.li>
                )
              )}
            </ul>
          ) : (
            <p className="text-gray-500">
              Chưa có chương nào trong khóa học này.
            </p>
          )}
        </div>
      </div>

      {/* SIDEBAR — sticky thật sự */}
      <div className="relative">
        <div className="sticky top-24">
          <CourseSidebar
            price={currentCourse.price || 149000}
            courseId={Number(courseId)}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;
