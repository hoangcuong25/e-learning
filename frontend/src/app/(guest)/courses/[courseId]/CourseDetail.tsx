"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import { BookOpen, Tag, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import CourseSidebar from "@/components/course/CourseSidebar";
import { RootState, AppDispatch } from "@/store";
import { fetchCourseCoupons } from "@/store/slice/couponSlice";
import { fetchInstructorProfile } from "@/store/slice/instructorProfileSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";

interface Props {
  initialCourse: any;
  courseId: number;
}

const CourseDetail = ({ initialCourse, courseId }: Props) => {
  const router = useRouter();
  const course = initialCourse;

  const dispatch = useDispatch<AppDispatch>();
  const {
    courseCoupons,
    loading: couponsLoading,
    error: couponsError,
  } = useSelector((state: RootState) => state.coupon);

  const { publicProfile } = useSelector(
    (state: RootState) => state.instructorProfile
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseCoupons(Number(course.id)));
    }
    if (course.instructor?.id) {
      dispatch(fetchInstructorProfile(Number(course.instructor.id)));
    }
  }, [courseId, course.id, course.instructor?.id, dispatch]);

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
          <div
            className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
            onClick={() =>
              router.push(`/instructor-profile/${publicProfile?.user?.id}`)
            }
          >
            <Avatar className="w-8 h-8">
              <AvatarImage
                src={
                  publicProfile?.user?.avatar || "https://github.com/shadcn.png"
                }
                alt={publicProfile?.user?.fullname || "Instructor"}
              />
              <AvatarFallback>
                {(
                  publicProfile?.user?.fullname?.charAt(0) || "I"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">
              {publicProfile?.user?.fullname || "Giảng viên ẩn danh"}
            </span>
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

        {/* Instructor Info Section */}
        <div className="mt-10 mb-8 p-6 bg-blue-50/50 rounded-2xl border border-blue-100">
          <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Thông tin giảng viên
          </h3>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div
              className="flex-shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
              onClick={() =>
                router.push(`/instructor-profile/${publicProfile?.user?.id}`)
              }
            >
              <Avatar className="w-20 h-20 border-4 border-white shadow-sm">
                <AvatarImage
                  src={
                    publicProfile?.user?.avatar ||
                    "https://github.com/shadcn.png"
                  }
                  alt={publicProfile?.user?.fullname || "Instructor"}
                />
                <AvatarFallback className="text-xl font-bold bg-blue-100 text-blue-600">
                  {(
                    course.instructor?.fullname?.charAt(0) || "I"
                  ).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>

            <div className="flex-1">
              <h4
                className="text-lg font-bold text-gray-800 cursor-pointer hover:text-blue-600 transition-colors mb-2"
                onClick={() =>
                  router.push(`/instructor-profile/${publicProfile?.user?.id}`)
                }
              >
                {publicProfile?.user?.fullname || "Giảng viên"}
              </h4>

              {publicProfile &&
              publicProfile.userId === course.instructor?.id ? (
                <div className="prose prose-sm max-w-none text-gray-600">
                  <p className="line-clamp-3">
                    {publicProfile.bio ||
                      "Giảng viên này chưa cập nhật thông tin giới thiệu."}
                  </p>
                  {publicProfile.bio && publicProfile.bio.length > 200 && (
                    <span
                      className="text-blue-600 text-sm font-medium cursor-pointer hover:underline mt-1 inline-block"
                      onClick={() =>
                        router.push(
                          `/instructor-profile/${publicProfile?.user?.id}`
                        )
                      }
                    >
                      Xem thêm
                    </span>
                  )}
                </div>
              ) : (
                <p className="text-sm text-gray-500 italic">
                  Đang tải thông tin...
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="sticky top-24">
        <CourseSidebar
          price={course.price}
          courseId={course.id}
          courseCoupons={courseCoupons}
          couponsLoading={couponsLoading}
          couponsError={couponsError}
        />
      </div>
    </motion.div>
  );
};

export default CourseDetail;
