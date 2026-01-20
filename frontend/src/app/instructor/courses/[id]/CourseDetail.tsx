"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseById } from "@/store/coursesSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Calendar, Video, Play } from "lucide-react";
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
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">
          {currentCourse.title}
        </h1>
        <CreateLesson courseId={currentCourse.id} />
      </div>

      {/* Course Info */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader>
          <CardTitle>Thông tin khóa học</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-gray-700">
          <p>
            <strong>Mô tả:</strong>{" "}
            {currentCourse.description || "Chưa có mô tả"}
          </p>
          <p>
            <strong>Giá:</strong> {currentCourse.price}₫
          </p>
          <p>
            <strong>Trạng thái:</strong>{" "}
            {currentCourse.isPublished ? "Đã xuất bản" : "Bản nháp"}
          </p>
        </CardContent>
      </Card>

      {/* Lessons Grid */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <BookOpen size={20} /> Danh sách bài học
          </CardTitle>
        </CardHeader>

        <CardContent>
          {currentCourse?.lessons?.length ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentCourse.lessons.map((lesson, index) => {
                const thumbnail = lesson.videoUrl
                  ? getCloudinaryThumbnail(lesson.videoUrl)
                  : null;

                return (
                  <div
                    key={lesson.id}
                    className="relative border rounded-lg overflow-hidden shadow hover:shadow-lg transition"
                  >
                    {/* Thumbnail */}
                    <div
                      className="relative w-full aspect-video bg-gray-200 cursor-pointer group"
                      onClick={() =>
                        lesson.videoUrl && setSelectedLesson(lesson)
                      }
                    >
                      {thumbnail ? (
                        <Image
                          src={thumbnail}
                          alt={lesson.title}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full text-gray-500 italic">
                          Chưa có video
                        </div>
                      )}
                      {/* Overlay Play */}
                      {lesson.videoUrl && (
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                          <Play className="w-12 h-12 text-white" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="p-4 flex flex-col gap-1">
                      <h3 className="font-semibold text-lg line-clamp-2">
                        {lesson.orderIndex}. {lesson.title}
                      </h3>

                      {lesson.content && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {lesson.content}
                        </p>
                      )}

                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mt-1">
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />{" "}
                          {new Date(lesson.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar size={14} />{" "}
                          {new Date(lesson.updatedAt).toLocaleDateString(
                            "vi-VN"
                          )}
                        </div>
                        {lesson.videoUrl && (
                          <Button
                            variant="link"
                            className="flex items-center gap-1 text-blue-600 hover:underline p-0"
                            onClick={() => setSelectedLesson(lesson)}
                          >
                            <Video size={14} /> Xem video
                          </Button>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2 mt-3">
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
                );
              })}
            </div>
          ) : (
            <p className="text-gray-500 italic">
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
