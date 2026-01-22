"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader2 } from "lucide-react";
import { Pagination } from "@/components/ui/pagination";
import { AppDispatch, RootState } from "@/store";
import { fetchAllCourses } from "@/store/coursesSlice";
import CoursesFilter from "@/components/course/CoursesFilter";
import CourseCard from "@/components/course/CourseCard";
import { useRouter, useSearchParams } from "next/navigation";

const CoursesPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const searchParams = useSearchParams();

  // 🧩 Lấy params từ URL khi load trang
  const [params, setParams] = useState<PaginationParams>({
    page: Number(searchParams.get("page")) || 1,
    limit: Number(searchParams.get("limit")) || 8,
    search: searchParams.get("search") || "",
    sortBy: searchParams.get("sortBy") || "createdAt",
    order: (searchParams.get("order") as "asc" | "desc") || "desc",
  });

  const { courses, loading } = useSelector((state: RootState) => state.courses);

  // 🧩 Khi params thay đổi → fetch API + cập nhật URL
  useEffect(() => {
    // Tạo query string
    const query = new URLSearchParams({
      page: String(params.page),
      limit: String(params.limit),
      search: params.search ?? "",
      sortBy: params.sortBy ?? "",
      order: params.order ?? "",
    });
    router.replace(`?${query.toString()}`);

    // Gọi API
    dispatch(fetchAllCourses(params));
  }, [params, dispatch, router]);

  // 🔍 Tìm kiếm
  const handleSearch = (search: string) => {
    setParams((prev) => ({ ...prev, search, page: 1 }));
  };

  // 🔽 Sắp xếp
  const handleSort = (sortBy: string, order: "asc" | "desc") => {
    setParams((prev) => ({ ...prev, sortBy, order }));
  };

  // 📄 Chuyển trang
  const handlePageChange = (page: number) => {
    setParams((prev) => ({ ...prev, page }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">
        Danh sách khóa học
      </h1>

      <CoursesFilter onSearch={handleSearch} onSort={handleSort} />

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="animate-spin w-8 h-8 text-gray-500" />
        </div>
      ) : courses.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          Không tìm thấy khóa học nào.
        </p>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          <div className="flex justify-center mt-10">
            <Pagination
              total={10}
              page={params.page ?? 1}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesPage;
