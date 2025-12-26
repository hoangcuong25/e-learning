"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/course/CourseCard";
import CoursesFilter from "@/components/course/CoursesFilter";
import { Pagination } from "@/components/ui/pagination";
import LoadingScreen from "@/components/LoadingScreen";
import { getAllCoursesApi } from "@/api/courses.api";

interface Props {
  initialCourses: any[];
  totalPages: number;
  initialParams: PaginationParams;
}

const CoursesClient = ({
  initialCourses,
  totalPages,
  initialParams,
}: Props) => {
  const router = useRouter();
  const [params, setParams] = useState(initialParams);
  const [courses, setCourses] = useState(initialCourses ?? []);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let isFirst = true;

    const fetchData = async () => {
      if (isFirst) {
        isFirst = false;
        return; //  Bỏ qua lần đầu
      }

      setLoading(true);
      const query = new URLSearchParams({
        page: String(params.page),
        limit: String(params.limit),
        search: params.search ?? "",
        sortBy: params.sortBy ?? "",
        order: params.order ?? "desc",
      });

      router.replace(`?${query.toString()}`, { scroll: false });

      const data = await getAllCoursesApi(params);
      setCourses(data?.courses ?? []);
      setLoading(false);
    };

    fetchData();
  }, [params]);

  const handleSearch = (search: string) =>
    setParams({ ...params, search, page: 1 });

  const handleSort = (sortBy: string, order: "asc" | "desc") =>
    setParams({ ...params, sortBy, order });

  const handlePageChange = (page: number) => setParams({ ...params, page });

  console.log(courses);
  console.log("initialCourses", initialCourses);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Danh sách khóa học</h1>

      <CoursesFilter onSearch={handleSearch} onSort={handleSort} />

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
              total={totalPages}
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
