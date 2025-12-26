"use client";

import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import { createDiscount } from "@/store/discount.slice";
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
      discountPercent: 0,
      startDate: "",
      endDate: "",
    },
  });

  const onSubmit = async (data: DiscountFormType) => {
    try {
      await dispatch(createDiscount(data)).unwrap();
      toast.success("Tạo chiến dịch thành công!");
      reset();
    } catch {
      toast.error("Tạo thất bại, vui lòng thử lại.");
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

          {/* Phần trăm giảm */}
          <div>
            <Label htmlFor="discountPercent">Phần trăm giảm giá (%)</Label>
            <Input
              id="discountPercent"
              type="number"
              placeholder="VD: 30"
              {...register("discountPercent", { valueAsNumber: true })}
            />
            {errors.discountPercent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountPercent.message}
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
