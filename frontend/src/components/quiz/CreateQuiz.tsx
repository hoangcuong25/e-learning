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
      toast.success("Hệ thống đã ghi nhận bài kiểm tra mới!");
    } catch {
      toast.error("Không thể khởi tạo bài kiểm tra.");
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto space-y-12 py-8 px-4">
      <div className="space-y-4 text-center md:text-left">
        <h2 className="text-4xl font-black text-slate-900 tracking-tight leading-tight">
          Thiết lập <span className="text-indigo-600">Bài kiểm tra</span>
        </h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
          Xây dựng cấu trúc & vị trí đánh giá kiến thức
        </p>
      </div>

      <div className="bg-white rounded-[2.5rem] border-2 border-slate-50 p-8 md:p-12 shadow-2xl shadow-indigo-100/20 shadow-slate-200/20">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-10"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Chọn khóa học */}
              <FormField
                control={form.control}
                name="courseId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Khóa học mục tiêu</FormLabel>
                    <Select
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-16 bg-slate-50/50 border-transparent focus:bg-white focus:border-indigo-200 rounded-[1.5rem] transition-all font-bold px-6 text-slate-900 shadow-sm outline-none">
                          <SelectValue placeholder="Chọn khóa học của bạn" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white/80 backdrop-blur-xl">
                        {instructorCourses.map((course) => (
                          <SelectItem key={course.id} value={String(course.id)} className="rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 py-3">
                            {course.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-4" />
                  </FormItem>
                )}
              />

              {/* Chọn Chapter */}
              <FormField
                control={form.control}
                name="chapterId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Chương mục</FormLabel>
                    <Select
                      disabled={!watchCourseId}
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-16 bg-slate-50/50 border-transparent hover:border-slate-100 focus:bg-white focus:border-indigo-200 rounded-[1.5rem] transition-all font-bold px-6 text-slate-900 shadow-sm outline-none disabled:opacity-50">
                          <SelectValue placeholder="Chọn chương bối cảnh" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white/80 backdrop-blur-xl">
                        {chapters.map((ch) => (
                          <SelectItem key={ch.id} value={String(ch.id)} className="rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 py-3">
                            {ch.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-4" />
                  </FormItem>
                )}
              />

              {/* Chọn Bài học */}
              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Bài học liên quan</FormLabel>
                    <Select
                      disabled={!watchChapterId}
                      onValueChange={(val) => field.onChange(Number(val))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="h-16 bg-slate-50/50 border-transparent hover:border-slate-100 focus:bg-white focus:border-indigo-200 rounded-[1.5rem] transition-all font-bold px-6 text-slate-900 shadow-sm outline-none disabled:opacity-50">
                          <SelectValue placeholder="Gắn vào bài học cụ thể" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="rounded-2xl border-none shadow-2xl p-2 bg-white/80 backdrop-blur-xl">
                        {lessons.map((lesson) => (
                          <SelectItem key={lesson.id} value={String(lesson.id)} className="rounded-xl font-bold text-slate-600 focus:bg-indigo-50 focus:text-indigo-600 py-3">
                            {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-4" />
                  </FormItem>
                )}
              />

              {/* Tiêu đề Quiz */}
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4">Tên bài kiểm tra</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Ví dụ: Kiểm tra kiến thức Flexbox"
                        {...field}
                        className="h-16 bg-slate-50/50 border-transparent focus:bg-white focus:border-indigo-200 rounded-[1.5rem] transition-all font-bold px-6 text-slate-900 shadow-sm outline-none"
                      />
                    </FormControl>
                    <FormMessage className="text-[10px] uppercase font-black tracking-widest text-rose-500 ml-4" />
                  </FormItem>
                )}
              />
            </div>

            <div className="pt-8 flex justify-center">
              <Button
                type="submit"
                disabled={quizLoading || courseLoading}
                className="h-20 px-16 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black uppercase tracking-widest rounded-[2rem] shadow-2xl shadow-indigo-200 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
              >
                {quizLoading ? "Đang xử lý hồ sơ..." : "Khởi tạo Bài kiểm tra"}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default QuizForm;
