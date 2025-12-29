import React from "react";
import type { Metadata } from "next";
import MyLearningPage from "./MyLearning";

// Định nghĩa Metadata
export const metadata: Metadata = {
  title: "Khóa học của tôi | Học Lập Trình",
};

const page = () => {
  return <MyLearningPage />;
};

export default page;
