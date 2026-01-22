import React from "react";
import CoursesPage from "./Courses";

// 🧭 Metadata SEO
export const metadata = {
  title: "Danh sách khóa học | EduSmart",
  description:
    "Khám phá hàng trăm khóa học trực tuyến chất lượng cao tại EduSmart. Học lập trình, thiết kế, kinh doanh, marketing và nhiều lĩnh vực khác với giảng viên hàng đầu.",
  keywords: [
    "EduSmart",
    "khóa học trực tuyến",
    "học online",
    "khóa học lập trình",
    "khóa học thiết kế",
    "khóa học marketing",
    "học online Việt Nam",
  ],
  openGraph: {
    title: "Danh sách khóa học | EduSmart",
    description:
      "Học mọi lúc, mọi nơi với hàng trăm khóa học hấp dẫn trên EduSmart. Chọn lĩnh vực bạn yêu thích và bắt đầu ngay hôm nay!",
    url: "https://edusmart.vn/courses", // ⚠️ Thay domain thực tế của bạn
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png",
        width: 1200,
        height: 630,
        alt: "EduSmart Courses Banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // ⚠️ Cập nhật domain thật của bạn
};

const Page = () => {
  return <CoursesPage />;
};

export default Page;
