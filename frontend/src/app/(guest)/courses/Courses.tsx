"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import CourseCard from "@/components/course/CourseCard";
import CoursesFilter from "@/components/course/CoursesFilter";
import { Pagination } from "@/components/ui/pagination";
import LoadingScreen from "@/components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { fetchAllCourses } from "@/store/slice/course/coursesSlice";
import { AppDispatch } from "@/store";
import { motion } from "framer-motion";
import { BookOpen } from "lucide-react";

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

  return (
    <div className="min-h-screen pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="max-w-7xl mx-auto bg-white rounded-[3.5rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden"
      >
        <div className="p-10 lg:p-20">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-12">
            <div className="space-y-4">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full text-indigo-600"
              >
                <span className="w-2 h-2 bg-indigo-600 rounded-full animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em]">Khám phá tri thức</span>
              </motion.div>
              <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter leading-tight">
                Danh sách <br /> <span className="text-indigo-600">Khóa học</span>
              </h1>
            </div>

            <div className="flex-1 lg:max-w-3xl">
              <CoursesFilter
                onSearch={handleSearch}
                onSort={handleSort}
                onFilterBySpecialization={handleFilterBySpecialization}
              />
            </div>
          </div>

          <div className="border-t border-slate-50 pt-12">
            {loading ? (
              <LoadingScreen />
            ) : !courses || courses.length === 0 ? (
              <div className="py-20 text-center">
                 <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-50 rounded-[2rem] text-slate-300 mb-6">
                    <BookOpen size={40} />
                 </div>
                 <h3 className="text-xl font-black text-slate-900 mb-2 tracking-tight">Không tìm thấy khóa học</h3>
                 <p className="text-slate-400 font-medium">Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm của bạn.</p>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {courses.map((course) => (
                    <CourseCard key={course.id} course={course} />
                  ))}
                </div>

                <div className="flex justify-center mt-20">
                  <Pagination
                    total={pagination?.totalPages || 1}
                    page={params.page ?? 1}
                    onChange={handlePageChange}
                  />
                </div>
              </>
            )}
          </div>
        </div>
      </motion.div>
    </div>
  );
};


export default CoursesClient;
