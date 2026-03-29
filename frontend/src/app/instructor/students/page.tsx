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
      name: "Số học viên",
      value: enrollmentStats?.totalStudents || 0,
      color: "#6366f1", // indigo-500
    },
    {
      name: "Lượt đăng ký",
      value: enrollmentStats?.totalEnrollments || 0,
      color: "#10b981", // emerald-500
    },
    {
      name: "Hoàn thành",
      value: enrollmentStats?.completedEnrollmentsCount || 0,
      color: "#8b5cf6", // violet-500
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/90 backdrop-blur-md border border-slate-100 rounded-2xl p-4 shadow-2xl">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
            {payload[0].payload.name}
          </p>
          <p className="text-xl font-black text-slate-900 tracking-tight">
            {payload[0].value.toLocaleString()} 
            <span className="text-xs font-bold text-slate-400 ml-1">đối tượng</span>
          </p>
        </div>
      );
    }
    return null;
  };

  const stats = [
    {
      title: "Cộng đồng học viên",
      value: enrollmentStats?.totalStudents || 0,
      icon: Users,
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      description: "Học viên duy nhất",
    },
    {
      title: "Tổng lượt đăng ký",
      value: enrollmentStats?.totalEnrollments || 0,
      icon: BookOpen,
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      description: "Tổng quan các khóa",
    },
    {
      title: "Tiến độ bình quân",
      value: `${enrollmentStats?.averageProgress || 0}%`,
      icon: TrendingUp,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      description: "Toàn bộ lộ trình",
    },
    {
      title: "Tỷ lệ tốt nghiệp",
      value: enrollmentStats?.completedEnrollmentsCount || 0,
      icon: CheckCircle,
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      description: "Hoàn thành 100%",
    },
  ];

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="flex h-[400px] items-center justify-center rounded-[2.5rem] bg-rose-50 border-2 border-dashed border-rose-100">
        <div className="text-center">
          <p className="text-rose-600 font-bold">Lỗi phân tích: {error}</p>
        </div>
      </div>
    );
  }

  const completionRate = enrollmentStats?.totalEnrollments
    ? ((enrollmentStats.completedEnrollmentsCount / enrollmentStats.totalEnrollments) * 100).toFixed(1)
    : 0;

  const avgCoursesPerStudent = enrollmentStats?.totalStudents
    ? (enrollmentStats.totalEnrollments / enrollmentStats.totalStudents).toFixed(1)
    : 0;

  return (
    <div className="space-y-10 pb-10 overflow-x-hidden">
      {/* Header Section */}
      <div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Cộng đồng học viên
        </h1>
        <p className="text-slate-500 mt-2 font-medium">
          Thống kê chi tiết về hành vi và tiến độ học tập của các học viên.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map(
          ({ title, value, icon: Icon, color, bgColor, description }) => (
            <Card key={title} className="rounded-[2.5rem] border-none shadow-sm hover:shadow-xl transition-all duration-500 overflow-hidden bg-white group">
              <CardHeader className="flex flex-row items-center justify-between pb-2 p-8">
                <div className="space-y-1">
                  <CardTitle className="text-[11px] font-black text-slate-400 uppercase tracking-[0.15em]">
                    {title}
                  </CardTitle>
                  <p className="text-2xl font-black text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
                    {value}
                  </p>
                </div>
                <div className={`p-4 rounded-3xl ${bgColor} transition-transform group-hover:scale-110 duration-500`}>
                  <Icon className={`w-6 h-6 ${color}`} />
                </div>
              </CardHeader>
              <CardContent className="px-8 pb-8">
                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-tighter opacity-70 italic">{description}</p>
              </CardContent>
            </Card>
          )
        )}
      </div>

      {/* Analytics Visualization */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Detail Insights */}
        <div className="lg:col-span-1 space-y-8">
           <Card className="rounded-[2.5rem] border-none shadow-sm bg-indigo-600 text-white p-8 relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-700" />
              <h3 className="text-[11px] font-black uppercase tracking-[0.2em] opacity-80 mb-6">Tỷ lệ hoàn thành</h3>
              <div className="flex items-end gap-2">
                 <span className="text-5xl font-black tracking-tighter">{completionRate}%</span>
                 <div className="mb-2 p-1 px-2 bg-white/20 rounded-lg text-[10px] font-black uppercase">Good</div>
              </div>
              <p className="text-sm font-medium opacity-80 mt-4 leading-relaxed">
                 {enrollmentStats?.completedEnrollmentsCount || 0} trên tổng số {enrollmentStats?.totalEnrollments || 0} lượt đăng ký đã về đích.
              </p>
           </Card>

           <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8 group">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] mb-6">Mật độ học tập</h3>
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-black text-slate-900 tracking-tight">{avgCoursesPerStudent}</span>
                  <span className="text-xs font-bold text-slate-400 ml-2 italic">khóa/học viên</span>
                </div>
                <div className="p-4 bg-emerald-50 text-emerald-600 rounded-3xl group-hover:rotate-12 transition-transform">
                   <TrendingUp className="w-6 h-6" />
                </div>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-4 leading-relaxed">
                 Số lượng khóa học bình quân mà mỗi học viên tin tưởng lựa chọn từ bạn.
              </p>
           </Card>
        </div>

        {/* Chart View */}
        <Card className="lg:col-span-2 rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
           <CardHeader className="p-8 border-b border-slate-50">
              <CardTitle className="text-xl font-black text-slate-900">Thống kê lưu lượng</CardTitle>
              <p className="text-xs text-slate-400 font-bold mt-1">Sự phân bổ giữa học viên, đăng ký và hoàn thành</p>
           </CardHeader>
           <CardContent className="p-8">
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={overviewChartData} barSize={60}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{fill: '#94a3b8', fontSize: 11, fontWeight: 700}}
                      dy={10}
                    />
                    <YAxis 
                      hide
                    />
                    <Tooltip 
                      content={<CustomTooltip />} 
                      cursor={{fill: '#f8fafc'}}
                    />
                    <Bar
                      dataKey="value"
                      radius={[16, 16, 16, 16]}
                      animationDuration={1500}
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
      </div>
    </div>
  );
}
