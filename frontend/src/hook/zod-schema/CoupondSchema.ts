import { z } from "zod";

export const couponSchema = z.object({
  code: z.string().min(3, "Mã coupon phải có ít nhất 3 ký tự"),
  percentage: z
    .string()
    .refine(
      (val) => !isNaN(Number(val)) && Number(val) > 0 && Number(val) <= 100,
      {
        message: "Phần trăm giảm phải từ 1 đến 100",
      }
    ),
  maxUsage: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(Number(val)) && Number(val) > 0), {
      message: "Số lần sử dụng phải là số dương",
    }),
  startsAt: z.string().optional(),
  endsAt: z.string().optional(),
  target: z.enum(["ALL", "COURSE", "SPECIALIZATION"]),
  courseId: z.string().optional(),
  specializationId: z.string().optional(),
});

export type CouponFormData = z.infer<typeof couponSchema>;
