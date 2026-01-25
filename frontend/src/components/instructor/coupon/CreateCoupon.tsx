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
  fetchInstructorCoupons,
} from "@/store/slice/couponSlice";
import { fetchSpecializationsByInstructorId } from "@/store/slice/specializationSlice";
import { fetchCoursesByInstructor } from "@/store/slice/coursesSlice";
import { CouponFormData, couponSchema } from "@/hook/zod-schema/CoupondSchema";

const CouponForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const { instructorSpecializaions } = useSelector(
    (state: RootState) => state.specialization
  );
  const { user } = useSelector((state: RootState) => state.user);

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
      courseId: "",
      specializationId: "",
    },
  });

  const target = watch("target");

  // 🧭 Fetch data on mount
  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
    if (user?.id) {
      dispatch(fetchSpecializationsByInstructorId(user.id));
    }
  }, [dispatch, user?.id]);

  // 🧠 Handle form submit
  const onSubmit = async (data: CouponFormData) => {
    try {
      await dispatch(
        createCoupon({
          code: data.code.toUpperCase(),
          percentage: Number(data.percentage),
          maxUsage: data.maxUsage ? Number(data.maxUsage) : undefined,
          expiresAt: data.expiresAt
            ? new Date(data.expiresAt).toISOString()
            : undefined,
          target: data.target,
          courseId:
            data.target === "COURSE" ? Number(data.courseId) : undefined,
          specializationId:
            data.target === "SPECIALIZATION"
              ? Number(data.specializationId)
              : undefined,
        })
      ).unwrap();

      toast.success("Tạo coupon thành công!");
      await dispatch(fetchInstructorCoupons());
      reset();
    } catch {
      toast.error("Tạo coupon thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-5 p-4 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Tạo Coupon Mới
      </h2>

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

      {/* Expiration date */}
      <div>
        <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
        <Input type="datetime-local" {...register("expiresAt")} />
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
              {instructorCourses.length > 0 ? (
                instructorCourses.map((course) => (
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
              {instructorSpecializaions.length > 0 ? (
                instructorSpecializaions.map((spec) => (
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
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        {isSubmitting ? "Đang tạo..." : "Tạo Coupon"}
      </Button>
    </form>
  );
};

export default CouponForm;
