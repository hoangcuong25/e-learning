"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Edit, Trash2, BookOpen, DollarSign } from "lucide-react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useRouter } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { fetchCoursesByInstructor } from "@/store/coursesSlice";
import CourseCreate from "@/components/instructor/courses/CreateCourse";

const InstructorCoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { instructorCourses, loading } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Khóa học của bạn</h1>
        <CourseCreate />
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
      {!Array.isArray(instructorCourses) || instructorCourses.length === 0 ? (
        <p className="text-gray-500 italic">Bạn chưa có khóa học nào.</p>
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
                    {course.price}₫
                  </span>
                </div>

                {/* Trạng thái */}
                <Badge
                  variant={course.isPublished ? "default" : "secondary"}
                  className="capitalize"
                >
                  {course.isPublished ? "Đã xuất bản" : "Bản nháp"}
                </Badge>

                {/* Hành động */}
                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(`/instructor/course/${course.id}/edit`)
                    }
                  >
                    <Edit className="w-4 h-4" /> Sửa
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="w-4 h-4" /> Xóa
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default InstructorCoursesPage;
