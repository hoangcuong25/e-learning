"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { motion, AnimatePresence } from "framer-motion";
import {
  Pencil,
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
import { updateCoupon } from "@/store/slice/common/couponSlice";
import { fetchSpecializationsByInstructorId } from "@/store/slice/common/specializationSlice";
import { fetchCoursesByInstructor } from "@/store/slice/course/coursesSlice";

interface UpdateCouponFormProps {
  coupon: any;
  onSuccess: () => void;
}

const UpdateCouponForm: React.FC<UpdateCouponFormProps> = ({
  coupon,
  onSuccess,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorCourses } = useSelector(
    (state: RootState) => state.courses,
  );
  const { instructorSpecializaions } = useSelector(
    (state: RootState) => state.specialization,
  );
  const { user } = useSelector((state: RootState) => state.user);

  const [loading, setLoading] = useState(false);

  // Pre-fill dữ liệu
  const [code, setCode] = useState(coupon.code || "");
  const [percentage, setPercentage] = useState(
    coupon.percentage?.toString() || "",
  );
  const [maxUsage, setMaxUsage] = useState(coupon.maxUsage?.toString() || "");
  const [startsAt, setStartsAt] = useState(
    coupon.startsAt ? new Date(coupon.startsAt).toISOString().slice(0, 16) : "",
  );
  const [endsAt, setEndsAt] = useState(
    coupon.endsAt ? new Date(coupon.endsAt).toISOString().slice(0, 16) : "",
  );
  const [target, setTarget] = useState(coupon.target || "ALL");
  const [courseId, setCourseId] = useState(coupon.courseId?.toString() || "");
  const [specializationId, setSpecializationId] = useState(
    coupon.specializationId?.toString() || "",
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

    setLoading(true);
    try {
      await dispatch(
        updateCoupon({
          id: coupon.id,
          payload: {
            percentage: Number(percentage),
            maxUsage: maxUsage ? Number(maxUsage) : undefined,
            startsAt: startsAt ? new Date(startsAt).toISOString() : undefined,
            endsAt: endsAt ? new Date(endsAt).toISOString() : undefined,
            target,
            courseId: target === "COURSE" ? Number(courseId) : undefined,
            specializationId:
              target === "SPECIALIZATION"
                ? Number(specializationId)
                : undefined,
          },
        }),
      ).unwrap();

      toast.success("Cập nhật coupon thành công!");
      onSuccess();
    } catch {
      toast.error("Cập nhật thất bại!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className=" backdrop-blur-3xl border border-slate-800 rounded-[2.5rem] overflow-y-auto max-h-[calc(100vh-12rem)] shadow-2xl relative custom-scrollbar p-3"
    >
      <div className="absolute top-0 left-0 w-full h-32 pointer-events-none" />
      <form onSubmit={handleUpdate} className="p-8 space-y-8 relative z-10">
        {/* Header Section */}
        <div className="flex items-center justify-between pb-2 border-b border-slate-800/50">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-violet-500/10 rounded-lg text-violet-500 border border-violet-500/20">
                <Pencil size={14} />
              </span>
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">
                Edit Coupon
              </span>
            </div>
            <h2 className="text-2xl font-black text-white uppercase tracking-tighter">
              CẬP NHẬT <span className="text-violet-500">MÃ GIẢM GIÁ</span>
            </h2>
          </div>
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
          >
            <Zap className="text-amber-500" size={24} />
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code (Read Only) */}
          <div className="space-y-2 opacity-80">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Hash size={12} className="text-violet-500" /> Mã Coupon
            </label>
            <Input
              value={code}
              disabled
              className="bg-slate-950/50 border-slate-800 focus:border-violet-500/50 h-12 rounded-2xl transition-all uppercase font-black tracking-widest text-slate-300 pointer-events-none"
            />
          </div>

          {/* Percentage */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Percent size={12} className="text-violet-500" /> Phần trăm giảm
              (%) *
            </label>
            <div className="relative group">
              <Input
                type="number"
                value={percentage}
                onChange={(e) => setPercentage(e.target.value)}
                placeholder="20"
                className="bg-slate-950/50 border-slate-800 focus:border-violet-500/50 focus:ring-violet-500/20 h-12 rounded-2xl transition-all font-bold group-hover:border-violet-500/30 text-white"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within:text-violet-500 transition-colors">
                <CheckCircle2 size={16} />
              </div>
            </div>
          </div>

          {/* Max usage */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Clock size={12} className="text-violet-500" /> Giới hạn sử dụng
            </label>
            <Input
              type="number"
              placeholder="VD: 100"
              value={maxUsage}
              onChange={(e) => setMaxUsage(e.target.value)}
              className="bg-slate-950/50 border-slate-800 focus:border-violet-500/50 focus:ring-violet-500/20 h-12 rounded-2xl transition-all font-bold text-white"
            />
          </div>

          {/* Target */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
              <Target size={12} className="text-violet-500" /> Mục tiêu áp dụng
            </label>
            <Select value={target} onValueChange={setTarget}>
              <SelectTrigger className="bg-slate-950/50 border-slate-800 focus:border-violet-500/50 h-12 rounded-2xl transition-all text-slate-300 font-bold">
                <SelectValue placeholder="Chọn mục tiêu" />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 rounded-2xl shadow-2xl">
                <SelectItem
                  value="ALL"
                  className="focus:bg-violet-500/10 focus:text-violet-400 font-bold uppercase text-[10px] py-3 rounded-xl cursor-pointer transition-colors"
                >
                  Tất cả
                </SelectItem>
                <SelectItem
                  value="COURSE"
                  className="focus:bg-violet-500/10 focus:text-violet-400 font-bold uppercase text-[10px] py-3 rounded-xl cursor-pointer transition-colors"
                >
                  Khóa học
                </SelectItem>
                <SelectItem
                  value="SPECIALIZATION"
                  className="focus:bg-violet-500/10 focus:text-violet-400 font-bold uppercase text-[10px] py-3 rounded-xl cursor-pointer transition-colors"
                >
                  Chuyên ngành
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Box */}
        <div className="bg-slate-950/30 p-6 rounded-[2rem] border border-slate-800/50 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <Calendar size={12} className="text-violet-500" /> Ngày bắt đầu
              </label>
              <Input
                type="datetime-local"
                value={startsAt}
                onChange={(e) => setStartsAt(e.target.value)}
                className="bg-slate-950/50 border-slate-800 focus:border-violet-500/50 h-12 rounded-2xl transition-all font-bold text-slate-400"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">
                <Calendar size={12} className="text-violet-500" /> Ngày kết thúc
              </label>
              <Input
                type="datetime-local"
                value={endsAt}
                onChange={(e) => setEndsAt(e.target.value)}
                className="bg-slate-950/50 border-slate-800 focus:border-violet-500/50 h-12 rounded-2xl transition-all font-bold text-slate-400"
              />
            </div>
          </div>
        </div>

        {/* Conditional Selection Fields */}
        <AnimatePresence mode="wait">
          {target === "COURSE" && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="space-y-2 p-6 bg-violet-500/5 border border-violet-500/10 rounded-[2rem]">
                <label className="flex items-center gap-2 text-[10px] font-black text-violet-400 uppercase tracking-widest ml-1">
                  <BookOpen size={12} /> Chọn Khóa học
                </label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger className="bg-slate-950/50 border-violet-500/20 focus:border-violet-500 h-12 rounded-2xl transition-all text-slate-300 font-bold">
                    <SelectValue placeholder="Chọn khóa học" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 rounded-2xl shadow-2xl max-h-[250px]">
                    {instructorCourses.map((course: any) => (
                      <SelectItem
                        key={course.id}
                        value={String(course.id)}
                        className="focus:bg-violet-500/10 focus:text-violet-400 font-bold text-xs py-3 rounded-xl cursor-pointer transition-colors"
                      >
                        {course.title}
                      </SelectItem>
                    ))}
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
              <div className="space-y-2 p-6 bg-emerald-500/5 border border-emerald-500/10 rounded-[2rem]">
                <label className="flex items-center gap-2 text-[10px] font-black text-emerald-400 uppercase tracking-widest ml-1">
                  <Layout size={12} /> Chọn Chuyên ngành
                </label>
                <Select
                  value={specializationId}
                  onValueChange={setSpecializationId}
                >
                  <SelectTrigger className="bg-slate-950/50 border-emerald-500/20 focus:border-emerald-500 h-12 rounded-2xl transition-all text-slate-300 font-bold">
                    <SelectValue placeholder="Chọn chuyên ngành" />
                  </SelectTrigger>
                  <SelectContent className="bg-slate-900 border-slate-800 text-slate-300 rounded-2xl shadow-2xl max-h-[250px]">
                    {instructorSpecializaions.map((spec: any) => (
                      <SelectItem
                        key={spec.id}
                        value={String(spec.id)}
                        className="focus:bg-emerald-500/10 focus:text-emerald-400 font-bold text-xs py-3 rounded-xl cursor-pointer transition-colors"
                      >
                        {spec.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="flex flex-col gap-4 pt-4">
          <Button
            type="submit"
            disabled={loading}
            className="w-full h-16 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-[2rem] text-sm font-black uppercase tracking-[0.2em] transition-all shadow-xl shadow-violet-600/20 hover:shadow-violet-600/40 hover:-translate-y-1 relative group"
          >
            {loading ? (
              <span className="flex items-center gap-3">
                <Loader2 className="animate-spin" size={18} />
                ĐANG CẬP NHẬT...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <CheckCircle2
                  size={18}
                  className="group-hover:scale-110 transition-transform"
                />
                LƯU THAY ĐỔI
              </span>
            )}
          </Button>

          <p className="flex items-center justify-center gap-1.5 text-center text-[10px] font-bold text-slate-600 uppercase tracking-widest">
            <AlertCircle size={12} /> Thay đổi sẽ được áp dụng ngay lập tức
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default UpdateCouponForm;
