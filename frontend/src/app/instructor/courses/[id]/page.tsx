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
import CreateChapter from "@/components/instructor/courses/chapter/CreateChapter";

const CourseDetailPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );
  const [selectedLesson, setSelectedLesson] = useState<LessonType | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

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

      {/* ─── CHAPTERS ────────────────────────────── */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BookOpen size={20} /> Danh sách chương (
            {currentCourse?.chapter?.length || 0})
          </CardTitle>
          <CreateChapter courseId={currentCourse.id} />
        </CardHeader>

        <CardContent>
          {currentCourse?.chapter?.length ? (
            <div className="space-y-6">
              {currentCourse.chapter.map((chapter) => (
                <Card
                  key={chapter.id}
                  className="border border-gray-100 hover:shadow-md transition bg-white"
                >
                  {/* Header chương */}
                  <CardHeader className="flex justify-between items-center bg-gray-50 rounded-t-lg">
                    <div>
                      <h3 className="font-semibold text-blue-700 text-lg">
                        {chapter.orderIndex}. {chapter.title}
                      </h3>
                      {chapter.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {chapter.description}
                        </p>
                      )}
                    </div>

                    {/* Nút thêm bài học */}
                    <CreateLesson
                      courseId={currentCourse.id}
                      chapterId={chapter.id}
                    />
                  </CardHeader>

                  {/* Danh sách bài học */}
                  <CardContent className="pt-4 space-y-3">
                    {chapter.lessons && chapter.lessons.length > 0 ? (
                      chapter.lessons.map((lesson) => (
                        <div
                          key={lesson.id}
                          className="flex flex-col border rounded-lg px-4 py-3 hover:bg-blue-50 transition"
                        >
                          {/* Hàng đầu: Thông tin & hành động */}
                          <div className="flex justify-between items-center">
                            {/* Thông tin bài học */}
                            <div
                              className="cursor-pointer"
                              onClick={() =>
                                router.push(
                                  `/instructor/courses/${currentCourse.id}/lesson/${lesson.id}`
                                )
                              }
                            >
                              <p className="font-medium text-gray-800">
                                {lesson.orderIndex}. {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500 mt-0.5">
                                Cập nhật:{" "}
                                {new Date(lesson.updatedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>

                            {/* Các nút hành động */}
                            <div className="flex items-center gap-2">
                              {/* Nút xem chi tiết */}
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:text-blue-700 hover:border-blue-600"
                                onClick={() =>
                                  router.push(
                                    `/instructor/courses/${currentCourse.id}/lesson/${lesson.id}`
                                  )
                                }
                              >
                                <BookOpen size={14} className="mr-1" />
                                Chi tiết
                              </Button>

                              {/* Nút xem video */}
                              {lesson.videoUrl ? (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-green-600 border-green-600 hover:border-green-700 hover:text-green-700"
                                  onClick={() => setSelectedLesson(lesson)}
                                >
                                  <Video size={14} className="mr-1" />
                                  Video
                                </Button>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  Không có video
                                </span>
                              )}

                              {/* Sửa / Xóa */}
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

                          {/* 🔹 Hiển thị quiz của bài học (nếu có) */}
                          {lesson.quizzes && lesson.quizzes.length > 0 && (
                            <div className="mt-3 ml-6 border-t border-gray-200 pt-2">
                              <p className="text-sm font-semibold text-gray-700">
                                Quiz:
                              </p>
                              <ul className="list-disc list-inside text-gray-600 text-sm space-y-2">
                                {lesson.quizzes.map((quiz) => (
                                  <li
                                    key={quiz.id}
                                    className="flex justify-between items-center bg-gray-50 border rounded-md px-3 py-2 hover:bg-blue-50 transition"
                                  >
                                    {/* Tên quiz có thể click để xem nhanh */}
                                    <span
                                      className="cursor-pointer hover:text-blue-600 transition font-medium"
                                      onClick={() => setSelectedQuiz(quiz)}
                                    >
                                      {quiz.title}
                                    </span>

                                    {/* Nút mở chi tiết quiz */}
                                    <div className="flex items-center gap-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        className="text-blue-600 border-blue-600 hover:text-blue-700 hover:border-blue-600"
                                        onClick={() =>
                                          router.push(
                                            `/instructor/quizzes/${quiz.id}`
                                          )
                                        }
                                      >
                                        <BookOpen size={14} className="mr-1" />
                                        Chi tiết
                                      </Button>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic text-sm">
                        Chưa có bài học nào trong chương này.
                      </p>
                    )}

                    {/* 🧩 Dialog hiển thị chi tiết quiz */}
                    <Dialog
                      open={!!selectedQuiz}
                      onOpenChange={() => setSelectedQuiz(null)}
                    >
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{selectedQuiz?.title}</DialogTitle>
                        </DialogHeader>

                        <div className="space-y-4 max-h-[70vh] overflow-y-auto">
                          {selectedQuiz?.questions?.map(
                            (q: any, qIndex: number) => (
                              <div
                                key={q.id}
                                className="border rounded-lg p-3 bg-gray-50 shadow-sm"
                              >
                                <p className="font-medium text-gray-800 mb-1">
                                  Câu {qIndex + 1}: {q.questionText}
                                </p>
                                <ul className="list-disc list-inside text-gray-600 text-sm ml-3">
                                  {q.options?.map((opt: any) => (
                                    <li
                                      key={opt.id}
                                      className={`${
                                        opt.isCorrect
                                          ? "text-green-600 font-medium"
                                          : ""
                                      }`}
                                    >
                                      {opt.text}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            )
                          )}

                          {!selectedQuiz?.questions?.length && (
                            <p className="text-gray-500 italic">
                              Quiz này chưa có câu hỏi nào.
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>

                    {/* 🎬 Dialog xem video bài học */}
                    <Dialog
                      open={!!selectedLesson}
                      onOpenChange={() => setSelectedLesson(null)}
                    >
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>{selectedLesson?.title}</DialogTitle>
                        </DialogHeader>
                        <div className="mt-2">
                          {selectedLesson?.videoUrl ? (
                            <video
                              controls
                              className="w-full rounded-lg"
                              src={selectedLesson.videoUrl}
                            />
                          ) : (
                            <p className="text-gray-500">
                              Không có video cho bài học này.
                            </p>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              Chưa có chương nào cho khóa học này.
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
