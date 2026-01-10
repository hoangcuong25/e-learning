"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllCourses,
  deleteCourse,
  clearCourseState,
} from "@/store/slice/coursesSlice";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Pagination } from "@/components/ui/pagination";
import {
  Search,
  Loader2,
  Trash2,
  Eye,
  BookOpen,
  DollarSign,
  Users,
} from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Image from "next/image";

const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { courses, pagination, loading, error, successMessage } = useSelector(
    (state: RootState) => state.courses
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchAllCourses({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
      })
    );
  }, [dispatch, currentPage, pageSize, searchTerm]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(clearCourseState());
    }
    if (successMessage) {
      toast.success(successMessage);
      dispatch(clearCourseState());
    }
  }, [error, successMessage, dispatch]);

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteCourse(id)).unwrap();
      toast.success("Xóa khóa học thành công");
      dispatch(
        fetchAllCourses({
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
        })
      );
    } catch (err: any) {
      toast.error("Có lỗi xảy ra khi xóa khóa học");
    }
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleViewDetails = (courseId: number) => {
    router.push(`/admin/courses/${courseId}`);
  };

  // Calculate statistics
  const totalCourses = pagination?.total || 0;
  const publishedCourses = courses.filter((c) => c.isPublished).length;
  const totalRevenue = courses.reduce(
    (sum, course) => sum + (course.price || 0),
    0
  );

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý khóa học</h1>
          <p className="text-gray-500 mt-1">
            Quản lý danh sách các khóa học trên hệ thống
          </p>
        </div>
      </div>

      {/* Main Content */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Danh sách khóa học ({pagination?.total || 0})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm khóa học..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && courses.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* Desktop View: Table */}
              <div className="hidden md:block rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead className="w-[100px]">Hình ảnh</TableHead>
                      <TableHead>Tên khóa học</TableHead>
                      <TableHead>Giảng viên</TableHead>
                      <TableHead>Giá</TableHead>
                      <TableHead>Đánh giá</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courses.length > 0 ? (
                      courses.map((course) => (
                        <TableRow key={course.id}>
                          <TableCell className="font-medium">
                            {course.id}
                          </TableCell>
                          <TableCell>
                            <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100">
                              {course.thumbnail ? (
                                <Image
                                  src={course.thumbnail}
                                  alt={course.title}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="flex items-center justify-center h-full">
                                  <BookOpen className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-xs">
                              <div className="font-semibold text-blue-600 truncate">
                                {course.title}
                              </div>
                              {course.description ? (
                                <div
                                  className="text-xs text-gray-500 line-clamp-2"
                                  dangerouslySetInnerHTML={{
                                    __html:
                                      course.description.length > 100
                                        ? course.description.slice(0, 100) +
                                          "..."
                                        : course.description,
                                  }}
                                />
                              ) : (
                                <div className="text-xs text-gray-500">
                                  Chưa có mô tả
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {course.instructor?.avatar && (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden">
                                  <Image
                                    src={course.instructor.avatar}
                                    alt={course.instructor.fullname}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              )}
                              <span className="text-sm">
                                {course.instructor?.fullname || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-green-600">
                              {course.price === 0
                                ? "Miễn phí"
                                : `${course.price.toLocaleString("vi-VN")} ₫`}
                            </span>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-medium">
                                {course.averageRating?.toFixed(1) || "0.0"}
                              </span>
                              <span className="text-xs text-gray-500">
                                ({course.totalRating || 0})
                              </span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge
                              className={
                                course.isPublished
                                  ? "bg-green-100 text-green-800"
                                  : "bg-gray-100 text-gray-800"
                              }
                            >
                              {course.isPublished ? "Đã xuất bản" : "Nháp"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetails(course.id)}
                                className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                                title="Xem chi tiết"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>

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
                                      Hành động này không thể hoàn tác. Khóa học
                                      "{course.title}" sẽ bị xóa vĩnh viễn.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Hủy</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(course.id)}
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
                          Không tìm thấy khóa học nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View: Cards */}
              <div className="md:hidden space-y-4">
                {courses.length > 0 ? (
                  courses.map((course) => (
                    <Card key={course.id} className="p-4 shadow-sm">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex gap-3">
                          <div className="relative w-16 h-16 rounded-md overflow-hidden bg-gray-100 flex-shrink-0">
                            {course.thumbnail ? (
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                fill
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex items-center justify-center h-full">
                                <BookOpen className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-blue-600 line-clamp-1">
                              {course.title}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm font-semibold text-green-600">
                                {course.price === 0
                                  ? "Miễn phí"
                                  : `${course.price.toLocaleString("vi-VN")} ₫`}
                              </span>
                              <Badge
                                className={
                                  course.isPublished
                                    ? "bg-green-100 text-green-800 text-[10px]"
                                    : "bg-gray-100 text-gray-800 text-[10px]"
                                }
                              >
                                {course.isPublished ? "Đã xuất bản" : "Nháp"}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3" />
                          <span>{course.instructor?.fullname || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="text-yellow-500">★</span>
                          <span>
                            {course.averageRating?.toFixed(1) || "0.0"} (
                            {course.totalRating || 0})
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Eye className="w-3 h-3" />
                          <span>{course.viewCount || 0} views</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="w-3 h-3" />
                          <span>{course._count?.chapter || 0} chương</span>
                        </div>
                      </div>

                      <div className="flex justify-end gap-2 border-t pt-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewDetails(course.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Chi tiết
                        </Button>

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
                                Hành động này không thể hoàn tác. Khóa học "
                                {course.title}" sẽ bị xóa vĩnh viễn.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="gap-2">
                              <AlertDialogCancel className="mt-0">
                                Hủy
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => handleDelete(course.id)}
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
                    Không tìm thấy khóa học nào
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              total={pagination.totalPages}
              page={currentPage}
              onChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CoursesPage;
