"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import Image from "next/image";
import Link from "next/link";
import { fetchMyEnrollments } from "@/store/slice/course/enrollmentsSlice";
import {
  BookOpen,
  Layers,
  Eye,
  Star,
  PlayCircle,
  Award,
  Clock,
  ArrowRight,
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { createRating } from "@/store/slice/course/courseRatingSlice";
import { toast } from "sonner";
import { RateDialog } from "@/components/course/RateDialog";
import { CourseMoreActions } from "@/components/course/CourseMoreActions";
import { motion, AnimatePresence } from "framer-motion";

export default function MyLearningPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { myEnrollments, loading, error } = useSelector(
    (state: RootState) => state.enrollment,
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
    if (hours > 0) return `${hours}h ${remainingMinutes}m`;
    return `${remainingMinutes} phút`;
  };

  const handleRateCourse = async (rating: number, text: string) => {
    if (!selectedCourseId) {
      toast.error("Không tìm thấy khóa học để đánh giá.");
      return;
    }
    setIsRating(true);
    try {
      await dispatch(
        createRating({ courseId: selectedCourseId, rating, text }),
      ).unwrap();
      toast.success("Đánh giá khóa học thành công!");
      dispatch(fetchMyEnrollments());
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Đã xảy ra lỗi khi đánh giá.");
    } finally {
      setIsRating(false);
      setSelectedCourseId(null);
    }
  };

  if (loading && myEnrollments.length === 0) return <LoadingScreen />;

  console.log(myEnrollments);

  if (error) {
    return (
      <div className="p-12 text-center bg-red-50 border border-red-100 rounded-[2.5rem] text-red-600 font-black uppercase tracking-widest text-[10px]">
        Hệ thống đang gặp sự cố: {error}
      </div>
    );
  }

  if (myEnrollments.length === 0) {
    return (
      <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-16 md:p-32 text-center space-y-8">
        <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
          <BookOpen size={48} />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Hành trình chưa bắt đầu
          </h2>
          <p className="text-slate-400 font-medium">
            Bạn chưa tham gia khóa học nào. Hãy bắt đầu ngay hôm nay!
          </p>
        </div>
        <Link
          href="/courses"
          className="inline-flex h-14 px-10 items-center bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-[10px]"
        >
          Khám phá khóa học
        </Link>
      </section>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-24"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
        <div className="space-y-4 text-center md:text-left">
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
            Khóa học{" "}
            <span className="text-indigo-600 text-sm block uppercase tracking-widest mt-2">
              Của bạn
            </span>
          </h1>
          <p className="text-slate-400 font-medium max-w-md tracking-tight">
            Tiếp tục hành trình chinh phục kiến thức. Bạn đang sở hữu{" "}
            {myEnrollments.length} khóa học.
          </p>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        <AnimatePresence mode="popLayout">
          {myEnrollments.map((enrollment, index) => {
            const course = enrollment.course;
            const progress = Math.round(enrollment.progress);

            return (
              <motion.div
                key={enrollment.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="group bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-indigo-500/5 transition-all duration-500 overflow-hidden"
              >
                <div className="flex flex-col lg:flex-row">
                  {/* Thumbnail */}
                  <div className="lg:w-80 relative aspect-video lg:aspect-auto overflow-hidden">
                    <Image
                      src={course?.thumbnail || "/default-course.png"}
                      alt={course?.title ?? "Thumbnail"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-transparent transition-colors" />
                    {progress === 100 && (
                      <div className="absolute top-4 left-4 h-10 px-4 bg-emerald-500 text-white rounded-full flex items-center gap-2 text-[10px] font-black uppercase tracking-widest shadow-xl">
                        <Award size={14} /> Completed
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-8 lg:p-10 space-y-8">
                    <div className="flex flex-col md:flex-row justify-between gap-6">
                      <div className="space-y-3 flex-1">
                        <Link
                          href={`/learn/${course?.id}`}
                          className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight hover:text-indigo-600 transition-colors block leading-tight"
                        >
                          {course?.title}
                        </Link>
                        <div className="flex flex-wrap items-center gap-4">
                          <div className="flex items-center gap-2 px-3 py-1 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            <span className="text-indigo-600">GV:</span>{" "}
                            {course?.instructor?.fullname}
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tight">
                            <Layers size={14} className="text-amber-500" />
                            {course?._count?.chapter ?? 0} chương
                          </div>
                          <div className="flex items-center gap-2 text-slate-400 font-bold text-xs uppercase tracking-tight">
                            <Clock size={14} className="text-indigo-500" />
                            {Math.floor(
                              (course?.duration ?? 0) / 3600,
                            )} giờ{" "}
                            {Math.floor(((course?.duration ?? 0) % 3600) / 60)}{" "}
                            phút
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end gap-2 md:text-right shrink-0">
                        <div className="flex items-center gap-2">
                          <Star
                            size={18}
                            className="text-amber-400 fill-amber-400"
                          />
                          <p className="text-xl font-black text-slate-900 tracking-tighter">
                            {(course?.averageRating ?? 0).toFixed(1)}
                          </p>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {course?._count?.courseView ?? 0} lượt xem
                        </p>
                      </div>
                    </div>

                    {/* Progress UI */}
                    <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative overflow-hidden group/progress">
                      <div className="flex justify-between items-end relative z-10">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            Tiến độ khóa học
                          </p>
                          <p className="text-slate-900 font-black text-2xl tracking-tighter">
                            {progress}%
                          </p>
                        </div>
                        <div
                          className={`p-3 rounded-2xl ${progress === 100 ? "bg-emerald-500 text-white" : "bg-white text-indigo-600 shadow-sm"} transition-colors`}
                        >
                          {progress === 100 ? (
                            <Award size={20} />
                          ) : (
                            <PlayCircle size={20} />
                          )}
                        </div>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 1, ease: "circOut" }}
                          className={`h-full rounded-full ${progress === 100 ? "bg-emerald-500" : "bg-indigo-600"} relative`}
                        >
                          <div className="absolute inset-0 bg-white/20 animate-pulse" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center justify-between gap-6 pt-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link
                          href={`/learn/${course?.id}`}
                          className="h-14 px-8 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-[0.2em] text-[10px] flex items-center group/btn"
                        >
                          {progress === 100
                            ? "Xem lại nội dung"
                            : "Tiếp tục học ngay"}
                          <ArrowRight
                            className="ml-3 group-hover/btn:translate-x-1 transition-transform"
                            size={16}
                          />
                        </Link>

                        <button
                          onClick={() => {
                            setSelectedCourseId(Number(course?.id));
                            setOpenRateDialog(true);
                          }}
                          className="h-14 px-8 bg-white border border-slate-200 text-slate-900 font-black rounded-2xl hover:bg-slate-50 transition-all uppercase tracking-widest text-[10px] flex items-center gap-2"
                        >
                          <Star size={14} className="text-amber-400" />
                          Đánh giá
                        </button>
                      </div>

                      <CourseMoreActions
                        enrollmentId={enrollment.id}
                        courseId={Number(course?.id)}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        <RateDialog
          open={openRateDialog}
          setOpen={setOpenRateDialog}
          onSubmit={handleRateCourse}
        />
      </div>
    </motion.div>
  );
}
