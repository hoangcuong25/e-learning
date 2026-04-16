"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/slice/course/coursesSlice";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  BookOpen,
  Calendar,
  Clock,
  DollarSign,
  Eye,
  Loader2,
  Star,
  Users,
  Video,
  CheckCircle2,
  XCircle,
  Hash,
  Crown,
  Layout,
  ExternalLink,
  Target,
  MessageCircle,
  Zap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { formatDuration } from "@/lib/helpers";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (dateString?: string) => {
  if (!dateString) return "N/A";
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const AdminCourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const courseId = Number(params.courseId);

  const { currentCourse, loading, error } = useSelector(
    (state: RootState) => state.courses,
  );

  useEffect(() => {
    if (courseId && !isNaN(courseId)) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading && !currentCourse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
          <Loader2 className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
          Đang tải dữ liệu khóa học...
        </p>
      </div>
    );
  }

  if (!currentCourse && !loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[2.5rem] opacity-50">
          <Zap size={64} className="text-rose-500" />
        </div>
        <p className="text-xl font-black text-white uppercase tracking-tight">
          Không tìm thấy khóa học
        </p>
        <button
          onClick={() => router.push("/admin/courses")}
          className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl shadow-indigo-600/20"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  const course = currentCourse;
  const totalLessons = course?.chapter?.reduce(
    (sum: number, ch: any) => sum + (ch.lessons?.length || 0),
    0,
  );

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 pb-20 space-y-8">
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-4 md:px-0">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push("/admin/courses")}
            className="p-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-500 hover:text-white hover:bg-slate-800 transition-all hover:-translate-x-1"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20 uppercase">
                COURSE ID #{course?.id}
              </span>
              {course?.isPublished ? (
                <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20 uppercase tracking-widest">
                  <CheckCircle2 size={10} /> Đã xuất bản
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[8px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 uppercase tracking-widest">
                  <XCircle size={10} /> Bản nháp
                </span>
              )}
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase leading-none">
              CHI TIẾT <span className="text-indigo-500">KHÓA HỌC</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (course?.id) window.open(`/courses/${course.id}`, "_blank");
            }}
            className="flex-1 md:flex-none px-6 py-3 bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 hover:bg-indigo-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/5 group"
          >
            <ExternalLink
              size={14}
              className="inline mr-2 group-hover:scale-110"
            />{" "}
            Xem như học viên
          </button>
          <button
            onClick={() => {
              if (course?.id) router.push(`/admin/courses/edit/${course.id}`);
            }}
            className="flex-1 md:flex-none px-6 py-3 bg-emerald-600/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/5"
          >
            Chỉnh sửa
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          {/* Hero Overview Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-600/10 to-transparent pointer-events-none" />

            <div className="p-8 relative z-10 flex flex-col md:flex-row gap-8">
              {/* Thumbnail Container */}
              <div className="w-full md:w-64 h-44 shrink-0 rounded-3xl bg-slate-950 border border-slate-800 overflow-hidden group shadow-inner relative">
                {course?.thumbnail ? (
                  <img
                    src={course?.thumbnail}
                    alt={course?.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-700 italic space-y-2">
                    <Layout size={40} strokeWidth={1} />
                    <span className="text-[10px] uppercase font-black tracking-widest">
                      No Thumbnail
                    </span>
                  </div>
                )}
              </div>

              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap gap-2">
                  <Badge
                    className={`uppercase text-[10px] font-black px-3 py-1 rounded-full ${course?.type === "FREE" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/10 text-amber-400 border border-amber-500/20"}`}
                  >
                    {course?.type === "FREE" ? "Miễn phí" : "Cao cấp"}
                  </Badge>
                  {course?.specializations?.map((spec: any) => (
                    <Badge
                      key={spec.specializationId}
                      className="bg-slate-800/80 text-slate-400 border border-slate-700/50 uppercase text-[9px] font-black px-3 py-1 rounded-full"
                    >
                      {spec.specialization?.name}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-2xl md:text-3xl font-black text-white leading-tight tracking-tighter uppercase whitespace-normal">
                  {course?.title}
                </h1>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-500">
                  <span className="flex items-center gap-1.5">
                    <Clock size={14} className="text-indigo-400" />{" "}
                    {formatDuration(course?.duration || 0)}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <BookOpen size={14} className="text-indigo-400" />{" "}
                    {course?.chapter?.length || 0} Chương
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Video size={14} className="text-indigo-400" />{" "}
                    {totalLessons} Bài học
                  </span>
                </div>
              </div>
            </div>

            <div className="px-8 pb-8 space-y-4">
              <div className="w-full h-px bg-slate-800" />
              <div className="space-y-4">
                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                  Mô tả khóa học
                </h3>
                {course?.description ? (
                  <div
                    className="prose prose-invert max-w-none text-slate-400 text-sm leading-relaxed prose-p:mb-4"
                    dangerouslySetInnerHTML={{ __html: course?.description }}
                  />
                ) : (
                  <p className="text-slate-600 italic text-sm">
                    Chưa có mô tả cho khóa học này...
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Curriculum Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-600/10 rounded-xl text-indigo-400 border border-indigo-500/20">
                  <Layout size={18} />
                </div>
                <h3 className="text-xl font-black text-white uppercase tracking-tighter">
                  Nội dung <span className="text-indigo-500">Bài học</span>
                </h3>
              </div>
              <Badge className="bg-slate-900 border-slate-800 text-slate-500 text-[10px] font-black uppercase tracking-widest px-3 py-1">
                {totalLessons} Bài học
              </Badge>
            </div>

            {course?.chapter && course?.chapter.length > 0 ? (
              <div className="space-y-4">
                {[...course?.chapter]
                  .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                  .map((chapter: any, idx: number) => (
                    <motion.div
                      key={chapter.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden group shadow-xl"
                    >
                      <div className="p-6 flex items-start justify-between bg-slate-900 group-hover:bg-slate-800/50 transition-colors cursor-pointer">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[9px] font-black text-indigo-500/80 uppercase tracking-[0.2em]">
                              Chương {String(idx + 1).padStart(2, "0")}
                            </span>
                            {chapter.lessons?.length > 0 && (
                              <span className="text-[8px] font-black text-slate-500 uppercase border border-slate-800 px-1.5 py-0.5 rounded-md">
                                {chapter.lessons.length} Items
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-black text-white uppercase tracking-tight leading-none">
                            {chapter.title}
                          </h4>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-500 group-hover:text-indigo-400 transition-colors">
                          <Calendar size={16} />
                        </div>
                      </div>

                      {chapter?.lessons && chapter?.lessons.length > 0 && (
                        <div className="p-2 border-t border-slate-800/50 bg-slate-950/50">
                          <div className="grid gap-2">
                            {[...chapter?.lessons]
                              .sort(
                                (a: any, b: any) => a.orderIndex - b.orderIndex,
                              )
                              .map((lesson: any, lessonIdx: number) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-800 transition-all group/lesson cursor-pointer shadow-sm hover:shadow-indigo-500/5"
                                >
                                  <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-center shrink-0 group-hover/lesson:bg-indigo-600/10 group-hover/lesson:border-indigo-500/30 transition-all">
                                    <Video
                                      size={16}
                                      className="text-slate-600 group-hover/lesson:text-indigo-400"
                                    />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                      <p className="text-[12px] font-black text-slate-200 group-hover/lesson:text-white transition-colors truncate uppercase tracking-tighter">
                                        {String(lessonIdx + 1).padStart(2, "0")}
                                        . {lesson.title}
                                      </p>
                                      {lesson.duration > 0 && (
                                        <span className="text-[8px] font-black text-slate-600 tracking-widest uppercase ml-4">
                                          {formatDuration(lesson.duration)}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <Badge className="bg-slate-950 text-[8px] px-1.5 py-0.5 rounded-md text-slate-500 border-none font-black uppercase">
                                        Lesson ID #{lesson.id}
                                      </Badge>
                                      {lesson.videoUrl && (
                                        <Badge className="bg-indigo-600/10 text-indigo-500 text-[8px] px-1.5 py-0.5 rounded-md border-none font-black uppercase">
                                          Video Content
                                        </Badge>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  ))}
              </div>
            ) : (
              <div className="py-20 bg-slate-900 border border-slate-800 border-dashed rounded-[2.5rem] text-center space-y-4">
                <div className="p-6 bg-slate-950 border border-slate-800 rounded-[2rem] w-fit mx-auto opacity-30">
                  <BookOpen size={48} strokeWidth={1} />
                </div>
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-[0.2em]">
                  Chưa có nội dung nội dung trình bày
                </p>
              </div>
            )}
          </motion.div>
        </div>

        {/* Sidebar Space */}
        <div className="space-y-8 px-4 md:px-0">
          {/* Quick Stats Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl"
          >
            <div className="p-8 border-b border-slate-800 flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-widest">
                Thống kê khóa học
              </h3>
              <Star className="text-amber-500 fill-amber-500" size={16} />
            </div>
            <div className="p-8 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">
                    Học phí
                  </p>
                  <p className="text-lg font-black text-emerald-400 tracking-tighter">
                    {course?.price === 0
                      ? "MIỄN PHÍ"
                      : formatCurrency(course?.price ?? 0)}
                  </p>
                </div>
                <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 shadow-inner">
                  <p className="text-[8px] font-black text-slate-600 uppercase tracking-[0.2em] mb-2">
                    Đánh giá
                  </p>
                  <div className="flex items-center gap-1.5">
                    <p className="text-lg font-black text-white tracking-tighter">
                      {course?.averageRating?.toFixed(1) || "0.0"}
                    </p>
                    <span className="text-[10px] text-slate-500 font-bold">
                      /5
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    label: "Số lượng học viên",
                    value: (course?._count as any)?.enrollments || 0,
                    icon: Users,
                    color: "text-indigo-400",
                  },
                  {
                    label: "Tổng lượt xem",
                    value: course?.viewCount || 0,
                    icon: Eye,
                    color: "text-blue-400",
                  },
                  {
                    label: "Thời lượng",
                    value: formatDuration(course?.duration || 0),
                    icon: Clock,
                    color: "text-amber-400",
                  },
                  {
                    label: "Tổng đánh giá",
                    value: course?.totalRating || 0,
                    icon: MessageCircle,
                    color: "text-purple-400",
                  },
                ].map((stat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between group"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`p-2 bg-slate-950 rounded-xl border border-slate-800 group-hover:scale-110 transition-transform ${stat.color}`}
                      >
                        <stat.icon size={14} />
                      </div>
                      <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        {stat.label}
                      </span>
                    </div>
                    <span className="text-xs font-black text-white tracking-tight">
                      {stat.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Instructor Profile Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl p-8"
          >
            <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-6">
              GIẢNG VIÊN HƯỚNG DẪN
            </h3>
            <div className="flex items-center gap-4 group">
              <Avatar className="w-16 h-16 border-2 border-slate-800 group-hover:border-indigo-500 transition-colors duration-500">
                <AvatarImage
                  src={course?.instructor?.avatar}
                  className="object-cover"
                />
                <AvatarFallback className="bg-slate-950 text-indigo-400 text-xl font-black">
                  {course?.instructor?.fullname?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <p className="text-base font-black text-white uppercase tracking-tighter truncate group-hover:text-indigo-400 transition-colors">
                  {course?.instructor?.fullname}
                </p>
                <p className="text-[10px] font-bold text-slate-500 truncate mt-0.5">
                  {course?.instructor?.email}
                </p>
              </div>
            </div>
          </motion.div>

          {/* Metadata Sidebar Card */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 space-y-6"
          >
            <div className="space-y-4">
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                  Ngày khởi tạo
                </p>
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <Calendar size={14} className="text-indigo-400" />
                  <span className="text-xs">
                    {formatDate(course?.createdAt)}
                  </span>
                </div>
              </div>
              <div className="w-full h-px bg-slate-800/50" />
              <div>
                <p className="text-[9px] font-black text-slate-600 uppercase tracking-widest mb-1">
                  Cập nhật lần cuối
                </p>
                <div className="flex items-center gap-2 text-slate-300 font-bold">
                  <Clock size={14} className="text-indigo-400" />
                  <span className="text-xs">
                    {formatDate(course?.updatedAt)}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Verification Badge */}
          <div className="p-8 bg-indigo-600/5 border border-indigo-500/10 rounded-[2.5rem] flex items-center justify-between group cursor-help transition-all hover:bg-indigo-600/10">
            <div className="space-y-1">
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">
                Khóa học đã được xác thực
              </p>
              <p className="text-[8px] font-medium text-indigo-300/60 uppercase">
                Đã kiểm tra tính toàn vẹn hệ thống
              </p>
            </div>
            <Crown
              className="text-indigo-500/50 group-hover:text-indigo-500 group-hover:scale-110 transition-all"
              size={24}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetailPage;
