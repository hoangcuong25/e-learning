"use client";

import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchDailyMissions, updateMissionProgress } from "@/store/slice/mission/missionSlice";
import { toast } from "sonner";

export default function MissionTracker() {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!user) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Lấy danh sách nhiệm vụ khi vừa đăng nhập
    dispatch(fetchDailyMissions());

    // Thiết lập bộ đếm thời gian mỗi phút
    timerRef.current = setInterval(() => {
      dispatch(updateMissionProgress(1))
        .unwrap()
        .then((res) => {
          if (res.totalReward && res.totalReward > 0) {
            toast.success(
              `🎉 Chúc mừng! Bạn vừa hoàn thành nhiệm vụ và nhận được ${new Intl.NumberFormat(
                "vi-VN"
              ).format(res.totalReward)} Learncoin!`
            );
          }
        })
        .catch((error) => console.error("Lỗi cập nhật nhiệm vụ:", error));
    }, 60000);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [dispatch, user]);

  return null; // Component này không hiển thị gì cả
}
