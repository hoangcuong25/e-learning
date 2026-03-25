"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, PlusCircle, Pencil, Eye } from "lucide-react";

import {
  deleteQuiz,
  fetchInstructorQuizzes,
  updateQuiz,
} from "@/store/slice/course/quizSlice";
import { fetchCoursesByInstructor } from "@/store/slice/course/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import QuizForm from "@/components/quiz/CreateQuiz";
import { useRouter } from "next/navigation";
import QuizOnboarding from "@/components/instructor/onboarding/QuizOnboarding";
import AiQuizPreviewDialog from "@/components/quiz/AiQuizPreviewDialog";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Loader2,
} from "lucide-react";
import {
  generateQuizQuestionsByAi,
  clearQuizState,
} from "@/store/slice/course/quizSlice";

const Quizzes = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { instructorQuizzes, loading } = useSelector(
    (state: RootState) => state.quiz,
  );
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses,
  );

  // Local UI states
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editQuiz, setEditQuiz] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

  // AI Preview State
  const [previewOpen, setPreviewOpen] = useState(false);
  const [aiGeneratingId, setAiGeneratingId] = useState<number | null>(null);
  const [currentPreviewQuizId, setCurrentPreviewQuizId] = useState<
    number | null
  >(null);

  // Fetch data
  useEffect(() => {
    dispatch(fetchInstructorQuizzes());
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  // 🗑️ Xóa quiz
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteQuiz(deleteId)).unwrap();
      await dispatch(fetchInstructorQuizzes()).unwrap();
      toast.success("Đã xóa quiz thành công!");
      setDeleteId(null);
    } catch {
      toast.error("Xóa quiz thất bại!");
    }
  };

  // ✏️ Cập nhật quiz (chỉ sửa title)
  const handleUpdate = async () => {
    if (!editQuiz) return;
    if (!newTitle.trim()) {
      toast.error("Tiêu đề không được để trống!");
      return;
    }
    try {
      await dispatch(
        updateQuiz({ id: editQuiz.id, payload: { title: newTitle } }),
      ).unwrap();
      await dispatch(fetchInstructorQuizzes()).unwrap();
      toast.success("Đã cập nhật quiz thành công!");
      setEditQuiz(null);
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  // Gọi AI sinh câu hỏi
  const handleGenerateAi = async (id: number) => {
    setAiGeneratingId(id);
    try {
      await dispatch(generateQuizQuestionsByAi(id)).unwrap();
      setCurrentPreviewQuizId(id);
      setPreviewOpen(true);
      toast.success("AI đã tạo xong câu hỏi! Hãy kiểm tra lại.");
    } catch (error: any) {
      const msg = Array.isArray(error?.message)
        ? error.message.join(", ")
        : error?.message || "Lỗi khi gọi AI";
      toast.error(msg);
    } finally {
      setAiGeneratingId(null);
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div className="step-quiz-header">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Quản lý{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Quiz
            </span>
          </h1>
          <p className="text-slate-500 max-w-lg leading-relaxed">
            Tạo và quản lý các bài kiểm tra chất lượng cao cho học viên của bạn.
            Sử dụng AI để sinh câu hỏi nhanh chóng.
          </p>
        </div>

        <div className="flex gap-4 items-center">
          <div className="step-create-quiz">
            {/* Nút mở form tạo quiz */}
            <Dialog>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl px-6 py-6 shadow-lg shadow-blue-200 transition-all active:scale-95">
                  <PlusCircle className="w-5 h-5" /> Tạo Quiz Mới
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl w-full">
                <DialogTitle className="text-lg font-semibold mb-2">
                  Tạo Quiz Mới
                </DialogTitle>
                <DialogDescription className="sr-only">
                  Form để tạo bài kiểm tra mới cho bài học.
                </DialogDescription>
                <QuizForm />
              </DialogContent>
            </Dialog>
          </div>

          <QuizOnboarding />
        </div>
      </div>

      {/* Danh sách quiz */}
      <Card className="shadow-sm border border-gray-200 step-quiz-list">
        <CardHeader className="border-b bg-slate-50/50 backdrop-blur-sm px-6 py-4">
          <CardTitle className="text-xl font-bold text-slate-800 flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-500" />
            Danh sách Quiz ({instructorQuizzes.length})
          </CardTitle>
        </CardHeader>

        <CardContent className="p-6">
          {instructorQuizzes.length === 0 ? (
            <p className="text-gray-500 italic text-center py-8">
              Chưa có quiz nào được tạo.
            </p>
          ) : (
            <div className="grid gap-4">
              {instructorQuizzes.map((quiz) => {
                const courseTitle =
                  quiz.lesson?.chapter?.course?.title || "Không rõ khóa học";
                const lessonTitle = quiz.lesson?.title || "Không rõ bài học";

                return (
                  <div
                    key={quiz.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-6 border border-slate-100 rounded-2xl hover:border-indigo-200 hover:shadow-xl bg-white transition-all duration-300 group relative overflow-hidden"
                  >
                    {/* Background Decorative Element */}
                    <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-50/30 rounded-full blur-2xl group-hover:bg-indigo-100/50 transition-colors" />

                    {/* Thông tin Quiz */}
                    <div className="relative z-10 flex-1 space-y-4">
                      <div>
                        <h3 className="font-bold text-slate-800 text-xl group-hover:text-blue-600 transition-colors flex items-center gap-2">
                          <span className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                            🧩
                          </span>
                          {quiz.title}
                        </h3>

                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-y-2 gap-x-6">
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <GraduationCap className="w-4 h-4 text-indigo-500" />
                            <span className="font-medium">Khóa học:</span>
                            <span className="text-slate-900 truncate max-w-[200px]">
                              {quiz.lesson?.chapter?.course?.title || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <BookOpen className="w-4 h-4 text-emerald-500" />
                            <span className="font-medium">Bài học:</span>
                            <span className="text-slate-900 truncate max-w-[200px]">
                              {quiz.lesson?.title || "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="bg-slate-100 text-slate-600 px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          ❓ {quiz._count?.questions ?? 0} câu hỏi
                        </div>
                        <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold">
                          #{quiz.id}
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 sm:mt-0 relative z-10 flex flex-wrap items-center gap-3">
                      {/* Sửa */}
                      <Dialog
                        open={editQuiz?.id === quiz.id}
                        onOpenChange={(open) =>
                          open
                            ? (setEditQuiz({ id: quiz.id, title: quiz.title }),
                              setNewTitle(quiz.title))
                            : setEditQuiz(null)
                        }
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex items-center gap-2 text-slate-600 hover:bg-slate-50 border-slate-200 rounded-xl px-4"
                          >
                            <Pencil className="w-4 h-4" />
                            Sửa
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                          <DialogTitle className="text-lg font-semibold">
                            ✏️ Chỉnh sửa tiêu đề Quiz
                          </DialogTitle>
                          <DialogDescription className="sr-only">
                            Cập nhật tiêu đề của bài kiểm tra hiện tại.
                          </DialogDescription>

                          <div className="space-y-5 mt-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">
                                Tiêu đề mới
                              </label>
                              <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Nhập tiêu đề mới..."
                              />
                            </div>

                            <div className="p-3 rounded-md bg-gray-50 border text-sm text-gray-700 space-y-1">
                              <p>
                                🏫 <strong>Khóa học:</strong> {courseTitle}
                              </p>
                              <p>
                                📘 <strong>Bài học:</strong> {lessonTitle}
                              </p>
                            </div>
                          </div>

                          <div className="flex justify-end gap-2 mt-6">
                            <Button
                              variant="outline"
                              onClick={() => setEditQuiz(null)}
                            >
                              Hủy
                            </Button>
                            <Button
                              onClick={handleUpdate}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Lưu thay đổi
                            </Button>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* AI Generate */}
                      <Button
                        variant="outline"
                        className="bg-amber-50 border-amber-200 text-amber-700 font-bold rounded-xl
                px-5 py-2 hover:bg-amber-500 hover:border-amber-500 hover:text-white 
                transition-all duration-300 shadow-sm hover:shadow-amber-200 flex items-center gap-2 group/ai"
                        onClick={() => handleGenerateAi(quiz.id)}
                        disabled={aiGeneratingId === quiz.id}
                      >
                        {aiGeneratingId === quiz.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles
                            size={18}
                            className="group-hover/ai:animate-pulse"
                          />
                        )}
                        Thêm câu hỏi (AI)
                      </Button>

                      {/* Chi tiết */}
                      <Button
                        variant="outline"
                        className="border-blue-500 border-2 hover:bg-blue-500 hover:text-white text-blue-500"
                        onClick={() =>
                          router.push(`/instructor/quizzes/${quiz.id}`)
                        }
                      >
                        <Eye size={18} />
                        Chi Tiết
                      </Button>

                      {/*  Xóa */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="destructive"
                            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => setDeleteId(quiz.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                            Xóa
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Xác nhận xóa quiz
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              Hành động này sẽ xóa vĩnh viễn quiz{" "}
                              <strong>{quiz.title}</strong>. Bạn có chắc chắn
                              muốn tiếp tục không?
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Hủy</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDelete}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              Xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Preview Dialog */}
      {currentPreviewQuizId && (
        <AiQuizPreviewDialog
          quizId={currentPreviewQuizId}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      )}
    </div>
  );
};

export default Quizzes;
