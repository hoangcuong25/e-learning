import { z } from "zod";

// 🟢 Schema validate cho form tạo khóa học
export const courseSchema = z.object({
  title: z.string().min(3, "Tên khóa học phải có ít nhất 3 ký tự"),
  description: z.string().min(10, "Mô tả phải có ít nhất 10 ký tự"),
  price: z.number().min(1000, "Giá tối thiểu là 1.000 VNĐ"),
  instructorId: z.number().optional(),
  thumbnail: z.instanceof(File).optional(),
});

export type CourseFormData = z.infer<typeof courseSchema>;
