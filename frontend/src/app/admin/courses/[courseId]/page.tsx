"use client";

import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/slice/coursesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
  CheckCircle,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

const AdminCourseDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const courseId = Number(params.courseId);

  const { currentCourse, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseById(courseId));
    }
  }, [dispatch, courseId]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!currentCourse) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-gray-500 mb-4">Không tìm thấy khóa học</p>
        <Button onClick={() => router.push("/admin/courses")}>
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const course = currentCourse;
  const totalLessons = course.chapter?.reduce(
    (sum: number, ch: any) => sum + (ch.lessons?.length || 0),
    0
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-6">
        <Button
          variant="ghost"
          onClick={() => router.push("/admin/courses")}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Quay lại danh sách
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">Chi tiết khóa học</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content - Left Side */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Overview */}
          <Card>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-2xl mb-2">
                    {course.title}
                  </CardTitle>
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <Badge
                      className={
                        course.isPublished
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                      }
                    >
                      {course.isPublished ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Đã xuất bản
                        </>
                      ) : (
                        <>
                          <XCircle className="w-3 h-3 mr-1" />
                          Nháp
                        </>
                      )}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={
                        course.type === "FREE"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }
                    >
                      {course.type === "FREE" ? "Miễn phí" : "Trả phí"}
                    </Badge>
                  </div>
                </div>
                {course.thumbnail && (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden ml-4">
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold mb-2">Mô tả</h3>
                {course.description ? (
                  <div
                    className="prose max-w-none text-gray-600"
                    dangerouslySetInnerHTML={{ __html: course.description }}
                  />
                ) : (
                  <p className="text-gray-600">Chưa có mô tả</p>
                )}
              </div>

              <Separator />

              {/* Instructor Info */}
              <div>
                <h3 className="font-semibold mb-2">Giảng viên</h3>
                <div className="flex items-center gap-3">
                  {course.instructor?.avatar && (
                    <div className="relative w-12 h-12 rounded-full overflow-hidden">
                      <Image
                        src={course.instructor.avatar}
                        alt={course.instructor.fullname}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <p className="font-medium">{course.instructor?.fullname}</p>
                    <p className="text-sm text-gray-500">
                      {course.instructor?.email}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Specializations */}
              {course.specializations && course.specializations.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Chuyên ngành</h3>
                  <div className="flex flex-wrap gap-2">
                    {course.specializations.map((spec: any) => (
                      <Badge key={spec.specializationId} variant="secondary">
                        {spec.specialization?.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Chapters & Lessons */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                Nội dung khóa học ({course.chapter?.length || 0} chương,{" "}
                {totalLessons} bài học)
              </CardTitle>
            </CardHeader>
            <CardContent>
              {course.chapter && course.chapter.length > 0 ? (
                <div className="space-y-4">
                  {[...course.chapter]
                    .sort((a: any, b: any) => a.orderIndex - b.orderIndex)
                    .map((chapter: any, idx: number) => (
                      <div
                        key={chapter.id}
                        className="border rounded-lg p-4 bg-gray-50"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-lg">
                              Chương {idx + 1}: {chapter.title}
                            </h4>
                            {chapter.description && (
                              <p className="text-sm text-gray-600 mt-1">
                                {chapter.description}
                              </p>
                            )}
                          </div>
                          <Badge variant="outline">
                            {chapter.lessons?.length || 0} bài học
                          </Badge>
                        </div>

                        {chapter.lessons && chapter.lessons.length > 0 && (
                          <div className="space-y-2 ml-4">
                            {[...chapter.lessons]
                              .sort(
                                (a: any, b: any) => a.orderIndex - b.orderIndex
                              )
                              .map((lesson: any, lessonIdx: number) => (
                                <div
                                  key={lesson.id}
                                  className="flex items-center gap-3 p-2 bg-white rounded border"
                                >
                                  <Video className="w-4 h-4 text-gray-400" />
                                  <span className="flex-1 text-sm">
                                    {lessonIdx + 1}. {lesson.title}
                                  </span>
                                  {lesson.duration > 0 && (
                                    <span className="text-xs text-gray-500 flex items-center gap-1">
                                      <Clock className="w-3 h-3" />
                                      {lesson.duration} phút
                                    </span>
                                  )}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-gray-500 py-8">
                  Chưa có nội dung khóa học
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right Side */}
        <div className="space-y-6">
          {/* Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <DollarSign className="w-4 h-4" />
                  <span className="text-sm">Giá</span>
                </div>
                <span className="font-semibold text-green-600">
                  {course.price === 0
                    ? "Miễn phí"
                    : `${course.price.toLocaleString("vi-VN")} ₫`}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Eye className="w-4 h-4" />
                  <span className="text-sm">Lượt xem</span>
                </div>
                <span className="font-semibold">{course.viewCount || 0}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Star className="w-4 h-4" />
                  <span className="text-sm">Đánh giá</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="font-semibold">
                    {course.averageRating?.toFixed(1) || "0.0"}
                  </span>
                  <span className="text-xs text-gray-500">
                    ({course.totalRating || 0})
                  </span>
                </div>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Users className="w-4 h-4" />
                  <span className="text-sm">Học viên</span>
                </div>
                <span className="font-semibold">
                  {(course._count as any)?.enrollments || 0}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <BookOpen className="w-4 h-4" />
                  <span className="text-sm">Chương</span>
                </div>
                <span className="font-semibold">
                  {course.chapter?.length || 0}
                </span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Video className="w-4 h-4" />
                  <span className="text-sm">Bài học</span>
                </div>
                <span className="font-semibold">{totalLessons || 0}</span>
              </div>

              <Separator />

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span className="text-sm">Thời lượng</span>
                </div>
                <span className="font-semibold">
                  {course.duration || 0} phút
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Metadata */}
          <Card>
            <CardHeader>
              <CardTitle>Thông tin</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div>
                <p className="text-gray-600 mb-1">ID Khóa học</p>
                <p className="font-mono font-semibold">#{course.id}</p>
              </div>

              <Separator />

              <div>
                <p className="text-gray-600 mb-1">Ngày tạo</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">
                    {new Date(course.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-gray-600 mb-1">Cập nhật lần cuối</p>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <p className="font-medium">
                    {new Date(course.updatedAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Hành động</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                className="w-full"
                variant="outline"
                onClick={() => router.push(`/courses/${course.id}`)}
              >
                <Eye className="w-4 h-4 mr-2" />
                Xem như học viên
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminCourseDetailPage;
