"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, PlusCircle } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteQuiz, fetchAllQuizzes } from "@/store/quizSlice";
import { fetchCoursesByInstructor } from "@/store/coursesSlice";
import LoadingScreen from "@/components/LoadingScreen";
import QuizForm from "@/components/quiz/CreateQuiz";

const Quizzes = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading } = useSelector((state: RootState) => state.quiz);
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses
  );

  // 🔹 Load dữ liệu khi vào trang
  useEffect(() => {
    dispatch(fetchAllQuizzes());
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  // 🗑️ Xóa quiz
  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa quiz này không?")) return;
    try {
      await dispatch(deleteQuiz(id)).unwrap();
      toast.success("Đã xóa quiz thành công!");
    } catch (err) {
      toast.error("Xóa quiz thất bại!");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Quản lý Quiz</h1>

        {/* Nút mở form tạo quiz */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600">
              <PlusCircle className="w-5 h-5" /> Tạo Quiz Mới
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl w-full">
            <DialogTitle></DialogTitle>
            <QuizForm />
          </DialogContent>
        </Dialog>
      </div>

      {/* Danh sách quiz */}
      <Card>
        <CardHeader>
          <CardTitle>Danh sách Quiz ({quizzes.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p>Đang tải dữ liệu...</p>
          ) : quizzes.length === 0 ? (
            <p className="text-gray-500 italic">Chưa có quiz nào được tạo.</p>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition"
                >
                  <div>
                    <h3 className="font-semibold">{quiz.title}</h3>
                    <p className="text-xs text-gray-400 mt-1">
                      🏫{" "}
                      {
                        instructorCourses.find((c) =>
                          c.lessons?.some((l) => l.id === quiz.lessonId)
                        )?.title
                      }{" "}
                      • 📘{" "}
                      {
                        instructorCourses
                          .flatMap((c) => c.lessons || [])
                          .find((l) => l.id === quiz.lessonId)?.title
                      }
                    </p>
                  </div>
                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(quiz.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Quizzes;
