import React from "react";
import CourseDetail from "./CourseDetail";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Chi tiết khóa học | Học Lập Trình",
  description:
    "Khám phá chi tiết khóa học, nội dung, giảng viên và mức giá hấp dẫn. Cùng bắt đầu hành trình học lập trình ngay hôm nay!",
  openGraph: {
    title: "Chi tiết khóa học | Học Lập Trình",
    description:
      "Xem thông tin khóa học, giảng viên và nội dung chi tiết. Nâng cao kỹ năng lập trình của bạn ngay hôm nay!",
    images: [
      {
        url: "/images/default-course.jpg",
        width: 1200,
        height: 630,
        alt: "Course thumbnail",
      },
    ],
    type: "article",
  },
};

const page = () => {
  return <CourseDetail />;
};

export default page;
