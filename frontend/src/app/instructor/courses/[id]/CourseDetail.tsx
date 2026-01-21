"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/coursesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  Calendar,
  Video,
  Play,
  ArrowLeft,
  DollarSign,
  CheckCircle,
  Clock,
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import CreateLesson from "@/components/instructor/courses/lessons/CreateLesson";
import UpdateLesson from "@/components/instructor/courses/lessons/UpdateLesson";
import DeleteLessonDialog from "@/components/instructor/courses/lessons/DeleteLessonDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Image from "next/image";

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);

  useEffect(() => {
    if (id) dispatch(fetchCourseById(Number(id)));
  }, [dispatch, id]);

  if (loading || !currentCourse) return <LoadingScreen />;

  const getCloudinaryThumbnail = (videoUrl: string) => {
    if (!videoUrl?.includes("cloudinary")) return null;
    return videoUrl
      .replace("/upload/", "/upload/so_auto,q_auto,w_400/")
      .replace(".mp4", ".jpg");
  };

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

        <CreateLesson courseId={currentCourse.id} />
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
                {currentCourse.price.toLocaleString()}₫
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

      {/* Lessons */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Video size={20} /> Danh sách bài học (
            {currentCourse.lessons?.length || 0})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentCourse?.lessons?.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourse.lessons.map((lesson) => {
                const thumbnail = lesson.videoUrl
                  ? getCloudinaryThumbnail(lesson.videoUrl)
                  : null;

                return (
                  <div
                    key={lesson.id}
                    className="border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition group bg-white"
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-full aspect-video bg-gray-100 cursor-pointer"
                      onClick={() =>
                        router.push(
                          `/instructor/courses/${currentCourse.id}/lesson/${lesson?.id}`
                        )
                      }
                    >
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={lesson.title}
                          fill
                          className="object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 italic">
                          Chưa có video
                        </div>
                      )}

                      {lesson.videoUrl && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 space-y-2">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {lesson.orderIndex}. {lesson.title}
                      </h3>

                      {lesson.content && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {currentCourse.description ? (
                            <div
                              className="prose max-w-none"
                              dangerouslySetInnerHTML={{
                                __html: currentCourse.description,
                              }}
                            />
                          ) : (
                            ""
                          )}
                        </p>
                      )}

                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>
                          Tạo:{" "}
                          {new Date(lesson.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                        <span>
                          Sửa:{" "}
                          {new Date(lesson.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </span>
                      </div>

                      {/* Detail */}
                      <div className="flex justify-center mt-4">
                        <Button
                          variant="default"
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white w-full"
                          onClick={() =>
                            router.push(
                              `/instructor/courses/${currentCourse.id}/lesson/${lesson?.id}`
                            )
                          }
                          disabled={!lesson.videoUrl}
                        >
                          <Play size={16} />
                          <span>Chi tiết</span>
                        </Button>
                      </div>

                      {/* Actions */}
                      <div className="flex justify-between items-center mt-3">
                        {lesson.videoUrl ? (
                          <Button
                            variant="link"
                            className="flex items-center gap-1 text-blue-600 hover:underline p-0"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            <Video size={14} /> Xem video
                          </Button>
                        ) : (
                          <span className="text-xs text-gray-400 italic">
                            Không có video
                          </span>
                        )}
                        <div className="flex gap-2">
                          <UpdateLesson
                            lesson={lesson}
                            courseId={currentCourse.id}
                          />
                          <DeleteLessonDialog
                            lessonId={lesson.id}
                            lessonTitle={lesson.title}
                            courseId={currentCourse.id}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              Chưa có bài học nào cho khóa học này.
            </p>
          )}
        </CardContent>
      </Card>

      {/* Modal Video */}
      <Dialog
        open={!!selectedLesson}
        onOpenChange={() => setSelectedLesson(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>{selectedLesson?.title}</DialogTitle>
          </DialogHeader>

          <div className="mt-4">
            {selectedLesson?.videoUrl ? (
              <div className="aspect-video rounded-lg overflow-hidden bg-black">
                <video
                  src={selectedLesson.videoUrl}
                  poster={
                    getCloudinaryThumbnail(selectedLesson.videoUrl) ?? undefined
                  }
                  controls
                  className="w-full h-full object-contain"
                  preload="metadata"
                >
                  Trình duyệt của bạn không hỗ trợ phát video.
                </video>
              </div>
            ) : (
              <p className="text-center text-gray-500 italic py-10">
                Bài học này chưa có video.
              </p>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CourseDetailPage;
