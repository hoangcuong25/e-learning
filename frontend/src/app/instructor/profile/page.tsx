"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchMyProfile,
  updateMyProfile,
  clearProfileState,
} from "@/store/slice/instructor/instructorProfileSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";

import { User, Briefcase, Award, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

const InstructorProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, successMessage, error } = useSelector(
    (state: RootState) => state.instructorProfile,
  );

  // Use user state for avatar/basic info if profile doesn't have it
  const { user } = useSelector((state: RootState) => state.user);

  const [formData, setFormData] = useState({
    bio: "",
    experience: "",
  });

  useEffect(() => {
    dispatch(fetchMyProfile());
    return () => {
      dispatch(clearProfileState());
    };
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: profile.bio || "",
        experience: profile.experience || "",
      });
    }
  }, [profile]);

  useEffect(() => {
    if (successMessage) {
      dispatch(clearProfileState());
    }
    if (error) {
      dispatch(clearProfileState());
    }
  }, [successMessage, error, dispatch]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateMyProfile(formData));
    toast.success("Hồ sơ của bạn đã được cập nhật thành công!");
  };

  if (loading && !profile) return <LoadingScreen />;

  return (
    <div className="space-y-10 pb-10 max-w-5xl mx-auto overflow-x-hidden">
      {/* 🚀 Hero Section */}
      <Card className="rounded-[3rem] border-none shadow-xl overflow-hidden bg-slate-900 text-white relative group">
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/40 to-slate-900 pointer-events-none" />
        <div className="absolute top-0 right-0 p-12 opacity-10 group-hover:opacity-20 transition-opacity">
          <Award className="w-64 h-64 -rotate-12" />
        </div>

        <CardContent className="relative z-10 p-10 sm:p-14 flex flex-col md:flex-row items-center gap-10">
          {/* Avatar Column */}
          <div className="relative">
            <div className="w-32 h-32 sm:w-44 sm:h-44 rounded-[2.5rem] overflow-hidden border-4 border-white/20 shadow-2xl relative">
              <Image
                src={
                  user?.avatar ||
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=Felix"
                }
                alt="Avatar"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-3 -right-3 p-3 bg-emerald-500 rounded-2xl shadow-xl border-4 border-slate-900 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
          </div>

          {/* Info Column */}
          <div className="flex-1 text-center md:text-left space-y-4">
            <div className="space-y-1">
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                <Badge className="bg-white/10 text-white border-white/20 rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                  Verified Instructor
                </Badge>
              </div>
              <h1 className="text-4xl sm:text-5xl font-black tracking-tight">
                {user?.fullname || "Giảng viên"}
              </h1>
              <p className="text-slate-400 font-medium text-lg italic">
                {user?.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-8 pt-4">
              <div className="text-center md:text-left">
                <div className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">
                  Kinh nghiệm
                </div>
                <div className="text-xl font-black text-indigo-400">
                  {(profile?.experience?.length || 0) > 0
                    ? "Chuyên gia"
                    : "Mới bắt đầu"}
                </div>
              </div>
              <div className="w-px h-10 bg-white/10 hidden sm:block" />
              <div className="text-center md:text-left">
                <div className="text-sm font-black text-slate-500 uppercase tracking-widest mb-1">
                  Gia nhập
                </div>
                <div className="text-xl font-black text-white">
                  {new Date().getFullYear()}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 📝 Main Setting Form */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <div className="md:col-span-2 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white overflow-hidden">
            <CardHeader className="p-8 border-b border-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                  <User className="w-5 h-5" />
                </div>
                <CardTitle className="text-xl font-black text-slate-900 tracking-tight">
                  Thông tin chi tiết
                </CardTitle>
              </div>
            </CardHeader>
            <CardContent className="p-8 space-y-10">
              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Tiểu sử cá nhân (Bio)
                </label>
                <Textarea
                  id="bio"
                  name="bio"
                  placeholder="Quốc gia, sở thích, định hướng giảng dạy..."
                  value={formData.bio}
                  onChange={handleChange}
                  className="min-h-[140px] bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-3xl transition-all font-medium p-6 text-slate-900 leading-relaxed outline-none"
                />
              </div>

              <div className="space-y-3">
                <label className="text-[11px] font-black text-slate-400 uppercase tracking-widest ml-1">
                  Lĩnh vực & Kinh nghiệm
                </label>
                <Textarea
                  id="experience"
                  name="experience"
                  placeholder="Lịch sử làm việc, các dự án thực tế đã thực hiện..."
                  value={formData.experience}
                  onChange={handleChange}
                  className="min-h-[200px] bg-slate-50 border-transparent focus:bg-white focus:border-indigo-200 rounded-3xl transition-all font-medium p-6 text-slate-900 leading-relaxed outline-none"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Actions */}
        <div className="md:col-span-1 space-y-8">
          <Card className="rounded-[2.5rem] border-none shadow-sm bg-white p-8">
            <div className="flex flex-col gap-6">
              <div className="p-6 bg-slate-50 rounded-[2rem] border border-slate-100/50 flex flex-col items-center text-center">
                <div className="p-4 bg-indigo-600 rounded-2xl shadow-xl shadow-indigo-100 mb-4">
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
                <h4 className="text-sm font-black text-slate-900 uppercase">
                  Hoàn thiện hồ sơ
                </h4>
                <p className="text-xs text-slate-500 font-medium mt-1">
                  Gia tăng khả năng tin cậy từ học viên bằng thông tin chi tiết.
                </p>
              </div>

              <Button
                type="submit"
                className="h-16 w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white font-black uppercase tracking-widest rounded-3xl shadow-xl shadow-indigo-100 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                disabled={loading}
              >
                {loading ? "Đang xử lý..." : "Cập nhật hồ sơ"}
              </Button>

              <p className="text-[10px] text-slate-400 font-bold text-center uppercase tracking-widest">
                Lưu ý: Mọi thay đổi sẽ hiển thị công khai trên trang cá nhân.
              </p>
            </div>
          </Card>

          <div className="p-8 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
              <Award className="w-20 h-20" />
            </div>
            <h4 className="text-xs font-black text-indigo-900 uppercase tracking-widest mb-2 leading-none">
              Chất lượng giảng dạy
            </h4>
            <p className="text-xs text-indigo-700 font-medium leading-relaxed">
              Giữ hồ sơ chi tiết giúp học viên hiểu rõ phong cách giảng dạy và
              chuyên môn của bạn hơn.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};

export default InstructorProfilePage;
