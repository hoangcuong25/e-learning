"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Video } from "lucide-react";
import CreateChapter from "@/components/instructor/courses/chapter/CreateChapter";
import CreateLesson from "@/components/instructor/courses/lessons/CreateLesson";
import UpdateLesson from "@/components/instructor/courses/lessons/UpdateLesson";
import DeleteLessonDialog from "@/components/instructor/courses/lessons/DeleteLessonDialog";
import LessonDiscussDialog from "./LessonDiscussDialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDuration } from "@/lib/helpers";

interface LessonTabsProps {
  currentCourse: any;
}

const LessonTabs = ({ currentCourse }: LessonTabsProps) => {
  const router = useRouter();

  const [selectedLesson, setSelectedLesson] = useState<any | null>(null);
  const [selectedLessonDetail, setSelectedLessonDetail] = useState<any | null>(
    null
  );
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [selectedLessonForQuestions, setSelectedLessonForQuestions] = useState<
    any | null
  >(null);

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
            <BookOpen size={20} />
            Danh sách chương ({currentCourse?.chapter?.length || 0})
          </CardTitle>
          <CreateChapter courseId={currentCourse.id} />
        </CardHeader>

        <CardContent>
          {currentCourse?.chapter?.length ? (
            <div className="space-y-6">
              {currentCourse.chapter.map((chapter: any) => (
                <Card
                  key={chapter.id}
                  className="border border-gray-100 bg-white"
                >
                  {/* Header chương */}
                  <CardHeader className="flex justify-between bg-gray-50">
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

                    <CreateLesson
                      courseId={currentCourse.id}
                      chapterId={chapter.id}
                    />
                  </CardHeader>

                  {/* Danh sách lesson */}
                  <CardContent className="pt-4 space-y-3">
                    {chapter.lessons?.length ? (
                      chapter.lessons.map((lesson: any) => (
                        <div
                          key={lesson.id}
                          className="border rounded-lg px-4 py-3 hover:bg-blue-50 transition"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium text-gray-800">
                                {lesson.orderIndex}. {lesson.title}
                              </p>
                              <p className="text-xs text-gray-500">
                                Cập nhật:{" "}
                                {new Date(lesson.updatedAt).toLocaleDateString(
                                  "vi-VN"
                                )}
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-blue-600 border-blue-600 hover:bg-blue-50 hover:text-blue-600"
                                onClick={() => setSelectedLessonDetail(lesson)}
                              >
                                Chi tiết
                              </Button>

                              <Button
                                size="sm"
                                variant="outline"
                                className="text-orange-600 border-orange-600 hover:bg-orange-50 hover:text-orange-600"
                                onClick={() =>
                                  setSelectedLessonForQuestions(lesson)
                                }
                              >
                                <MessageCircle size={14} className="mr-1" />
                                Câu hỏi
                              </Button>

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

                          {/* Quiz */}
                          {lesson.quizzes?.length > 0 && (
                            <div className="mt-3 ml-6 border-t pt-2">
                              <p className="text-sm font-semibold">Quiz:</p>
                              <ul className="space-y-2 text-sm">
                                {lesson.quizzes.map((quiz: any) => (
                                  <li
                                    key={quiz.id}
                                    className="flex justify-between bg-gray-50 border rounded px-3 py-2"
                                  >
                                    <span
                                      className="cursor-pointer hover:text-blue-600"
                                      onClick={() => setSelectedQuiz(quiz)}
                                    >
                                      {quiz.title}
                                    </span>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() =>
                                        router.push(
                                          `/instructor/quizzes/${quiz.id}`
                                        )
                                      }
                                    >
                                      Chi tiết
                                    </Button>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-400 italic">
                        Chưa có bài học nào.
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic text-center py-8">
              Chưa có chương nào.
            </p>
          )}
        </CardContent>
      </Card>

      {/* ===== Dialog Chi tiết Lesson ===== */}
      <Dialog
        open={!!selectedLessonDetail}
        onOpenChange={() => setSelectedLessonDetail(null)}
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {selectedLessonDetail?.orderIndex}. {selectedLessonDetail?.title}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 max-h-[70vh] overflow-y-auto">
            <div className="grid grid-cols-2 text-sm text-gray-600">
              <p>
                <strong>Thời lượng:</strong>{" "}
                {formatDuration(selectedLessonDetail?.duration || 0)}
              </p>
              <p>
                <strong>Cập nhật:</strong>{" "}
                {new Date(selectedLessonDetail?.updatedAt).toLocaleString(
                  "vi-VN"
                )}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-1">Nội dung</h4>
              <div
                className="prose prose-sm border rounded p-3 bg-gray-50 max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    selectedLessonDetail?.content || "<i>Chưa có nội dung</i>",
                }}
              />
            </div>

            {selectedLessonDetail?.videoUrl && (
              <div>
                <h4 className="font-semibold mb-1">Video</h4>
                <video
                  src={selectedLessonDetail.videoUrl}
                  controls
                  className="w-full rounded-lg"
                />
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* ===== Dialog Câu hỏi ===== */}
      <LessonDiscussDialog
        open={!!selectedLessonForQuestions}
        onOpenChange={() => setSelectedLessonForQuestions(null)}
        lesson={selectedLessonForQuestions}
      />

      {/* ===== Dialog Quiz ===== */}
      <Dialog open={!!selectedQuiz} onOpenChange={() => setSelectedQuiz(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedQuiz?.title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-3">
            {selectedQuiz?.questions?.map((q: any, i: number) => (
              <div key={q.id} className="border rounded p-3 bg-gray-50">
                <p className="font-medium">
                  Câu {i + 1}: {q.questionText}
                </p>
                <ul className="list-disc ml-5 text-sm">
                  {q.options?.map((opt: any) => (
                    <li
                      key={opt.id}
                      className={opt.isCorrect ? "text-green-600" : ""}
                    >
                      {opt.text}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LessonTabs;
