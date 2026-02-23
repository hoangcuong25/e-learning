"use client";

import React, { useEffect } from "react";
import { Users, BookOpen, TrendingUp, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchEnrollmentStats } from "@/store/slice/instructor/instructorAnalyticsSlice";
import LoadingScreen from "@/components/LoadingScreen";
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

export default function InstructorStudentsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollmentStats, loading, error } = useSelector(
    (state: RootState) => state.instructorAnalytics
  );

  useEffect(() => {
    dispatch(fetchEnrollmentStats());
  }, [dispatch]);

  const overviewChartData = [
    {
      name: "Học viên",
      value: enrollmentStats?.totalStudents || 0,
      color: "#3b82f6",
    },
    {
      name: "Đăng ký",
      value: enrollmentStats?.totalEnrollments || 0,
      color: "#22c55e",
    },
    {
      name: "Hoàn thành",
      value: enrollmentStats?.completedEnrollmentsCount || 0,
      color: "#8b5cf6",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white border rounded-xl px-4 py-2 shadow-lg">
          <p className="font-semibold text-gray-800">
            {payload[0].payload.name}
          </p>
          <p className="text-indigo-600 text-lg font-bold">
            {payload[0].value}
          </p>
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      title: "Tổng số học viên",
      value: enrollmentStats?.totalStudents || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      description: "Số học viên duy nhất",
    },
    {
      title: "Tổng số đăng ký",
      value: enrollmentStats?.totalEnrollments || 0,
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-50",
      description: "Tổng lượt đăng ký khóa học",
    },
    {
      title: "Tiến độ trung bình",
      value: `${enrollmentStats?.averageProgress || 0}%`,
      icon: TrendingUp,
      color: "text-amber-500",
      bgColor: "bg-amber-50",
      description: "Tiến độ học tập trung bình",
    },
    {
      title: "Đã hoàn thành",
      value: enrollmentStats?.completedEnrollmentsCount || 0,
      icon: CheckCircle,
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      description: "Số lượt hoàn thành khóa học",
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">Lỗi: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <main className="flex-1 space-y-8 overflow-y-auto">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800 mb-1">
            Quản lý học viên
          </h1>
          <p className="text-gray-500">
            Thống kê và theo dõi tiến độ học viên của bạn
          </p>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {stats.map(
            ({ title, value, icon: Icon, color, bgColor, description }) => (
              <Card key={title} className="hover:shadow-lg transition-all">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {title}
                  </CardTitle>
                  <div className={`p-2 rounded-lg ${bgColor}`}>
                    <Icon className={`w-5 h-5 ${color}`} />
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-semibold text-gray-800">
                    {value}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">{description}</p>
                </CardContent>
              </Card>
            )
          )}
        </div>

        {/* Additional Info Card */}
        <Card>
          <CardHeader>
            <CardTitle>Thông tin chi tiết</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h3 className="font-semibold text-blue-900 mb-2">
                  Tỷ lệ hoàn thành
                </h3>
                <p className="text-2xl font-bold text-blue-600">
                  {enrollmentStats?.totalEnrollments
                    ? (
                        (enrollmentStats.completedEnrollmentsCount /
                          enrollmentStats.totalEnrollments) *
                        100
                      ).toFixed(1)
                    : 0}
                  %
                </p>
                <p className="text-sm text-blue-700 mt-1">
                  {enrollmentStats?.completedEnrollmentsCount || 0} /{" "}
                  {enrollmentStats?.totalEnrollments || 0} đăng ký
                </p>
              </div>

              <div className="p-4 bg-green-50 rounded-lg">
                <h3 className="font-semibold text-green-900 mb-2">
                  Trung bình khóa học/học viên
                </h3>
                <p className="text-2xl font-bold text-green-600">
                  {enrollmentStats?.totalStudents
                    ? (
                        enrollmentStats.totalEnrollments /
                        enrollmentStats.totalStudents
                      ).toFixed(1)
                    : 0}
                </p>
                <p className="text-sm text-green-700 mt-1">
                  Số khóa học trung bình mỗi học viên đăng ký
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>📊 Thống kê học viên</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={overviewChartData} barSize={50}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis allowDecimals={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar
                    dataKey="value"
                    radius={[12, 12, 0, 0]}
                    animationDuration={800}
                  >
                    {overviewChartData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
