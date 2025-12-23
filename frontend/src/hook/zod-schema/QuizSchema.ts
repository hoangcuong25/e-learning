import { z } from "zod";

// 🧩 Zod schema cho form Quiz
export const quizSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters"),
  courseId: z.number("Vui lòng chọn khóa học"),
  lessonId: z.number("Vui lòng chọn bài học"),
});

export type QuizFormData = z.infer<typeof quizSchema>;
