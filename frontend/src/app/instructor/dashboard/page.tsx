"use client";

import React, { useEffect, useMemo } from "react";
import {
  BookOpen,
  Users,
  DollarSign,
  Eye,
  LayoutDashboard,
  TrendingUp,
  Calendar,
  ArrowUpRight,
  Star,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import DashboardOnboarding from "@/components/instructor/onboarding/DashboardOnboarding";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCourseAnalytics,
  fetchDailyStats,
  fetchOverview,
} from "@/store/slice/instructor/instructorAnalyticsSlice";
import dayjs from "dayjs";
import Link from "next/link";

export default function InstructorDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, dailyStats, courseAnalytics, loading } = useSelector(
    (state: RootState) => state.instructorAnalytics,
  );

  useEffect(() => {
    dispatch(fetchOverview());
    dispatch(
      fetchDailyStats({
        startDate: dayjs().subtract(30, "days").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      }),
    );
    dispatch(fetchCourseAnalytics());
  }, [dispatch]);

  const stats = [
    {
      title: "Tổng khóa học",
      value: overview?.totalCourses || 0,
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Học viên mới",
      value: overview?.totalEnrollments || 0,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Doanh thu",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
      }).format(overview?.totalEarnings || 0),
      icon: DollarSign,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
    },
    {
      title: "Lượt xem nội dung",
      value: overview?.totalViews || 0,
      icon: Eye,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
    },
  ];

  const chartData = useMemo(() => {
    if (!dailyStats) return [];
    return [...dailyStats].reverse().map((stat) => ({
      date: dayjs(stat.date).format("DD/MM"),
      revenue: stat.totalRevenue,
      views: stat.totalViews,
    }));
  }, [dailyStats]);

  const recentCourses = useMemo(() => {
    if (!courseAnalytics) return [];
    return [...courseAnalytics]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 5);
  }, [courseAnalytics]);

  return (
    <div className="space-y-10 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight flex items-center gap-3">
            <LayoutDashboard className="w-10 h-10 text-indigo-600" />
            Dashboard
          </h1>
          <p className="text-slate-500 mt-2 font-medium">
            Chào mừng bạn quay lại! Đây là tóm tắt hiệu suất giảng dạy của bạn
            trong 30 ngày qua.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-100 shadow-sm text-sm font-bold text-slate-600">
            <Calendar className="w-4 h-4 text-indigo-500" />
            {dayjs().format("DD/MM/YYYY")}
          </div>
          <DashboardOnboarding />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 step-dashboard">
        {stats.map(({ title, value, icon: Icon, color, bgColor }) => (
          <Card
            key={title}
            className="group relative overflow-hidden border-slate-100 shadow-sm hover:shadow-2xl hover:border-indigo-100 transition-all duration-300 rounded-3xl p-1"
          >
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`p-3.5 rounded-2xl ${bgColor} ${color} transition-transform group-hover:scale-110 duration-300`}
                >
                  <Icon className="w-6 h-6" />
                </div>
              </div>
              <div>
                <CardTitle className="text-sm font-bold text-slate-500 tracking-wide uppercase mb-1">
                  {title}
                </CardTitle>
                <p className="text-2xl font-black text-slate-900 tracking-tight">
                  {value}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Column */}
        <Card className="lg:col-span-2 border-slate-100 shadow-sm rounded-3xl overflow-hidden step-stats">
          <CardHeader className="p-8 border-b border-slate-50 bg-slate-50/30">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl font-extrabold text-slate-900">
                  Biểu đồ doanh thu
                </CardTitle>
                <p className="text-sm text-slate-500 font-medium mt-1">
                  Dữ liệu tăng trưởng trong 30 ngày gần nhất
                </p>
              </div>
              <Badge className="bg-indigo-600 hover:bg-indigo-700 rounded-lg px-3 py-1">
                Hàng ngày
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-8">
            <div className="h-[350px] w-full">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart
                    data={chartData}
                    margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
                  >
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#4f46e5"
                          stopOpacity={0.1}
                        />
                        <stop
                          offset="95%"
                          stopColor="#4f46e5"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      vertical={false}
                      stroke="#f1f5f9"
                    />
                    <XAxis
                      dataKey="date"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                      dy={10}
                    />
                    <YAxis
                      axisLine={false}
                      tickLine={false}
                      tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                    />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "16px",
                        border: "none",
                        boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1)",
                      }}
                      formatter={(value) =>
                        new Intl.NumberFormat("vi-VN", {
                          style: "currency",
                          currency: "VND",
                          maximumFractionDigits: 0,
                        }).format(value as number)
                      }
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4f46e5"
                      strokeWidth={4}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                      name="Doanh thu"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full flex-col items-center justify-center text-slate-400 gap-3">
                  <TrendingUp className="w-12 h-12 opacity-20" />
                  <p className="font-bold">
                    Chưa có dữ liệu thống kê doanh thu
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Column */}
        <div className="space-y-8">
          {/* Recent Courses */}
          <Card className="border-slate-100 shadow-sm rounded-3xl overflow-hidden step-courses flex-1 h-full">
            <CardHeader className="p-6 border-b border-slate-50">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg font-extrabold text-slate-900">
                  Khóa học mới
                </CardTitle>
                <Link
                  href="/instructor/courses"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors uppercase tracking-wider"
                >
                  Xem tất cả
                </Link>
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-2">
              {recentCourses.length === 0 ? (
                <div className="text-center py-10">
                  <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-3" />
                  <p className="text-slate-400 font-bold text-sm">
                    Chưa có khóa học nào
                  </p>
                </div>
              ) : (
                recentCourses.map((course, index) => (
                  <div
                    key={course.id || index}
                    className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group"
                  >
                    <div className="w-14 h-14 rounded-xl bg-slate-100 flex-shrink-0 relative overflow-hidden">
                      {/* Simplified Placeholder if No Img Thumb in this data */}
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-indigo-300" />
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 line-clamp-1 text-sm group-hover:text-indigo-600 transition-colors">
                        {course.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1 text-[11px] font-bold text-slate-400">
                        <span className="flex items-center gap-1.5">
                          <Users className="w-3 h-3 text-indigo-400" />{" "}
                          {course.enrollmentCount || 0}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />{" "}
                          {course.averageRating || 0}
                        </span>
                      </div>
                    </div>
                    <Badge
                      className={`rounded-full px-2.5 py-0.5 text-[10px] font-black uppercase tracking-tighter ${
                        course.isPublished
                          ? "bg-emerald-50 text-emerald-600 border-none"
                          : "bg-slate-100 text-slate-500 border-none"
                      }`}
                    >
                      {course.isPublished ? "Public" : "Draft"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
