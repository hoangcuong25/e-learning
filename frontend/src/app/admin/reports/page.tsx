"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllReports,
  deleteReport,
  clearReportState,
} from "@/store/slice/reportSlice";
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
import { Search, Loader2, Trash2, Eye, FileText } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý báo cáo</h1>
          <p className="text-gray-500 mt-1">
            Quản lý các báo cáo vi phạm từ người dùng
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Danh sách báo cáo ({pagination?.total || 0})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm báo cáo..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && reports.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Desktop View: Table */}
              <div className="hidden lg:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Mục tiêu</TableHead>
                      <TableHead>Target ID</TableHead>
                      <TableHead>Lý do</TableHead>
                      <TableHead>Người báo cáo</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.length > 0 ? (
                      reports.map((report) => (
                        <TableRow key={report.id}>
                          <TableCell className="font-medium">
                            {report.id}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{report.targetType}</Badge>
                          </TableCell>
                          <TableCell>#{report.targetId}</TableCell>
                          <TableCell>
                            <div
                              className="font-medium text-gray-900 truncate max-w-[150px]"
                              title={ReportReasonTranslation[report.reason]}
                            >
                              {ReportReasonTranslation[report.reason]}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {report.reporter?.fullname ||
                                report.reporter?.email ||
                                `User #${report.reporterId}`}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                report.status === ReportStatus.PENDING
                                  ? "bg-yellow-100 text-yellow-800"
                                  : report.status === ReportStatus.RESOLVED
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }
                            >
                              {ReportStatusTranslation[report.status]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <span className="text-sm text-gray-500">
                              {report.createdAt
                                ? new Date(report.createdAt).toLocaleDateString(
                                    "vi-VN",
                                    {
                                      year: "numeric",
                                      month: "2-digit",
                                      day: "2-digit",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )
                                : "N/A"}
                            </span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              {/* View Details Dialog */}
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setSelectedReport(report)}
                                    className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:border-blue-300 transition-colors"
                                    title="Xem chi tiết"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                </DialogTrigger>
                                <DialogContent className="max-w-md">
                                  <DialogHeader>
                                    <DialogTitle>
                                      Chi tiết báo cáo #{report.id}
                                    </DialogTitle>
                                    <DialogDescription>
                                      Thông tin chi tiết về nội dung báo cáo
                                    </DialogDescription>
                                  </DialogHeader>
                                  <div className="space-y-4 mt-2">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700">
                                        Lý do
                                      </h4>
                                      <p className="text-sm text-gray-900 border p-2 rounded bg-gray-50">
                                        {report.reason}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700">
                                        Mô tả chi tiết
                                      </h4>
                                      <div className="text-sm text-gray-900 border p-2 rounded bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                                        {report.description ||
                                          "Không có mô tả chi tiết"}
                                      </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-700">
                                          Người báo cáo
                                        </h4>
                                        <p className="text-sm">
                                          {report.reporter?.fullname ||
                                            "Ẩn danh"}
                                        </p>
                                      </div>
                                      <div>
                                        <h4 className="text-sm font-semibold text-gray-700">
                                          Đối tượng
                                        </h4>
                                        <p className="text-sm">
                                          {report.targetType} #{report.targetId}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </DialogContent>
                              </Dialog>

                              {/* Delete Alert */}
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-8 w-8 p-0 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 transition-colors"
                                    title="Xóa"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>
                                      Bạn có chắc chắn muốn xóa?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Hành động này không thể hoàn tác. Báo cáo
                                      #{report.id} sẽ bị xóa vĩnh viễn.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(report.id)}
                                      className="bg-red-600 hover:bg-red-700"
                                    >
                                      Xóa
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={8}
                          className="text-center py-10 text-gray-500"
                        >
                          <div className="flex flex-col items-center justify-center gap-2">
                            <FileText className="w-8 h-8 text-gray-300" />
                            <p>Không tìm thấy báo cáo nào</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View: Cards */}
              <div className="lg:hidden space-y-4">
                {reports.length > 0 ? (
                  reports.map((report) => (
                    <Card key={report.id} className="p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="text-xs text-gray-400">
                            #{report.id} •{" "}
                            {report.createdAt
                              ? new Date(report.createdAt).toLocaleDateString(
                                  "vi-VN",
                                  {
                                    day: "2-digit",
                                    month: "2-digit",
                                    year: "numeric",
                                  }
                                )
                              : "N/A"}
                          </p>
                          <h3 className="font-semibold mt-1">
                            {report.reason}
                          </h3>
                        </div>
                        <Badge variant="outline">{report.targetType}</Badge>
                      </div>

                      <div className="space-y-2 text-sm text-gray-600 mb-4">
                        <div className="flex gap-2">
                          <span className="font-medium min-w-[70px]">
                            Reporter:
                          </span>
                          <span className="text-gray-900 truncate">
                            {report.reporter?.fullname ||
                              report.reporter?.email ||
                              `User #${report.reporterId}`}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <span className="font-medium min-w-[70px]">
                            Target:
                          </span>
                          <span className="text-blue-600 truncate">
                            {report.targetType} #{report.targetId}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t pt-3">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedReport(report)}
                              className=" text-blue-600 border-blue-200 hover:bg-blue-50"
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Chi tiết
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-md w-[95vw] rounded-lg">
                            <DialogHeader>
                              <DialogTitle>
                                Chi tiết báo cáo #{report.id}
                              </DialogTitle>
                              <DialogDescription>
                                Thông tin chi tiết về nội dung báo cáo
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 mt-2">
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700">
                                  Lý do
                                </h4>
                                <p className="text-sm text-gray-900 border p-2 rounded bg-gray-50">
                                  {report.reason}
                                </p>
                              </div>
                              <div>
                                <h4 className="text-sm font-semibold text-gray-700">
                                  Mô tả
                                </h4>
                                <div className="text-sm text-gray-900 border p-2 rounded bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                                  {report.description ||
                                    "Không có nội dung chi tiết"}
                                </div>
                              </div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700">
                                    Người báo cáo
                                  </h4>
                                  <p className="text-sm">
                                    {report.reporter?.fullname || "Ẩn danh"}
                                  </p>
                                </div>
                                <div>
                                  <h4 className="text-sm font-semibold text-gray-700">
                                    Đối tượng
                                  </h4>
                                  <p className="text-sm">
                                    {report.targetType} #{report.targetId}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>

                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-red-600 border-red-200 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Xóa
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="w-[95vw] rounded-lg">
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Bạn có chắc chắn muốn xóa?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Hành động này không thể hoàn tác. Báo cáo #
                                {report.id} sẽ bị xóa vĩnh viễn.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                              <AlertDialogCancel className="mt-0">
                                Hủy
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(report.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
                                Xóa
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-10 text-gray-500 border rounded-md bg-white">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <FileText className="w-8 h-8 text-gray-300" />
                      <p>Không tìm thấy báo cáo nào</p>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="mt-4">
              <Pagination
                total={pagination.totalPages}
                page={currentPage}
                onChange={setCurrentPage}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportsPage;
