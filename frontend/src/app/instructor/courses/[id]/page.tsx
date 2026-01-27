"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/slice/coursesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import Image from "next/image";
import CourseTabs from "@/components/instructor/courseTabs/CourseTabs";

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    if (id) dispatch(fetchCourseById(Number(id)));
  }, [dispatch, id]);

  if (loading || !currentCourse) return <LoadingScreen />;

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* Nút quay lại */}
          <Button
            variant="outline"
            onClick={() => router.push("/instructor/courses")}
            className="flex items-center gap-2 hover:bg-gray-100 transition-all"
          >
            <ArrowLeft size={18} />
            <span>Quay lại</span>
          </Button>
        </div>
      </div>

      {/* Course Info */}
      <Card className="shadow-md border border-gray-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen size={20} /> Thông tin khóa học
          </CardTitle>
        </CardHeader>

        <CardContent className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 text-gray-700">
          {/* 🔹 Thumbnail + Title */}
          <div className="sm:col-span-2 lg:col-span-3 flex flex-col md:flex-row items-start md:items-center gap-6 mb-4">
            <div className="relative w-full md:w-64 aspect-video bg-gray-100 rounded-lg overflow-hidden shadow">
              {currentCourse.thumbnail ? (
                <Image
                  src={currentCourse.thumbnail}
                  alt={currentCourse.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400 italic">
                  Chưa có thumbnail
                </div>
              )}
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-900">
                {currentCourse.title}
              </h2>
              <p className="text-sm text-gray-500 mt-1">
                Mã khóa học: #{currentCourse.id}
              </p>
              <div className="mt-4">
                {Array.isArray(currentCourse?.specializations) &&
                  currentCourse.specializations.length > 0 && (
                    <div className="sm:col-span-2 lg:col-span-3">
                      <p className="text-gray-800 mb-1">Chuyên ngành</p>
                      <div className="flex flex-wrap gap-2">
                        {currentCourse.specializations.map((sp: any) => (
                          <span
                            key={sp.specialization.id}
                            className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded-full border border-blue-200"
                          >
                            {sp.specialization.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
              </div>
            </div>
          </div>

          {/* 🔹 Ngày tạo */}
          <div className="flex items-center gap-3">
            <Clock className="text-blue-600" />
            <div>
              <p className="font-medium text-gray-800">Ngày tạo</p>
              <p className="text-sm text-gray-500">
                {new Date(currentCourse.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* 🔹 Cập nhật */}
          <div className="flex items-center gap-3">
            <Calendar className="text-purple-600" />
            <div>
              <p className="font-medium text-gray-800">Cập nhật lần cuối</p>
              <p className="text-sm text-gray-500">
                {new Date(currentCourse.updatedAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>

          {/* 🔹 Giá */}
          <div className="flex items-center gap-3">
            <DollarSign className="text-green-600" />
            <div>
              <p className="font-medium text-gray-800">Giá khóa học</p>
              <p className="text-sm text-gray-500">
                {currentCourse.price.toLocaleString()} LearnCoin
              </p>
            </div>
          </div>

          {/* 🔹 Trạng thái */}
          <div className="flex items-center gap-3">
            <CheckCircle
              className={`${
                currentCourse.isPublished
                  ? "text-emerald-600"
                  : "text-yellow-500"
              }`}
            />
            <div>
              <p className="font-medium text-gray-800">Trạng thái</p>
              <p className="text-sm text-gray-500">
                {currentCourse.isPublished ? "Đã xuất bản" : "Bản nháp"}
              </p>
            </div>
          </div>

          {/* 🔹 Mô tả */}
          <div className="sm:col-span-2 lg:col-span-3">
            <p className="font-medium text-gray-800 mb-1">Mô tả</p>
            <p className="text-gray-600 text-sm leading-relaxed">
              {currentCourse.description ? (
                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: currentCourse.description,
                  }}
                />
              ) : (
                "Chưa có mô tả cho khóa học này."
              )}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* TABS */}
      <CourseTabs currentCourse={currentCourse} />
    </div>
  );
};

export default CourseDetailPage;
