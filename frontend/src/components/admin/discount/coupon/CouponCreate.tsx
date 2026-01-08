"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { PlusCircle } from "lucide-react";
import { createCouponDiscountByAdmin } from "@/store/slice/couponSlice";
import { fetchAllSpecializations } from "@/store/slice/specializationSlice";
import { CouponFormData, couponSchema } from "@/hook/zod-schema/CoupondSchema";
import { fetchDiscountById } from "@/store/slice/discountCampaign.slice";

export default function CouponCreateDialog({
  discount,
}: {
  discount: DiscountCampaignType;
}) {
  const dispatch = useDispatch<AppDispatch>();
  const [open, setOpen] = useState(false);

  const { specializations } = useSelector(
    (state: RootState) => state.specialization
  );

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CouponFormData>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      code: "",
      percentage: "",
      maxUsage: "",
      expiresAt: "",
      target: "ALL",
      specializationId: "",
    },
  });

  const target = watch("target");

  // Gán expiresAt = discount.endsAt khi dialog mở
  useEffect(() => {
    if (open && discount?.endsAt) {
      setValue("expiresAt", discount.endsAt.slice(0, 16)); // format 'YYYY-MM-DDTHH:mm'
    }
  }, [open, discount, setValue]);

  // Fetch dữ liệu
  useEffect(() => {
    if (open) {
      dispatch(fetchAllSpecializations());
    }
  }, [open, dispatch]);

  // Submit form
  const onSubmit = async (data: CouponFormData) => {
    try {
      await dispatch(
        createCouponDiscountByAdmin({
          code: data.code.toUpperCase(),
          percentage: Number(data.percentage),
          maxUsage: data.maxUsage ? Number(data.maxUsage) : undefined,
          expiresAt: new Date(discount.endsAt).toISOString(),
          target: data.target,
          specializationId:
            data.target === "SPECIALIZATION"
              ? Number(data.specializationId)
              : undefined,
          discountCampaignId: discount.id, // liên kết bắt buộc với discount
        })
      ).unwrap();

      await dispatch(fetchDiscountById(Number(discount.id)));

      toast.success("Tạo coupon thành công!");
      reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.message || "Tạo coupon thất bại!");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white">
          <PlusCircle className="w-4 h-4 mr-1" /> Tạo Coupon
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo Coupon Mới</DialogTitle>
          <DialogDescription>
            Coupon sẽ được gắn với chiến dịch{" "}
            <span className="font-semibold text-indigo-600">
              {discount.title}
            </span>
            .
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-3">
          {/* Code */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mã Coupon *
            </label>
            <Input
              {...register("code")}
              placeholder="VD: SUMMER50"
              className="uppercase"
            />
            {errors.code && (
              <p className="text-red-500 text-sm mt-1">{errors.code.message}</p>
            )}
          </div>

          {/* Percentage */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Phần trăm giảm (%)
            </label>
            <Input
              type="number"
              {...register("percentage")}
              placeholder="VD: 20"
            />
            {errors.percentage && (
              <p className="text-red-500 text-sm mt-1">
                {errors.percentage.message}
              </p>
            )}
          </div>

          {/* Max usage */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Giới hạn số lần sử dụng
            </label>
            <Input
              type="number"
              {...register("maxUsage")}
              placeholder="VD: 100"
            />
          </div>

          {/* Expiration date */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Ngày hết hạn (cố định)
            </label>
            <Input
              type="datetime-local"
              {...register("expiresAt")}
              disabled
              className="bg-gray-100 cursor-not-allowed"
            />
            <p className="text-xs text-gray-500 mt-1">
              Coupon sẽ hết hạn cùng lúc với chiến dịch (
              {new Date(discount.endsAt).toLocaleString("vi-VN")}).
            </p>
          </div>

          {/* Target */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Mục tiêu áp dụng
            </label>
            <Select
              value={target}
              onValueChange={(value) => setValue("target", value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn mục tiêu áp dụng" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">Tất cả (ALL)</SelectItem>
                <SelectItem value="SPECIALIZATION">
                  Chuyên ngành (SPECIALIZATION)
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Specialization selection */}
          {target === "SPECIALIZATION" && (
            <div>
              <label className="block text-sm font-medium mb-1">
                Chọn chuyên ngành
              </label>
              <Select
                value={watch("specializationId")}
                onValueChange={(value) => setValue("specializationId", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn chuyên ngành" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.length > 0 ? (
                    specializations.map((spec) => (
                      <SelectItem key={spec.id} value={String(spec.id)}>
                        {spec.name}
                      </SelectItem>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-gray-400 text-sm">
                      Không có chuyên ngành
                    </div>
                  )}
                </SelectContent>
              </Select>
            </div>
          )}

          <DialogFooter className="pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {isSubmitting ? "Đang tạo..." : "Tạo Coupon"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
