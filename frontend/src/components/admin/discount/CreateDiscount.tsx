"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createDiscount, fetchAllDiscounts } from "@/store/discount.slice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  DiscountFormType,
  discountSchema,
} from "@/hook/zod-schema/DiscountSchema";
import { toast } from "sonner";

export default function CreateDiscountForm() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DiscountFormType>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      title: "",
      description: "",
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: DiscountFormType) => {
    try {
      // Chuẩn hóa dữ liệu
      const payload = {
        title: data.title,
        description: data.description?.trim() || undefined,
        startsAt: new Date(data.startDate).toISOString(),
        endsAt: new Date(data.endDate).toISOString(),
      };

      await dispatch(createDiscount(payload)).unwrap();
      await dispatch(fetchAllDiscounts({ page: 1 }));

      toast.success("Tạo chiến dịch thành công!");
      reset();
    } catch (error: any) {
      // Xử lý thông báo lỗi chi tiết
      let message = "Tạo thất bại, vui lòng thử lại.";

      const backendError = error;

      if (backendError) {
        const msg = backendError.message || backendError.errors || backendError;

        if (Array.isArray(msg) && msg.length > 0) {
          message = msg[0]; // Lấy lỗi đầu tiên trong mảng
        } else if (typeof msg === "string") {
          message = msg; // Nếu là chuỗi
        }
      }

      toast.error(message);
    }
  };

  return (
    <Card className="bg-white rounded-2xl shadow-sm border border-indigo-100 mt-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-indigo-700">
          Nhập thông tin chiến dịch
        </CardTitle>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Tên chiến dịch */}
          <div>
            <Label htmlFor="title">Tên chiến dịch</Label>
            <Input
              id="title"
              placeholder="VD: Giảm giá mùa tựu trường"
              {...register("title")}
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <Label htmlFor="description">Mô tả (tuỳ chọn)</Label>
            {/* Dùng textarea cho mô tả */}
            <textarea
              id="description"
              placeholder="Mô tả ngắn về chiến dịch, điều kiện áp dụng..."
              className="w-full min-h-[88px] resize-y rounded-md border border-gray-200 p-2"
              {...register("description")}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Ngày bắt đầu & kết thúc */}
          <div className="flex gap-4">
            <div className="flex-1">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input id="startDate" type="date" {...register("startDate")} />
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>
            <div className="flex-1">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input id="endDate" type="date" {...register("endDate")} />
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white"
          >
            {isSubmitting ? "Đang lưu..." : "Lưu chiến dịch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
