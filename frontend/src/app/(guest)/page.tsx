import React from "react";
import Home from "./Home";

export const metadata = {
  title: "EduSmart - Nền tảng học trực tuyến hàng đầu",
  description:
    "EduSmart giúp bạn học tập mọi lúc, mọi nơi với hàng trăm khóa học chất lượng cao từ các giảng viên hàng đầu Việt Nam.",
  keywords: [
    "EduSmart",
    "học trực tuyến",
    "khóa học online",
    "giảng viên",
    "elearning",
    "lập trình web",
  ],
  openGraph: {
    title: "EduSmart - Học tập mọi lúc, phát triển không ngừng",
    description:
      "Truy cập hàng trăm khóa học chất lượng từ các giảng viên hàng đầu. Học online, nhận chứng chỉ uy tín và phát triển sự nghiệp cùng EduSmart.",
    url: "https://edusmart.vn", // Thay bằng domain thực của bạn
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png", // đường dẫn ảnh banner trong public/
        width: 1200,
        height: 630,
        alt: "EduSmart e-learning banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"), // Đặt domain của bạn ở đây
};

export default async function Page() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}course/popular`,
    {
      next: { revalidate: 60 },
    }
  );

  const popularCourses = await res.json();

  return <Home popularCourses={popularCourses.data} />;
}
