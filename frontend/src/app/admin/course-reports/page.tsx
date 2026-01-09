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

const CourseReportsPage = () => {
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
          <h1 className="text-3xl font-bold text-gray-800">Báo cáo khóa học</h1>
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
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[80px]">ID</TableHead>
                    <TableHead>Tiêu đề</TableHead>
                    <TableHead>Loại báo cáo</TableHead>
                    <TableHead>Khóa học bị báo cáo</TableHead>
                    <TableHead>Người báo cáo</TableHead>
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
                          <div
                            className="font-medium text-gray-900 truncate max-w-[200px]"
                            title={report.title}
                          >
                            {report.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="bg-orange-50 text-orange-700 border-orange-200"
                          >
                            {report.type || "Khác"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm text-blue-600 hover:underline cursor-pointer">
                            {report.course?.title ||
                              `Course #${report.courseId}`}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {report.user?.fullname ||
                              report.user?.email ||
                              `User #${report.userId}`}
                          </div>
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
                                      Tiêu đề
                                    </h4>
                                    <p className="text-sm text-gray-900 border p-2 rounded bg-gray-50">
                                      {report.title}
                                    </p>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-semibold text-gray-700">
                                      Nội dung
                                    </h4>
                                    <div className="text-sm text-gray-900 border p-2 rounded bg-gray-50 min-h-[100px] whitespace-pre-wrap">
                                      {report.description ||
                                        "Không có nội dung chi tiết"}
                                    </div>
                                  </div>
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700">
                                        Người báo cáo
                                      </h4>
                                      <p className="text-sm">
                                        {report.user?.fullname || "Ẩn danh"}
                                      </p>
                                    </div>
                                    <div>
                                      <h4 className="text-sm font-semibold text-gray-700">
                                        Khóa học
                                      </h4>
                                      <p className="text-sm">
                                        {report.course?.title || "N/A"}
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
                                    Hành động này không thể hoàn tác. Báo cáo #
                                    {report.id} sẽ bị xóa vĩnh viễn.
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
                        colSpan={7}
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

export default CourseReportsPage;
