"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllReports,
  deleteReport,
  clearReportState,
} from "@/store/slice/common/reportSlice";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import { Search, Loader2, Trash2, Eye, FileText, AlertTriangle, ShieldAlert, User, Calendar, Info, Filter, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";

import {
  ReportStatus,
  ReportReason,
  ReportTargetType,
  ReportReasonTranslation,
  ReportStatusTranslation,
} from "@/constants/report.enum";

const ReportsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { reports, pagination, loading, error, successMessage } = useSelector(
    (state: RootState) => state.report
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [selectedReport, setSelectedReport] = useState<any>(null);

  useEffect(() => {
    dispatch(
      fetchAllReports({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearReportState());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearReportState());
    }
  }, [error, successMessage, dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteReport(id)).unwrap();
      toast.success("Xóa báo cáo thành công");
      dispatch(
        fetchAllReports({
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
        })
      );
    } catch (err: any) {
      toast.error("Có lỗi xảy ra khi xóa báo cáo");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-rose-600/10 border border-rose-500/20 rounded-xl text-rose-400 font-bold">
                <ShieldAlert size={18} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
               TRUNG TÂM <span className="text-rose-500">BÁO CÁO</span>
             </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Theo dõi và xử lý các phản hồi vi phạm từ cộng đồng người dùng.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
           <div className="px-4 py-2 bg-slate-900 border border-slate-800 rounded-2xl">
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest leading-none mb-1">Cần xử lý</p>
              <p className="text-lg font-black text-rose-400 tracking-tight leading-none">
                {reports?.filter(r => r.status === ReportStatus.PENDING).length || 0} yêu cầu
              </p>
           </div>
        </div>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-rose-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              placeholder="Tìm mã báo cáo, người dùng..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
             <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500">
                <Filter size={18} />
             </div>
             <div className="w-px h-8 bg-slate-800 mx-1" />
             <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
               Tổng số: <span className="text-rose-400">{pagination?.total || 0} bản ghi</span>
             </p>
          </div>
        </div>

        <div className="p-2 relative z-10">
          {loading && reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="p-4 bg-rose-600/10 rounded-3xl animate-spin">
                 <Loader2 className="w-8 h-8 text-rose-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang quét dữ liệu báo cáo...</p>
            </div>
          ) : (
            <>
              {/* Desktop View: Table */}
              <div className="hidden lg:block overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 px-6">ID</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Phạm vi</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Lý do vi phạm</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Người gửi</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Trạng thái</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Thời gian</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-right px-6">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-800/50">
                    {reports.length > 0 ? (
                      reports.map((report, idx) => (
                        <motion.tr 
                          key={report.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                        >
                          <TableCell className="py-5 px-6">
                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400 transition-colors">#{report.id}</span>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex flex-col gap-1">
                               <Badge className="w-fit bg-slate-950 border-slate-800 text-slate-400 text-[9px] font-black uppercase tracking-widest">
                                 {report.targetType}
                               </Badge>
                               <span className="text-[10px] font-bold text-indigo-400 tracking-widest uppercase">ID: #{report.targetId}</span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div
                              className="font-black text-white text-sm tracking-tight truncate max-w-[200px]"
                              title={ReportReasonTranslation[report.reason]}
                            >
                              {ReportReasonTranslation[report.reason]}
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                             <div className="flex items-center gap-2">
                                <div className="w-7 h-7 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-black text-indigo-400 border border-slate-700">
                                   {report.reporter?.fullname?.charAt(0) || "U"}
                                </div>
                                <div className="flex flex-col min-w-0">
                                   <span className="text-xs font-bold text-slate-300 truncate max-w-[120px]">
                                     {report.reporter?.fullname || "Ẩn danh"}
                                   </span>
                                   <span className="text-[9px] text-slate-500 font-medium truncate max-w-[120px]">
                                     {report.reporter?.email || "ID: "+report.reporterId}
                                   </span>
                                </div>
                             </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <Badge
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                report.status === ReportStatus.PENDING
                                  ? "bg-amber-500/10 text-amber-500 border-amber-500/20"
                                  : report.status === ReportStatus.RESOLVED
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}
                            >
                              {ReportStatusTranslation[report.status]}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex flex-col">
                               <span className="text-xs font-bold text-slate-400">
                                 {report.createdAt ? new Date(report.createdAt).toLocaleDateString("vi-VN") : "N/A"}
                               </span>
                               <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                 {report.createdAt ? new Date(report.createdAt).toLocaleTimeString("vi-VN", { hour: '2-digit', minute: '2-digit' }) : ""}
                               </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5 text-right px-6">
                            <div className="flex justify-end gap-2 pr-2">
                              {/* View Details Dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <button
                                    onClick={() => setSelectedReport(report)}
                                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:bg-slate-900 transition-all hover:scale-110 shadow-lg"
                                    title="Xem chi tiết"
                                  >
                                    <Eye size={16} />
                                  </button>
                                </DialogTrigger>
                                <DialogContent className="sm:max-w-[500px] bg-slate-900 border border-slate-800 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
                                  <DialogHeader className="p-8 bg-slate-950/50 border-b border-slate-800">
                                     <div className="flex items-center gap-3">
                                        <div className="p-2 bg-indigo-600/10 rounded-xl">
                                           <FileText size={18} className="text-indigo-400" />
                                        </div>
                                        <DialogTitle className="text-xl font-black text-white tracking-tighter uppercase">
                                          Chi tiết báo cáo #{report.id}
                                        </DialogTitle>
                                     </div>
                                  </DialogHeader>
                                  <div className="p-8 space-y-6 max-h-[70vh] overflow-y-auto relative z-10 text-slate-200">
                                    <div className="grid grid-cols-2 gap-4">
                                       <div className="space-y-1">
                                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">LÝ DO BÁO CÁO</p>
                                          <p className="text-sm font-bold text-rose-400">{ReportReasonTranslation[report.reason]}</p>
                                       </div>
                                       <div className="space-y-1">
                                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TRẠNG THÁI</p>
                                          <Badge className="bg-slate-950 border-slate-800 text-[9px] font-black uppercase">{ReportStatusTranslation[report.status]}</Badge>
                                       </div>
                                    </div>
                                    
                                    <div className="space-y-2">
                                       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">NỘI DUNG CHI TIẾT</p>
                                       <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-sm font-medium text-slate-400 leading-relaxed italic">
                                         "{report.description || "Người báo cáo không cung cấp thêm mô tả chi tiết cho báo cáo này."}"
                                       </div>
                                    </div>

                                    <div className="p-4 bg-indigo-600/5 border border-indigo-500/10 rounded-2xl flex items-center justify-between">
                                       <div className="flex items-center gap-3">
                                          <div className="p-2 bg-slate-900 rounded-lg">
                                             <User size={14} className="text-indigo-400" />
                                          </div>
                                          <div className="flex flex-col">
                                             <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">REPORTED BY</p>
                                             <p className="text-xs font-bold">{report.reporter?.fullname || "Người dùng ẩn danh"}</p>
                                          </div>
                                       </div>
                                       <ArrowRight size={14} className="text-slate-700" />
                                       <div className="flex flex-col items-end">
                                          <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">TARGET TYPE</p>
                                          <p className="text-xs font-bold text-indigo-400">{report.targetType} #{report.targetId}</p>
                                       </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* Delete Alert */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <button
                                    className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/20 transition-all hover:scale-110 shadow-lg"
                                    title="Xóa"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </AlertDialogTrigger>
                                <AlertDialogContent className="bg-slate-900 border border-slate-800 rounded-3xl p-8">
                                  <AlertDialogHeader>
                                    <AlertDialogTitle className="text-xl font-black text-white tracking-tighter uppercase">Xóa lịch sử báo cáo?</AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400 font-medium">
                                      Hành động này sẽ xóa vĩnh viễn dữ liệu về báo cáo vi phạm <span className="text-rose-400 font-bold">#{report.id}</span> khỏi hệ thống.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-6 gap-3">
                                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Hủy bỏ</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(report.id)}
                                      className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest"
                                    >
                                      Xác nhận xóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </motion.tr>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="py-20 text-center text-slate-600">
                          <div className="flex flex-col items-center gap-4">
                            <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-slate-800 opacity-50">
                                <ShieldAlert size={48} strokeWidth={1} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Hệ thống hiện tại sạch sẽ, không có báo cáo nào.</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View: Cards */}
              <div className="lg:hidden grid grid-cols-1 gap-6 px-4 py-6">
                {reports.length > 0 ? (
                  reports.map((report, idx) => (
                    <motion.div 
                      key={report.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-950/50 border border-slate-800 rounded-3xl overflow-hidden p-5 shadow-lg group"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                             <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">#{report.id}</span>
                             <Badge variant="outline" className="text-[8px] border-slate-800">{report.targetType}</Badge>
                          </div>
                          <h3 className="font-black text-white text-sm tracking-tight line-clamp-1 truncate">
                            {ReportReasonTranslation[report.reason]}
                          </h3>
                        </div>
                        <Badge
                          className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                            report.status === ReportStatus.PENDING
                              ? "bg-amber-500/10 text-amber-500"
                              : report.status === ReportStatus.RESOLVED
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-rose-500/10 text-rose-400"
                          }`}
                        >
                          {ReportStatusTranslation[report.status]}
                        </Badge>
                      </div>

                      <div className="space-y-3 pb-4 border-b border-slate-800/50 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center justify-between">
                           <div className="flex items-center gap-2">
                              <User size={12} className="text-indigo-400" />
                              <span className="text-slate-300">{report.reporter?.fullname || "Ẩn danh"}</span>
                           </div>
                           <div className="flex items-center gap-1">
                              <Calendar size={12} />
                              <span>{report.createdAt ? new Date(report.createdAt).toLocaleDateString("vi-VN") : "N/A"}</span>
                           </div>
                        </div>
                        <div className="flex items-center gap-2">
                           <AlertTriangle size={12} className="text-rose-500" />
                           <span className="text-indigo-400">{report.targetType} #{report.targetId}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <button
                               onClick={() => setSelectedReport(report)}
                               className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                            >
                              Chi tiết
                            </button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md w-[95vw] bg-slate-900 border-slate-800 rounded-[2rem] p-6">
                            <DialogHeader>
                              <DialogTitle className="text-lg font-black text-white uppercase tracking-tighter">Báo cáo #{report.id}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 mt-4 text-slate-300">
                               <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-xs text-slate-500 leading-relaxed">
                                  {report.description || "Không có nội dung mô tả chi tiết."}
                               </div>
                               <div className="grid grid-cols-2 gap-4">
                                  <div>
                                     <p className="text-[9px] font-black text-slate-500 uppercase">Đối tượng</p>
                                     <p className="text-xs font-bold text-indigo-400">{report.targetType} #{report.targetId}</p>
                                  </div>
                                  <div>
                                     <p className="text-[9px] font-black text-slate-500 uppercase">Trạng thái</p>
                                     <p className="text-xs font-bold">{ReportStatusTranslation[report.status]}</p>
                                  </div>
                               </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="px-5 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-2xl transition-all shadow-lg">
                              <Trash2 size={16} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-900 border-slate-800 rounded-3xl p-8 w-[90vw]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-lg font-black text-white tracking-tighter uppercase">Xóa báo cáo?</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs text-slate-400 tracking-tight">Hành động này sẽ xóa vĩnh viễn báo cáo này khỏi hệ thống quản trị.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 gap-2">
                              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-400 rounded-xl text-[9px] font-black uppercase">Không</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(report.id)} className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase">Xóa</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-950/30 rounded-3xl border border-slate-800 border-dashed">
                    Không có báo cáo nào
                  </div>
                )}
              </div>
            </>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-8 border-t border-slate-800 bg-slate-950/30 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Hiển thị <span className="text-rose-500">{reports.length}</span> trên <span className="text-rose-500">{pagination.total}</span> kết quả
            </p>
            <Pagination
              total={pagination.totalPages}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default ReportsPage;
