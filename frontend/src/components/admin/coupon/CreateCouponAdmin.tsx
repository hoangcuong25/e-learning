"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ticket,
  Percent,
  Hash,
  Calendar,
  Target,
  Zap,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Clock,
  Layout,
  BookOpen,
} from "lucide-react";
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
    >
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-br from-indigo-500/10 to-transparent pointer-events-none" />

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="p-8 space-y-8 relative z-10"
      >
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-indigo-500/10 rounded-lg text-indigo-500 border border-indigo-500/20">
                <Ticket size={14} />
              </span>
              <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">
                Admin Panel
              </span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              TẠO <span className="text-indigo-500">MÃ GIẢM GIÁ</span>
            </h2>
          </div>
          <Zap className="text-amber-500 animate-pulse" size={24} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Hash size={12} className="text-indigo-500" /> Mã Coupon *
            </label>
            <div className="relative group">
              <Input
                {...register("code")}
                placeholder="SUMMER50"
                className="bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-12 rounded-2xl transition-all uppercase font-bold tracking-widest pl-4"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-600 group-focus-within:text-indigo-500 transition-colors">
                <CheckCircle2 size={16} />
              </div>
            </div>
            {errors.code && (
              <p className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase ml-1">
                <AlertCircle size={12} /> {errors.code.message}
              </p>
            )}
          </div>

          {/* Percentage */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Percent size={12} className="text-indigo-500" /> Phần trăm giảm *
            </label>
            <Input
              type="number"
              placeholder="20"
              {...register("percentage")}
              className="bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-12 rounded-2xl transition-all font-bold"
            />
            {errors.percentage && (
              <p className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase ml-1">
                <AlertCircle size={12} /> {errors.percentage.message}
              </p>
            )}
          </div>

          {/* Max usage */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Clock size={12} className="text-indigo-500" /> Giới hạn số lần
            </label>
            <Input
              type="number"
              placeholder="100"
              {...register("maxUsage")}
              className="bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-12 rounded-2xl transition-all font-bold"
            />
            {errors.maxUsage && (
              <p className="flex items-center gap-1.5 text-rose-500 text-[10px] font-bold uppercase ml-1">
                <AlertCircle size={12} /> {errors.maxUsage.message}
              </p>
            )}
          </div>

          {/* Target */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Target size={12} className="text-indigo-500" /> Mục tiêu áp dụng
            </label>
            <Select
              value={target}
              onValueChange={(value) => setValue("target", value as any)}
            >
              <SelectTrigger className="bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 focus:ring-indigo-500/20 h-12 rounded-2xl transition-all text-slate-400 font-bold">
                <SelectValue placeholder="Chọn mục tiêu" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 rounded-2xl shadow-2xl">
                <SelectItem
                  value="ALL"
                  className="focus:bg-indigo-500/10 focus:text-indigo-400 cursor-pointer rounded-xl transition-colors font-bold uppercase text-[10px] py-3"
                >
                  Tất cả khóa học
                </SelectItem>
                <SelectItem
                  value="COURSE"
                  className="focus:bg-indigo-500/10 focus:text-indigo-400 cursor-pointer rounded-xl transition-colors font-bold uppercase text-[10px] py-3"
                >
                  Khóa học cụ thể
                </SelectItem>
                <SelectItem
                  value="SPECIALIZATION"
                  className="focus:bg-indigo-500/10 focus:text-indigo-400 cursor-pointer rounded-xl transition-colors font-bold uppercase text-[10px] py-3"
                >
                  Chuyên ngành cụ thể
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date range */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-950/30 p-6 rounded-3xl border border-slate-800/50">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Calendar size={12} className="text-indigo-500" /> Ngày bắt đầu
            </label>
            <Input
              type="datetime-local"
              {...register("startsAt")}
              className="bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 h-12 rounded-2xl transition-all font-bold text-slate-400"
            />
          </div>
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Calendar size={12} className="text-indigo-500" /> Ngày kết thúc
            </label>
            <Input
              type="datetime-local"
              {...register("endsAt")}
              className="bg-slate-950/50 border-slate-800 focus:border-indigo-500/50 h-12 rounded-2xl transition-all font-bold text-slate-400"
            />
          </div>
        </div>

        {/* Conditional Selections */}
        <AnimatePresence mode="wait">
          {target === "COURSE" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-3xl">
                <label className="flex items-center gap-2 text-[10px] font-black text-indigo-400 uppercase tracking-widest ml-1">
                  <BookOpen size={12} /> Chọn khóa học áp dụng
                </label>
                <Select
                  value={watch("courseId")}
                  onValueChange={(value) => setValue("courseId", value)}
                >
                  <SelectTrigger className="bg-slate-950/50 border-indigo-500/20 focus:border-indigo-500 h-12 rounded-2xl transition-all text-slate-400 font-bold shadow-inner">
                    <SelectValue placeholder="Chọn từ danh sách khóa học..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 rounded-2xl shadow-2xl max-h-[300px]">
                    {courses?.length > 0 ? (
                      courses.map((course: any) => (
                        <SelectItem
                          key={course.id}
                          value={String(course.id)}
                          className="focus:bg-indigo-500/10 focus:text-indigo-400 cursor-pointer rounded-xl transition-colors font-bold text-xs py-3"
                        >
                          {course.title}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500">
                        <Loader2
                          className="animate-spin mx-auto mb-2"
                          size={16}
                        />
                        <span className="text-[10px] uppercase font-black tracking-widest">
                          Đang tải khóa học...
                        </span>
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}

          {target === "SPECIALIZATION" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-3xl">
                <label className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">
                  <Layout size={12} /> Chọn chuyên ngành áp dụng
                </label>
                <Select
                  value={watch("specializationId")}
                  onValueChange={(value) => setValue("specializationId", value)}
                >
                  <SelectTrigger className="bg-slate-950/50 border-emerald-500/20 focus:border-emerald-500 h-12 rounded-2xl transition-all text-slate-400 font-bold shadow-inner">
                    <SelectValue placeholder="Chọn chuyên ngành..." />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 rounded-2xl shadow-2xl max-h-[300px]">
                    {specializations?.length > 0 ? (
                      specializations.map((spec: any) => (
                        <SelectItem
                          key={spec.id}
                          value={String(spec.id)}
                          className="focus:bg-emerald-500/10 focus:text-emerald-400 cursor-pointer rounded-xl transition-colors font-bold text-xs py-3"
                        >
                          {spec.name}
                        </SelectItem>
                      ))
                    ) : (
                      <div className="p-4 text-center text-slate-500">
                        <Loader2
                          className="animate-spin mx-auto mb-2"
                          size={16}
                        />
                        <span className="text-[10px] uppercase font-black tracking-widest">
                          Không có chuyên ngành
                        </span>
                      </div>
                    )}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit button */}
        <div className="pt-4">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-16 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-3xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-1 relative group"
          >
            {isSubmitting ? (
              <span className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={18} />
                ĐANG TẠO...
              </span>
            ) : (
              <span className="flex items-center gap-3">
                <Ticket size={18} className="group-hover:rotate-12 transition-transform" />
                TẠO COUPON NGAY
              </span>
            )}
          </Button>

          <p className="text-center mt-6 text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            * Các trường có dấu sao là bắt buộc phải điền
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default CreateCouponAdmin;
