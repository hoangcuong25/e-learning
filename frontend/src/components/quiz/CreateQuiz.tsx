"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { toast } from "sonner";

import { quizSchema, QuizFormData } from "@/hook/zod-schema/QuizSchema";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { fetchCoursesByInstructor } from "@/store/slice/course/coursesSlice";
import {
  clearQuizState,
  createQuiz,
  fetchInstructorQuizzes,
} from "@/store/slice/course/quizSlice";

const QuizForm = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { instructorCourses, loading: courseLoading } = useSelector(
    (state: RootState) => state.courses
  );
  const {
    successMessage,
    error,
    loading: quizLoading,
  } = useSelector((state: RootState) => state.quiz);

  const [chapters, setChapters] = useState<ChapterType[]>([]);
  const [lessons, setLessons] = useState<LessonType[]>([]);

  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      courseId: 0,
      chapterId: 0,
      lessonId: 0,
    },
  });

  const watchCourseId = form.watch("courseId");
  const watchChapterId = form.watch("chapterId");

  // Load courses
  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  // Khi chọn course → load chapters
  useEffect(() => {
    const selectedCourse = instructorCourses.find(
      (c) => c.id === watchCourseId
    );
    setChapters(selectedCourse?.chapter || []);
    setLessons([]);
    form.setValue("chapterId", 0);
    form.setValue("lessonId", 0);
  }, [watchCourseId, instructorCourses, form]);

  // Khi chọn chapter → load lessons
  useEffect(() => {
    const chapter = chapters.find((ch) => ch.id === watchChapterId);
    setLessons(chapter?.lessons || []);
    form.setValue("lessonId", 0);
  }, [watchChapterId, chapters, form]);

  // Toast Message
  useEffect(() => {
    if (successMessage) {
      toast.success(successMessage);
      form.reset();
      dispatch(clearQuizState());
    }
    if (error) {
      toast.error(error);
      dispatch(clearQuizState());
    }
  }, [successMessage, error, dispatch, form]);

  const onSubmit = async (values: QuizFormData) => {
    try {
      await dispatch(createQuiz(values)).unwrap();
      await dispatch(fetchInstructorQuizzes()).unwrap();
      toast.success("Tạo quiz thành công");
    } catch {
      toast.error("Có lỗi xảy ra");
    }
  };

  return (
    <div className="w-full space-y-8 py-4">
      <div className="space-y-2">
        <h2 className="text-3xl font-extrabold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Tạo Quiz Mới
        </h2>
        <p className="text-slate-500 text-sm">
          Thiết lập tiêu đề và vị trí bài kiểm tra trong khóa học của bạn.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 w-full"
        >
          {/* Chọn khóa học */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Chọn khóa học</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all">
                      <SelectValue placeholder="Chọn khóa học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {instructorCourses.map((course) => (
                      <SelectItem key={course.id} value={String(course.id)}>
                        {course.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chọn Chapter */}
          <FormField
            control={form.control}
            name="chapterId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">
                  Chọn chương (Chapter)
                </FormLabel>
                <Select
                  disabled={!watchCourseId}
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all">
                      <SelectValue placeholder="Chọn chương" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {chapters.map((ch) => (
                      <SelectItem key={ch.id} value={String(ch.id)}>
                        {ch.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Chọn Bài học */}
          <FormField
            control={form.control}
            name="lessonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Chọn bài học</FormLabel>
                <Select
                  disabled={!watchChapterId}
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                >
                  <FormControl>
                    <SelectTrigger className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all">
                      <SelectValue placeholder="Chọn bài học" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lessons.map((lesson) => (
                      <SelectItem key={lesson.id} value={String(lesson.id)}>
                        {lesson.title}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Tiêu đề Quiz */}
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Tiêu đề Quiz</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Nhập tiêu đề quiz (VD: Kiểm tra kiến thức chương 1)"
                    {...field}
                    className="bg-slate-50 border-slate-200 rounded-xl h-12 focus:ring-2 focus:ring-blue-500 transition-all"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={quizLoading || courseLoading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-6 rounded-2xl shadow-lg shadow-blue-200 transition-all active:scale-95 disabled:opacity-50"
          >
            {quizLoading ? "Đang xử lý..." : "Xác nhận tạo Quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuizForm;
