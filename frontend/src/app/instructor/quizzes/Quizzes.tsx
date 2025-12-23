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
} from "@/store/quizSlice";
import { fetchCoursesByInstructor } from "@/store/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import QuizForm from "@/components/quiz/CreateQuiz";
import { useRouter } from "next/navigation";

const Quizzes = () => {
  const router = useRouter();

  const dispatch = useDispatch<AppDispatch>();

  // Redux state
  const { instructorQuizzes, loading } = useSelector(
    (state: RootState) => state.quiz
  );
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses
  );

  // Local UI states
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editQuiz, setEditQuiz] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");

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
        updateQuiz({ id: editQuiz.id, payload: { title: newTitle } })
      ).unwrap();
      await dispatch(fetchInstructorQuizzes()).unwrap();
      toast.success("Đã cập nhật quiz thành công!");
      setEditQuiz(null);
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            🎓 Quản lý Quiz của bạn
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Tạo, sửa tiêu đề và quản lý các bài quiz của khóa học bạn giảng dạy.
          </p>
        </div>

        {/* Nút mở form tạo quiz */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 transition-all shadow-md">
              <PlusCircle className="w-5 h-5" /> Tạo Quiz Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full">
            <DialogTitle className="text-lg font-semibold mb-2">
              Tạo Quiz Mới
            </DialogTitle>
            <QuizForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách quiz */}
      <Card className="shadow-sm border border-gray-200">
        <CardHeader className="border-b bg-gray-50">
          <CardTitle className="text-lg font-semibold">
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
                const course = instructorCourses.find((c) =>
                  c.lessons?.some((l) => l.id === quiz.lessonId)
                );
                const lesson = instructorCourses
                  .flatMap((c) => c.lessons || [])
                  .find((l) => l.id === quiz.lessonId);

                return (
                  <div
                    key={quiz.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl hover:shadow-md bg-white transition-all group"
                  >
                    <div>
                      <h3 className="font-semibold text-gray-800 text-lg group-hover:text-blue-600 transition">
                        🧩 Quiz: {quiz.title}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">
                        🏫 <span className="font-bold">Khóa học:</span>{" "}
                        {course?.title || "Không rõ khóa học"} • 📘{" "}
                        <span className="font-bold">Bài học:</span>{" "}
                        {lesson?.title || "Không rõ bài học"}
                      </p>
                    </div>

                    {/* ─── Action buttons ─────────────────────────────── */}
                    <div className="mt-4 flex items-center gap-2">
                      {/* ✏️ Sửa */}
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
                            className="flex items-center gap-2 text-gray-700 hover:bg-gray-100"
                          >
                            <Pencil className="w-4 h-4" />
                            Sửa
                          </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md">
                          <DialogTitle className="text-lg font-semibold">
                            ✏️ Chỉnh sửa tiêu đề Quiz
                          </DialogTitle>

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
                                🏫 <strong>Khóa học:</strong>{" "}
                                {course?.title || "Không rõ khóa học"}
                              </p>
                              <p>
                                📘 <strong>Bài học:</strong>{" "}
                                {lesson?.title || "Không rõ bài học"}
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

                      {/* Chi tiết */}
                      <Button
                        variant="outline"
                        className="border-2 border-blue-500 text-blue-600 font-semibold rounded-xl
                        px-5 py-2 hover:bg-blue-500 hover:text-white 
                        transition-all duration-300 shadow-sm hover:shadow-md flex items-center gap-2"
                        onClick={() =>
                          router.push(`/instructor/quizzes/${quiz.id}`)
                        }
                      >
                        <Eye size={18} />
                        Chi Tiết
                      </Button>
                      {/* 🗑️ Xóa */}
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
    </div>
  );
};

export default Quizzes;
