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
import { Badge } from "@/components/ui/badge";
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

  const [selectedLessonDetail, setSelectedLessonDetail] = useState<any | null>(
    null,
  );
  const [selectedQuiz, setSelectedQuiz] = useState<any>(null);
  const [selectedLessonForQuestions, setSelectedLessonForQuestions] = useState<
    any | null
  >(null);

  return (
    <div className="space-y-8">
      {/* ─── CHAPTERS CONTAINER ────────────────────────── */}
      <div className="flex items-center justify-between px-2">
        <div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Cấu trúc chương trình
          </h2>
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
            Quản lý và sắp xếp lộ trình học tập
          </p>
        </div>
        <CreateChapter courseId={currentCourse.id} />
      </div>

      {currentCourse?.chapter?.length ? (
        <div className="space-y-10">
          {currentCourse.chapter.map((chapter: any, index: number) => (
            <Card
              key={chapter.id}
              className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden group hover:shadow-xl transition-all duration-500"
            >
              {/* Header chương */}
              <div className="p-8 md:px-10 bg-slate-50/50 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex items-start gap-6">
                  <div className="w-14 h-14 bg-indigo-600 text-white rounded-2xl flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-100 group-hover:scale-110 transition-transform">
                    {index + 1}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="bg-indigo-100 text-indigo-700 border-none rounded-lg px-2 py-0.5 text-[10px] font-black uppercase tracking-tight">
                        Chương mục
                      </Badge>
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">
                        ID: {chapter.id}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 leading-tight">
                      {chapter.title}
                    </h3>
                    {chapter.description && (
                      <p className="text-sm text-slate-400 font-medium mt-1 line-clamp-1 max-w-xl">
                        {chapter.description}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                  <CreateLesson
                    courseId={currentCourse.id}
                    chapterId={chapter.id}
                  />
                </div>
              </div>

              {/* Danh sách lesson */}
              <CardContent className="p-8 md:p-10 space-y-4">
                {chapter.lessons?.length ? (
                  chapter.lessons.map((lesson: any, lIndex: number) => (
                    <div
                      key={lesson.id}
                      className="group/lesson border-b border-dashed border-slate-100 last:border-0 pb-4 last:pb-0"
                    >
                      <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 rounded-3xl hover:bg-slate-50 transition-all duration-300 gap-6">
                        <div className="flex items-center gap-6 flex-1 min-w-0">
                          <div className="w-10 h-10 rounded-xl bg-white shadow-sm border border-slate-100 flex items-center justify-center text-sm font-black text-slate-400 group-hover/lesson:bg-indigo-600 group-hover/lesson:text-white group-hover/lesson:border-indigo-600 transition-all">
                            {lIndex + 1}
                          </div>
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-900 group-hover/lesson:text-indigo-600 transition-colors truncate">
                              {lesson.title}
                            </h4>
                            <div className="flex items-center gap-4 mt-1">
                              <span className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400">
                                <Video size={12} className="text-indigo-400" />{" "}
                                {formatDuration(lesson.duration || 0)}
                              </span>
                              <span className="w-1 h-1 bg-slate-200 rounded-full" />
                              <span className="text-[10px] font-bold text-slate-400">
                                {new Date(lesson.updatedAt).toLocaleDateString(
                                  "vi-VN",
                                )}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 w-full md:w-auto">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 rounded-xl text-slate-600 font-bold px-4 hover:bg-white hover:shadow-sm"
                            onClick={() => setSelectedLessonDetail(lesson)}
                          >
                            Chi tiết
                          </Button>

                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-10 rounded-xl text-indigo-600 font-black uppercase tracking-widest text-[10px] px-4 hover:bg-slate-900 hover:text-white transition-all"
                            onClick={() =>
                              setSelectedLessonForQuestions(lesson)
                            }
                          >
                            <MessageCircle size={14} className="mr-2" />
                            Phản hồi
                          </Button>

                          <div className="flex items-center gap-1 bg-white p-1 rounded-xl shadow-sm border border-slate-50">
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

                      {/* Quiz Section in Lesson */}
                      {lesson.quizzes?.length > 0 && (
                        <div className="mt-2 ml-16 pl-6 space-y-2">
                          {lesson.quizzes.map((quiz: any) => (
                            <div
                              key={quiz.id}
                              className="flex items-center justify-between bg-indigo-50/50 p-4 rounded-2xl border border-indigo-100/50 group/quiz transition-all"
                            >
                              <div className="flex items-center gap-4 border-l-4 border-indigo-600 pl-4">
                                <span className="text-xs font-black text-indigo-900 truncate">
                                  {quiz.title}
                                </span>
                                <Badge className="bg-indigo-600 text-white border-none rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                                  Quiz Active
                                </Badge>
                              </div>
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-9 rounded-xl border-indigo-200 text-indigo-600 font-black text-[10px] hover:bg-indigo-600 hover:text-white transition-all shadow-sm"
                                onClick={() =>
                                  router.push(`/instructor/quizzes/${quiz.id}`)
                                }
                              >
                                Sửa Quiz
                              </Button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="py-12 flex flex-col items-center justify-center bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-100">
                    <BookOpen className="w-10 h-10 text-slate-200 mb-4" />
                    <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">
                      Chương này chưa có bài học
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-slate-100 font-bold">
          <BookOpen className="w-12 h-12 text-slate-200 mb-6" />
          <h3 className="text-xl font-black text-slate-900">
            Giáo trình đang trống
          </h3>
          <p className="text-slate-400 mt-1 font-medium italic">
            Hãy bắt đầu xây dựng chương đầu tiên cho khóa học.
          </p>
        </div>
      )}

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
                  "vi-VN",
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
