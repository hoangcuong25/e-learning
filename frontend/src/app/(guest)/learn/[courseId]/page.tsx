import React from "react";
import Learn from "./Learn";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Học tập | Học lập trình trực tuyến",
  description:
    "Trang học tập cá nhân, nơi bạn có thể theo dõi tiến trình và hoàn thành các bài học.",
};

const Page = () => {
  // 2. Component chính hiển thị UI
  return <Learn />;
};

export default Page;
