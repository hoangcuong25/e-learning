"use client";

import React, { useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { BookOpen, User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";
import CourseSidebar from "@/components/course/CourseSidebar";
import { RootState, AppDispatch } from "@/store";
import { fetchCourseCoupons } from "@/store/slice/common/couponSlice";
import { fetchInstructorProfile } from "@/store/slice/instructor/instructorProfileSlice";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { formatDuration } from "@/lib/helpers";

interface Props {
  initialCourse: any;
  courseId: number;
}

const CourseDetail = ({ initialCourse, courseId }: Props) => {
  const router = useRouter();
  const course = initialCourse;
  const buySectionRef = useRef<HTMLDivElement>(null);

  const scrollToBuySection = () => {
    buySectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  const dispatch = useDispatch<AppDispatch>();

  const {
    courseCoupons,
    loading: couponsLoading,
    error: couponsError,
  } = useSelector((state: RootState) => state.coupon);

  const { publicProfile } = useSelector(
    (state: RootState) => state.instructorProfile,
  );

  useEffect(() => {
    if (course?.id) {
      dispatch(fetchCourseCoupons(Number(course.id)));
    }
    if (course?.instructor?.id) {
      dispatch(fetchInstructorProfile(Number(course.instructor.id)));
    }
  }, [course?.id, course?.instructor?.id, dispatch]);

  if (!course) {
    return (
      <div className="py-20 text-center text-slate-400 font-medium">
        Không tìm thấy khóa học.
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-7xl mx-auto bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
      >
        <div className="grid lg:grid-cols-[1fr_380px]">
          {/* MAIN CONTENT AREA */}
          <div className="p-10 lg:p-20 border-r border-slate-50 space-y-16">
            {/* Header / Hero */}
            <div className="space-y-10">
              <div className="relative w-full h-[400px] rounded-[3rem] overflow-hidden shadow-2xl shadow-indigo-100/30 group">
                <Image
                  src={course.thumbnail || "/images/default-course.jpg"}
                  alt={course.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-1000"
                  priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
              </div>

              <div className="space-y-6">
                <div className="flex flex-wrap items-center gap-3">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600"
                  >
                    <span className="text-[10px] font-black uppercase tracking-[0.2em]">
                      Khóa học premium
                    </span>
                  </motion.div>
                  {course.specializations?.map((sp: any, i: number) => (
                    <span
                      key={i}
                      className="px-4 py-2 bg-slate-50 text-slate-400 border border-slate-100 rounded-full text-[10px] font-bold uppercase tracking-widest"
                    >
                      {sp.specialization?.name}
                    </span>
                  ))}
                </div>

                <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                  {course.title}
                </h1>

                <div className="flex items-center gap-6 pt-2">
                  <div
                    className="flex items-center gap-3 group cursor-pointer"
                    onClick={() =>
                      publicProfile?.user?.id &&
                      router.push(
                        `/instructor-profile/${publicProfile.user.id}`,
                      )
                    }
                  >
                    <Avatar className="w-12 h-12 border-2 border-white shadow-lg shadow-indigo-100">
                      <AvatarImage
                        src={
                          publicProfile?.user?.avatar ||
                          "https://github.com/shadcn.png"
                        }
                      />
                      <AvatarFallback className="font-bold bg-indigo-50 text-indigo-600">
                        {(
                          publicProfile?.user?.fullname?.charAt(0) || "I"
                        ).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                        Giảng viên
                      </p>
                      <p className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                        {publicProfile?.user?.fullname || "Giảng viên EduSmart"}
                      </p>
                    </div>
                  </div>

                  <div className="w-px h-10 bg-slate-100" />

                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Cập nhật mới nhất
                    </p>
                    <p className="text-sm font-black text-slate-900 uppercase tracking-tight">
                      Tháng 3, 2026
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                Giới thiệu khóa học
              </h3>
              <div
                className="prose prose-lg max-w-none text-slate-500 font-medium leading-[1.8] marker:text-indigo-600"
                dangerouslySetInnerHTML={{
                  __html:
                    course.description || "Chưa có mô tả cho khóa học này.",
                }}
              />
            </div>

            {/* Curriculum */}
            <div className="space-y-8">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-600 rounded-full" />
                Nội dung chương trình
              </h3>

              <div className="space-y-4">
                {course.chapter?.map((chapter: any, i: number) => (
                  <motion.div
                    key={chapter.id}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="group p-6 border border-slate-100 shadow-sm rounded-[2rem] bg-white hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300"
                  >
                    <details className="group/details">
                      <summary className="flex items-center justify-between cursor-pointer list-none">
                        <div className="flex gap-4">
                          <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-all shadow-sm">
                            <span className="text-lg font-black">{i + 1}</span>
                          </div>
                          <div>
                            <h4 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors uppercase tracking-tight">
                              {chapter.title}
                            </h4>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                              {chapter.lessons?.length || 0} bài học •{" "}
                              {chapter.description ||
                                "Tìm hiểu nền tảng quan trọng"}
                            </p>
                          </div>
                        </div>
                        <div className="w-10 h-10 rounded-full border border-slate-100 flex items-center justify-center text-slate-400 group-open/details:rotate-180 transition-transform">
                          ▼
                        </div>
                      </summary>

                      <div className="mt-8 space-y-3 pl-14">
                        {chapter.lessons?.map((lesson: any) => (
                          <div
                            key={lesson.id}
                            className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group/lesson hover:bg-indigo-50 transition-colors border border-transparent hover:border-indigo-100/50"
                          >
                            <div className="flex items-center gap-4 text-slate-900 font-bold tracking-tight">
                              <BookOpen className="w-4 h-4 text-indigo-600" />
                              <span>{lesson.title}</span>
                            </div>
                            <span className="py-1 px-3 bg-white text-[10px] font-black text-slate-400 uppercase tracking-widest rounded-lg border border-slate-100">
                              {lesson.duration
                                ? formatDuration(lesson.duration)
                                : "15:00"}
                            </span>
                          </div>
                        ))}
                      </div>
                    </details>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Instructor Card */}
            <div className="p-10 bg-slate-50 rounded-[3rem] border border-slate-100 space-y-8">
              <div className="flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left">
                <Avatar className="w-32 h-32 border-8 border-white shadow-2xl shadow-indigo-500/20">
                  <AvatarImage
                    src={
                      publicProfile?.user?.avatar ||
                      "https://github.com/shadcn.png"
                    }
                  />
                  <AvatarFallback className="text-4xl font-black bg-indigo-50 text-indigo-600">
                    {(
                      publicProfile?.user?.fullname?.charAt(0) || "I"
                    ).toUpperCase()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 space-y-4">
                  <div>
                    <h4 className="text-2xl font-black text-slate-900 tracking-tight">
                      {publicProfile?.user?.fullname || "EduSmart Instructor"}
                    </h4>
                    <p className="text-indigo-600 font-bold text-sm uppercase tracking-widest">
                      Giảng viên
                    </p>
                  </div>
                  <p className="text-slate-500 font-medium leading-relaxed">
                    {publicProfile?.bio ||
                      "Một trong những chuyên gia hàng đầu lĩnh vực này tại EduSmart, với hơn 10 năm kinh nghiệm thực chiến."}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() =>
                      router.push(
                        `/instructor-profile/${publicProfile?.user?.id}`,
                      )
                    }
                    className="rounded-2xl border-slate-200 font-bold uppercase text-[10px] tracking-widest px-8"
                  >
                    Xem hồ sơ chi tiết
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* SIDEBAR AREA */}
          <div
            className="relative p-10 lg:p-12 lg:bg-slate-50/50"
            ref={buySectionRef}
          >
            <div className="sticky top-12">
              <CourseSidebar
                price={course.price}
                courseId={course.id}
                courseCoupons={courseCoupons}
                couponsLoading={couponsLoading}
                couponsError={couponsError}
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* MOBILE FLOATING CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-50 px-8 py-6 bg-white/90 backdrop-blur-xl border-t border-slate-100 shadow-2xl lg:hidden flex items-center justify-between rounded-t-[2.5rem]">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">
            Giá trọn đời
          </p>
          <p className="font-black text-2xl text-indigo-600 tracking-tighter">
            {course.price === 0
              ? "MIỄN PHÍ"
              : `${course.price.toLocaleString()} LC`}
          </p>
        </div>
        <Button
          onClick={scrollToBuySection}
          size="lg"
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-black px-10 rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[11px]"
        >
          Đăng ký ngay
        </Button>
      </div>
    </div>
  );
};

export default CourseDetail;
