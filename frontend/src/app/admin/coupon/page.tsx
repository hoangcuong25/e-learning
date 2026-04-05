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
import { toast } from "sonner";
import { Trash2, PlusCircle, Pencil, Ticket, Calendar, BarChart3, Clock, CheckCircle2, XCircle, Gift, BookOpen, Layers, MousePointer2 } from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import {
  deleteCoupon,
  fetchAllCoupons,
} from "@/store/slice/common/couponSlice";
import CreateCouponAdmin from "@/components/admin/coupon/CreateCouponAdmin";
import UpdateCouponForm from "@/components/instructor/coupon/UpdateCoupon";
import { motion, AnimatePresence } from "framer-motion";

const AdminCoupons = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { coupons, loading } = useSelector((state: RootState) => state.coupon);

  // UI states
  const [deleteId, setDeleteId] = useState<number | null>(null);

  // Fetch all coupons
  useEffect(() => {
    dispatch(fetchAllCoupons({}));
  }, [dispatch]);

  // 🗑️ Delete coupon
  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      await dispatch(deleteCoupon(deleteId)).unwrap();
      await dispatch(fetchAllCoupons({})).unwrap();
      toast.success("Đã xóa coupon thành công!");
      setDeleteId(null);
    } catch {
      toast.error("Xóa coupon thất bại!");
    }
  };

  if (loading && (!coupons || coupons.length === 0)) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
           <Gift className="w-8 h-8 text-indigo-500" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang tải kho Coupon...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <Ticket size={18} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
               KHO <span className="text-indigo-500">COUPON</span>
             </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Quản lý và theo dõi hiệu suất các chương trình ưu đãi trên toàn hệ thống.
          </p>
        </motion.div>

        <Dialog>
          <DialogTrigger asChild>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 group">
              <PlusCircle size={14} className="group-hover:scale-110 transition-transform" /> 
              Tạo Coupon Mới
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
            <DialogHeader className="p-8 bg-slate-950/50 border-b border-slate-800">
               <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-600/10 rounded-xl">
                     <Gift size={18} className="text-indigo-400" />
                  </div>
                  <DialogTitle className="text-xl font-black text-white tracking-tighter uppercase">
                    Thiết lập Coupon Hệ thống
                  </DialogTitle>
               </div>
            </DialogHeader>
            <div className="p-8 max-h-[80vh] overflow-y-auto">
              <CreateCouponAdmin />
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Statistics Section (Quick Insights) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
         {[
           { label: "Tổng số mã", value: coupons?.length || 0, icon: Ticket, color: "text-indigo-400" },
           { label: "Mã đang bật", value: coupons?.filter(c => c.isActive).length || 0, icon: CheckCircle2, color: "text-emerald-400" },
           { label: "Mã đã hết hạn", value: coupons?.filter(c => c.expiresAt && new Date(c.expiresAt) < new Date()).length || 0, icon: Clock, color: "text-rose-400" }
         ].map((stat, i) => (
           <motion.div 
             key={i}
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ delay: i * 0.1 }}
             className="bg-slate-900 border border-slate-800 p-6 rounded-[2rem] flex items-center gap-4 group hover:border-slate-700 transition-all"
           >
              <div className={`p-3 rounded-2xl bg-slate-950 border border-slate-800 group-hover:scale-110 transition-transform ${stat.color}`}>
                 <stat.icon size={20} />
              </div>
              <div>
                 <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">{stat.label}</p>
                 <p className="text-2xl font-black text-white tracking-tight">{stat.value}</p>
              </div>
           </motion.div>
         ))}
      </div>

      {/* Coupons List Grid */}
      <div className="relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-indigo-600/5 rounded-full blur-[120px] pointer-events-none" />
        
        {!coupons || coupons.length === 0 ? (
          <div className="bg-slate-900/50 border border-slate-800 rounded-[2.5rem] p-20 text-center relative z-10 border-dashed">
            <Gift className="w-16 h-16 text-slate-700 mx-auto mb-4 stroke-1" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hiện tại chưa có coupon nào khả dụng.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
            {coupons.map((coupon, idx) => (
              <motion.div
                key={coupon.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden group hover:shadow-2xl hover:shadow-indigo-600/5 hover:-translate-y-1 transition-all duration-300"
              >
                {/* Coupon Top (Visual ID) */}
                <div className="p-6 pb-4 border-b border-slate-800/50 bg-slate-950/30">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                         <span className="text-[10px] font-black text-indigo-500 bg-indigo-500/10 px-2 py-0.5 rounded-lg border border-indigo-500/20">#{coupon.id}</span>
                         {coupon.isActive ? (
                            <span className="flex items-center gap-1 text-[8px] font-black text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-lg border border-emerald-400/20 uppercase tracking-widest">ACTIVE</span>
                         ) : (
                            <span className="flex items-center gap-1 text-[8px] font-black text-slate-500 bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-700 uppercase tracking-widest">INACTIVE</span>
                         )}
                      </div>
                      <h3 className="text-xl font-black text-white tracking-tighter uppercase group-hover:text-indigo-400 transition-colors">
                        {coupon.code}
                      </h3>
                    </div>
                    <div className="text-right">
                       <p className="text-2xl font-black text-indigo-400 tracking-tighter">-{coupon.percentage}%</p>
                       <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">GIẢM GIÁ</p>
                    </div>
                  </div>
                </div>

                {/* Coupon Info */}
                <div className="p-6 space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                         <div className="flex items-center gap-1.5 text-slate-500">
                            <BarChart3 size={12} className="text-indigo-500" />
                            <p className="text-[9px] font-black uppercase tracking-widest">Lượt dùng</p>
                         </div>
                         <p className="text-xs font-bold text-slate-200">
                           {coupon.usedCount} / <span className="opacity-50">{coupon.maxUsage || "∞"}</span>
                         </p>
                      </div>
                      <div className="space-y-1">
                         <div className="flex items-center gap-1.5 text-slate-500">
                            <Calendar size={12} className="text-indigo-500" />
                            <p className="text-[9px] font-black uppercase tracking-widest">Hết hạn</p>
                         </div>
                         <p className={`text-xs font-bold truncate ${coupon.expiresAt && new Date(coupon.expiresAt) < new Date() ? 'text-rose-400' : 'text-slate-200'}`}>
                           {coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString("vi-VN") : "Vĩnh viễn"}
                         </p>
                      </div>
                   </div>

                   <div className="space-y-1 pt-2 border-t border-slate-800/30">
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-500">ÁP DỤNG CHO</p>
                      <div className="flex items-center gap-2">
                         {coupon.target === "COURSE" ? (
                           <>
                             <div className="p-1.5 bg-blue-500/10 rounded-lg text-blue-400 border border-blue-500/20">
                               <BookOpen size={12} />
                             </div>
                             <span className="text-[11px] font-bold text-slate-300 truncate tracking-tight">{coupon.course?.title || "Khóa học cụ thể"}</span>
                           </>
                         ) : coupon.target === "SPECIALIZATION" ? (
                           <>
                             <div className="p-1.5 bg-purple-500/10 rounded-lg text-purple-400 border border-purple-500/20">
                               <Layers size={12} />
                             </div>
                             <span className="text-[11px] font-bold text-slate-300 truncate tracking-tight">{coupon.specialization?.name || "Chuyên ngành cụ thể"}</span>
                           </>
                         ) : (
                           <>
                             <div className="p-1.5 bg-slate-800 rounded-lg text-slate-400 border border-slate-700">
                               <Gift size={12} />
                             </div>
                             <span className="text-[11px] font-bold text-slate-500 tracking-tight italic">Tất cả sản phẩm EduSmart</span>
                           </>
                         )}
                      </div>
                   </div>
                </div>

                {/* Actions */}
                <div className="p-2 pt-0 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <button className="flex-1 py-3 bg-slate-800/50 hover:bg-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                        <Pencil size={12} /> Sửa
                      </button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl bg-slate-900 border border-slate-800 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                       <DialogHeader className="p-8 bg-slate-950/50 border-b border-slate-800">
                          <DialogTitle className="text-xl font-black text-white tracking-tighter uppercase">Cập nhật Coupon: <span className="text-indigo-400">{coupon.code}</span></DialogTitle>
                       </DialogHeader>
                       <div className="p-8 max-h-[80vh] overflow-y-auto">
                        <UpdateCouponForm
                          coupon={coupon}
                          onSuccess={() => {
                            dispatch(fetchAllCoupons({}));
                            toast.success("Đã cập nhật coupon!");
                          }}
                        />
                       </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button 
                        onClick={() => setDeleteId(coupon.id)}
                        className="p-3 bg-rose-500/10 hover:bg-rose-500 text-rose-400 hover:text-white border border-rose-500/20 rounded-2xl transition-all shadow-lg"
                      >
                        <Trash2 size={14} />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                       <AlertDialogHeader>
                         <AlertDialogTitle className="text-xl font-black text-white tracking-tighter uppercase">Xóa mã ưu đãi?</AlertDialogTitle>
                         <AlertDialogDescription className="text-slate-400 font-medium">
                           Mã <span className="text-rose-400 font-bold">"{coupon.code}"</span> sẽ biến mất và không thể khôi phục.
                         </AlertDialogDescription>
                       </AlertDialogHeader>
                       <AlertDialogFooter className="mt-6 gap-3">
                         <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white rounded-2xl text-[10px] font-black uppercase">Không</AlertDialogCancel>
                         <AlertDialogAction 
                           onClick={confirmDelete}
                           className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase"
                         >
                           Xác nhận xóa
                         </AlertDialogAction>
                       </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminCoupons;
