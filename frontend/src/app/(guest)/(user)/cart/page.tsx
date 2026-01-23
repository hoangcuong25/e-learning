import React from "react";
import MyCartPage from "./Cart";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Giỏ hàng của tôi | Học Lập Trình Online",
  description:
    "Xem danh sách khóa học bạn đã thêm vào giỏ hàng và tiến hành thanh toán để bắt đầu học ngay hôm nay.",
  openGraph: {
    title: "Giỏ hàng của tôi | Học Lập Trình Online",
    description:
      "Xem danh sách khóa học bạn đã thêm vào giỏ hàng và tiến hành thanh toán để bắt đầu học ngay hôm nay.",
    url: "https://yourdomain.com/cart",
    siteName: "Học Lập Trình Online",
    type: "website",
    images: [
      {
        url: "/images/cart-og.jpg",
        width: 1200,
        height: 630,
        alt: "Giỏ hàng khóa học",
      },
    ],
  },
};

const page = () => {
  return <MyCartPage />;
};

export default page;
