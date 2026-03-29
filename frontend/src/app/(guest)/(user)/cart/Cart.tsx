"use client";

import React, { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { Trash2, CheckCircle2, Lock, ShoppingBag, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchCart, removeFromCart } from "@/store/slice/common/cartSlice";
import LoadingScreen from "@/components/LoadingScreen";
import { useRouter } from "next/navigation";

export default function MyCartPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { items, loading } = useSelector((state: RootState) => state.cart);
  const router = useRouter();

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const paymentSectionRef = useRef<HTMLDivElement>(null);

  const handleScrollToPayment = () => {
    paymentSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleRemove = (courseId: number) => {
    dispatch(removeFromCart(courseId));
    if (selectedCourseId === courseId) {
      setSelectedCourseId(null);
    }
  };

  const handleSelectCourse = (courseId: number) => {
    setSelectedCourseId(courseId);
  };

  const subtotal = items
    .filter((item) => item.courseId === selectedCourseId)
    .reduce((sum, item) => sum + (item.course?.price || 0), 0);

  const handleCheckout = () => {
    if (!selectedCourseId) {
      toast.error("Vui lòng chọn một khóa học để thanh toán!");
      return;
    }
    router.push(`/payment/${selectedCourseId}`);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto space-y-12 pb-24"
    >
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
         <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Giỏ hàng <span className="text-indigo-600">của bạn</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md tracking-tight">
              {items.length} khóa học đang chờ bạn chinh phục. Hãy hoàn tất để bắt đầu hành trình ngay.
            </p>
         </div>
      </header>

      {items.length === 0 ? (
        <section className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-16 md:p-32 text-center space-y-8">
           <div className="w-24 h-24 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
              <ShoppingBag size={48} />
           </div>
           <div className="space-y-2">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Giỏ hàng trống rỗng</h2>
              <p className="text-slate-400 font-medium">Bạn chưa thêm khóa học nào. Khám phá kho tri thức ngay!</p>
           </div>
           <Button 
             onClick={() => router.push("/courses")}
             className="h-14 px-10 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-widest text-[10px]"
           >
              Khám phá khóa học
           </Button>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          {/* Danh sách khóa học */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
              {items.map((item, index) => (
                <motion.div
                  key={item.courseId}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleSelectCourse(item.courseId)}
                  className={`relative group cursor-pointer p-6 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                    selectedCourseId === item.courseId 
                    ? "bg-white border-indigo-500 shadow-2xl shadow-indigo-500/10 -translate-y-1" 
                    : "bg-white border-slate-100 shadow-sm hover:border-slate-200"
                  }`}
                >
                  <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                    <div className="flex items-center gap-6 w-full md:w-auto">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                        selectedCourseId === item.courseId ? "bg-indigo-600 border-indigo-600" : "border-slate-200"
                      }`}>
                         {selectedCourseId === item.courseId && <div className="w-2 h-2 bg-white rounded-full" />}
                      </div>

                      <div className="relative aspect-video w-full md:w-48 rounded-2xl overflow-hidden border border-slate-100 shadow-inner group-hover:scale-[1.02] transition-transform duration-500">
                        <Image
                          src={item.course?.thumbnail || "/images/default.jpg"}
                          alt={item.course?.title || ""}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-900/10 group-hover:bg-transparent transition-colors" />
                      </div>
                    </div>

                    <div className="flex-1 w-full text-center md:text-left space-y-3">
                      <h2 className="text-xl font-black text-slate-900 tracking-tight line-clamp-2 md:line-clamp-none group-hover:text-indigo-600 transition-colors">
                        {item.course?.title}
                      </h2>
                      <div className="flex items-center justify-center md:justify-start gap-3">
                         <div className="px-3 py-1 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                            {(item.course?.instructor as any) || "Instructor"}
                         </div>
                         <div className="text-indigo-600 font-black text-xl tracking-tighter">
                            {item.course?.price?.toLocaleString()} <span className="text-[10px] uppercase font-black opacity-60">LC</span>
                         </div>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item.courseId);
                      }}
                      className="absolute top-0 right-0 md:static p-4 hover:bg-red-50 hover:text-red-500 text-slate-300 rounded-2xl transition-all group-hover:text-red-400"
                    >
                      <Trash2 className="w-5 h-5" />
                    </Button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Checkout Section */}
          <section
            ref={paymentSectionRef}
            className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] sticky top-32 space-y-10"
          >
            <div className="space-y-6">
               <h3 className="text-2xl font-black text-slate-900 tracking-tight">Thông tin <span className="text-indigo-600 text-sm block uppercase tracking-widest mt-1">Giao dịch</span></h3>
               <ul className="space-y-4">
                 {[
                   { text: "Truy cập trọn đời", icon: <CheckCircle2 className="text-emerald-500" /> },
                   { text: "Tài liệu 4K chất lượng", icon: <CheckCircle2 className="text-emerald-500" /> },
                   { text: "Hỗ trợ 24/7", icon: <CheckCircle2 className="text-emerald-500" /> },
                   { text: "Thanh toán bảo mật", icon: <Lock className="text-emerald-500" /> }
                 ].map((benefit, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm font-bold text-slate-600">
                      <div className="w-8 h-8 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                         {React.cloneElement(benefit.icon as React.ReactElement<any>, { size: 16 })}
                      </div>
                      <span>{benefit.text}</span>
                    </li>
                 ))}
               </ul>
            </div>

            <div className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 space-y-6">
               <div className="flex justify-between items-center text-sm font-black text-slate-400 uppercase tracking-widest">
                  <span>Tạm tính</span>
                  <span className="text-slate-900 font-bold">{subtotal.toLocaleString()} LC</span>
               </div>
               <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tổng cộng</span>
                  <div className="text-indigo-600 font-black text-4xl tracking-tighter">
                     {subtotal.toLocaleString()} <span className="text-[10px] uppercase font-black opacity-60">LC</span>
                  </div>
               </div>
            </div>

            <Button
              disabled={!selectedCourseId}
              onClick={handleCheckout}
              className="w-full h-16 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 transition-all uppercase tracking-[0.2em] text-[11px] group disabled:opacity-50"
            >
              Tiến hành thanh toán
              <ArrowRight className="ml-3 group-hover:translate-x-1 transition-transform" size={18} />
            </Button>
            
            <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
               Vui lòng kiểm tra kỹ trước khi thanh toán
            </p>
          </section>
        </div>
      )}

      {/* Mobile Sticky Action Bar */}
      <AnimatePresence>
        {selectedCourseId && (
          <motion.div 
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-0 left-0 right-0 p-6 bg-white/80 backdrop-blur-3xl border-t border-slate-100 shadow-[0_-20px_40px_rgba(0,0,0,0.05)] lg:hidden flex items-center justify-between z-50 rounded-t-[2.5rem]"
          >
            <div className="space-y-1">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Tổng thanh toán</p>
              <p className="text-indigo-600 font-black text-2xl tracking-tighter">
                {subtotal.toLocaleString()} <span className="text-[10px] uppercase font-black opacity-60">LC</span>
              </p>
            </div>
            <Button
              onClick={handleScrollToPayment}
              className="h-14 px-8 bg-indigo-600 hover:bg-indigo-50 text-white font-black rounded-2xl shadow-xl shadow-indigo-600/20 uppercase tracking-widest text-[10px]"
            >
              Thanh toán ngay
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

