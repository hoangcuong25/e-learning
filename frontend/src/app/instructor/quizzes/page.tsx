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
import { Badge } from "@/components/ui/badge";
import {
  BookOpen,
  GraduationCap,
  Layers,
  Sparkles,
  Loader2,
  Puzzle,
  TrendingUp,
  FileQuestion,
  MoreVertical,
} from "lucide-react";
import { generateQuizQuestionsByAi } from "@/store/slice/course/quizSlice";

const Quizzes = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { instructorQuizzes, loading } = useSelector(
    (state: RootState) => state.quiz,
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

  if (loading && instructorQuizzes.length === 0) return <LoadingScreen />;

  const totalQuestions = instructorQuizzes.reduce(
    (acc, q) => acc + (q._count?.questions || 0),
    0,
  );

  return (
    <div className="space-y-10 pb-10 overflow-x-hidden">
      {/* Header Section */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-end gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Thư viện Quiz
          </h1>
          <p className="text-slate-500 mt-2 font-medium max-w-2xl">
            Thiết kế các bài kiểm tra tương tác để đánh giá sự tiến bộ của học
            viên một cách chính xác nhất.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <QuizOnboarding />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 bg-slate-900 text-white font-black uppercase tracking-widest rounded-3xl shadow-xl hover:scale-105 transition-all flex items-center gap-3">
                <PlusCircle className="w-5 h-5" /> Tạo Quiz Mới
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[1200px] w-[95vw] rounded-[2.5rem] border-none p-0 overflow-hidden bg-white">
              <div className="p-8 bg-slate-50 border-b border-slate-100">
                <DialogTitle className="text-2xl font-black text-slate-900">
                  Thiết lập Quiz
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
                  Gắn bài kiểm tra vào bài học tương ứng
                </DialogDescription>
              </div>
              <div className="p-8">
                <QuizForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Stats Quickview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white flex items-center gap-6 group">
          <div className="p-4 bg-indigo-50 text-indigo-600 rounded-3xl group-hover:scale-110 transition-transform">
            <Puzzle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Tổng số Quiz
            </div>
            <div className="text-2xl font-black text-slate-900">
              {instructorQuizzes.length}
            </div>
          </div>
        </Card>
        <Card className="rounded-[2.5rem] border-none shadow-sm p-8 bg-white flex items-center gap-6 group">
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:scale-110 transition-transform">
            <FileQuestion className="w-6 h-6" />
          </div>
          <div>
            <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Tổng câu hỏi
            </div>
            <div className="text-2xl font-black text-slate-900">
              {totalQuestions}
            </div>
          </div>
        </Card>
      </div>

      {/* Quiz Grid List */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 mt-8">
        {instructorQuizzes.length === 0 ? (
          <div className="col-span-full py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-slate-100 font-bold">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <Puzzle className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Danh sách trống
            </h3>
            <p className="text-slate-400 mt-1">
              Hãy bắt đầu bằng cách tạo bài kiểm tra đầu tiên của bạn.
            </p>
          </div>
        ) : (
          instructorQuizzes.map((quiz) => {
            const courseTitle =
              quiz.lesson?.chapter?.course?.title || "Draft Course";
            const lessonTitle = quiz.lesson?.title || "Unassigned Lesson";

            return (
              <Card
                key={quiz.id}
                className="rounded-[3rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden group border-2 border-transparent hover:border-indigo-100"
              >
                <CardContent className="p-8 space-y-8">
                  {/* Card Top: Title and Badges */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap gap-2">
                        <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight">
                          #{quiz.id}
                        </Badge>
                        <Badge className="bg-emerald-50 text-emerald-600 border-none rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight">
                          Active
                        </Badge>
                      </div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight leading-tight group-hover:text-indigo-600 transition-colors">
                        {quiz.title}
                      </h3>
                    </div>
                    <div className="p-3 bg-slate-50 rounded-2xl">
                      <Puzzle className="w-6 h-6 text-slate-200 group-hover:text-indigo-600 transition-colors" />
                    </div>
                  </div>

                  {/* Course Context Metadata */}
                  <div className="grid grid-cols-2 gap-4 p-5 bg-slate-50/50 rounded-3xl border border-slate-100/50">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <GraduationCap size={12} /> Course
                      </span>
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {courseTitle}
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                        <BookOpen size={12} /> Lesson
                      </span>
                      <p className="text-xs font-bold text-slate-700 truncate">
                        {lessonTitle}
                      </p>
                    </div>
                  </div>

                  {/* card Actions Footer */}
                  <div className="flex flex-wrap items-center justify-between gap-6 pt-4 border-t border-slate-50">
                    <div className="flex items-center gap-6">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          Questions
                        </span>
                        <span className="text-lg font-black text-slate-900">
                          {quiz._count?.questions ?? 0}
                        </span>
                      </div>
                      <div className="w-px h-8 bg-slate-100" />
                      <Button
                        variant="ghost"
                        className="text-indigo-600 font-extrabold text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-indigo-50 rounded-xl"
                        onClick={() =>
                          router.push(`/instructor/quizzes/${quiz.id}`)
                        }
                      >
                        Quản lý câu hỏi <Eye size={16} />
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      {/* AI Button */}
                      <Button
                        variant="outline"
                        className="h-12 px-6 bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 text-white font-black uppercase tracking-widest rounded-2xl border-none shadow-lg shadow-amber-100 transition-transform active:scale-95 flex items-center gap-2"
                        onClick={() => handleGenerateAi(quiz.id)}
                        disabled={aiGeneratingId === quiz.id}
                      >
                        {aiGeneratingId === quiz.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Sparkles size={16} />
                        )}
                        AI tạo
                      </Button>

                      {/* Edit Dialog */}
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
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-600 transition-all"
                          >
                            <Pencil size={18} />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="rounded-[2.5rem] border-none p-8 overflow-hidden bg-white shadow-2xl max-w-md">
                          <div className="space-y-6">
                            <div>
                              <DialogTitle className="text-2xl font-black text-slate-900">
                                Chỉnh sửa Quiz
                              </DialogTitle>
                              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                Cập nhật danh tính cho bài kiểm tra
                              </p>
                            </div>
                            <div className="space-y-3">
                              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">
                                Tiêu đề mới
                              </label>
                              <Input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Tên quiz của bạn..."
                                className="h-14 bg-slate-50 border-transparent rounded-2xl focus:bg-white focus:border-indigo-200 transition-all font-bold px-6 outline-none"
                              />
                            </div>
                            <div className="flex gap-4 pt-4">
                              <Button
                                variant="outline"
                                className="flex-1 h-14 rounded-2xl font-bold text-slate-500 border-none bg-slate-50 hover:bg-slate-100"
                                onClick={() => setEditQuiz(null)}
                              >
                                Đóng
                              </Button>
                              <Button
                                className="flex-1 h-14 rounded-2xl font-black uppercase tracking-widest text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-100"
                                onClick={handleUpdate}
                              >
                                Cập nhật ngay
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      {/* Delete */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="w-12 h-12 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                            onClick={() => setDeleteId(quiz.id)}
                          >
                            <Trash2 size={18} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] border-none p-10 bg-white shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                              Cảnh báo xóa Quiz
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium py-4 text-base leading-relaxed">
                              Bạn sắp xóa vĩnh viễn{" "}
                              <span className="text-slate-900 font-black">
                                "{quiz.title}"
                              </span>
                              . Hành động này không thể hoàn tác và mọi dữ liệu
                              liên quan sẽ biến mất.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="gap-4">
                            <AlertDialogCancel className="h-14 flex-1 rounded-2xl font-bold bg-slate-50 border-none hover:bg-slate-100 text-slate-500">
                              Bỏ qua
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDelete}
                              className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-100"
                            >
                              Xác nhận xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}
      </div>

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
