import { z } from "zod";

// 🟢 Schema validate cho form tạo khóa học
export const courseSchema = z.object({
  title: z.string().min(3, "Tên khóa học phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  price: z.number().optional(),
  type: z.string().optional(),
  instructorId: z.number().optional(),
  thumbnail: z.instanceof(File).optional(),
  specializationIds: z
    .array(z.number())
    .min(1, "Cần chọn ít nhất 1 chuyên ngành"),
});

export type CourseFormData = z.infer<typeof courseSchema>;
