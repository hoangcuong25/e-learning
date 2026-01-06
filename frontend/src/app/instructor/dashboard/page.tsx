"use client";

import React, { useEffect, useMemo } from "react";
import { BookOpen, Users, DollarSign, Star, Eye } from "lucide-react";
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
} from "recharts";
import DashboardOnboarding from "@/components/instructor/onboarding/DashboardOnboarding";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchCourseAnalytics,
  fetchDailyStats,
  fetchOverview,
} from "@/store/slice/instructorAnalyticsSlice";
import dayjs from "dayjs";

export default function InstructorDashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const { overview, dailyStats, courseAnalytics, loading } = useSelector(
    (state: RootState) => state.instructorAnalytics
  );

  useEffect(() => {
    dispatch(fetchOverview());
    dispatch(
      fetchDailyStats({
        startDate: dayjs().subtract(30, "days").format("YYYY-MM-DD"),
        endDate: dayjs().format("YYYY-MM-DD"),
      })
    );
    dispatch(fetchCourseAnalytics());
  }, [dispatch]);

  const stats = [
    {
      title: "Khóa học",
      value: overview?.totalCourses || 0,
      icon: BookOpen,
      color: "text-blue-600",
    },
    {
      title: "Tổng số đăng ký",
      value: overview?.totalEnrollments || 0,
      icon: Users,
      color: "text-green-600",
    },
    {
      title: "Thu nhập",
      value: new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(overview?.totalEarnings || 0),
      icon: DollarSign,
      color: "text-amber-500",
    },
    {
      title: "Lượt xem",
      value: overview?.totalViews || 0,
      icon: Eye,
      color: "text-purple-500",
    },
  ];

  // Process chart data (reverse to show chronological order if needed, assuming API returns desc)
  const chartData = useMemo(() => {
    if (!dailyStats) return [];
    // API returns desc date, so reverse for chart (left to right)
    return [...dailyStats].reverse().map((stat) => ({
      date: dayjs(stat.date).format("DD/MM"),
      revenue: stat.totalRevenue, // Or totalEarnings if available in dailyStats
      views: stat.totalViews,
    }));
  }, [dailyStats]);

  // Process recent courses (take top 5 by enrollment or just first 5)
  const recentCourses = useMemo(() => {
    if (!courseAnalytics) return [];
    return [...courseAnalytics]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);
  }, [courseAnalytics]);

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <main className="flex-1 space-y-8 overflow-y-auto">
        {/* Header */}
        <header className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-1">
              Bảng điều khiển giảng viên
            </h1>
            <p className="text-gray-500">
              Chào mừng bạn quay lại! Dưới đây là tổng quan hoạt động của bạn.
            </p>
          </div>

          {/* Nút hướng dẫn lại */}
          <div>
            <DashboardOnboarding />
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 step-dashboard">
          {stats.map(({ title, value, icon: Icon, color }) => (
            <Card key={title} className="hover:shadow-lg transition-all">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-gray-500">
                  {title}
                </CardTitle>
                <Icon className={`w-5 h-5 ${color}`} />
              </CardHeader>
              <CardContent>
                <p className="text-2xl font-semibold text-gray-800">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Chart + Recent Courses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Chart */}
          <Card className="h-[360px] step-stats">
            <CardHeader>
              <CardTitle>Doanh thu 30 ngày qua</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip
                    formatter={(value) =>
                      new Intl.NumberFormat("vi-VN", {
                        style: "currency",
                        currency: "VND",
                      }).format(value as number)
                    }
                  />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    name="Doanh thu"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card className="step-courses">
            <CardHeader>
              <CardTitle>Khóa học gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.length === 0 ? (
                <p className="text-gray-500 text-center py-4">
                  Chưa có khóa học nào.
                </p>
              ) : (
                recentCourses.map((course, index) => (
                  <div
                    key={course.id || index}
                    className="flex items-center justify-between border-b pb-3 last:border-none"
                  >
                    <div>
                      <h3 className="font-medium text-gray-800 line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {course.enrollmentCount || 0} học viên •{" "}
                        {course.averageRating || 0} ⭐
                      </p>
                    </div>
                    <Badge
                      variant={course.isPublished ? "default" : "secondary"}
                    >
                      {course.isPublished ? "Đang hoạt động" : "Bản nháp"}
                    </Badge>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
