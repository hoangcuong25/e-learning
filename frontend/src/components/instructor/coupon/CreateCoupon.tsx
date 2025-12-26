"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
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
import { createCoupon, fetchInstructorCoupons } from "@/store/couponSlice";
import { fetchSpecializationsByInstructorId } from "@/store/specializationSlice";
import { fetchCoursesByInstructor } from "@/store/coursesSlice";

const CouponForm = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const { instructorSpecializaions } = useSelector(
    (state: RootState) => state.specialization
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [code, setCode] = useState("");
  const [percentage, setPercentage] = useState("");
  const [maxUsage, setMaxUsage] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [target, setTarget] = useState("ALL");
  const [courseId, setCourseId] = useState("");
  const [specializationId, setSpecializationId] = useState("");

  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
    if (user?.id) {
      dispatch(fetchSpecializationsByInstructorId(user.id));
    }
  }, [dispatch, user?.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!code || !percentage) {
      toast.error("Vui lòng nhập mã coupon và phần trăm giảm!");
      return;
    }

    try {
      await dispatch(
        createCoupon({
          code,
          percentage: Number(percentage),
          maxUsage: maxUsage ? Number(maxUsage) : undefined,
          expiresAt: expiresAt ? new Date(expiresAt).toISOString() : undefined,
          target,
          courseId: target === "COURSE" ? Number(courseId) : undefined,
          specializationId:
            target === "SPECIALIZATION" ? Number(specializationId) : undefined,
        })
      ).unwrap();

      toast.success("Tạo coupon thành công!");
      await dispatch(fetchInstructorCoupons());

      // Reset form
      setCode("");
      setPercentage("");
      setMaxUsage("");
      setExpiresAt("");
      setTarget("ALL");
      setCourseId("");
      setSpecializationId("");
    } catch {
      toast.error("Tạo coupon thất bại!");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5 p-4 border rounded-lg bg-white shadow-sm"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        Tạo Coupon Mới
      </h2>

      {/* Mã Coupon */}
      <div>
        <label className="block text-sm font-medium mb-1">Mã Coupon *</label>
        <Input
          placeholder="Ví dụ: SUMMER50"
          value={code}
          className="uppercase"
          onChange={(e) => setCode(e.target.value)}
        />
      </div>

      {/* Phần trăm giảm */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Phần trăm giảm (%)
        </label>
        <Input
          type="number"
          placeholder="VD: 20"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
        />
      </div>

      {/* Giới hạn số lần */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Giới hạn số lần sử dụng
        </label>
        <Input
          type="number"
          placeholder="VD: 100"
          value={maxUsage}
          onChange={(e) => setMaxUsage(e.target.value)}
        />
      </div>

      {/* Ngày hết hạn */}
      <div>
        <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
        <Input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

      {/* Target */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Mục tiêu áp dụng
        </label>
        <Select value={target} onValueChange={setTarget}>
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

      {/* Dropdown chọn khóa học */}
      {target === "COURSE" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Chọn Khóa học
          </label>
          <Select value={courseId} onValueChange={setCourseId}>
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

      {/* Dropdown chọn chuyên ngành */}
      {target === "SPECIALIZATION" && (
        <div>
          <label className="block text-sm font-medium mb-1">
            Chọn Chuyên ngành
          </label>
          <Select value={specializationId} onValueChange={setSpecializationId}>
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

      <Button
        type="submit"
        className="w-full bg-blue-500 hover:bg-blue-600 text-white"
      >
        Tạo Coupon
      </Button>
    </form>
  );
};

export default CouponForm;
