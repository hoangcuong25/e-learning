import { z } from "zod";

export const discountSchema = z
  .object({
    title: z.string().min(3, "Tên chiến dịch phải có ít nhất 3 ký tự"),
    description: z.string().max(1000, "Mô tả tối đa 1000 ký tự").optional(), // tuỳ chọn
    discountPercent: z.number().min(1, "Tối thiểu 1%").max(100, "Tối đa 100%"),
    startDate: z.string().nonempty("Vui lòng chọn ngày bắt đầu"),
    endDate: z.string().nonempty("Vui lòng chọn ngày kết thúc"),
  })
  .refine((data) => new Date(data.startDate) <= new Date(data.endDate), {
    message: "Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc",
    path: ["endDate"],
  });

export type DiscountFormType = z.infer<typeof discountSchema>;
