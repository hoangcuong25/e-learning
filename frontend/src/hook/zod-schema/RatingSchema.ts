import { z } from "zod";

export const RateSchema = z.object({
  rating: z.number().min(1, "Điểm phải từ 1").max(5, "Điểm tối đa 5"),
  text: z
    .string()
    .min(3, "Nội dung đánh giá phải có ít nhất 3 ký tự.")
    .max(255, "Nội dung không được vượt quá 255 ký tự."),
});

export type RateFormValues = z.infer<typeof RateSchema>;
