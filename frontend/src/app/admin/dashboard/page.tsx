"use client";

import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  GraduationCap,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { useSelector } from "react-redux";
import { fetchAdminOverview } from "@/store/slice/adminAnalyticsSlice";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();

  const { overview, loading } = useSelector(
    (state: RootState) => state.adminAnalytics
  );

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const chartData = [
    {
      name: "Khóa học",
      value: overview?.totalCourses ?? 0,
      color: "#6366f1", // indigo
    },
    {
      name: "Chuyên ngành",
      value: overview?.totalSpecializations ?? 0,
      color: "#3b82f6", // blue
    },
    {
      name: "Học sinh",
      value: overview?.totalUsers ?? 0,
      color: "#10b981", // green
    },
    {
      name: "Giảng viên",
      value: overview?.totalInstructors ?? 0,
      color: "#f59e0b", // amber
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white shadow-lg rounded-xl px-4 py-2 border">
          <p className="font-semibold text-gray-800">
            {payload[0].payload.name}
          </p>
          <p className="text-indigo-600 font-bold text-lg">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <main className="flex-1 p-6 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold text-gray-800">
              👋 Chào mừng, Admin
            </h2>
            <p className="text-gray-500 mt-1">
              Tổng quan về hoạt động của hệ thống
            </p>
          </div>
        </div>

        {/* Statistic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Courses */}
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng khóa học
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : overview?.totalCourses ?? 0}
                </p>
                <BookOpen className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Specializations */}
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng chuyên ngành
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : overview?.totalSpecializations ?? 0}
                </p>
                <DollarSign className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Users */}
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng học sinh
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : overview?.totalUsers ?? 0}
                </p>
                <Users className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Instructors */}
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng giảng viên
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-gray-900">
                  {loading ? "..." : overview?.totalInstructors ?? 0}
                </p>
                <GraduationCap className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart */}
        <div className="mt-10 bg-white rounded-2xl shadow-md border border-indigo-100 p-6">
          <h3 className="text-lg font-semibold text-indigo-700 mb-6">
            📊 Thống kê tổng quan hệ thống
          </h3>

          <div className="h-80">
            {loading ? (
              <div className="h-full flex items-center justify-center text-gray-400">
                Đang tải dữ liệu...
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} barSize={48}>
                  <defs>
                    {chartData.map((item, index) => (
                      <linearGradient
                        key={index}
                        id={`color-${index}`}
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor={item.color}
                          stopOpacity={0.9}
                        />
                        <stop
                          offset="100%"
                          stopColor={item.color}
                          stopOpacity={0.4}
                        />
                      </linearGradient>
                    ))}
                  </defs>

                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis
                    dataKey="name"
                    tick={{ fill: "#475569", fontSize: 13 }}
                  />
                  <YAxis
                    allowDecimals={false}
                    tick={{ fill: "#475569", fontSize: 13 }}
                  />
                  <Tooltip content={<CustomTooltip />} />

                  <Bar
                    dataKey="value"
                    radius={[12, 12, 0, 0]}
                    animationDuration={900}
                  >
                    {chartData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={`url(#color-${index})`}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
