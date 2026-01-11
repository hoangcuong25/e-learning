"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/course/CourseCard";
import CoursesFilter from "@/components/course/CoursesFilter";
import { Pagination } from "@/components/ui/pagination";
import LoadingScreen from "@/components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAllCourses } from "@/store/slice/coursesSlice";
import { AppDispatch } from "@/store";

interface Props {
  initialParams: PaginationParams;
}

const CoursesClient = ({ initialParams }: Props) => {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const { courses, pagination, loading } = useSelector(
    (state: RootState) => state.courses
  );

  const [params, setParams] = useState(initialParams);

  useEffect(() => {
    const fetchData = async () => {
      const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
        search: params.search ?? "",
        specialization: params.specialization ?? "",
        sortBy: params.sortBy ?? "",
        order: params.order ?? "desc",
      });

      router.replace(`?${query.toString()}`, { scroll: false });

      dispatch(fetchAllCourses(params));
    };

    fetchData();
  }, [params, dispatch]);
  const handleSearch = (search: string) =>
    setParams({ ...params, search, page: 1 });

  const handleSort = (sortBy: string, order: "asc" | "desc") =>
    setParams({ ...params, sortBy, order });

  const handlePageChange = (page: number) => setParams({ ...params, page });

  const handleFilterBySpecialization = (specName: string | null) =>
    setParams({ ...params, specialization: specName ?? "", page: 1 });

  console.log(courses);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách khóa học</h1>

      <CoursesFilter
        onSearch={handleSearch}
        onSort={handleSort}
        onFilterBySpecialization={handleFilterBySpecialization}
      />

      {loading ? (
        <LoadingScreen />
      ) : !courses || courses.length === 0 ? (
        <p className="text-center text-gray-500 py-10">
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
              total={pagination?.totalPages || 1}
              page={params.page ?? 1}
              onChange={handlePageChange}
            />
          </div>
        </>
      )}
    </div>
  );
};

export default CoursesClient;
