"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import {
  createCoupon,
  fetchAllCoupons,
} from "@/store/slice/common/couponSlice";
import { fetchAllSpecializations } from "@/store/slice/common/specializationSlice";
import { fetchAllCourses } from "@/store/slice/course/coursesSlice";
import { CouponFormData, couponSchema } from "@/hook/zod-schema/CoupondSchema";

const CreateCouponAdmin = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { courses } = useSelector((state: RootState) => state.courses);
  const { specializations } = useSelector(
    (state: RootState) => state.specialization,
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
      startsAt: "",
      endsAt: "",
      target: "ALL",
      courseId: "",
      specializationId: "",
    },
  });

  const target = watch("target");

  // 🧭 Fetch data on mount
  useEffect(() => {
    dispatch(fetchAllCourses({}));
    dispatch(fetchAllSpecializations());
  }, [dispatch]);

  // 🧠 Handle form submit
  const onSubmit = async (data: CouponFormData) => {
    try {
      await dispatch(
        createCoupon({
          code: data.code.toUpperCase(),
          percentage: Number(data.percentage),
          maxUsage: data.maxUsage ? Number(data.maxUsage) : undefined,
          startsAt: data.startsAt
            ? new Date(data.startsAt).toISOString()
            : undefined,
          endsAt: data.endsAt ? new Date(data.endsAt).toISOString() : undefined,
          target: data.target,
          courseId:
            data.target === "COURSE" ? Number(data.courseId) : undefined,
          specializationId:
            data.target === "SPECIALIZATION"
              ? Number(data.specializationId)
              : undefined,
        }),
      ).unwrap();

      toast.success("Tạo coupon thành công!");
      await dispatch(fetchAllCoupons({}));
      reset();
    } catch {
      toast.error("Tạo coupon thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-4 py-8 border-none bg-white rounded-lg"
    >
      {/* Code */}
      <div>
        <label className="block text-sm font-medium mb-1">Mã Coupon *</label>
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
        <Input type="number" placeholder="VD: 20" {...register("percentage")} />
        {errors.percentage && (
          <p className="text-red-500 text-sm mt-1">
            {errors.percentage.message}
          </p>
        )}
      </div>

      {/* Max usage */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Giới hạn số lần
        </label>
        <Input type="number" placeholder="VD: 100" {...register("maxUsage")} />
        {errors.maxUsage && (
          <p className="text-red-500 text-sm mt-1">{errors.maxUsage.message}</p>
        )}
      </div>

      {/* Date range */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Ngày bắt đầu</label>
          <Input type="datetime-local" {...register("startsAt")} />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">
            Ngày kết thúc
          </label>
          <Input type="datetime-local" {...register("endsAt")} />
        </div>
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
            <SelectItem value="COURSE">Khóa học (COURSE)</SelectItem>
            <SelectItem value="SPECIALIZATION">
              Chuyên ngành (SPECIALIZATION)
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Course selection */}
      {target === "COURSE" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Chọn khóa học
          </label>
          <Select
            value={watch("courseId")}
            onValueChange={(value) => setValue("courseId", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn khóa học" />
            </SelectTrigger>
            <SelectContent>
              {courses && courses.length > 0 ? (
                courses.map((course) => (
                  <SelectItem key={course.id} value={String(course.id)}>
                    {course.title}
                  </SelectItem>
                ))
              ) : (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  Không có khóa học
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
      )}

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
              {specializations && specializations.length > 0 ? (
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

      {/* Submit button */}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-500 hover:bg-blue-700 text-white mt-4"
      >
        {isSubmitting ? "Đang tạo..." : "Tạo Coupon"}
      </Button>
    </form>
  );
};

export default CreateCouponAdmin;
