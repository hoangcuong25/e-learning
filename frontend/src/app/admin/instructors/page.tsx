"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Search, Loader2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAllApplications } from "@/store/slice/instructorSlice";
import { fetchAllUsers } from "@/store/slice/userSlice";
import Applications from "@/components/instructor/Applications";
import { Pagination } from "@/components/ui/pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

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
  const [pageSize] = useState(10);

  const pendingApps = applications.filter((a) => a.status === "PENDING");

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
      setCurrentPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    dispatch(fetchAllApplications());
  }, [dispatch]);

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

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            Quản lý giảng viên
          </h1>
          <p className="text-gray-500 mt-1">
            Xem danh sách giảng viên và xử lý các đơn ứng tuyển.
          </p>
        </div>

        {tab === "instructors" && (
          <div className="relative w-72">
            <Input
              placeholder="Tìm theo tên hoặc email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setTab("instructors")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "instructors"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Giảng viên
        </button>
        <button
          onClick={() => setTab("applications")}
          className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
            tab === "applications"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
        >
          Ứng tuyển ({pendingApps.length})
        </button>
      </div>

      {/* Instructors Table */}
      {tab === "instructors" && (
        <section className="mt-6">
          {loading && instructorsList.length === 0 ? (
            <div className="flex justify-center py-10">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
          ) : (
            <>
              <div className="rounded-md border bg-white overflow-hidden">
                <table className="min-w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Giảng viên
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Ngày tham gia
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                        Trạng thái
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-200 bg-white">
                    {instructorsList.length > 0 ? (
                      instructorsList.map((ins) => (
                        <tr
                          key={ins.id}
                          className="hover:bg-gray-50 transition"
                        >
                          {/* Instructor */}
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <Avatar className="h-9 w-9">
                                <AvatarImage
                                  src={ins.avatar}
                                  alt={ins.fullname}
                                />
                                <AvatarFallback>
                                  {ins.fullname?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>

                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {ins.fullname}
                                </div>
                                <div className="text-xs text-gray-500">
                                  ID: {ins.id}
                                </div>
                              </div>
                            </div>
                          </td>

                          {/* Email */}
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {ins.email}
                          </td>

                          {/* Created At */}
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {ins.createdAt
                              ? new Date(ins.createdAt).toLocaleDateString(
                                  "vi-VN"
                                )
                              : "--"}
                          </td>

                          {/* Status */}
                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={
                                ins.isVerified
                                  ? "bg-green-50 text-green-700 border-green-200"
                                  : "bg-yellow-50 text-yellow-700 border-yellow-200"
                              }
                            >
                              {ins.isVerified ? "Đã xác thực" : "Chưa xác thực"}
                            </Badge>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan={4}
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

      {/* Applications */}
      {tab === "applications" && <Applications applications={applications} />}
    </div>
  );
}
