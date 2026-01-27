"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  DollarSign,
  Eye,
} from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCoursesByInstructor } from "@/store/slice/coursesSlice";
import CourseCreate from "@/components/instructor/courses/CreateCourse";
import DeleteCourseDialog from "@/components/instructor/courses/DeleteCourseDialog";
import UpdateCourse from "@/components/instructor/courses/UpdateCourse";
import CourseOnboarding from "@/components/instructor/onboarding/CoursesOnboarding";
import { fetchSpecializationsByInstructorId } from "@/store/slice/specializationSlice";

const InstructorCoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { instructorCourses, loading } = useSelector(
    (state: RootState) => state.courses
  );
  const { user, loading: userLoading } = useSelector(
    (state: RootState) => state.user
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between ">
        <h1 className="text-2xl font-bold tracking-tight step-course-header">
          Khóa học của bạn
        </h1>

        <div className="flex gap-4 items-center">
          <div className="step-create-course">
            <CourseCreate />
          </div>

          <CourseOnboarding />
        </div>
      </div>

      {/* Search bar */}
      <div className="flex items-center gap-2 max-w-md">
        <Search className="w-4 h-4 text-gray-500" />
        <Input
          placeholder="Tìm kiếm khóa học..."
          className="bg-white border-gray-300"
        />
      </div>

      {/* Course list */}
      <div className="step-course-list">
        {!Array.isArray(instructorCourses) || instructorCourses.length === 0 ? (
          <Card className="border border-gray-200 shadow-sm">
            <CardContent className="py-12 text-center text-gray-500 italic">
              Bạn chưa có khóa học nào. Hãy tạo khóa học đầu tiên của bạn!
            </CardContent>
          </Card>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {instructorCourses.map((course) => (
              <Card
                key={course.id}
                className="overflow-hidden shadow-md hover:shadow-lg transition-all"
              >
                <div className="relative h-40 w-full">
                  <Image
                    src={course.thumbnail || "/default-course.jpg"}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                </div>

                <CardHeader className="pb-2">
                  <CardTitle className="text-lg font-semibold truncate">
                    {course.title}
                  </CardTitle>
                </CardHeader>

                <CardContent className="space-y-3">
                  {/* Thông tin cơ bản */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      {course.lessons?.length || 0} bài học
                    </span>

                    <span className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      {course.price.toLocaleString()} LearnCoin
                    </span>
                  </div>

                  {/* Trạng thái */}
                  <Badge
                    variant={course.isPublished ? "success" : "secondary"}
                    className="capitalize"
                  >
                    {course.isPublished ? "Đã xuất bản" : "Bản nháp"}
                  </Badge>

                  {/* Hành động */}
                  <div className="flex justify-end gap-2 pt-2">
                    <UpdateCourse course={course} />

                    <Button
                      variant="outline"
                      className="border-2 border-blue-500 text-blue-600 font-semibold rounded-xl
             px-5 py-2 hover:bg-blue-500 hover:text-white 
             transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                      onClick={() =>
                        router.push(`/instructor/courses/${course.id}`)
                      }
                    >
                      <Eye size={18} />
                      Chi Tiết
                    </Button>

                    <DeleteCourseDialog
                      courseId={course.id}
                      courseTitle={course.title}
                    />
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
