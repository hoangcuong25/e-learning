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
import { Textarea } from "@/components/ui/textarea";
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
import { fetchCoursesByInstructor } from "@/store/coursesSlice";
import { clearQuizState, createQuiz } from "@/store/quizSlice";

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

  const [lessons, setLessons] = useState<LessonType[]>([]);
  const form = useForm<QuizFormData>({
    resolver: zodResolver(quizSchema),
    defaultValues: {
      title: "",
      courseId: 0,
      lessonId: 0,
    },
  });

  const selectedCourseId = form.watch("courseId");

  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
  }, [dispatch]);

  useEffect(() => {
    const selectedCourse = instructorCourses.find(
      (c) => c.id === selectedCourseId
    );
    setLessons(selectedCourse?.lessons || []);
  }, [selectedCourseId, instructorCourses]);

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

      toast.success("Tạo quiz thành công");
    } catch {
      toast.error("Có lỗi đã xảy ra");
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
          {/* Khóa học */}
          <FormField
            control={form.control}
            name="courseId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Chọn khóa học</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                  disabled={courseLoading}
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

          {/* Bài học */}
          <FormField
            control={form.control}
            name="lessonId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold">Chọn bài học</FormLabel>
                <Select
                  onValueChange={(val) => field.onChange(Number(val))}
                  value={field.value ? String(field.value) : ""}
                  disabled={!selectedCourseId}
                >
                  <FormControl>
                    <SelectTrigger className="bg-gray-50">
                      <SelectValue
                        placeholder={
                          selectedCourseId
                            ? "Chọn bài học"
                            : "Hãy chọn khóa học trước"
                        }
                      />
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

          {/* Tiêu đề quiz */}
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

          {/* Submit button */}
          <Button
            type="submit"
            disabled={quizLoading || courseLoading}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 rounded-xl shadow-md hover:opacity-90 transition-all"
          >
            {quizLoading ? "Đang tạo..." : "Tạo Quiz"}
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default QuizForm;
