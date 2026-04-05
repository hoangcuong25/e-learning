"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Loader2, GraduationCap, ClipboardList, UserCheck, Mail, Calendar, Filter, Users } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllApplications } from "@/store/slice/instructor/instructorSlice";
import { fetchAllUsers } from "@/store/slice/common/userSlice";
import Applications from "@/components/instructor/Applications";
import { Pagination } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminDashboardInstructorsPage() {
  const dispatch = useDispatch<AppDispatch>();

  const { applications } = useSelector((state: RootState) => state.instructor);
  const { users, loading } = useSelector((state: RootState) => state.user);

  const instructorsList = users?.data || [];
  const paginationData = users?.pagination;

  const [tab, setTab] = useState<"instructors" | "applications">("instructors");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  useEffect(() => {
    if (tab === "instructors") {
      dispatch(
        fetchAllUsers({
          page: currentPage,
          limit: pageSize,
          search: debouncedSearch,
          role: "INSTRUCTOR",
        })
      );
    }
  }, [dispatch, tab, currentPage, pageSize, debouncedSearch]);

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <GraduationCap size={18} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
               QUẢN LÝ <span className="text-indigo-500">GIẢNG VIÊN</span>
             </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Quản lý đội ngũ giảng viên và xét duyệt hồ sơ ứng tuyển mới.
          </p>
        </motion.div>

        {tab === "instructors" && (
          <div className="relative w-full max-w-sm group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-sm"
            />
          </div>
        )}
      </div>

      {/* Tabs Design */}
      <div className="flex items-center gap-2 p-1 bg-slate-900 border border-slate-800 rounded-2xl w-fit">
        <button
          onClick={() => setTab("instructors")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
            tab === "instructors"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <Users size={14} />
          Giảng viên
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all relative ${
            tab === "applications"
              ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20"
              : "text-slate-500 hover:text-slate-300"
          }`}
        >
          <ClipboardList size={14} />
          Ứng tuyển
          {pendingApps.length > 0 && (
            <span className="ml-1 bg-rose-500 text-white text-[9px] px-1.5 py-0.5 rounded-full ring-2 ring-slate-900">
              {pendingApps.length}
            </span>
          )}
        </button>
      </div>

      {/* Content Area */}
      <AnimatePresence mode="wait">
        {tab === "instructors" ? (
          <motion.div
            key="instructors"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
          >
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
            
            <div className="overflow-x-auto relative z-10 p-2">
              {loading && instructorsList.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-24 space-y-4">
                  <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
                    <Loader2 className="w-8 h-8 text-indigo-500" />
                  </div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang tải danh sách giảng viên...</p>
                </div>
              ) : (
                <table className="min-w-full">
                  <thead>
                    <tr className="border-b border-slate-800">
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Giảng viên
                      </th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Liên hệ
                      </th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Ngày tham gia
                      </th>
                      <th className="px-6 py-6 text-left text-[10px] font-black text-slate-500 uppercase tracking-widest">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-800/50">
                    {instructorsList.length > 0 ? (
                      instructorsList.map((ins, idx) => (
                        <motion.tr
                          key={ins.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="hover:bg-slate-800/30 transition-colors group"
                        >
                          <td className="px-6 py-5">
                            <div className="flex items-center gap-4">
                              <Avatar className="h-12 w-12 border-2 border-slate-800 group-hover:border-indigo-500/50 transition-all duration-300">
                                <AvatarImage src={ins.avatar} alt={ins.fullname} className="object-cover" />
                                <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-indigo-400 font-black text-xs uppercase">
                                  {ins.fullname?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <div className="text-sm font-black text-white tracking-tight group-hover:text-indigo-400 transition-colors">
                                  {ins.fullname}
                                </div>
                                <div className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-0.5">
                                  ID: {ins.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                               <Mail size={13} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                               <span className="text-xs font-medium">{ins.email}</span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-2 text-slate-400">
                               <Calendar size={13} className="text-slate-600" />
                               <span className="text-xs font-bold">
                                 {ins.createdAt ? new Date(ins.createdAt).toLocaleDateString("vi-VN") : "--"}
                               </span>
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <Badge className={
                                ins.isVerified
                                  ? "bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                                  : "bg-slate-800 text-slate-500 border border-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest"
                              }>
                              {ins.isVerified ? "Verified" : "Pending"}
                            </Badge>
                          </td>
                        </motion.tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="px-6 py-20 text-center">
                           <div className="flex flex-col items-center gap-4 text-slate-600">
                              <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-slate-800 opacity-50">
                                 <Users size={48} strokeWidth={1} />
                              </div>
                              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Không tìm thấy giảng viên nào</p>
                           </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              )}
            </div>

            {/* Pagination */}
            {paginationData && paginationData.totalPages > 1 && (
              <div className="p-8 border-t border-slate-800 bg-slate-950/30 relative z-10 flex items-center justify-between">
                <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                  Trang {currentPage} / {paginationData.totalPages}
                </p>
                <Pagination
                  total={paginationData.totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              </div>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="applications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <Applications applications={applications} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
