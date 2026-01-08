"use client";

import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  updateDiscount,
  fetchDiscountById,
} from "@/store/slice/discountCampaign.slice";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  DiscountFormType,
  discountSchema,
} from "@/hook/zod-schema/DiscountSchema";

interface DiscountUpdateDialogProps {
  discount: any;
  onUpdated?: () => void;
}

export default function DiscountUpdateDialog({
  discount,
  onUpdated,
}: DiscountUpdateDialogProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  // react-hook-form setup
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<DiscountFormType>({
    resolver: zodResolver(discountSchema),
    defaultValues: {
      title: "",
      description: "",
      discountPercent: 0,
      startDate: "",
      endDate: "",
    },
  });

  // Gán giá trị mặc định khi mở dialog
  useEffect(() => {
    if (discount) {
      reset({
        title: discount.title || "",
        description: discount.description || "",
        discountPercent: discount.percentage || 0,
        startDate: discount.startsAt
          ? new Date(discount.startsAt).toISOString().split("T")[0]
          : "",
        endDate: discount.endsAt
          ? new Date(discount.endsAt).toISOString().split("T")[0]
          : "",
      });
    }
  }, [discount, reset]);

  // Submit handler
  const onSubmit = async (data: DiscountFormType) => {
    try {
      await dispatch(
        updateDiscount({
          id: discount.id,
          payload: {
            title: data.title,
            description: data.description,
            percentage: data.discountPercent,
            startsAt: new Date(data.startDate),
            endsAt: new Date(data.endDate),
          },
        })
      ).unwrap();

      toast.success("Cập nhật chiến dịch thành công!");
      setOpen(false);
      onUpdated?.();
      dispatch(fetchDiscountById(discount.id));
    } catch (err) {
      toast.error("Không thể cập nhật chiến dịch");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="border-blue-400 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
        >
          Cập nhật
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Cập nhật chiến dịch giảm giá</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin của chiến dịch <strong>{discount.title}</strong>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          {/* Tiêu đề */}
          <div>
            <Label>Tiêu đề</Label>
            <Input
              {...register("title")}
              placeholder="Nhập tiêu đề chiến dịch"
            />
            {errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {errors.title.message}
              </p>
            )}
          </div>

          {/* Mô tả */}
          <div>
            <Label>Mô tả</Label>
            <Textarea
              {...register("description")}
              placeholder="Nhập mô tả chiến dịch"
              rows={3}
            />
            {errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* Phần trăm */}
          <div>
            <Label>Phần trăm giảm (%)</Label>
            <Input
              type="number"
              {...register("discountPercent", { valueAsNumber: true })}
              placeholder="Ví dụ: 20"
              min={1}
              max={100}
            />
            {errors.discountPercent && (
              <p className="text-red-500 text-sm mt-1">
                {errors.discountPercent.message}
              </p>
            )}
          </div>

          {/* Ngày bắt đầu / kết thúc */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Ngày bắt đầu</Label>
              <div className="relative">
                <Input type="date" {...register("startDate")} />
                <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.startDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.startDate.message}
                </p>
              )}
            </div>

            <div>
              <Label>Ngày kết thúc</Label>
              <div className="relative">
                <Input type="date" {...register("endDate")} />
                <Calendar className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
              </div>
              {errors.endDate && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.endDate.message}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button
              variant="outline"
              type="button"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
