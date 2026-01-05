"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, Video } from "lucide-react";
import CreateChapter from "@/components/instructor/courses/chapter/CreateChapter";
import CreateLesson from "@/components/instructor/courses/lessons/CreateLesson";
import UpdateLesson from "@/components/instructor/courses/lessons/UpdateLesson";
import DeleteLessonDialog from "@/components/instructor/courses/lessons/DeleteLessonDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LessonTabsProps {
  currentCourse: any;
}

const LessonTabs = ({ currentCourse }: LessonTabsProps) => {
  const router = useRouter();
  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);

  const getCloudinaryThumbnail = (videoUrl: string) => {
    if (!videoUrl?.includes("cloudinary")) return null;
    return videoUrl
      .replace("/upload/", "/upload/so_auto,q_auto,w_400/")
      .replace(".mp4", ".jpg");
  };

  return (
    <div>
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
              {currentCourse.chapter.map((chapter: any) => (
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
                      chapter.lessons.map((lesson: any) => (
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
                                {lesson.quizzes.map((quiz: any) => (
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

      {/* Modal Video (Global for this component) */}
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

export default LessonTabs;
