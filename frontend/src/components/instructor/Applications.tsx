"use client";

import React from "react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import { Check, X, Mail, Briefcase, GraduationCap, Calendar, User, Info, ArrowUpRight, Slash, LayoutGrid } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { toast } from "sonner";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/store";
import {
  approveInstructor,
  fetchAllApplications,
  rejectInstructor,
} from "@/store/slice/instructor/instructorSlice";
import { motion, AnimatePresence } from "framer-motion";

interface ApplicationsProps {
  applications: InstructorApplicationType[];
}

const Applications: React.FC<ApplicationsProps> = ({ applications }) => {
  const dispatch = useDispatch<AppDispatch>();

  const handleApproveApp = async (userId: number, applicationId: number) => {
    try {
      await dispatch(approveInstructor({ userId, applicationId })).unwrap();
      await dispatch(fetchAllApplications()).unwrap();
      toast.success("Đơn đã được chấp thuận thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi khi phê duyệt đơn đăng ký");
    }
  };

  const handleRejectApp = async (userId: number, applicationId: number) => {
    try {
      await dispatch(rejectInstructor({ userId, applicationId })).unwrap();
      await dispatch(fetchAllApplications()).unwrap();
      toast.success("Đơn đã bị từ chối thành công!");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Lỗi từ chối đơn đăng ký");
    }
  };

  if (!applications || applications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32 space-y-4">
        <div className="p-8 bg-slate-900 border border-slate-800 rounded-[3rem] opacity-50 shadow-2xl">
          <GraduationCap size={64} className="text-slate-600" />
        </div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Hiện chưa có đơn ứng tuyển nào mới</p>
      </div>
    );
  }

  return (
    <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
      <AnimatePresence>
        {applications.map((app, idx) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: idx * 0.1, duration: 0.5 }}
            whileHover={{ y: -4 }}
            className="group"
          >
            <Card className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative transition-all duration-300 group-hover:border-indigo-500/30 group-hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.15)]">
              {/* Background gradient */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors" />
              
              <CardHeader className="p-8 pb-4 relative z-10">
                <CardTitle className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-indigo-400 font-bold shadow-lg">
                      {app.user?.fullname?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xl font-black text-white tracking-tighter">
                        {app.user?.fullname}
                      </h4>
                      <div className="flex items-center gap-1.5 text-slate-500 mt-0.5">
                        <Mail size={12} className="text-slate-600" />
                        <span className="text-[11px] font-medium tracking-tight truncate max-w-[150px] sm:max-w-none">{app.user?.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest text-right">
                      {new Date(app.createdAt).toLocaleDateString("vi-VN")}
                    </span>
                    <Badge className={`px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border ${
                      app.status === 'PENDING' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 
                      app.status === 'APPROVED' ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' : 
                      'bg-rose-500/10 text-rose-500 border-rose-500/20'
                    }`}>
                      {app.status}
                    </Badge>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8 pt-2 space-y-6 relative z-10">
                {/* Meta details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <Briefcase size={12} className="text-indigo-500" /> Kinh nghiệm
                      </div>
                      <p className="text-sm font-bold text-slate-300 pl-4">{app.experience}</p>
                   </div>
                   <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                         <LayoutGrid size={12} className="text-indigo-500" /> Chuyên ngành
                      </div>
                      <div className="flex flex-wrap gap-1.5 pl-4 mt-1">
                         {app.applicationSpecializations?.map((item, idx) => (
                           <span key={idx} className="px-2 py-0.5 bg-slate-950 border border-slate-800 rounded-lg text-[10px] font-bold text-indigo-400">
                             {item.specialization.name}
                           </span>
                         )) || <span className="text-xs text-slate-500 italic">Trống</span>}
                      </div>
                   </div>
                </div>

                {/* Bio */}
                <div className="p-5 bg-slate-950/40 border border-slate-800/50 rounded-2xl relative group-hover:bg-slate-950 transition-colors">
                   <div className="flex items-center gap-1.5 text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3">
                      <Info size={12} className="text-indigo-400" /> Giới thiệu ứng viên
                   </div>
                   <p className="text-sm text-slate-400 leading-relaxed font-medium">
                     {app.bio}
                   </p>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-800/50">
                  <button
                    disabled={app.user?.id === undefined || app.status !== 'PENDING'}
                    onClick={() => app.user?.id && handleApproveApp(app.user.id, app.id)}
                    className="flex-1 px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-30 disabled:hover:bg-emerald-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-emerald-600/10 flex items-center justify-center gap-2 group-hover:scale-105 active:scale-95"
                  >
                    <Check size={14} className="stroke-[3]" /> Chấp thuận đăng ký
                  </button>
                  <button
                    disabled={app.user?.id === undefined || app.status !== 'PENDING'}
                    onClick={() => app.user?.id && handleRejectApp(app.user.id, app.id)}
                    className="px-8 py-3.5 bg-slate-800 hover:bg-rose-500/20 border border-slate-700 hover:border-rose-500/30 text-slate-400 hover:text-rose-400 disabled:opacity-30 disabled:hover:bg-slate-800 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
                  >
                    <X size={14} className="stroke-[3]" /> Từ chối
                  </button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </section>
  );
};

export default Applications;
