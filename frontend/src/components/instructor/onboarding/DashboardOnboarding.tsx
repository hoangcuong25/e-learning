"use client";

import React, { useEffect } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const steps = [
  { selector: ".step-dashboard", content: "Đây là bảng điều khiển tổng quan." },
  { selector: ".step-stats", content: "Phần thống kê doanh thu theo tháng." },
  { selector: ".step-courses", content: "Các khóa học mới tạo gần đây." },
];

function AutoStartTour() {
  const { setIsOpen } = useTour();

  useEffect(() => {
    // const hasSeenTour = localStorage.getItem("hasSeenDashboardTour");
    // if (!hasSeenTour) {
    //   setIsOpen(true);
    //   localStorage.setItem("hasSeenDashboardTour", "true");
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
      className="flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600"
    >
      <HelpCircle className="w-4 h-4" />
      Xem hướng dẫn
    </Button>
  );
}

export default function DashboardOnboarding() {
  return (
    <TourProvider steps={steps}>
      <AutoStartTour />
      <RestartTourButton />
    </TourProvider>
  );
}
