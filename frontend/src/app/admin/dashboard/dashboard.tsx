"use client";

import React from "react";
import { motion } from "framer-motion";
import { BookOpen, Users, DollarSign, TrendingUp } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const DashboardPage = () => {
  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-indigo-100">
      {/* Main content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-indigo-700">
            👋 Chào mừng, Admin
          </h2>
          <Button className="bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white rounded-lg">
            + Thêm khóa học
          </Button>
        </div>

        {/* Statistic cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tổng khóa học
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-indigo-600">128</p>
                <BookOpen className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Học viên đang hoạt động
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-indigo-600">1,240</p>
                <Users className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Doanh thu tháng
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-indigo-600">$12,340</p>
                <DollarSign className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>

          <motion.div whileHover={{ scale: 1.03 }}>
            <Card className="rounded-2xl shadow-md border border-indigo-100">
              <CardHeader>
                <CardTitle className="text-sm font-medium text-gray-600">
                  Tăng trưởng
                </CardTitle>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <p className="text-3xl font-bold text-indigo-600">+12%</p>
                <TrendingUp className="w-8 h-8 text-indigo-500" />
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Chart placeholder */}
        <div className="mt-10 bg-white rounded-2xl shadow-md border border-indigo-100 p-6">
          <h3 className="text-lg font-semibold text-indigo-700 mb-4">
            Biểu đồ doanh thu (Tháng)
          </h3>
          <div className="h-64 flex items-center justify-center text-gray-400">
            [📈 Chart sẽ hiển thị ở đây]
          </div>
        </div>
      </main>
    </div>
  );
};

export default DashboardPage;
