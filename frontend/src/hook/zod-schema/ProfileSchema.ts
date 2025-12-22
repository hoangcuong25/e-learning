import { z } from "zod";

// 🧩 Schema validation bằng Zod
export const profileSchema = z.object({
  fullname: z.string().min(1, "Họ và tên không được để trống"),
  phone: z
    .string()
    .min(10, "Số điện thoại phải có ít nhất 10 số")
    .regex(/^[0-9]+$/, "Số điện thoại chỉ được chứa số"),
  address: z.string().min(1, "Địa chỉ không được để trống"),
  dob: z
    .string()
    .min(1, "Vui lòng chọn ngày sinh")
    .refine(
      (value) => {
        const selectedDate = new Date(value);
        const today = new Date();
        return selectedDate < today;
      },
      { message: "Ngày sinh không hợp lệ" }
    ),
  gender: z.string().min(1, "Vui lòng chọn giới tính"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;
