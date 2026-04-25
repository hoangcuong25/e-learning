"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Trash2, PlusCircle, Pencil, Percent } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import {
  deleteCoupon,
  fetchInstructorCoupons,
} from "@/store/slice/common/couponSlice";
import CouponForm from "@/components/instructor/coupon/CreateCoupon";
import UpdateCouponForm from "@/components/instructor/coupon/UpdateCoupon";
import CouponOnboarding from "@/components/instructor/onboarding/CouponOnboarding";

const Coupons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { instructorCoupons, loading } = useSelector(
    (state: RootState) => state.coupon,
  );

  // UI states
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [editCoupon, setEditCoupon] = useState<{
    id: number;
    title: string;
    discountPercent: number;
  } | null>(null);
  const [newTitle, setNewTitle] = useState("");
  const [newDiscount, setNewDiscount] = useState("");

  // Fetch all coupons
  useEffect(() => {
    dispatch(fetchInstructorCoupons());
  }, [dispatch]);

  // 🗑️ Delete coupon
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteCoupon(deleteId)).unwrap();
      await dispatch(fetchInstructorCoupons()).unwrap();
      toast.success("Đã xóa coupon thành công!");
      setDeleteId(null);
    } catch {
      toast.error("Xóa coupon thất bại!");
    }
  };

  if (loading) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight step-coupon-header">
            Mã giảm giá
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Tối ưu hóa doanh thu bằng cách tạo các chiến dịch khuyến mãi hấp dẫn
            cho học viên.
          </p>
        </div>

        {/* Action Buttons Area */}
        <div className="flex items-center gap-3">
          <CouponOnboarding />
          <Dialog>
            <DialogTrigger asChild>
              <Button className="h-14 px-8 flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-black uppercase tracking-tight rounded-2xl shadow-xl shadow-emerald-100 transition-all hover:scale-105 active:scale-95 step-create-coupon">
                <PlusCircle className="w-5 h-5 shadow-sm" />
                Tạo mã mới
              </Button>
            </DialogTrigger>
            <DialogContent className="md:max-w-[700px] max-h-[90vh] overflow-auto rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
              <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
                <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                  <div className="p-2.5 bg-emerald-500 rounded-xl shadow-lg shadow-emerald-200">
                    <Percent className="w-5 h-5 text-white" />
                  </div>
                  Tạo Coupon Mới
                </DialogTitle>
              </DialogHeader>
              <div className="p-8">
                <CouponForm />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Coupon Grid Section */}
      <div className="step-coupon-list">
        {instructorCoupons.length === 0 ? (
          <Card className="border-2 border-dashed border-slate-200 bg-slate-50/50 rounded-[2.5rem] shadow-none">
            <CardContent className="py-24 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center shadow-xl mb-8 group hover:scale-110 transition-transform">
                <Percent className="w-12 h-12 text-slate-300 group-hover:text-emerald-500 transition-colors" />
              </div>
              <h3 className="text-2xl font-black text-slate-800 mb-3">
                Chưa có mã giảm giá nào
              </h3>
              <p className="text-slate-500 max-w-sm mb-10 font-medium italic">
                Sử dụng coupon để khuyến khích học viên đăng ký các khóa học của
                bạn ngay bây giờ!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {instructorCoupons.map((coupon) => (
              <div
                key={coupon.id}
                className="relative flex items-stretch bg-white rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group active:scale-[0.99]"
              >
                {/* Left Side: Discount Badge (Ticket Look) */}
                <div className="w-32 sm:w-40 flex-shrink-0 bg-gradient-to-br from-emerald-500 to-teal-600 flex flex-col items-center justify-center relative overflow-hidden text-white">
                  <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_white_0%,_transparent_10%)] bg-[length:16px_16px] opacity-10" />
                  <div className="relative font-black text-4xl sm:text-5xl tracking-tighter shadow-sm">
                    {coupon.percentage}%
                  </div>
                  <div className="relative text-[10px] sm:text-[11px] font-black uppercase tracking-[0.2em] mt-1 opacity-90">
                    OFF
                  </div>

                  {/* Decorative semi-circles for ticket look */}
                  <div className="absolute top-1/2 -right-3 w-6 h-6 bg-white rounded-full -translate-y-1/2 z-10 shadow-inner" />
                </div>

                {/* Right Side: Content */}
                <div className="flex-1 p-6 sm:p-8 flex flex-col min-w-0">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
                          {coupon.code}
                        </div>
                        <Badge
                          className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-widest border-none ${coupon.isActive ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-400"}`}
                        >
                          {coupon.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-500 font-bold line-clamp-1">
                        {coupon.target === "COURSE"
                          ? coupon.course?.title
                          : coupon.specialization?.title || "Tất cả khóa học"}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <button className="p-2.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-xl transition-all active:scale-90 shadow-sm border border-slate-50 bg-white">
                            <Pencil className="w-4 h-4" />
                          </button>
                        </DialogTrigger>
                        <DialogContent className="md:max-w-[700px] max-h-[90vh] overflow-auto rounded-[2.5rem] border-none shadow-2xl p-0 overflow-hidden">
                          <DialogHeader className="p-8 bg-slate-50/50 border-b border-slate-100">
                            <DialogTitle className="text-2xl font-black text-slate-900 flex items-center gap-3">
                              <div className="p-2.5 bg-amber-500 rounded-xl shadow-lg shadow-amber-200">
                                <Pencil className="w-5 h-5 text-white" />
                              </div>
                              Cập Nhật Coupon
                            </DialogTitle>
                          </DialogHeader>
                          <div className="p-8">
                            <UpdateCouponForm
                              coupon={coupon}
                              onSuccess={() => {
                                dispatch(fetchInstructorCoupons());
                                toast.success("Đã cập nhật coupon!");
                              }}
                            />
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <button
                            className="p-2.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all active:scale-90 shadow-sm border border-slate-50 bg-white"
                            onClick={() => setDeleteId(coupon.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="rounded-[2.5rem] p-8 border-none shadow-2xl">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-xl font-black text-slate-900">
                              Xác nhận xóa coupon
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-slate-500 font-medium leading-relaxed mt-2">
                              Bạn sắp xóa vĩnh viễn mã giảm giá{" "}
                              <strong>{coupon.code}</strong>. Hành động này
                              không thể hoàn tác.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="mt-6 gap-3">
                            <AlertDialogCancel className="h-12 px-6 rounded-2xl border-slate-100 text-slate-500 font-bold hover:bg-slate-50">
                              Hủy bỏ
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={confirmDelete}
                              className="h-12 px-8 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-tight"
                            >
                              Đồng ý xóa
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-auto">
                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
                        Hiệu năng
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-600">
                          Đã dùng:
                        </span>
                        <span className="text-sm font-black text-indigo-600">
                          {coupon.usedCount}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs font-bold text-slate-600">
                          Giới hạn:
                        </span>
                        <span className="text-sm font-black text-slate-700">
                          {coupon.maxUsage || "∞"}
                        </span>
                      </div>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100/50">
                      <div className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1.5 leading-none">
                        Hết hạn
                      </div>
                      {coupon.expiresAt ? (
                        <div className="text-[11px] font-black text-slate-700 leading-tight">
                          {new Date(coupon.expiresAt).toLocaleDateString(
                            "vi-VN",
                            {
                              day: "2-digit",
                              month: "2-digit",
                              year: "numeric",
                            },
                          )}
                          <br />
                          <span
                            className={`${new Date(coupon.expiresAt) < new Date() ? "text-red-500" : "text-emerald-500"}`}
                          >
                            {new Date(coupon.expiresAt) < new Date()
                              ? "Đã quá hạn"
                              : "Còn thời hạn"}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs font-black text-slate-700">
                          Còn thời hạn
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Applicability Footer */}
                  <div className="mt-4 pt-4 border-t border-slate-50 flex items-center justify-between">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <div className="p-1 px-2.5 bg-slate-900 text-[10px] text-white font-black rounded-lg uppercase tracking-tight">
                        Target
                      </div>
                      <div className="text-[11px] font-bold text-slate-500 truncate italic">
                        {coupon.target === "COURSE" && coupon.course
                          ? coupon.course.title
                          : coupon.target === "SPECIALIZATION" &&
                              coupon.specialization
                            ? coupon.specialization.name
                            : "Tất cả học phần"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Coupons;
