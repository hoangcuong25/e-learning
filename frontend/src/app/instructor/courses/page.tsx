"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  BookOpen,
  DollarSign,
  Eye,
  Layers,
  Plus,
  Filter,
  MoreVertical,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCoursesByInstructor } from "@/store/slice/course/coursesSlice";
import CourseCreate from "@/components/instructor/courses/CreateCourse";
import DeleteCourseDialog from "@/components/instructor/courses/DeleteCourseDialog";
import UpdateCourse from "@/components/instructor/courses/UpdateCourse";
import CourseOnboarding from "@/components/instructor/onboarding/CoursesOnboarding";
import { fetchSpecializationsByInstructorId } from "@/store/slice/common/specializationSlice";

const InstructorCoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { instructorCourses, loading } = useSelector(
    (state: RootState) => state.courses,
  );
  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.user,
  );

  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchSpecializationsByInstructorId(Number(user.id)));
    }
  }, [dispatch, user]);

  if (loading || userLoading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight step-course-header">
            Khóa học của bạn
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Quản lý, theo dõi và tối ưu hóa nội dung giảng dạy của bạn một cách
            chuyên nghiệp.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <CourseOnboarding />
          <div className="step-create-course">
            <CourseCreate />
          </div>
        </div>
      </div>

      {/* Course List Section */}
      <div className="step-course-list">
        {!Array.isArray(instructorCourses) || instructorCourses.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-3xl shadow-none">
            <CardContent className="py-20 flex flex-col items-center text-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg mb-6 group hover:scale-110 transition-transform">
                <BookOpen className="w-10 h-10 text-slate-300 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">
                Chưa có khóa học nào
              </h3>
              <p className="text-slate-500 max-w-sm mb-8 font-medium italic">
                Hãy bắt đầu hành trình giảng dạy của bạn bằng cách tạo khóa học
                đầu tiên ngay hôm nay!
              </p>
              <CourseCreate />
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-8">
            {instructorCourses.map((course) => (
              <Card
                key={course.id}
                className="group overflow-hidden rounded-[2.5rem] border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-500 flex flex-col h-full active:scale-[0.98]"
              >
                {/* Thumbnail Area */}
                <div className="relative h-56 w-full overflow-hidden">
                  <Image
                    src={course.thumbnail || "/default-course.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Floating Price Tag */}
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-4 py-2 rounded-2xl shadow-xl border border-white/20">
                    <span className="text-sm font-black text-indigo-600">
                      {course.price.toLocaleString()} LC
                    </span>
                  </div>

                  {/* Status Overlay */}
                  <div className="absolute bottom-4 left-4">
                    <Badge
                      className={`rounded-xl px-3 py-1 text-[10px] font-black uppercase tracking-wider border-none shadow-lg ${
                        course.isPublished
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-700/80 backdrop-blur-md text-white"
                      }`}
                    >
                      {course.isPublished ? "Đã xuất bản" : "Bản nháp"}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="p-6 pb-2">
                  <CardTitle className="text-xl font-extrabold text-slate-900 line-clamp-2 leading-snug group-hover:text-indigo-600 transition-colors">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-6 pt-0 space-y-6 flex flex-col flex-1">
                  {/* Stats Bar */}
                  <div className="flex items-center justify-between p-3 bg-slate-50 rounded-2xl border border-slate-100 mt-2">
                    <div className="flex flex-col items-center gap-1 flex-1 border-r border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Chương
                      </span>
                      <span className="text-sm font-black text-slate-700">
                        {course.chapter?.length || 0}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1 border-r border-slate-200">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Bài học
                      </span>
                      <span className="text-sm font-black text-slate-700">
                        {course.chapter?.reduce(
                          (total, chapter) =>
                            total + (chapter.lessons?.length || 0),
                          0,
                        ) || 0}
                      </span>
                    </div>

                    <div className="flex flex-col items-center gap-1 flex-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                        Rating
                      </span>
                      <span className="text-sm font-black text-amber-500 flex items-center gap-1">
                        4.8 <Star className="w-3 h-3 fill-amber-500" />
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons Area */}
                  <div className="mt-auto grid grid-cols-2 gap-3 pt-4">
                    <div className="flex items-center gap-2">
                      <UpdateCourse course={course} />
                      <DeleteCourseDialog
                        courseId={course.id}
                        courseTitle={course.title}
                      />
                    </div>

                    <Button
                      variant="outline"
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-none font-extrabold rounded-2xl
                                 px-6 py-6 hover:scale-105 hover:shadow-xl hover:shadow-indigo-200
                                 transition-all duration-300 flex items-center gap-2"
                      onClick={() =>
                        router.push(`/instructor/courses/${course.id}`)
                      }
                    >
                      <Eye size={18} />
                      Chi Tiết
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorCoursesPage;
