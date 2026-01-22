import React from "react";
import InstructorStatusPage from "./Status";

// 🧭 Metadata SEO cho trang
export const metadata = {
  title: "Trạng thái giảng viên | EduSmart",
  description:
    "Kiểm tra trạng thái đơn đăng ký giảng viên của bạn trên EduSmart. Xem kết quả phê duyệt hoặc gửi lại đơn đăng ký nhanh chóng.",
  keywords: [
    "EduSmart",
    "trạng thái giảng viên",
    "đơn đăng ký giảng viên",
    "phê duyệt tài khoản",
    "trở thành giảng viên",
    "dạy học online",
  ],
  openGraph: {
    title: "Trạng thái giảng viên | EduSmart",
    description:
      "Theo dõi tiến trình phê duyệt đơn đăng ký giảng viên của bạn trên nền tảng EduSmart.",
    url: "https://edusmart.vn/instructor/status", // 🟦 Thay domain thật của bạn
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png", // Ảnh trong thư mục /public
        width: 1200,
        height: 630,
        alt: "EduSmart Instructor Status Banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // ⚠️ Thay domain thực tế của bạn
};

const Page = () => {
  return <InstructorStatusPage />;
};

export default Page;
