"use client";

import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { Wallet, PlusCircle, Clock, ArrowUpRight, ArrowDownLeft, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getMyTransactionsApi } from "@/store/api/common/payment.api";
import { DepositConfirmationDialog } from "@/components/wallet/DepositConfirmation";
import { motion, AnimatePresence } from "framer-motion";

export default function WalletPage() {
  const { user } = useSelector((state: RootState) => state.user);
  const [isOpen, setIsOpen] = useState(false);
  const [transactions, setTransactions] = useState<any[]>([]);

  const updateTransactions = async () => {
    try {
      const res = await getMyTransactionsApi();
      setTransactions(res.data || []);
    } catch (error) {
      toast.error("Không thể tải lịch sử giao dịch");
    }
  };

  useEffect(() => {
    updateTransactions();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-12 pb-24"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
         <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Ví <span className="text-indigo-600 italic">điện tử</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md tracking-tight">
               Quản lý tài chính cá nhân, nạp LearnCoin và theo dõi mọi biến động giao dịch của bạn.
            </p>
         </div>
         <div className="flex items-center gap-3 px-6 py-3 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 font-black text-[10px] uppercase tracking-widest shadow-sm mx-auto md:mx-0">
            <ShieldCheck size={16} /> 
            Thanh toán bảo mật 100%
         </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        {/* Balance Card Container */}
        <div className="lg:col-span-1 space-y-6">
          <div className="relative group overflow-hidden bg-slate-900 rounded-[3rem] p-10 shadow-2xl shadow-indigo-500/20">
            {/* Animated Background Elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500 opacity-20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:scale-125 transition-transform duration-1000" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-emerald-500 opacity-10 rounded-full blur-[60px] translate-y-1/2 -translate-x-1/2" />
            
            <div className="relative z-10 space-y-10">
              <div className="flex items-center justify-between">
                 <div className="w-14 h-14 bg-white/10 backdrop-blur-xl border border-white/10 rounded-2xl flex items-center justify-center text-white">
                    <Wallet size={28} />
                 </div>
                 <Sparkles size={20} className="text-indigo-400 animate-pulse" />
              </div>

              <div className="space-y-2">
                <p className="text-white/40 text-[10px] font-black uppercase tracking-[0.2em]">Tổng số dư khả dụng</p>
                <div className="flex items-end gap-3 text-white">
                   <h2 className="text-5xl font-black tracking-tighter leading-none">
                     {(user?.walletBalance || 0).toLocaleString()}
                   </h2>
                   <span className="text-indigo-400 font-black text-lg mb-1 uppercase tracking-widest">LC</span>
                </div>
              </div>

              <Button
                onClick={() => setIsOpen(true)}
                className="w-full h-16 bg-white hover:bg-slate-50 text-slate-900 font-black rounded-2xl shadow-xl transition-all uppercase tracking-[0.2em] text-[11px] flex items-center justify-center gap-3"
              >
                <PlusCircle className="w-5 h-5 text-indigo-600" />
                Nạp thêm LearnCoin
              </Button>
            </div>
          </div>

          <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm space-y-6">
             <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">Thông tin ví</h3>
             <div className="space-y-4">
                {[
                  { label: "Mã ví", value: "E-LEARN-99", color: "text-slate-400" },
                  { label: "Loại tiền", value: "LearnCoin (LC)", color: "text-indigo-600" },
                  { label: "Trạng thái", value: "Hoạt động", color: "text-emerald-500" }
                ].map((item, i) => (
                  <div key={i} className="flex justify-between items-center text-xs">
                    <span className="font-bold text-slate-400 uppercase tracking-tight">{item.label}</span>
                    <span className={`font-black ${item.color}`}>{item.value}</span>
                  </div>
                ))}
             </div>
          </div>
        </div>

        {/* Transactions List */}
        <div className="lg:col-span-2 space-y-8">
           <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
             <div className="p-10 border-b border-slate-50 flex items-center justify-between">
                <div className="flex items-center gap-4">
                   <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <Clock size={20} />
                   </div>
                   <h2 className="text-2xl font-black text-slate-900 tracking-tight">Lịch sử giao dịch</h2>
                </div>
                <div className="px-5 py-2 bg-slate-50 rounded-full text-[10px] font-black text-slate-400 uppercase tracking-widest">
                   {transactions.length} Giao dịch
                </div>
             </div>

             <div className="p-6">
                {transactions.length > 0 ? (
                  <div className="space-y-3">
                    <AnimatePresence mode="popLayout">
                      {transactions.map((t, index) => (
                        <motion.div
                          key={t.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          className="flex items-center justify-between p-6 bg-white hover:bg-slate-50 border border-transparent hover:border-slate-100 rounded-[2rem] transition-all group"
                        >
                          <div className="flex items-center gap-5">
                            <div className={`p-4 rounded-2xl ${t.amount > 0 ? 'bg-emerald-50 text-emerald-500' : 'bg-rose-50 text-rose-500'} transition-colors`}>
                               {t.amount > 0 ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />}
                            </div>
                            <div className="space-y-1">
                              <p className="font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors uppercase text-xs">{t.type}</p>
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                                {new Date(t.createdAt).toLocaleString("vi-VN", { dateStyle: 'medium', timeStyle: 'short' })}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`text-xl font-black tracking-tighter ${t.amount > 0 ? "text-emerald-500" : "text-rose-500"}`}>
                              {t.amount > 0 ? "+" : ""}
                              {t.amount.toLocaleString()} <span className="text-[10px] uppercase opacity-50 ml-1">LC</span>
                            </p>
                            <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest mt-0.5">Thành công</p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                  </div>
                ) : (
                  <div className="py-24 text-center space-y-4">
                     <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto text-slate-200">
                        <Clock size={40} />
                     </div>
                     <p className="text-slate-400 font-bold text-sm tracking-tight italic">Chưa có giao dịch nào được ghi nhận.</p>
                  </div>
                )}
             </div>
           </div>
        </div>
      </div>

      <DepositConfirmationDialog
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onDepositSuccess={updateTransactions}
      />
    </motion.div>
  );
}

