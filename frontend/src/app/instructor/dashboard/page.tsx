"use client";

import React from "react";
import { BookOpen, Users, DollarSign, Star } from "lucide-react";
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

// =============================
// DUMMY DATA
// =============================
const stats = [
  { title: "Khóa học", value: "12", icon: BookOpen, color: "text-blue-600" },
  { title: "Học viên", value: "240", icon: Users, color: "text-green-600" },
  {
    title: "Doanh thu",
    value: "$1,280",
    icon: DollarSign,
    color: "text-amber-500",
  },
  {
    title: "Đánh giá TB",
    value: "4.7/5",
    icon: Star,
    color: "text-yellow-500",
  },
];

const chartData = [
  { month: "Jan", income: 200 },
  { month: "Feb", income: 400 },
  { month: "Mar", income: 300 },
  { month: "Apr", income: 500 },
  { month: "May", income: 700 },
  { month: "Jun", income: 900 },
];

const recentCourses = [
  {
    title: "React cho người mới bắt đầu",
    students: 58,
    status: "Đang hoạt động",
  },
  { title: "Node.js nâng cao", students: 34, status: "Đang hoạt động" },
  { title: "Thiết kế REST API với NestJS", students: 27, status: "Bản nháp" },
];

// =============================
// DASHBOARD PAGE
// =============================
export default function InstructorDashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* MAIN CONTENT */}
      <main className="flex-1 space-y-8 overflow-y-auto">
        {/* Header */}
        <header>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Bảng điều khiển giảng viên
          </h1>
          <p className="text-gray-500">
            Chào mừng bạn quay lại! Dưới đây là tổng quan hoạt động của bạn.
          </p>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
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
          <Card className="h-[360px]">
            <CardHeader>
              <CardTitle>Doanh thu theo tháng</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height="90%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="income"
                    stroke="#2563eb"
                    strokeWidth={3}
                    dot={{ r: 5 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Recent Courses */}
          <Card>
            <CardHeader>
              <CardTitle>Khóa học gần đây</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentCourses.map((course, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-3 last:border-none"
                >
                  <div>
                    <h3 className="font-medium text-gray-800">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500">
                      {course.students} học viên
                    </p>
                  </div>
                  <Badge
                    variant={
                      course.status === "Đang hoạt động"
                        ? "default"
                        : "secondary"
                    }
                  >
                    {course.status}
                  </Badge>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
