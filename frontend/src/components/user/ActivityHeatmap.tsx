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
    return (
      <div className="mt-8 bg-white rounded-[2.5rem] p-10 border border-slate-100 animate-pulse h-72"></div>
    );
  }

  const activityMap = data?.activityMap || [];
  const activityDict = activityMap.reduce(
    (acc, curr) => {
      acc[curr.date] = curr.count;
      return acc;
    },
    {} as Record<string, number>,
  );

  const today = dayjs();
  const days = [];
  for (let i = 364; i >= 0; i--) {
    days.push(today.subtract(i, "day").format("YYYY-MM-DD"));
  }

  const getHeatmapColor = (count: number) => {
    if (count === 0) return "bg-slate-50";
    if (count === 1) return "bg-emerald-500/20";
    if (count <= 3) return "bg-emerald-500/40";
    if (count <= 5) return "bg-emerald-500/70";
    return "bg-emerald-500";
  };

  return (
    <div className="bg-white rounded-[2.5rem] p-10 border border-slate-100 shadow-sm space-y-10 group">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">
            Bản đồ học tập
          </h2>
          <p className="text-sm text-slate-400 font-medium max-w-lg leading-relaxed">
            Mỗi ô vuông đại diện cho hành trình tri thức của bạn. Màu càng đậm
            chứng tỏ sự nỗ lực và kiên trì không ngừng nghỉ.
          </p>
        </div>
      </div>

      <div className="inline-flex items-center gap-3 bg-orange-500 text-white px-6 py-3 rounded-2xl shadow-xl shadow-orange-500/20 transition-transform group-hover:scale-105 duration-500">
        <span className="text-[10px] font-black uppercase tracking-widest">
          Học liên tiếp:
        </span>
        <span className="text-xl font-black tracking-tighter">
          {data?.streak || 0} ngày 🔥
        </span>
      </div>

      <div className="flex-col hidden md:flex overflow-x-auto pb-4 scrollbar-hide">
        <div
          className="grid grid-flow-col gap-1.5"
          style={{ gridTemplateRows: "repeat(7, 1fr)" }}
        >
          {days.map((day) => {
            const count = activityDict[day] || 0;
            return (
              <div
                key={day}
                title={`${count} hoạt động vào ${dayjs(day).format("DD/MM/YYYY")}`}
                className={`w-4 h-4 rounded-[3px] transition-colors duration-500 cursor-pointer ${getHeatmapColor(count)} hover:ring-2 hover:ring-indigo-400`}
              />
            );
          })}
        </div>

        <div className="flex justify-end items-center mt-8 gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
          <span>Ít</span>
          <div className="flex gap-1.5">
            <div className="w-4 h-4 rounded-[2px] bg-slate-50" />
            <div className="w-4 h-4 rounded-[2px] bg-emerald-500/20" />
            <div className="w-4 h-4 rounded-[2px] bg-emerald-500/40" />
            <div className="w-4 h-4 rounded-[2px] bg-emerald-500/70" />
            <div className="w-4 h-4 rounded-[2px] bg-emerald-500" />
          </div>
          <span>Nhiều</span>
        </div>
      </div>
      <div className="md:hidden py-10 bg-slate-50 rounded-2xl text-center">
        <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">
          Vui lòng xem trên màn hình lớn để thấy chi tiết
        </p>
      </div>
    </div>
  );
}
