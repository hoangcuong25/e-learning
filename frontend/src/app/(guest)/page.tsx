import React from "react";
import type { Metadata } from "next";
import Home from "./Home";

export const metadata: Metadata = {
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
      "Truy cập hàng trăm khóa học chất lượng từ các giảng viên hàng đầu.",
    url: "https://edusmart.vn",
    siteName: "EduSmart",
    images: [
      {
        url: "/elearning-banner.png",
        width: 1200,
        height: 630,
        alt: "EduSmart e-learning banner",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  authors: [{ name: "EduSmart Team" }],
  metadataBase: new URL("https://edusmart.vn"),
};

export default async function Page() {
  return <Home />;
}
