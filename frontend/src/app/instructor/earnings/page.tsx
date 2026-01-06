"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchEarningsHistory,
  fetchOverview,
} from "@/store/slice/instructorAnalyticsSlice";
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
        variant: "default" | "secondary" | "destructive" | "outline";
      }
    > = {
      COURSE_PURCHASE: { label: "Mua khóa học", variant: "default" },
      COURSE_REFUND: { label: "Hoàn tiền", variant: "destructive" },
      ADMIN_ADJUST: { label: "Điều chỉnh", variant: "secondary" },
      REWARD: { label: "Thưởng", variant: "outline" },
    };

    const config = typeMap[type] || {
      label: type,
      variant: "default" as const,
    };
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading && !earnings) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Lỗi: {error}</p>
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
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Tổng số tiền đã kiếm được",
    },
    {
      title: "Số giao dịch",
      value: totalTransactions,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Tổng số giao dịch thu nhập",
    },
    {
      title: "Trung bình/giao dịch",
      value: formatCurrency(averageEarning),
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      description: "Thu nhập trung bình mỗi giao dịch",
    },
    {
      title: "Giao dịch gần nhất",
      value: formatCurrency(latestEarning),
      icon: Calendar,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Số tiền giao dịch mới nhất",
    },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 space-y-8 overflow-y-auto">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Quản lý thu nhập
          </h1>
          <p className="text-gray-500">
            Theo dõi và quản lý thu nhập từ các khóa học của bạn
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map(
            ({ title, value, icon: Icon, color, bgColor, description }) => (
              <Card key={title} className="hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-gray-800">
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Earnings History Table */}
        <Card>
          <CardHeader>
            <CardTitle>Lịch sử thu nhập</CardTitle>
          </CardHeader>
          <CardContent>
            {earnings && earnings.data.length > 0 ? (
              <>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Thời gian</TableHead>
                        <TableHead>Loại giao dịch</TableHead>
                        <TableHead>Khóa học ID</TableHead>
                        <TableHead className="text-right">Số tiền</TableHead>
                        <TableHead>Ghi chú</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {earnings.data.map((earning) => (
                        <TableRow key={earning.id}>
                          <TableCell className="font-medium">
                            {formatDate(earning.createdAt)}
                          </TableCell>
                          <TableCell>
                            {getTransactionTypeBadge(earning.type)}
                          </TableCell>
                          <TableCell>#{earning.courseId}</TableCell>
                          <TableCell className="text-right font-semibold text-green-600">
                            {formatCurrency(earning.amount)}
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {earning.transaction?.note || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between mt-4">
                  <p className="text-sm text-gray-600">
                    Hiển thị {(currentPage - 1) * pageSize + 1} -{" "}
                    {Math.min(
                      currentPage * pageSize,
                      earnings.pagination.total
                    )}{" "}
                    trong tổng số {earnings.pagination.total} giao dịch
                  </p>
                  <Pagination
                    total={earnings.pagination.totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Chưa có giao dịch thu nhập nào</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
