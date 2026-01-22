import React from "react";
import Payment from "./Payment";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thanh toán khóa học | Học lập trình trực tuyến",
  description:
    "Trang thanh toán khóa học của bạn. Hoàn tất thanh toán để bắt đầu học ngay hôm nay!",
  openGraph: {
    title: "Thanh toán khóa học | Học lập trình trực tuyến",
    description:
      "Hoàn tất thanh toán để truy cập toàn bộ nội dung khóa học chất lượng cao.",
    url: "https://your-domain.com/payment",
    siteName: "Online Learning Platform",
    images: [
      {
        url: "/images/payment-banner.jpg",
        width: 1200,
        height: 630,
        alt: "Thanh toán khóa học",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
};

const Page = () => {
  return <Payment />;
};

export default Page;
