"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/slice/course/coursesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  Clock,
  Eye,
  Star,
  Users,
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import Image from "next/image";
import CourseTabs from "@/components/instructor/courseTabs/CourseTabs";
import { formatDuration } from "@/lib/helpers";
import { Badge } from "@/components/ui/badge";

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses,
  );

  useEffect(() => {
    if (id) dispatch(fetchCourseById(Number(id)));
  }, [dispatch, id]);

  if (loading || !currentCourse) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-10 overflow-x-hidden">
      {/* ─── HEADER SECTION ───────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/instructor/courses")}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all text-slate-600 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight">
                #{id}
              </Badge>
              <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Khóa học
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none">
              {currentCourse.title}
            </h1>
          </div>
        </div>
      </div>

      {/* ─── MAIN INFO CARD ───────────────────────────── */}
      <Card className="rounded-[3rem] border-none shadow-sm bg-white overflow-hidden">
        <CardContent className="p-0">
          <div className="flex flex-col lg:flex-row">
            {/* Thumbnail Column */}
            <div className="lg:w-1/3 xl:w-1/4 relative bg-slate-900 aspect-video lg:aspect-auto">
              {currentCourse.thumbnail ? (
                <>
                  <Image
                    src={currentCourse.thumbnail}
                    alt={currentCourse.title}
                    fill
                    className="object-cover opacity-90"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent pointer-events-none" />
                </>
              ) : (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-500 bg-slate-50 italic gap-3">
                  <BookOpen className="w-12 h-12 opacity-20" />
                  <p className="text-xs font-bold uppercase tracking-widest">
                    No preview
                  </p>
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="flex-1 p-8 md:p-12 space-y-10">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 mb-2 leading-tight">
                    Thông tin tổng quan
                  </h2>
                  <p className="text-slate-400 font-medium text-sm">
                    Cập nhật và quản lý thuộc tính khóa học hiện tại
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {Array.isArray(currentCourse?.specializations) &&
                    currentCourse.specializations.map((sp: any) => (
                      <Badge
                        key={sp.specialization.id}
                        className="bg-indigo-50 text-indigo-600 hover:bg-indigo-100 border-none rounded-xl px-4 py-2 text-xs font-bold transition-colors"
                      >
                        {sp.specialization.name}
                      </Badge>
                    ))}
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="space-y-4 group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <DollarSign className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Giá
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {currentCourse.price === 0
                          ? "Miễn phí"
                          : currentCourse.price.toLocaleString() + " LC"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <Users className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Học viên
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {currentCourse.totalRating.toLocaleString()} Học viên
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                      <Star className="w-5 h-5" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Đánh giá
                      </span>
                      <span className="text-lg font-black text-slate-900">
                        {currentCourse.averageRating > 0
                          ? currentCourse.averageRating.toFixed(1)
                          : "0"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 group">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-slate-900 text-white rounded-2xl group-hover:scale-110 transition-transform">
                      <CheckCircle
                        className={`w-5 h-5 ${currentCourse.isPublished ? "text-emerald-400" : "text-amber-400"}`}
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                        Trạng thái
                      </span>
                      <span
                        className={`text-lg font-black ${currentCourse.isPublished ? "text-emerald-600" : "text-slate-500"}`}
                      >
                        {currentCourse.isPublished ? "Công khai" : "Bản nháp"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Additional Meta */}
              <div className="pt-8 border-t border-slate-50 grid grid-cols-1 md:grid-cols-2 gap-12">
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-indigo-500 uppercase tracking-[0.2em]">
                    Mô tả khóa học
                  </h4>
                  <div className="text-slate-600 text-sm leading-relaxed line-clamp-4 font-medium italic">
                    {currentCourse.description ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: currentCourse.description,
                        }}
                      />
                    ) : (
                      "No detailed description provided for this course yet."
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} />
                      Ngày tạo
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {new Date(currentCourse.createdAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Calendar size={12} /> Cập nhật lần cuối
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {new Date(currentCourse.updatedAt).toLocaleDateString(
                        "vi-VN",
                      )}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Eye size={12} /> Tổng lượt xem
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {currentCourse.viewCount.toLocaleString()}
                    </p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                      <Clock size={12} /> Thời lượng
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {currentCourse.duration > 0
                        ? formatDuration(currentCourse.duration)
                        : "0s"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <CourseTabs currentCourse={currentCourse} />
    </div>
  );
};

export default CourseDetailPage;
