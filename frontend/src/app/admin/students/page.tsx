"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllUsers } from "@/store/slice/userSlice";
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
import { Search, Loader2, User as UserIcon } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const StudentPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { users, loading } = useSelector((state: RootState) => state.user);

  // Unwrap students data correctly based on the slice structure
  const studentList = users?.data || [];
  const pagination = users?.pagination;

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1); // Reset to page 1 only if search term actually changed
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

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

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("vi-VN");
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Quản lý học viên</h1>
          <p className="text-gray-500 mt-1">
            Xem danh sách và thông tin chi tiết các học viên
          </p>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-medium">
              Danh sách học viên ({pagination?.total || 0})
            </CardTitle>
            <div className="relative w-72">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Tìm kiếm theo tên, email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading && (!studentList || studentList.length === 0) ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="w-[80px]">ID</TableHead>
                      <TableHead>Học viên</TableHead>
                      <TableHead>Thông tin liên hệ</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Số dư ví</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studentList.length > 0 ? (
                      studentList.map((student: any) => (
                        <TableRow key={student.id}>
                          <TableCell className="font-medium">
                            {student.id}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <Avatar>
                                <AvatarImage
                                  src={student.avatar}
                                  alt={student.fullname}
                                />
                                <AvatarFallback className="bg-blue-100 text-blue-600">
                                  {student.fullname?.charAt(0)?.toUpperCase() ||
                                    "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="font-medium text-gray-900">
                                  {student.fullname}
                                </span>
                                <span className="text-xs text-gray-500 uppercase">
                                  {student.gender || "N/A"}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col text-sm">
                              <span className="text-gray-700">
                                {student.email}
                              </span>
                              {student.phone ? (
                                <span className="text-gray-500 text-xs">
                                  {student.phone}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs italic">
                                  Chưa có SĐT
                                </span>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            {student.isVerified ? (
                              <Badge
                                variant="outline"
                                className="bg-green-50 text-green-700 border-green-200"
                              >
                                Đã xác thực
                              </Badge>
                            ) : (
                              <Badge
                                variant="outline"
                                className="bg-yellow-50 text-yellow-700 border-yellow-200"
                              >
                                Chưa xác thực
                              </Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <span className="font-medium text-gray-900">
                              {formatCurrency(student.walletBalance || 0)}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600">
                            {formatDate(student.createdAt)}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell
                          colSpan={6}
                          className="text-center py-10 text-gray-500"
                        >
                          Không tìm thấy học viên nào
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              {/* Pagination Controls */}
              {pagination && pagination.totalPages > 1 && (
                <div className="mt-4">
                  <Pagination
                    total={pagination.totalPages}
                    page={currentPage}
                    onChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentPage;
