"use client";

import React, { useEffect } from "react";
import { TourProvider, useTour } from "@reactour/tour";
import { Button } from "@/components/ui/button";
import { HelpCircle } from "lucide-react";

const steps = [
  {
    selector: ".step-coupon-header",
    content: "Đây là trang quản lí coupons của bạn.",
  },
  {
    selector: ".step-create-coupon",
    content: "Nhấn vào đây để tạo mã giảm giá mới cho khóa học.",
  },
  {
    selector: ".step-coupon-list",
    content:
      "Danh sách các coupon bạn đã tạo sẽ hiển thị tại đây, kèm trạng thái, thời gian hết hạn và khóa học áp dụng. Bạn cũng có thể chỉnh sửa hoặc xóa từng coupon bằng các nút hành động.",
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

export default function CouponOnboarding() {
  return (
    <TourProvider steps={steps}>
      <RestartTourButton />
    </TourProvider>
  );
}
