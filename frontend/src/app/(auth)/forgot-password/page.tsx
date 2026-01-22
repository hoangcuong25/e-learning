import React from "react";
import ForgotPassword from "./ForgotPassword";

// 🧠 Thêm metadata cho trang Forgot Password
export const metadata = {
  title: "Quên mật khẩu | E-Learning Platform",
  description:
    "Đặt lại mật khẩu tài khoản E-Learning của bạn một cách nhanh chóng và an toàn. Nhận mã OTP qua email và tạo mật khẩu mới dễ dàng.",
  openGraph: {
    title: "Quên mật khẩu | E-Learning Platform",
    description:
      "Trang đặt lại mật khẩu giúp bạn khôi phục tài khoản E-Learning nhanh chóng và bảo mật.",
    url: "https://your-domain.com/forgot-password",
    siteName: "E-Learning Platform",
    images: [
      {
        url: "/elearning-banner.png",
        width: 1200,
        height: 630,
        alt: "E-Learning Forgot Password Page",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // Đặt domain của bạn ở đây
};

const page = () => {
  return <ForgotPassword />;
};

export default page;
