"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  ArrowLeft, 
  CreditCard, 
  ShieldCheck, 
  Tag, 
  Zap, 
  Wallet,
  Calendar,
  Layers,
  ChevronRight,
  Loader2
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { fetchCourseCoupons } from "@/store/slice/common/couponSlice";
import { AppDispatch, RootState } from "@/store";
import { fetchCourseDetail } from "@/store/slice/course/coursesSlice";
import { createEnrollment } from "@/store/slice/course/enrollmentsSlice";

const Payment = () => {
  const { courseId } = useParams();
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();

  const { currentCourse, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const { loading: enrolling } = useSelector(
    (state: RootState) => state.enrollment
  );

  const { courseCoupons } = useSelector((state: RootState) => state.coupon);

  const [selectedCoupon, setSelectedCoupon] = useState<any>(null);

  useEffect(() => {
    if (courseId) {
      dispatch(fetchCourseDetail(Number(courseId)));
      dispatch(fetchCourseCoupons(Number(courseId)) as any);
    }
  }, [courseId, dispatch]);

  if (loading || !currentCourse) return <LoadingScreen />;

  const handlePayment = async () => {
    try {
      if (!courseId) return;

      await dispatch(
        createEnrollment({
          courseId: Number(courseId),
          couponCode: selectedCoupon?.code,
        })
      ).unwrap();

      toast.success(`Thanh toán thành công! Bạn đã sẵn sàng học.`);
      router.push(`/my-learning`);
    } catch (error: any) {
      toast.error(
        error?.message || "Có lỗi xảy ra khi thanh toán, vui lòng thử lại."
      );
    }
  };

  const basePrice = currentCourse.price || 0;
  const discountPercent = selectedCoupon?.percentage || 0;
  const discountAmount = Math.round((basePrice * discountPercent) / 100);
  const total = Math.max(basePrice - discountAmount, 0);

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto space-y-10"
      >
        {/* Navigation */}
        <button
          onClick={() => router.back()}
          className="group flex items-center gap-4 text-slate-400 hover:text-indigo-600 transition-all font-black uppercase tracking-widest text-[10px]"
        >
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-slate-100 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-all">
             <ArrowLeft size={18} />
          </div>
          Trở về khóa học
        </button>

        <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-2xl p-8 md:p-14 space-y-12 relative overflow-hidden group/main">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600 opacity-5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-indigo-500 opacity-5 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />

          {/* Header Info */}
          <div className="flex flex-col md:flex-row items-start md:items-center gap-10 relative z-10">
            <div className="relative w-full md:w-56 aspect-[4/3] rounded-[2.5rem] overflow-hidden border border-white shadow-xl shadow-slate-200/50 shrink-0 group-hover/main:scale-105 transition-transform duration-700">
              <Image
                src={currentCourse.thumbnail || "/images/default-course.jpg"}
                alt={currentCourse.title}
                fill
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-slate-900/60 to-transparent" />
            </div>
            
            <div className="space-y-4 flex-1">
              <div className="flex items-center gap-3">
                 <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-[9px] font-black uppercase tracking-widest">Enrollment Stage</span>
                 <span className="text-slate-200">•</span>
                 <span className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    <ShieldCheck size={14} className="text-emerald-500" />
                    Secure Transaction
                 </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                Hoàn tất đơn hàng.
              </h1>
              <p className="text-slate-500 text-lg font-medium tracking-tight truncate max-w-md">{currentCourse.title}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            {/* Payment Details */}
            <div className="space-y-8">
              <div className="space-y-6">
                 <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center">
                       <Wallet size={20} />
                    </div>
                    <h3 className="text-xl font-black text-slate-900 tracking-tight">Chi tiết thanh toán</h3>
                 </div>

                 <div className="bg-slate-50/50 rounded-[2.5rem] p-8 border border-slate-100 space-y-4 shadow-sm">
                    <div className="flex justify-between items-center text-sm font-bold text-slate-400 uppercase tracking-widest">
                      <span>Giá gốc</span>
                      <span className="text-slate-600">{basePrice.toLocaleString()} LearnCoin</span>
                    </div>

                    <AnimatePresence>
                      {selectedCoupon && (
                        <motion.div 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex justify-between items-center border-t border-slate-100 pt-4"
                        >
                          <div className="flex flex-col">
                            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Mã giảm giá áp dụng</span>
                            <span className="text-sm font-bold text-slate-900">{selectedCoupon.code}</span>
                          </div>
                          <span className="text-emerald-500 font-black tracking-tight">
                            - {discountAmount.toLocaleString()} LearnCoin
                          </span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="border-t-2 border-dashed border-slate-200 my-4" />

                    <div className="flex justify-between items-center">
                       <span className="text-lg font-black text-slate-900 tracking-tight">Tổng thanh toán</span>
                       <div className="text-right">
                          <span className="block text-3xl font-black text-indigo-600 tracking-tighter">
                            {total.toLocaleString()}
                          </span>
                          <span className="text-[9px] font-black uppercase tracking-widest text-slate-400">LearnCoin Units</span>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Coupon Selection */}
              {basePrice > 0 && courseCoupons && courseCoupons.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-600 rounded-full w-fit">
                    <Tag size={14} className="animate-bounce" />
                    <span className="text-[9px] font-black uppercase tracking-widest">Tiết kiệm nhiều hơn</span>
                  </div>
                  <Select
                    onValueChange={(value) => {
                      const coupon = courseCoupons.find((c) => c.code === value);
                      setSelectedCoupon(coupon || null);
                    }}
                  >
                    <SelectTrigger className="w-full h-16 bg-white border-slate-100 rounded-2xl shadow-sm px-6 font-bold text-slate-600 focus:ring-indigo-500 focus:border-indigo-500 transition-all">
                      <SelectValue placeholder="Sử dụng mã giảm giá" />
                    </SelectTrigger>
                    <SelectContent className="rounded-2xl border-slate-100 shadow-2xl">
                      {courseCoupons.map((coupon) => (
                        <SelectItem key={coupon.code} value={coupon.code} className="py-3 rounded-xl focus:bg-indigo-50">
                          <div className="flex items-center gap-3">
                            <span className="font-black text-indigo-600 uppercase tracking-widest text-[10px]">{coupon.code}</span>
                            <span className="text-slate-300">•</span>
                            <span className="text-sm font-bold text-slate-600">Giảm {coupon.percentage}%</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Checklist & Summary */}
            <div className="space-y-8 bg-slate-900 rounded-[2.5rem] p-10 text-white relative flex flex-col justify-between">
              <div className="absolute bottom-0 right-0 w-48 h-48 bg-indigo-500 opacity-10 rounded-full blur-[80px] translate-x-1/2 translate-y-1/2" />
              
              <div className="space-y-8 relative z-10">
                <div className="flex items-center gap-3 h-fit">
                  <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center text-amber-400">
                    <Zap size={20} fill="currentColor" />
                  </div>
                  <h4 className="text-xl font-black tracking-tight">Đặc quyền học viên</h4>
                </div>
                
                <ul className="space-y-5">
                  {[
                    { icon: <Layers size={16} />, text: "Truy cập không giới hạn nội dung" },
                    { icon: <Calendar size={16} />, text: "Cập nhật miễn phí từ giảng viên" },
                    { icon: <CheckCircle size={16} />, text: "Chứng chỉ hoàn thành EduSmart" },
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-4 text-sm font-medium text-slate-400">
                       <span className="text-indigo-400">{item.icon}</span>
                       {item.text}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-12 relative z-10">
                <button
                  onClick={handlePayment}
                  disabled={enrolling}
                  className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/30 uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3 group transition-all"
                >
                  {enrolling ? (
                    <Loader2 className="animate-spin" size={20} />
                  ) : (
                    <>
                      Xác nhận thanh toán <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <p className="text-center mt-6 text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  Powered by EduSmart Secure Core
                </p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Payment;
