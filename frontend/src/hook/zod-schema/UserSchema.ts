import { z } from "zod";

// Schema validate với Zod
export const registerSchema = z
    .object({
        fullname: z.string().min(2, "Họ và tên phải có ít nhất 2 ký tự"),
        email: z.string().email("Email không hợp lệ"),
        password1: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
        password2: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
    })
    .refine((data) => data.password1 === data.password2, {
        message: "Mật khẩu không khớp",
        path: ["password2"], // báo lỗi ở field password2
    });

export type RegisterFormData = z.infer<typeof registerSchema>;

export const loginSchema = z.object({
    email: z.string().email("Email không hợp lệ"),
    password: z.string().min(6, "Mật khẩu phải ít nhất 6 ký tự"),
});

export type LoginFormData = z.infer<typeof loginSchema>;