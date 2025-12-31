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
import { updateCoupon } from "@/store/slice/couponSlice";
import { fetchSpecializationsByInstructorId } from "@/store/slice/specializationSlice";
import { fetchCoursesByInstructor } from "@/store/slice/coursesSlice";

interface UpdateCouponFormProps {
  coupon: any; // hoặc bạn có thể định nghĩa kiểu rõ hơn
  onSuccess: () => void;
  onCancel: () => void;
}

const UpdateCouponForm: React.FC<UpdateCouponFormProps> = ({
  coupon,
  onSuccess,
  onCancel,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses
  );
  const { instructorSpecializaions } = useSelector(
    (state: RootState) => state.specialization
  );
  const { user } = useSelector((state: RootState) => state.user);

  // Pre-fill dữ liệu
  const [code, setCode] = useState(coupon.code || "");
  const [percentage, setPercentage] = useState(
    coupon.percentage?.toString() || ""
  );
  const [maxUsage, setMaxUsage] = useState(coupon.maxUsage?.toString() || "");
  const [expiresAt, setExpiresAt] = useState(
    coupon.expiresAt
      ? new Date(coupon.expiresAt).toISOString().slice(0, 16)
      : ""
  );
  const [target, setTarget] = useState(coupon.target || "ALL");
  const [courseId, setCourseId] = useState(coupon.courseId?.toString() || "");
  const [specializationId, setSpecializationId] = useState(
    coupon.specializationId?.toString() || ""
  );

  useEffect(() => {
    dispatch(fetchCoursesByInstructor());
    if (user?.id) {
      dispatch(fetchSpecializationsByInstructorId(user.id));
    }
  }, [dispatch, user?.id]);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!percentage) {
      toast.error("Vui lòng nhập phần trăm giảm!");
      return;
    }

    try {
      await dispatch(
        updateCoupon({
          id: coupon.id,
          payload: {
            percentage: Number(percentage),
            maxUsage: maxUsage ? Number(maxUsage) : undefined,
            expiresAt: expiresAt
              ? new Date(expiresAt).toISOString()
              : undefined,
            target,
            courseId: target === "COURSE" ? Number(courseId) : undefined,
            specializationId:
              target === "SPECIALIZATION"
                ? Number(specializationId)
                : undefined,
          },
        })
      ).unwrap();

      toast.success("Cập nhật coupon thành công!");
      onSuccess();
    } catch {
      toast.error("Cập nhật thất bại!");
    }
  };

  return (
    <form onSubmit={handleUpdate} className="space-y-5 p-4 bg-white rounded-lg">
      <h2 className="text-lg font-semibold text-gray-800 mb-2">
        ✏️ Cập nhật Coupon
      </h2>

      <div>
        <label className="block text-sm font-medium mb-1">Mã Coupon</label>
        <Input value={code} disabled className="bg-gray-100" />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Phần trăm giảm (%)
        </label>
        <Input
          type="number"
          value={percentage}
          onChange={(e) => setPercentage(e.target.value)}
        />
      </div>

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

      <div>
        <label className="block text-sm font-medium mb-1">Ngày hết hạn</label>
        <Input
          type="datetime-local"
          value={expiresAt}
          onChange={(e) => setExpiresAt(e.target.value)}
        />
      </div>

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
              {instructorCourses.map((course) => (
                <SelectItem key={course.id} value={String(course.id)}>
                  {course.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

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
              {instructorSpecializaions.map((spec) => (
                <SelectItem key={spec.id} value={String(spec.id)}>
                  {spec.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end gap-2 mt-4">
        <Button variant="outline" onClick={onCancel}>
          Hủy
        </Button>
        <Button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white"
        >
          Lưu thay đổi
        </Button>
      </div>
    </form>
  );
};

export default UpdateCouponForm;
