"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDailyMissions } from "@/store/slice/mission/missionSlice";
import { Target, Coins, Clock, CheckCircle2, Sparkles, Trophy } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MissionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { missions, loading } = useSelector(
    (state: RootState) => state.mission,
  );

  useEffect(() => {
    dispatch(fetchDailyMissions());
  }, [dispatch]);

  const sortedMissions = [...missions].sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    return a.requirement - b.requirement;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-5xl mx-auto space-y-12 pb-24"
    >
      {/* Header Section */}
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4 md:px-0">
         <div className="space-y-4 text-center md:text-left">
            <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-none">
              Nhiệm vụ <span className="text-indigo-600 italic">Hàng ngày</span>
            </h1>
            <p className="text-slate-400 font-medium max-w-md tracking-tight">
               Hoàn thành các thử thách mỗi ngày để tích lũy LearnCoin và thăng hạng trong cộng đồng.
            </p>
         </div>
         <div className="flex items-center gap-3 px-6 py-3 bg-amber-50 border border-amber-100 rounded-full text-amber-600 font-black text-[10px] uppercase tracking-widest shadow-sm mx-auto md:mx-0">
            <Trophy size={16} /> 
            Tích lũy điểm thưởng ngay
         </div>
      </header>

      <div className="bg-white rounded-[3.5rem] border border-slate-100 shadow-sm p-10 md:p-12 space-y-10">
        <div className="flex items-center gap-4 border-b border-slate-50 pb-8">
           <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
              <Sparkles size={24} />
           </div>
           <div className="space-y-1">
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Danh sách thử thách</h2>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Cập nhật lúc 00:00 hàng ngày</p>
           </div>
        </div>

        {loading && missions.length === 0 ? (
          <div className="grid gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-50 h-32 rounded-[2rem] border border-slate-100"></div>
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="py-24 text-center space-y-6">
             <div className="w-24 h-24 bg-slate-50 rounded-[2rem] flex items-center justify-center mx-auto text-slate-200">
                <Target size={48} />
             </div>
             <p className="text-slate-400 font-bold text-lg tracking-tight italic">Hôm nay không có nhiệm vụ nào dành cho bạn.</p>
          </div>
        ) : (
          <div className="grid gap-6">
            <AnimatePresence mode="popLayout">
              {sortedMissions.map((mission, index) => {
                const progressPercentage = Math.min(
                  100,
                  Math.round((mission.progress / mission.requirement) * 100),
                );

                return (
                  <motion.div
                    key={mission.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`group p-8 rounded-[2rem] border transition-all duration-500 overflow-hidden ${
                      mission.isCompleted
                        ? "bg-emerald-50/30 border-emerald-100/50"
                        : "bg-white border-slate-100 hover:border-indigo-200 hover:shadow-2xl hover:shadow-indigo-500/5"
                    }`}
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 mb-8">
                      <div className="flex items-start gap-6">
                        <div
                          className={`p-4 rounded-2xl transition-colors ${
                            mission.isCompleted 
                            ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20" 
                            : "bg-slate-50 text-slate-400 group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors"
                          }`}
                        >
                          {mission.type === "ONLINE_TIME" ? <Clock size={24} /> : <Target size={24} />}
                        </div>
                        <div className="space-y-2">
                          <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-3">
                            {mission.title}
                            {mission.isCompleted && (
                               <div className="px-3 py-1 bg-emerald-500 text-white rounded-full text-[9px] font-black uppercase tracking-widest shadow-sm">
                                  Success
                               </div>
                            )}
                          </h3>
                          <p className="text-sm font-medium text-slate-400 max-w-md leading-relaxed tracking-tight group-hover:text-slate-500 transition-colors">
                            {mission.description}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 px-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-sm self-start lg:self-auto group-hover:border-amber-200 transition-colors">
                        <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-500">
                           <Coins size={16} />
                        </div>
                        <div className="flex items-end gap-1">
                           <span className="text-xl font-black text-slate-900 tracking-tighter">
                              {new Intl.NumberFormat("vi-VN").format(mission.rewardAmount)}
                           </span>
                           <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5">LC</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4 p-8 bg-slate-50 rounded-[2rem] border border-slate-100 relative group/progress transition-colors overflow-hidden">
                       {/* Background Animated Stripes for Progress */}
                       <div className="absolute inset-0 opacity-5 pointer-events-none" style={{ backgroundImage: 'linear-gradient(45deg, #000 25%, transparent 25%, transparent 50%, #000 50%, #000 75%, transparent 75%, transparent)', backgroundSize: '40px 40px' }} />
                       
                       <div className="flex justify-between items-end relative z-10">
                          <div className="space-y-1">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Tiến độ nhiệm vụ</p>
                             <p className={`font-black text-2xl tracking-tighter ${mission.isCompleted ? 'text-emerald-500' : 'text-indigo-600'}`}>
                                {progressPercentage}%
                             </p>
                          </div>
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Hiện tại</p>
                             <div className="font-black text-slate-900 tracking-tight flex items-center gap-2">
                                <span className={mission.isCompleted ? 'text-emerald-500' : 'text-indigo-600'}>
                                   {Math.min(mission.progress, mission.requirement)}
                                </span>
                                <span className="text-slate-300">/</span> 
                                <span>{mission.requirement}</span>
                                <span className="text-[10px] text-slate-400 uppercase tracking-widest ml-1">
                                   {mission.type === "ONLINE_TIME" ? "Phút" : "Điểm"}
                                </span>
                             </div>
                          </div>
                       </div>

                       <div className="w-full bg-slate-200 rounded-full h-3 relative overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${progressPercentage}%` }}
                            transition={{ duration: 1, ease: "circOut" }}
                            className={`h-full rounded-full ${mission.isCompleted ? "bg-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]" : "bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.3)]"} relative`}
                          >
                             <div className="absolute inset-0 bg-white/20 animate-pulse" />
                          </motion.div>
                       </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </motion.div>
  );
}

