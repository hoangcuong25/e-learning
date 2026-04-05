"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Users,
  DollarSign,
  TrendingUp,
  GraduationCap,
  Layers,
  ArrowUpRight,
  LayoutDashboard,
  Calendar,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchAdminOverview } from "@/store/slice/common/adminAnalyticsSlice";
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
    (state: RootState) => state.adminAnalytics,
  );

  useEffect(() => {
    dispatch(fetchAdminOverview());
  }, [dispatch]);

  const chartData = [
    {
      name: "Khóa học",
      value: overview?.totalCourses ?? 0,
      color: "#6366f1", // indigo-500
      glow: "rgba(99, 102, 241, 0.5)",
    },
    {
      name: "Chuyên ngành",
      value: overview?.totalSpecializations ?? 0,
      color: "#818cf8", // indigo-400
      glow: "rgba(129, 140, 248, 0.4)",
    },
    {
      name: "Học sinh",
      value: overview?.totalUsers ?? 0,
      color: "#4f46e5", // indigo-600
      glow: "rgba(79, 70, 229, 0.5)",
    },
    {
      name: "Giảng viên",
      value: overview?.totalInstructors ?? 0,
      color: "#3b82f6", // blue-500
      glow: "rgba(59, 130, 246, 0.4)",
    },
  ];

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-slate-900 border border-slate-800 shadow-2xl rounded-2xl p-4 backdrop-blur-xl">
          <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">
            {payload[0].payload.name}
          </p>
          <div className="flex items-baseline gap-2">
            <p className="text-2xl font-black text-white tracking-tighter">
              {payload[0].value}
            </p>
            <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">
              Đơn vị
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  const StatCard = ({ title, value, icon: Icon, colorClass, delay }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="group"
    >
      <div
        className={`relative bg-slate-900 border border-slate-800 rounded-3xl p-6 overflow-hidden h-full transition-all duration-300 group-hover:border-indigo-500/30 group-hover:shadow-[0_20px_40px_-12px_rgba(79,70,229,0.2)]`}
      >
        {/* Decorative mask */}
        <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-[40px] -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-600/10 transition-colors" />

        <div className="flex justify-between items-start mb-6 relative z-10">
          <div
            className={`p-4 rounded-2xl bg-slate-800 border border-slate-700/50 text-indigo-400 group-hover:scale-110 group-hover:border-indigo-500/30 transition-all duration-500`}
          >
            <Icon size={24} strokeWidth={1.5} />
          </div>
          <div className="flex items-center gap-1 text-[10px] font-black text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
            <ArrowUpRight size={10} /> +12%
          </div>
        </div>

        <div className="space-y-1 relative z-10">
          <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">
            {title}
          </h4>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-white tracking-tighter">
              {loading ? "..." : value}
            </span>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="space-y-10 pb-10">
      {/* Welcome Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-1"
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600/10 border border-indigo-500/20 rounded-xl">
              <LayoutDashboard size={18} className="text-indigo-400" />
            </div>
            <h2 className="text-3xl font-black text-white tracking-tighter">
              BẢNG ĐIỀU KHIỂN <span className="text-indigo-500">ADMIN</span>
            </h2>
          </div>
          <p className="text-sm font-medium text-slate-500 tracking-tight pl-11">
            Chào mừng trở lại! Dưới đây là thống kê hoạt động của hệ thống
            EduSmart.
          </p>
        </motion.div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 border border-slate-800 text-slate-400 hover:text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all hover:bg-slate-800">
            <Calendar size={14} className="text-indigo-400" /> 12 Th6, 2024
          </button>
          <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shadow-xl shadow-indigo-600/20">
            Tải báo cáo
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Tổng khóa học"
          value={overview?.totalCourses}
          icon={BookOpen}
          delay={0.1}
        />
        <StatCard
          title="Chuyên ngành"
          value={overview?.totalSpecializations}
          icon={Layers}
          delay={0.2}
        />
        <StatCard
          title="Tổng học viên"
          value={overview?.totalUsers}
          icon={Users}
          delay={0.3}
        />
        <StatCard
          title="Giảng viên"
          value={overview?.totalInstructors}
          icon={GraduationCap}
          delay={0.4}
        />
      </div>

      {/* Chart Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
        className="bg-slate-900 border border-slate-800 rounded-[2.5rem] p-10 overflow-hidden relative shadow-2xl"
      >
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/4 pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4 relative z-10">
          <div>
            <h3 className="text-xl font-black text-white tracking-tighter mb-1 uppercase">
              Thống kê hệ thống
            </h3>
            <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
              Dữ liệu tổng hợp của cả hệ thống
            </p>
          </div>
        </div>

        <div className="h-[400px] w-full relative z-10">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center space-y-4">
              <div className="p-3 bg-slate-950 rounded-2xl animate-pulse">
                <TrendingUp size={32} className="text-indigo-500/30" />
              </div>
              <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest animate-pulse">
                Đang chuẩn bị dữ liệu...
              </p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barSize={64}
                margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
              >
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
                        stopOpacity={1}
                      />
                      <stop
                        offset="100%"
                        stopColor={item.color}
                        stopOpacity={0.2}
                      />
                    </linearGradient>
                  ))}
                </defs>

                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#1e293b"
                  opacity={0.5}
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                  dy={15}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  allowDecimals={false}
                  tick={{ fill: "#64748b", fontSize: 11, fontWeight: 700 }}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "rgba(255, 255, 255, 0.03)", radius: 16 }}
                  content={<CustomTooltip />}
                />

                <Bar
                  dataKey="value"
                  radius={[20, 20, 4, 4]}
                  animationDuration={1500}
                  animationEasing="ease-in-out"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={`url(#color-${index})`} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10 pt-8 border-t border-slate-800/50">
          {chartData.map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-1.5 p-4 rounded-3xl bg-slate-950/50 border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{
                    backgroundColor: item.color,
                    boxShadow: `0 0 10px ${item.color}`,
                  }}
                />
                <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">
                  {item.name}
                </p>
              </div>
              <p className="text-lg font-black text-white tracking-tighter ml-4">
                {loading
                  ? "..."
                  : ((item.value / (overview?.totalUsers || 1)) * 100).toFixed(
                      1,
                    )}{" "}
                %
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default DashboardPage;
