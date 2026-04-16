"use client";

import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import React, { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { fetchQuizById } from "@/store/slice/course/quizSlice";
import LoadingScreen from "@/components/LoadingScreen";
import {
  ArrowLeft,
  BookOpen,
  GraduationCap,
  Layers,
  Puzzle,
  PlusCircle,
  HelpCircle,
  ChevronRight,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import CreateQuestion from "@/components/quiz/question/CreateQuestion";
import EditQuestion from "@/components/quiz/question/EditQuestion";
import { deleteQuestion } from "@/store/slice/course/question.slice";
import { toast } from "sonner";

const QuizDetail = () => {
  const { quizId } = useParams();
  const id = Number(quizId);
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { currentQuiz, loading } = useSelector(
    (state: RootState) => state.quiz,
  );

  useEffect(() => {
    if (id) dispatch(fetchQuizById(id));
  }, [dispatch, id]);

  if (loading || !currentQuiz) return <LoadingScreen />;

  const lesson = currentQuiz.lesson;
  const chapter = lesson?.chapter;
  const course = chapter?.course;

  const handleDeleteQuestion = async (questionId: number) => {
    try {
      await dispatch(deleteQuestion(questionId)).unwrap();
      toast.success("Đã gỡ bỏ câu hỏi thành công!");
      dispatch(fetchQuizById(id));
    } catch {
      toast.error("Gỡ bỏ thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div className="space-y-10 pb-10 overflow-x-hidden">
      {/* ─── HEADER SECTION ───────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-6">
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="w-12 h-12 rounded-2xl bg-white shadow-sm border border-slate-100 hover:bg-slate-50 transition-all text-slate-600 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          </Button>
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Badge className="bg-indigo-50 text-indigo-600 border-none rounded-lg px-2.5 py-1 text-[10px] font-black uppercase tracking-tight">
                #{id}
              </Badge>
              <div className="flex items-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                <Layers size={12} className="mr-2" /> Quiz Management
              </div>
            </div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight leading-none flex items-center gap-3">
              <Puzzle className="w-8 h-8 text-indigo-600" /> {currentQuiz.title}
            </h1>
          </div>
        </div>

        <CreateQuestion quizId={id} />
      </div>

      {/* ─── METADATA GRID ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl group-hover:scale-110 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Khóa học hiện tại
            </span>
          </div>
          <h4 className="text-lg font-black text-slate-900 leading-tight truncate">
            {course?.title || "Draft Course"}
          </h4>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
              <Layers className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Chương
            </span>
          </div>
          <h4 className="text-lg font-black text-slate-900 leading-tight truncate font-bold">
            {chapter?.title || "Module #0"}
          </h4>
        </Card>

        <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 group hover:shadow-xl transition-all duration-500">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
              <BookOpen className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
              Bài học áp dụng
            </span>
          </div>
          <h4 className="text-lg font-black text-slate-900 leading-tight truncate font-bold">
            {lesson?.title || "Intro Session"}
          </h4>
        </Card>
      </div>

      <Separator className="bg-slate-100" />

      {/* ─── QUESTIONS LIST ───────────────────────────── */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Ngân hàng câu hỏi
            </h2>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">
              Sắp xếp và quản lý nội dung kiểm tra
            </p>
          </div>
          <div className="p-2 px-6 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl">
            {currentQuiz?.questions?.length || 0} Câu hỏi
          </div>
        </div>

        {currentQuiz &&
        currentQuiz?.questions &&
        currentQuiz?.questions?.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {currentQuiz?.questions.map((q, index) => (
              <Card
                key={q.id}
                className="rounded-[3rem] border-none shadow-sm hover:shadow-2xl transition-all duration-500 bg-white overflow-hidden group border-2 border-transparent hover:border-indigo-100"
              >
                <CardHeader className="p-10 pb-6 border-b border-slate-50 flex flex-row items-start justify-between">
                  <div className="flex items-start gap-6">
                    <div className="w-14 h-14 bg-indigo-600 text-white rounded-[1.5rem] flex items-center justify-center text-xl font-black shadow-lg shadow-indigo-100 shrink-0">
                      {index + 1}
                    </div>
                    <div className="space-y-1">
                      <div className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                        Nội dung câu hỏi
                      </div>
                      <h3 className="text-xl font-extrabold text-slate-900 leading-relaxed max-w-2xl">
                        {q.questionText}
                      </h3>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <EditQuestion
                      currentQuiz={currentQuiz}
                      question={q}
                      onUpdated={() => dispatch(fetchQuizById(id))}
                    />

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="w-12 h-12 rounded-2xl bg-rose-50 hover:bg-rose-100 text-rose-600 transition-all"
                        >
                          <Trash2 className="w-5 h-5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="rounded-[2.5rem] border-none p-10 bg-white shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-2xl font-black text-slate-900 tracking-tight leading-none">
                            Gỡ câu hỏi?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-slate-500 font-medium py-4 text-base leading-relaxed">
                            Bạn có chắc chắn muốn gỡ bỏ câu hỏi này khỏi bài
                            kiểm tra? Hành động này có thể ảnh hưởng đến kết quả
                            của học viên đã thực hiện quiz.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-4">
                          <AlertDialogCancel className="h-14 flex-1 rounded-2xl font-bold bg-slate-50 border-none hover:bg-slate-100 text-slate-500">
                            Bỏ qua
                          </AlertDialogCancel>
                          <AlertDialogAction
                            className="h-14 flex-1 rounded-2xl font-black uppercase tracking-widest bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-100"
                            onClick={() => handleDeleteQuestion(q.id)}
                          >
                            Xác nhận gỡ
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardHeader>

                <CardContent className="p-10 bg-slate-50/20">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {q.options && q.options.length > 0 ? (
                      q.options.map((opt, optIndex) => (
                        <div
                          key={opt.id}
                          className={`flex items-center gap-4 p-5 rounded-3xl border-2 transition-all duration-300 ${
                            opt.isCorrect
                              ? "bg-emerald-50 border-emerald-500/20 text-emerald-800 shadow-lg shadow-emerald-50"
                              : "bg-white border-slate-100 text-slate-600 shadow-sm"
                          } group/opt hover:scale-[1.02]`}
                        >
                          <div
                            className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shrink-0 ${
                              opt.isCorrect
                                ? "bg-emerald-500 text-white"
                                : "bg-slate-100 text-slate-400 group-hover/opt:bg-slate-200"
                            }`}
                          >
                            {String.fromCharCode(65 + optIndex)}
                          </div>
                          <span className="text-sm font-bold flex-1">
                            {opt.text}
                          </span>
                          {opt.isCorrect && (
                            <Badge className="bg-emerald-500 text-white border-none rounded-lg px-2 py-0.5 text-[8px] font-black uppercase tracking-widest">
                              Correct
                            </Badge>
                          )}
                        </div>
                      ))
                    ) : (
                      <div className="col-span-full py-8 text-center bg-white/50 border-2 border-dashed border-slate-100 rounded-[2rem]">
                        <HelpCircle className="w-10 h-10 text-slate-100 mx-auto mb-2" />
                        <p className="text-sm text-slate-400 font-bold uppercase tracking-widest">
                          No options defined
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="py-24 flex flex-col items-center justify-center bg-white rounded-[3rem] shadow-sm border-2 border-dashed border-slate-100">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
              <HelpCircle className="w-10 h-10 text-slate-200" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              Quiz chưa có nội dung
            </h3>
            <p className="text-slate-400 mt-1 font-medium">
              Bấm vào nút "Tạo câu hỏi" ở góc phải để bắt đầu thiết lập.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizDetail;
