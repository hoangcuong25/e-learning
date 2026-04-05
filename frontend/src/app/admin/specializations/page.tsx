"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchSpecializationsForAdmin,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "@/store/slice/common/specializationSlice";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { Pagination } from "@/components/ui/pagination";
import {
  Pencil,
  Trash2,
  Plus,
  Search,
  Loader2,
  Layers,
  Filter,
  ArrowRight,
  Info,
  BookOpen,
} from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const SpecializationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminList, pagination, loading, error } = useSelector(
    (state: RootState) => state.specialization,
  );

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState<number | null>(null);
  const [formData, setFormData] = useState({ name: "", desc: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    dispatch(
      fetchSpecializationsForAdmin({
        page: currentPage,
        limit: pageSize,
        search: searchTerm,
      }),
    );
  }, [dispatch, currentPage, pageSize, searchTerm]);

  const handleOpenDialog = (specialization?: any) => {
    if (specialization) {
      setIsEditing(true);
      setCurrentId(specialization.id);
      setFormData({
        name: specialization.name,
        desc: specialization.desc || specialization.description || "",
      });
    } else {
      setIsEditing(false);
      setCurrentId(null);
      setFormData({ name: "", desc: "" });
    }
    setIsDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.name.trim()) {
      toast.error("Tên chuyên ngành không được để trống");
      return;
    }

    try {
      if (isEditing && currentId) {
        await dispatch(
          updateSpecialization({
            id: currentId,
            data: { name: formData.name, desc: formData.desc || "" },
          }),
        ).unwrap();
        toast.success("Cập nhật chuyên ngành thành công");
      } else {
        await dispatch(
          createSpecialization({
            name: formData.name,
            desc: formData.desc || "",
          }),
        ).unwrap();
        toast.success("Tạo chuyên ngành thành công");
      }
      setIsDialogOpen(false);
      dispatch(
        fetchSpecializationsForAdmin({
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
        }),
      );
    } catch (error: any) {
      toast.error(error?.message || "Có lỗi xảy ra");
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await dispatch(deleteSpecialization(id)).unwrap();
      toast.success("Xóa chuyên ngành thành công");
    } catch (err: any) {
      toast.error("Có lỗi xảy ra khi xóa");
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
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl text-indigo-400">
              <Layers size={18} />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase">
              CHUYÊN NGÀNH <span className="text-indigo-500">ĐÀO TẠO</span>
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Quản lý cây danh mục chuyên ngành và lộ trình học tập của EduSmart.
          </p>
        </motion.div>

        <button
          onClick={() => handleOpenDialog()}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center gap-2 group"
        >
          <Plus
            size={14}
            className="group-hover:rotate-90 transition-transform duration-300"
          />
          Thêm chuyên ngành
        </button>
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
              placeholder="Tìm kiếm chuyên ngành..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-200 placeholder:text-slate-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-sm"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl text-slate-500 hover:text-white transition-colors cursor-pointer">
              <Filter size={18} />
            </div>
            <div className="w-px h-8 bg-slate-800 mx-1" />
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
              Tổng số:{" "}
              <span className="text-indigo-400">{pagination?.total || 0}</span>
            </p>
          </div>
        </div>

        <div className="overflow-x-auto relative z-10 p-2">
          {loading && adminList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 space-y-4">
              <div className="p-4 bg-indigo-600/10 rounded-3xl animate-spin">
                <Loader2 className="w-8 h-8 text-indigo-500" />
              </div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
                Đang đồng bộ dữ liệu...
              </p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-800 hover:bg-transparent">
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 px-6 w-[100px]">
                    Mã ID
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">
                    Chuyên ngành
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6">
                    Mô tả tóm tắt
                  </TableHead>
                  <TableHead className="text-[10px] font-black text-slate-500 uppercase tracking-widest py-6 text-right px-6">
                    Hành động
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody className="divide-y divide-slate-800/50">
                {adminList.length > 0 ? (
                  adminList.map((spec, idx) => (
                    <motion.tr
                      key={spec.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className="border-b border-slate-800/50 hover:bg-slate-800/30 transition-colors group"
                    >
                      <TableCell className="py-5 px-6">
                        <span className="text-xs font-bold text-slate-600 group-hover:text-slate-400 transition-colors">
                          #{spec.id}
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                        <span className="font-black text-white text-sm tracking-tight group-hover:text-indigo-400 transition-colors uppercase">
                          {spec.name}
                        </span>
                      </TableCell>
                      <TableCell className="py-5">
                        <div className="flex items-center gap-2 max-w-sm">
                          <p className="text-xs font-medium text-slate-500 line-clamp-1 group-hover:text-slate-400 transition-colors">
                            {spec.desc ||
                              spec.desc ||
                              "Chưa cập nhật mô tả cho chuyên ngành này."}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell className="py-5 text-right px-6">
                        <div className="flex justify-end gap-2 pr-2">
                          <button
                            onClick={() => handleOpenDialog(spec)}
                            className="p-2.5 bg-slate-950 border border-slate-800 rounded-xl text-slate-500 hover:text-white hover:bg-slate-900 transition-all hover:scale-110 shadow-lg"
                            title="Sửa"
                          >
                            <Pencil size={16} />
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
                                  XÓA CHUYÊN NGÀNH?
                                </AlertDialogTitle>
                                <AlertDialogDescription className="text-slate-400 font-medium">
                                  Hành động này sẽ ảnh hưởng đến các khóa học
                                  thuộc chuyên ngành
                                  <span className="text-rose-400 font-bold mx-1">
                                    "{spec.name}"
                                  </span>
                                  .
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter className="mt-6 gap-3">
                                <AlertDialogCancel className="bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest">
                                  Hủy bỏ
                                </AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() => handleDelete(spec.id)}
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
                    <TableCell
                      colSpan={4}
                      className="py-20 text-center text-slate-600"
                    >
                      <div className="flex flex-col items-center gap-4">
                        <div className="p-6 bg-slate-950 rounded-[2.5rem] border border-slate-800 opacity-50">
                          <Layers size={48} strokeWidth={1} />
                        </div>
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">
                          Không tìm thấy chuyên ngành nào
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.totalPages > 1 && (
          <div className="p-8 border-t border-slate-800 bg-slate-950/30 relative z-10 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest">
              Hiển thị{" "}
              <span className="text-indigo-500">{adminList.length}</span> trên{" "}
              <span className="text-indigo-500">{pagination.total}</span> kết
              quả
            </p>
            <Pagination
              total={pagination.totalPages}
              page={currentPage}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </motion.div>

      {/* Modernized Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[550px] bg-slate-900 border border-slate-800 rounded-[2.5rem] p-0 overflow-hidden shadow-2xl">
          <DialogHeader className="p-8 bg-slate-950/50 border-b border-slate-800 relative">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2" />
            <div className="flex items-center gap-3 relative z-10">
              <div className="p-2 bg-indigo-600/10 rounded-xl">
                <Plus size={18} className="text-indigo-400" />
              </div>
              <DialogTitle className="text-xl font-black text-white tracking-tighter uppercase">
                {isEditing ? "Cập nhật chuyên ngành" : "Thêm chuyên ngành mới"}
              </DialogTitle>
            </div>
          </DialogHeader>

          <div className="p-8 space-y-6 relative z-10">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1"
              >
                Tên chuyên ngành học <span className="text-rose-500">*</span>
              </label>
              <div className="relative group">
                <BookOpen className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ví dụ: Lập trình Web Fullstack..."
                  className="bg-slate-950 border-slate-800 rounded-2xl pl-12 py-6 text-white placeholder:text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-bold tracking-tight"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label
                htmlFor="desc"
                className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1"
              >
                Mô tả chi tiết ứng dụng
              </label>
              <div className="relative group">
                <Info className="absolute left-4 top-6 size-4 text-slate-600 group-focus-within:text-indigo-500 transition-colors" />
                <Textarea
                  id="desc"
                  value={formData.desc}
                  onChange={(e) =>
                    setFormData({ ...formData, desc: e.target.value })
                  }
                  placeholder="Nhập mô tả tóm tắt về chuyên ngành học này..."
                  className="bg-slate-950 border-slate-800 rounded-2xl pl-12 py-4 text-white placeholder:text-slate-700 focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all font-medium text-sm min-h-[120px]"
                />
              </div>
            </div>
          </div>

          <DialogFooter className="p-8 pt-0 flex gap-3">
            <button
              onClick={() => setIsDialogOpen(false)}
              className="flex-1 px-6 py-4 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Hủy bỏ
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-[2] px-6 py-4 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {isEditing ? "Lưu thay đổi hệ thống" : "Xác nhận tạo mới"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecializationPage;
