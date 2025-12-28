"use client";

import React from "react";
import Image from "next/image";
import { BookOpen, User, Tag } from "lucide-react";
import { motion } from "framer-motion";
import CourseSidebar from "@/components/course/CourseSidebar";

interface Props {
  initialCourse: any;
}

const CourseDetail = ({ initialCourse }: Props) => {
  const course = initialCourse;

  if (!course)
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
        <div className="relative w-full h-64 rounded-xl overflow-hidden mb-6">
          <Image
            src={course.thumbnail || "/images/default-course.jpg"}
            alt={course.title}
            fill
            className="object-cover"
          />
        </div>

        <h1 className="text-3xl font-bold mb-3 text-gray-900 leading-tight">
          {course.title}
        </h1>

        <div className="flex flex-wrap items-center text-gray-600 mb-4 gap-x-6 gap-y-3">
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-500" />
            <span>{course.instructor?.fullname || "Giảng viên ẩn danh"}</span>
          </div>
          <div className="font-semibold text-blue-500">
            {course.price?.toLocaleString()} LC
          </div>
        </div>

        {/* Hiển thị chuyên ngành */}
        {course.specializations && course.specializations.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {course.specializations.map((sp: any, index: number) => (
              <span
                key={index}
                className="text-sm bg-blue-50 text-blue-600 border border-blue-200 px-3 py-1 rounded-full"
              >
                {sp.specialization?.name}
              </span>
            ))}
          </div>
        )}

        <hr className="border-gray-200 mb-5" />

        {/* Description */}
        <div
          className="prose max-w-none text-gray-700 leading-relaxed mb-10"
          dangerouslySetInnerHTML={{
            __html: course.description || "Chưa có mô tả cho khóa học này.",
          }}
        />

        {/* Chapter list */}
        <div className="mt-10">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Các chương học
          </h2>

          {course.chapter?.length ? (
            <ul className="space-y-4">
              {course.chapter.map((chapter: any, index: number) => (
                <motion.li
                  key={chapter.id}
                  className="p-4 border rounded-2xl bg-gray-50 hover:shadow-md transition-shadow"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <details className="group">
                    <summary className="flex justify-between cursor-pointer">
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

                    <motion.ul
                      className="mt-4 space-y-2 pl-4"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      transition={{ duration: 0.3 }}
                    >
                      {chapter.lessons?.length ? (
                        chapter.lessons.map((lesson: any) => (
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
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">Chưa có chương nào.</p>
          )}
        </div>
      </div>

      {/* SIDEBAR */}
      <div className="relative">
        <div className="sticky top-24">
          <CourseSidebar price={course.price} courseId={course.id} />
        </div>
      </div>
    </motion.div>
  );
};

export default CourseDetail;
