"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAllCourses,
  deleteCourse,
  clearCourseState,
} from "@/store/slice/course/coursesSlice";
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
  TrendingUp,
  Filter,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
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
    (sum, course) => sum + (Number(course.price) || 0),
    0
  );

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
                <BookOpen size={18} />
             </div>
             <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
               QUẢN LÝ <span className="text-indigo-500">KHÓA HỌC</span>
             </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Tổng số {pagination?.total || 0} khóa học đang được vận hành trên hệ thống.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all">
            <TrendingUp size={14} className="text-emerald-400" /> Thống kê
          </button>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
            Tạo khóa học
          </button>
        </div>
      </div>

      {/* Main Content Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] overflow-hidden shadow-2xl relative"
      >
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-600/5 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        {/* Toolbar */}
        <div className="p-8 border-b border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="relative w-full max-w-md group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
            <input
              placeholder="Tìm kiếm khóa học..."
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
               Hiển thị: <span className="text-indigo-400">{pageSize} mục</span>
             </p>
          </div>
        </div>

        <div className="p-2 relative z-10">
          {loading && courses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
                 <Loader2 className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Đang tải dữ liệu khóa học...</p>
            </div>
          ) : (
            <>
              {/* Desktop View: Table */}
              <div className="hidden md:block">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-slate-800 hover:bg-transparent">
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 px-6">ID</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Khóa học</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Giảng viên</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Học phí</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-center">Đánh giá</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">Trạng thái</TableHead>
                      <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-right px-6">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody className="divide-y divide-slate-800/50">
                    {courses.length > 0 ? (
                      courses.map((course, idx) => (
                        <motion.tr 
                          key={course.id}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: idx * 0.05 }}
                          className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                        >
                          <TableCell className="py-5 px-6">
                            <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400 transition-colors">#{course.id}</span>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex items-center gap-4">
                              <div className="relative w-24 h-14 rounded-xl overflow-hidden bg-slate-950 border border-slate-800 ring-2 ring-transparent group-hover:ring-indigo-500/30 transition-all duration-300 shadow-lg">
                                {course.thumbnail ? (
                                  <Image
                                    src={course.thumbnail}
                                    alt={course.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                                  />
                                ) : (
                                  <div className="flex items-center justify-center h-full">
                                    <BookOpen className="w-5 h-5 text-slate-700" />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col min-w-0 max-w-[200px]">
                                <span className="font-black text-white text-sm tracking-tight truncate group-hover:text-indigo-400 transition-colors">
                                  {course.title}
                                </span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1 line-clamp-1">
                                  {course.specializations?.[0]?.specialization?.name || "Chưa phân loại"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex items-center gap-3">
                              {course.instructor?.avatar ? (
                                <div className="relative w-8 h-8 rounded-full overflow-hidden border border-slate-800">
                                  <Image
                                    src={course.instructor.avatar}
                                    alt={course.instructor.fullname}
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                              ) : (
                                <div className="w-8 h-8 bg-slate-800 rounded-full flex items-center justify-center text-[10px] font-black text-indigo-400">
                                   {course.instructor?.fullname?.charAt(0)}
                                </div>
                              )}
                              <span className="text-xs font-medium text-slate-400 group-hover:text-slate-200 transition-colors">
                                {course.instructor?.fullname || "N/A"}
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <div className="flex flex-col">
                               <span className={`text-sm font-black tracking-tighter ${course.price === 0 ? 'text-emerald-400' : 'text-white'}`}>
                                 {course.price === 0
                                   ? "MIỄN PHÍ"
                                   : `${course.price.toLocaleString("vi-VN")} ₫`}
                               </span>
                               {course.price !== 0 && <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">VN ĐỒNG</span>}
                            </div>
                          </TableCell>
                          <TableCell className="py-5 text-center">
                            <div className="flex flex-col items-center gap-0.5">
                              <div className="flex items-center gap-1">
                                <span className="text-amber-500 text-xs shadow-amber-500/20 shadow-sm">★</span>
                                <span className="text-sm font-black text-white tracking-tighter">
                                  {course.averageRating?.toFixed(1) || "0.0"}
                                </span>
                              </div>
                              <span className="text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                                ({course.totalRating || 0} HV)
                              </span>
                            </div>
                          </TableCell>
                          <TableCell className="py-5">
                            <Badge
                              className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${
                                course.isPublished
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                                  : "bg-slate-800 text-slate-500 border-slate-700"
                              }`}
                            >
                              {course.isPublished ? "Published" : "Draft"}
                            </Badge>
                          </TableCell>
                          <TableCell className="py-5 text-right px-6">
                            <div className="flex justify-end gap-2 pr-2">
                              <button
                                onClick={() => handleViewDetails(course.id)}
                                className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:bg-slate-900 transition-all hover:scale-110 shadow-lg"
                                title="Xem chi tiết"
                              >
                                <Eye size={16} />
                              </button>

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
                                    <AlertDialogTitle className="text-xl font-black text-white tracking-tighter">
                                      QUYẾT ĐỊNH XÓA KHÓA HỌC?
                                    </AlertDialogTitle>
                                    <AlertDialogDescription className="text-slate-400 font-medium">
                                      Hành động này không thể hoàn tác. Khóa học
                                      <span className="text-rose-400 font-bold mx-1">"{course.title}"</span> sẽ bị gỡ bỏ vĩnh viễn khỏi nền tảng.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter className="mt-6 gap-3">
                                    <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">Hủy bỏ</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => handleDelete(course.id)}
                                      className="bg-rose-600 hover:bg-rose-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-rose-600/20"
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
                                <BookOpen size={48} strokeWidth={1} />
                            </div>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em]">Không tìm thấy khóa học nào</p>
                          </div>
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile View: Cards */}
              <div className="md:hidden grid grid-cols-1 gap-6 px-4 py-6">
                {courses.length > 0 ? (
                  courses.map((course, idx) => (
                    <motion.div 
                      key={course.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-slate-950/50 border border-slate-800 rounded-3xl overflow-hidden p-5 shadow-lg group"
                    >
                      <div className="flex gap-4 mb-4">
                        <div className="relative w-24 h-16 rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 shadow-xl flex-shrink-0">
                          {course.thumbnail ? (
                            <Image
                              src={course.thumbnail}
                              alt={course.title}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex items-center justify-center h-full">
                              <BookOpen className="w-6 h-6 text-slate-800" />
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col justify-center min-w-0">
                          <h3 className="font-black text-white text-sm tracking-tight truncate">
                            {course.title}
                          </h3>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-xs font-black tracking-tight ${course.price === 0 ? 'text-emerald-400' : 'text-indigo-400'}`}>
                              {course.price === 0
                                ? "Free"
                                : `${course.price.toLocaleString("vi-VN")} ₫`}
                            </span>
                            <Badge className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${
                              course.isPublished ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-800 text-slate-500 border-slate-700'
                            }`}>
                              {course.isPublished ? "Public" : "Draft"}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3 pb-4 border-b border-slate-800/50 mb-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                           <Users size={12} className="text-indigo-500" />
                           <span className="truncate">{course.instructor?.fullname || "N/A"}</span>
                        </div>
                        <div className="flex items-center gap-1 justify-end">
                           <span className="text-amber-500">★</span>
                           <span className="text-white font-black">{course.averageRating?.toFixed(1) || "0.0"}</span>
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleViewDetails(course.id)}
                          className="flex-1 py-3.5 bg-slate-800 hover:bg-slate-700 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
                        >
                          Chi tiết
                        </button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <button className="px-5 py-3.5 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 text-rose-400 rounded-2xl transition-all">
                              <Trash2 size={16} />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-[90vw]">
                            <AlertDialogHeader>
                              <AlertDialogTitle className="text-lg font-black text-white tracking-tighter uppercase">Xóa khóa học?</AlertDialogTitle>
                              <AlertDialogDescription className="text-xs text-slate-400">"{course.title}" sẽ biến mất mãi mãi.</AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="mt-4 gap-2">
                              <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-400 rounded-xl text-[9px] font-black uppercase">Không</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(course.id)} className="bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-[9px] font-black uppercase">Xóa ngay</AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-20 text-[10px] font-black text-slate-600 uppercase tracking-widest bg-slate-950/30 rounded-3xl border border-slate-800 border-dashed">
                    Không có khóa học nào
                  </div>
                )}
              </div>
            </>
          )}

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="p-8 border-t border-slate-800 bg-slate-950/30 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
                Hiển thị <span className="text-indigo-500">{courses.length}</span> trên <span className="text-indigo-500">{pagination.total}</span> kết quả
              </p>
              <div className="flex items-center gap-2">
                <Pagination
                  total={pagination.totalPages}
                  page={currentPage}
                  onChange={setCurrentPage}
                />
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default CoursesPage;
