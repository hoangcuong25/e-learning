"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllUsers } from "@/store/slice/common/userSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pagination } from "@/components/ui/pagination";
import { Search, Loader2, User as UserIcon, Mail, Phone, Calendar, ArrowRight, Filter, Download } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const StudentPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { users, loading } = useSelector((state: RootState) => state.user);

  const studentList = users?.data || [];
  const paginationData = users?.pagination;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm, debouncedSearch]);

  useEffect(() => {
    dispatch(
      fetchAllUsers({
        page: currentPage,
        limit: pageSize,
        search: debouncedSearch,
        role: "USER",
      })
    );
  }, [dispatch, currentPage, pageSize, debouncedSearch]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <UserIcon size={18} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
               QUẢN LÝ <span className="text-indigo-500">HỌC VIÊN</span>
             </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Tổng số {paginationData?.total || 0} học viên đang tham gia nền tảng.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
            Thêm mới
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Table Toolbar */}
        <div className="p-8 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              placeholder="Tìm kiếm theo tên, email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
             <button className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-white hover:bg-slate-900 transition-all">
                <Filter size={18} />
             </button>
             <div className="w-px h-8 bg-slate-800 mx-1" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
               Sắp xếp: <span className="text-indigo-400">Mới nhất</span>
             </p>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10 p-2">
          {loading && (!studentList || studentList.length === 0) ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
                 <Loader2 className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang đồng bộ dữ liệu...</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-800 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 px-6">ID</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Học viên</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-center">Xác thực</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Số dư ví</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Ngày tham gia</TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-right px-6">Hành động</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {studentList.length > 0 ? (
                  studentList.map((student: any, idx: number) => (
                    <TableRow key={student.id} className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group">
                      <TableCell className="py-5 px-6">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400 transition-colors">#{student.id}</span>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-4">
                          <div className="relative">
                            <Avatar className="w-12 h-12 border-2 border-slate-800 shadow-xl group-hover:border-indigo-500/50 transition-all duration-300">
                              <AvatarImage src={student.avatar} alt={student.fullname} className="object-cover" />
                              <AvatarFallback className="bg-gradient-to-br from-slate-800 to-slate-900 text-indigo-400 font-black text-xs uppercase">
                                {student.fullname?.charAt(0)?.toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className={`absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-slate-900 ${student.isVerified ? 'bg-indigo-500' : 'bg-slate-700'}`} />
                          </div>
                          <div className="flex flex-col">
                            <span className="font-black text-white text-sm tracking-tight group-hover:text-indigo-400 transition-colors">
                              {student.fullname}
                            </span>
                            <div className="flex items-center gap-3 mt-1">
                               <div className="flex items-center gap-1.5 text-[10px] text-slate-500 group-hover:text-slate-400 transition-colors">
                                  <Mail size={10} /> {student.email}
                               </div>
                               {student.phone && (
                                 <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                                    <Phone size={10} /> {student.phone}
                                 </div>
                               )}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-center">
                        <AnimatePresence>
                          {student.isVerified ? (
                            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                              <Badge className="bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                                Verified
                              </Badge>
                            </motion.div>
                          ) : (
                            <Badge className="bg-slate-800 text-slate-500 border border-slate-700 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest">
                              Pending
                            </Badge>
                          )}
                        </AnimatePresence>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex flex-col">
                           <span className="text-sm font-black text-white tracking-tighter">
                             {formatCurrency(student.walletBalance || 0)}
                           </span>
                           <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">VN ĐỒNG</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 text-slate-400 group-hover:text-slate-300 transition-colors">
                           <Calendar size={13} className="text-slate-600 group-hover:text-indigo-400 transition-colors" />
                           <span className="text-xs font-bold">{formatDate(student.createdAt)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-right px-6">
                        <button 
                          onClick={() => router.push(`/admin/students/${student.id}`)}
                          className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:bg-indigo-600 hover:border-indigo-500 transition-all hover:scale-110 shadow-lg group/btn"
                        >
                           <ArrowRight size={16} className="group-hover/btn:translate-x-0.5 transition-transform" />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-20">
                      <div className="flex flex-col items-center gap-4 text-slate-600">
                         <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-slate-800 opacity-50">
                            <UserIcon size={48} strokeWidth={1} />
                         </div>
                         <p className="text-[10px] font-black uppercase tracking-[0.2em]">Không tìm thấy học viên nào</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination Controls */}
        {paginationData && paginationData.totalPages > 1 && (
          <div className="p-8 border-t border-slate-800 bg-slate-950/30 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Hiển thị <span className="text-indigo-500">{studentList.length}</span> trên <span className="text-indigo-500">{paginationData.total}</span> kết quả
            </p>
            <div className="flex items-center gap-2">
              <Pagination
                total={paginationData.totalPages}
                page={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StudentPage;
