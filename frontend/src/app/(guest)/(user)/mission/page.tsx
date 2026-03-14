"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDailyMissions } from "@/store/slice/mission/missionSlice";
import { Target, Coins, Clock, CheckCircle2 } from "lucide-react";

export default function MissionPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { missions, loading } = useSelector(
    (state: RootState) => state.mission,
  );

  useEffect(() => {
    dispatch(fetchDailyMissions());
  }, [dispatch]);

  // Optionally sort so completed are at the bottom
  const sortedMissions = [...missions].sort((a, b) => {
    if (a.isCompleted && !b.isCompleted) return 1;
    if (!a.isCompleted && b.isCompleted) return -1;
    return a.requirement - b.requirement;
  });

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in zoom-in duration-300">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center gap-3 border-b border-gray-100 pb-4 mb-6">
          <div className="p-3 bg-blue-50 rounded-xl">
            <Target className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Nhiệm vụ hàng ngày
            </h1>
            <p className="text-sm text-gray-500">
              Hoàn thành các nhiệm vụ mỗi ngày để nhận Learncoin
            </p>
          </div>
        </div>

        {loading && missions.length === 0 ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="animate-pulse bg-gray-50 h-24 rounded-xl"
              ></div>
            ))}
          </div>
        ) : missions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Chưa có nhiệm vụ nào cho hôm nay.</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {sortedMissions.map((mission) => {
              const progressPercentage = Math.min(
                100,
                Math.round((mission.progress / mission.requirement) * 100),
              );

              return (
                <div
                  key={mission.id}
                  className={`p-5 rounded-2xl border transition-all ${
                    mission.isCompleted
                      ? "bg-green-50/50 border-green-100 opacity-75"
                      : "bg-white border-gray-100 hover:border-blue-200 hover:shadow-md"
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-1 p-2 rounded-lg ${mission.isCompleted ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"}`}
                      >
                        {mission.type === "ONLINE_TIME" ? (
                          <Clock className="w-5 h-5" />
                        ) : (
                          <Target className="w-5 h-5" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                          {mission.title}
                          {mission.isCompleted && (
                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {mission.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 whitespace-nowrap px-4 py-2 bg-yellow-50 text-yellow-700 rounded-full font-medium text-sm self-start md:self-auto border border-yellow-200/50">
                      <Coins className="w-4 h-4 text-yellow-500" />+
                      {new Intl.NumberFormat("vi-VN").format(
                        mission.rewardAmount,
                      )}
                      đ
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-xs font-semibold">
                      <span
                        className={
                          mission.isCompleted
                            ? "text-green-600"
                            : "text-blue-600"
                        }
                      >
                        {mission.isCompleted
                          ? "Đã hoàn thành"
                          : "Đang tiến hành"}
                      </span>
                      <span className="text-gray-600">
                        {Math.min(mission.progress, mission.requirement)} /{" "}
                        {mission.requirement}{" "}
                        {mission.type === "ONLINE_TIME" ? "phút" : ""}
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                      <div
                        className={`h-2.5 w-full rounded-full ${mission.isCompleted ? "bg-green-500" : "bg-blue-600"}`}
                        style={{ width: `${progressPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
