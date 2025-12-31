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

import { fetchCoursesByInstructor } from "@/store/slice/coursesSlice";
import {
  clearQuizState,
  createQuiz,
  fetchInstructorQuizzes,
} from "@/store/slice/quizSlice";

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
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 bg-clip-text text-transparent">
        Tạo Quiz Mới
      </h2>

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
                    <SelectTrigger className="bg-gray-50">
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
                    <SelectTrigger className="bg-gray-50">
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
                    <SelectTrigger className="bg-gray-50">
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
                    placeholder="Nhập tiêu đề quiz"
                    {...field}
                    className="bg-gray-50"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={quizLoading || courseLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl shadow-md"
          >
            {quizLoading ? "Đang tạo..." : "Tạo Quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuizForm;
