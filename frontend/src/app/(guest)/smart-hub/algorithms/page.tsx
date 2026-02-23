"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Code2,
  ArrowLeft,
  Lightbulb,
  Search,
  Filter,
  ChevronRight,
  CheckCircle2,
  Clock,
  BarChart3,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchAlgorithmCategories,
  fetchAlgorithmProblems,
} from "@/store/slice/common/algorithmSlice";

const AlgorithmsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { categories, problems, loading } = useSelector(
    (state: RootState) => state.algorithm
  );

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");

  useEffect(() => {
    dispatch(fetchAlgorithmCategories());
  }, [dispatch]);

  useEffect(() => {
    dispatch(
      fetchAlgorithmProblems({
        categoryId:
          selectedCategory !== "all" ? Number(selectedCategory) : undefined,
        difficulty:
          selectedDifficulty !== "all" ? selectedDifficulty : undefined,
        search: search || undefined,
      })
    );
  }, [dispatch, selectedCategory, selectedDifficulty, search]);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "bg-emerald-50 text-emerald-600 border-emerald-100";
      case "MEDIUM":
        return "bg-amber-50 text-amber-600 border-amber-100";
      case "HARD":
        return "bg-rose-50 text-rose-600 border-rose-100";
      default:
        return "bg-slate-50 text-slate-600 border-slate-100";
    }
  };

  const getDifficultyLabel = (difficulty: string) => {
    switch (difficulty) {
      case "EASY":
        return "Dễ";
      case "MEDIUM":
        return "Trung bình";
      case "HARD":
        return "Khó";
      default:
        return difficulty;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/50 py-12 px-6">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <Link
                href="/smart-hub"
                className="inline-flex items-center text-slate-500 hover:text-blue-600 font-medium transition-colors group"
              >
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Quay lại Smart Hub
              </Link>
            </motion.div>
            <div className="space-y-2">
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                Thử thách <span className="text-blue-600">Thuật toán</span>
              </h1>
              <p className="text-slate-500 text-lg max-w-xl">
                Luyện tập kỹ năng lập trình và tư duy thuật toán với các bài
                toán từ cơ bản đến nâng cao.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-white p-2 rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-4 text-center border-r border-slate-100">
              <div className="text-xl font-bold text-slate-900">
                {problems?.length || 0}
              </div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Bài tập
              </div>
            </div>
            <div className="px-4 text-center">
              <div className="text-xl font-bold text-blue-600">0</div>
              <div className="text-[10px] font-bold uppercase text-slate-400">
                Đã giải
              </div>
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
          <div className="grid md:grid-cols-4 gap-4">
            <div className="md:col-span-2 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Tìm kiếm bài tập..."
                className="pl-11 h-12 rounded-xl bg-slate-50 border-transparent focus:bg-white transition-all"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <Select
              value={selectedCategory}
              onValueChange={setSelectedCategory}
            >
              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent">
                <SelectValue placeholder="Chủ đề" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả chủ đề</SelectItem>
                {categories?.map((cat: AlgorithmCategoryType) => (
                  <SelectItem key={cat.id} value={cat.id.toString()}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select
              value={selectedDifficulty}
              onValueChange={setSelectedDifficulty}
            >
              <SelectTrigger className="h-12 rounded-xl bg-slate-50 border-transparent">
                <SelectValue placeholder="Độ khó" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Độ khó</SelectItem>
                <SelectItem value="EASY">Dễ</SelectItem>
                <SelectItem value="MEDIUM">Trung bình</SelectItem>
                <SelectItem value="HARD">Khó</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* Problems List */}
        <div className="space-y-4">
          {loading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-24 bg-white rounded-3xl border border-slate-200 animate-pulse"
              />
            ))
          ) : problems && problems.length > 0 ? (
            <div className="grid gap-4">
              {problems.map((problem: AlgorithmProblemType, index: number) => (
                <motion.div
                  key={problem.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Link href={`/smart-hub/algorithms/${problem.slug}`}>
                    <div className="group bg-white p-6 rounded-3xl border border-slate-200 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all flex items-center justify-between">
                      <div className="flex items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                          <Code2 className="w-6 h-6" />
                        </div>
                        <div className="space-y-1">
                          <h3 className="text-xl font-bold text-slate-800 group-hover:text-blue-600 transition-colors">
                            {problem.title}
                          </h3>
                          <div className="flex items-center gap-3">
                            <Badge
                              variant="outline"
                              className={`${getDifficultyColor(
                                problem.difficulty
                              )} border rounded-lg px-2 py-0.5 text-[10px] font-bold`}
                            >
                              {getDifficultyLabel(problem.difficulty)}
                            </Badge>
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <Filter className="w-3 h-3" />{" "}
                              {problem.category?.name}
                            </span>
                            <span className="text-slate-400 text-xs flex items-center gap-1">
                              <BarChart3 className="w-3 h-3" />{" "}
                              {problem._count?.submissions || 0} lượt giải
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="hidden md:flex flex-col items-end text-sm">
                          <span className="text-slate-400">Tỉ lệ đạt</span>
                          <span className="font-bold text-slate-700">--%</span>
                        </div>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 text-slate-300">
                <Search className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">
                Không tìm thấy bài tập nào
              </h3>
              <p className="text-slate-500">
                Hãy thử thay đổi bộ lọc hoặc từ khóa tìm kiếm.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlgorithmsPage;
