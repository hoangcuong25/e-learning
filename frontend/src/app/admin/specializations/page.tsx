"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchSpecializationsForAdmin,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization,
} from "@/store/slice/specializationSlice";
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
import { Pencil, Trash2, Plus, Search, Loader2 } from "lucide-react";
import { toast } from "sonner";

const SpecializationPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { adminList, pagination, loading, error } = useSelector(
    (state: RootState) => state.specialization
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
      })
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
          })
        ).unwrap();
        toast.success("Cập nhật chuyên ngành thành công");
      } else {
        await dispatch(
          createSpecialization({
            name: formData.name,
            desc: formData.desc || "",
          })
        ).unwrap();
        toast.success("Tạo chuyên ngành thành công");
      }
      setIsDialogOpen(false);
      dispatch(
        fetchSpecializationsForAdmin({
          page: currentPage,
          limit: pageSize,
          search: searchTerm,
        })
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
    setCurrentPage(1); // Reset to first page on search
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý chuyên ngành
          </h1>
          <p className="text-gray-500 mt-1">
            Quản lý danh sách các chuyên ngành học
          </p>
        </div>
        <Button
          onClick={() => handleOpenDialog()}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm chuyên ngành
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Danh sách chuyên ngành ({pagination?.total || 0})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm chuyên ngành..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && adminList.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow className="bg-gray-50">
                    <TableHead className="w-[100px]">ID</TableHead>
                    <TableHead>Tên chuyên ngành</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {adminList.length > 0 ? (
                    adminList.map((spec) => (
                      <TableRow key={spec.id}>
                        <TableCell className="font-medium">{spec.id}</TableCell>
                        <TableCell className="font-semibold text-blue-600">
                          {spec.name}
                        </TableCell>
                        <TableCell className="text-gray-600 max-w-md truncate">
                          {spec.desc || "Chưa có mô tả"}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleOpenDialog(spec)}
                              className="h-8 w-8 p-0 border-blue-200 text-blue-600 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 transition-colors"
                              title="Chỉnh sửa"
                            >
                              <Pencil className="w-4 h-4" />
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
                                    Hành động này không thể hoàn tác. Chuyên
                                    ngành "{spec.name}" sẽ bị xóa vĩnh viễn.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Hủy</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={() => handleDelete(spec.id)}
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
                        colSpan={4}
                        className="text-center py-10 text-gray-500"
                      >
                        Không tìm thấy chuyên ngành nào
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          {/* Pagination Controls */}
          {pagination && pagination.totalPages > 1 && (
            <Pagination
              total={pagination.totalPages}
              page={currentPage}
              onChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Cập nhật chuyên ngành" : "Thêm chuyên ngành mới"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Tên chuyên ngành <span className="text-red-500">*</span>
              </label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                placeholder="Nhập tên chuyên ngành..."
              />
            </div>
            <div className="grid gap-2">
              <label htmlFor="desc" className="text-sm font-medium">
                Mô tả
              </label>
              <Textarea
                id="desc"
                value={formData.desc}
                onChange={(e) =>
                  setFormData({ ...formData, desc: e.target.value })
                }
                placeholder="Nhập mô tả chuyên ngành..."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Hủy
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {isEditing ? "Lưu thay đổi" : "Tạo mới"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SpecializationPage;
