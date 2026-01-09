"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Plus, MoreHorizontal, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllApplications } from "@/store/slice/instructorSlice";
import Applications from "@/components/instructor/Applications";
import { fetchAllUsers } from "@/store/slice/userSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Pagination } from "@/components/ui/pagination";

export default function AdminDashboardInstructorsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { applications } = useSelector((state: RootState) => state.instructor);
  const { users, loading } = useSelector((state: RootState) => state.user);

  const instructorsList = users?.data || [];
  const pagination = users?.pagination;

  const [tab, setTab] = useState<"instructors" | "applications">("instructors");
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      if (searchTerm !== debouncedSearch) {
        setCurrentPage(1);
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

  // Fetch instructors when tab is active
  useEffect(() => {
    if (tab === "instructors") {
      dispatch(
        fetchAllUsers({
          page: currentPage,
          limit: pageSize,
          search: debouncedSearch,
          role: "INSTRUCTOR",
        })
      );
    }
  }, [dispatch, tab, currentPage, pageSize, debouncedSearch]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý giảng viên
          </h1>
          <p className="text-gray-500 mt-1">
            Xem danh sách giảng viên, số bài giảng và xử lý các đơn ứng tuyển.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {tab === "instructors" && (
            <div className="relative w-72">
              <Input
                placeholder="Tìm kiếm tên hoặc email..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8"
              />
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("instructors")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            tab === "instructors"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Giảng viên
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-4 py-2 text-sm font-medium transition-colors border-b-2 ${
            tab === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Ứng tuyển ({pendingApps.length})
        </button>
      </div>

      {/* Content */}
      {tab === "instructors" && (
        <section className="mt-6">
          {loading && (!instructorsList || instructorsList.length === 0) ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              {/* instructors table */}
              <div className="rounded-md border bg-white">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Giảng viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Số bài giảng
                      </th> */}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trạng thái
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Hành động
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {instructorsList.length > 0 ? (
                      instructorsList.map((ins) => (
                        <tr key={ins.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {ins.fullname}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {ins.email}
                          </td>
                          {/* <td className="px-6 py-4 text-sm text-gray-700">
                            {0}
                          </td> */}
                          <td className="px-6 py-4 whitespace-nowrap">
                            <Badge
                              variant="outline"
                              className={`
                                ${
                                  ins.isVerified
                                    ? "bg-green-50 text-green-700 border-green-200"
                                    : "bg-yellow-50 text-yellow-700 border-yellow-200"
                                }
                              `}
                            >
                              {ins.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                            </Badge>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" className="h-8 w-8 p-0">
                                  <span className="sr-only">Open menu</span>
                                  <MoreHorizontal className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                                <DropdownMenuItem>
                                  Xem chi tiết
                                </DropdownMenuItem>
                                <DropdownMenuItem>Chỉnh sửa</DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem className="text-red-600">
                                  Xóa giảng viên
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-10 text-center text-gray-500"
                        >
                          Không tìm thấy giảng viên nào.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

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
            </>
          )}
        </section>
      )}

      {tab === "applications" && <Applications applications={applications} />}
    </div>
  );
}
