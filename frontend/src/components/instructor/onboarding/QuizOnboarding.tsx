"use client";

import React, { useEffect } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const steps = [
  {
    selector: ".step-quiz-header",
    content:
      "Đây là khu vực quản lý toàn bộ các quiz mà bạn đã tạo cho các bài học của mình.",
  },
  {
    selector: ".step-create-quiz",
    content:
      "Nhấn vào đây để tạo quiz mới. Bạn có thể gắn quiz với bài học trong khóa học cụ thể.",
  },
  {
    selector: ".step-quiz-list",
    content:
      "Danh sách toàn bộ quiz bạn đã tạo. Tại đây bạn có thể xem, tạo câu hỏi, sửa tiêu đề hoặc xóa quiz.",
  },
];

function AutoStartTour() {
  const { setIsOpen } = useTour();

  useEffect(() => {
    // const hasSeenTour = localStorage.getItem("hasSeenCourseTour");
    // if (!hasSeenTour) {
    //   setIsOpen(true);
    //   localStorage.setItem("hasSeenCourseTour", "true");
    // }

    setIsOpen(true);
  }, [setIsOpen]);

  return null;
}

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

export default function QuizOnboarding() {
  return (
    <TourProvider steps={steps}>
      <AutoStartTour />
      <RestartTourButton />
    </TourProvider>
  );
}
