"use client";

import React, { useEffect } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const steps = [
  {
    selector: ".step-course-header",
    content: "Đây là trang quản lý tất cả khóa học mà bạn đã tạo.",
  },
  {
    selector: ".step-create-course",
    content: "Nhấn vào đây để tạo khóa học mới của bạn.",
  },
  {
    selector: ".step-course-list",
    content: `Danh sách các khóa học của bạn hiển thị ở đây. Mỗi khóa học có các nút hành động để xem chi tiết, chỉnh sửa hoặc xóa. Bạn có thể tạo chương và bài giảng ở phần "xem chi tiết"`,
  },
];

function RestartTourButton() {
  const { setIsOpen } = useTour();
  return (
    <Button
      onClick={() => setIsOpen(true)}
      variant="ghost"
      size="sm"
      className="flex items-center gap-2 text-gray-600 hover:text-blue-600"
    >
      <HelpCircle className="w-4 h-4" />
      Xem hướng dẫn
    </Button>
  );
}

export default function CourseOnboarding() {
  return (
    <TourProvider steps={steps}>
      <RestartTourButton />
    </TourProvider>
  );
}
