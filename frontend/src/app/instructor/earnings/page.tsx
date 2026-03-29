"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchEarningsHistory,
  fetchOverview,
} from "@/store/slice/instructor/instructorAnalyticsSlice";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  DollarSign,
  TrendingUp,
  FileText,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Gift,
  PlusCircle,
  MinusCircle,
  Settings,
} from "lucide-react";
import LoadingScreen from "@/components/LoadingScreen";
import { Button } from "@/components/ui/button";

export default function InstructorEarningsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { earnings, overview, loading, error } = useSelector(
    (state: RootState) => state.instructorAnalytics
  );

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    dispatch(fetchOverview());
    dispatch(fetchEarningsHistory({ page: currentPage, limit: pageSize }));
  }, [dispatch, currentPage]);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTransactionTypeBadge = (type: string) => {
    const typeMap: Record<
      string,
      {
        label: string;
        className: string;
        icon?: React.ElementType;
      }
    > = {
      COURSE_PURCHASE: {
        label: "Học viên đăng ký",
        className: "bg-emerald-50 text-emerald-600 border-emerald-100",
        icon: PlusCircle,
      },
      COURSE_REFUND: {
        label: "Hoàn tiền",
        className: "bg-rose-50 text-rose-600 border-rose-100",
        icon: MinusCircle,
      },
      ADMIN_ADJUST: {
        label: "Hệ thống điều chỉnh",
        className: "bg-indigo-50 text-indigo-600 border-indigo-100",
        icon: Settings,
      },
      REWARD: {
        label: "Thưởng nóng",
        className: "bg-amber-50 text-amber-600 border-amber-100",
        icon: Gift,
      },
    };

    const config = typeMap[type] || {
      label: type,
      className: "bg-slate-50 text-slate-500 border-slate-100",
    };

    const Icon = config.icon;

    return (
      <Badge
        variant="outline"
        className={`flex items-center gap-2 px-3 py-1 text-[10px] font-black uppercase tracking-tight rounded-xl ${config.className}`}
      >
        {Icon && <Icon size={12} />}
        {config.label}
      </Badge>
    );
  };

  if (loading && !earnings) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-[2.5rem] bg-rose-50 border-2 border-dashed border-rose-100">
        <div className="text-center">
          <p className="text-rose-600 font-bold">Lỗi hệ thống: {error}</p>
        </div>
      </div>
    );
  }

  const totalEarnings = overview?.totalEarnings || 0;
  const totalTransactions = earnings?.pagination.total || 0;
  const averageEarning =
    totalTransactions > 0 ? totalEarnings / totalTransactions : 0;
  const latestEarning = earnings?.data[0]?.amount || 0;

  const stats = [
    {
      title: "Tổng thu nhập",
      value: formatCurrency(totalEarnings),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Tổng doanh thu tích lũy",
    },
    {
      title: "Số lượt mua",
      value: totalTransactions.toLocaleString(),
      icon: FileText,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Tổng số giao dịch thành công",
    },
    {
      title: "Giá trị trung bình",
      value: formatCurrency(averageEarning),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Doanh thu trên mỗi học viên",
    },
    {
      title: "Giao dịch cuối",
      value: formatCurrency(latestEarning),
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Cập nhật vài phút trước",
    },
  ];

  return (
    <div className="space-y-10 pb-10 overflow-x-hidden">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Thu nhập & Doanh thu
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Minh bạch mọi giao dịch và theo dõi sự tăng trưởng tài chính của bạn.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(
          ({ title, value, icon: Icon, color, bgColor, description }) => (
            <Card key={title} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
                <div className="space-y-1">
                  <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    {title}
                  </CardTitle>
                  <p className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {value}
                  </p>
                </div>
                <div className={`p-4 rounded-3xl ${bgColor} transition-transform group-hover:scale-110 duration-500`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter opacity-70 italic">{description}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Earnings History Section */}
      <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
        <CardHeader className="p-8 border-b border-slate-50 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-xl font-black text-slate-900">Chi tiết giao dịch</CardTitle>
            <p className="text-xs text-slate-400 font-bold mt-1">Lịch sử thu thập tự động theo thời gian thực</p>
          </div>
          <div className="p-2 px-4 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest">
             {totalTransactions} Records
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {earnings && earnings.data.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="hover:bg-transparent border-none">
                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Thời gian</TableHead>
                    <TableHead className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Loại giao dịch</TableHead>
                    <TableHead className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Reference</TableHead>
                    <TableHead className="py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Số tiền (VND)</TableHead>
                    <TableHead className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ghi chú</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {earnings.data.map((earning) => (
                    <TableRow key={earning.id} className="hover:bg-slate-50/50 transition-colors border-b border-slate-50 group">
                      <TableCell className="px-8 py-6">
                         <div className="text-sm font-bold text-slate-900">{new Date(earning.createdAt).toLocaleDateString("vi-VN", {day: '2-digit', month: '2-digit', year: 'numeric'})}</div>
                         <div className="text-[10px] text-slate-400 font-medium">{new Date(earning.createdAt).toLocaleTimeString("vi-VN", {hour: '2-digit', minute: '2-digit'})}</div>
                      </TableCell>
                      <TableCell>
                        {getTransactionTypeBadge(earning.type)}
                      </TableCell>
                      <TableCell className="text-center">
                         <span className="p-1 px-3 bg-indigo-50 text-indigo-600 rounded-lg text-[10px] font-black shadow-sm">
                            #{earning.courseId || "SYS"}
                         </span>
                      </TableCell>
                      <TableCell className="text-right">
                        <span className={`text-sm font-black ${earning.amount >= 0 ? "text-emerald-500" : "text-rose-500"}`}>
                          {earning.amount >= 0 ? "+" : ""}{formatCurrency(earning.amount)}
                        </span>
                      </TableCell>
                      <TableCell className="px-8 text-right">
                        <span className="text-xs text-slate-500 font-medium italic">
                          {earning.transaction?.note || "Giao dịch hệ thống"}
                        </span>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              {/* Pagination Section */}
              <div className="p-8 border-t border-slate-50 flex flex-col sm:flex-row items-center justify-between gap-6">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                  PAGE {currentPage} OF {earnings.pagination.totalPages} <span className="mx-2 text-slate-200">|</span> 
                  SHOWING {earnings.data.length} OF {earnings.pagination.total} ENTRIES
                </p>
                <Pagination
                  total={earnings.pagination.totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                />
              </div>
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center">
              <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-6">
                 <FileText className="w-10 h-10 text-slate-200" />
              </div>
              <h3 className="text-lg font-black text-slate-900">Lịch sử trống</h3>
              <p className="text-sm text-slate-400 font-medium mt-1">Bạn chưa có bất kỳ giao dịch nào phát sinh.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
