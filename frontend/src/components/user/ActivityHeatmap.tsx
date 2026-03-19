"use client";

import { useEffect, useState } from "react";
import { getUserActivity } from "@/store/api/common/user.api";
import dayjs from "dayjs";


interface ActivityData {
  streak: number;
  activityMap: { date: string; count: number }[];
}

export default function ActivityHeatmap() {
  const [data, setData] = useState<ActivityData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await getUserActivity();
        setData(res);
      } catch (error) {
        console.error("Failed to fetch activity data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, []);

  if (loading) {
    return <div className="mt-8 bg-white shadow-md rounded-2xl p-6 border border-gray-100 animate-pulse h-64"></div>;
  }

  const activityMap = data?.activityMap || [];
  const activityDict = activityMap.reduce((acc, curr) => {
    acc[curr.date] = curr.count;
    return acc;
  }, {} as Record<string, number>);

  // Generate 365 days
  const today = dayjs();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    days.push(today.subtract(i, "day").format("YYYY-MM-DD"));
  }

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-gray-100";
    if (count === 1) return "bg-green-200";
    if (count <= 3) return "bg-green-400";
    if (count <= 5) return "bg-green-600";
    return "bg-green-800";
  };

  return (
    <div className="mt-8 bg-white shadow-md rounded-2xl p-6 border border-gray-100">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Bản đồ hoạt động</h2>
          <p className="text-sm text-gray-500 mt-1">
            Mỗi ô vuông đại diện cho một ngày. Màu càng đậm chứng tỏ bạn càng hoạt động tích cực (hoàn thành bài học, nhiệm vụ) trong ngày đó.
          </p>
        </div>
        <div className="flex items-center gap-2 whitespace-nowrap bg-orange-50 px-3 py-1.5 rounded-full border border-orange-100">
          <span className="text-sm text-orange-800">Chuỗi học liên tiếp:</span>
          <span className="text-lg font-bold text-orange-600">{data?.streak || 0} ngày 🔥</span>
        </div>
      </div>

      <div className="flex-col hidden md:flex overflow-x-auto pb-4">
        <div className="grid grid-flow-col gap-1" style={{ gridTemplateRows: 'repeat(7, 1fr)' }}>
            {days.map((day) => {
            const count = activityDict[day] || 0;
            return (
                <div
                    key={day}
                    title={`${count} hoạt động vào ${dayjs(day).format('DD/MM/YYYY')}`}
                    className={`w-3.5 h-3.5 rounded-sm cursor-pointer ${getHeatmapColor(count)}`}
                />
            );
            })}
        </div>

        <div className="flex justify-end items-center mt-4 gap-2 text-xs text-gray-500">
          <span>Ít</span>
          <div className="w-3.5 h-3.5 rounded-sm bg-gray-100" />
          <div className="w-3.5 h-3.5 rounded-sm bg-green-200" />
          <div className="w-3.5 h-3.5 rounded-sm bg-green-400" />
          <div className="w-3.5 h-3.5 rounded-sm bg-green-600" />
          <div className="w-3.5 h-3.5 rounded-sm bg-green-800" />
          <span>Nhiều</span>
        </div>
      </div>
      <div className="md:hidden text-center text-gray-500 text-sm">
        Vui lòng xem trên màn hình lớn để thấy biểu đồ chi tiết.
      </div>
    </div>
  );
}
