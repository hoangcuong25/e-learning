import { z } from "zod";

export const lessonSchema = z.object({
  title: z.string().min(3, "Tiêu đề phải có ít nhất 3 ký tự"),
  content: z.string().min(3, "Nội dung phải có ít nhất 3 ký tự"),
  orderIndex: z
    .number()
    .int()
    .min(0, "Thứ tự phải là số không âm")
    .default(0)
    .optional(),
  video: z.any().optional(),
});

export type LessonFormData = z.infer<typeof lessonSchema>;
