"use client";

import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import {
  fetchMyProfile,
  updateMyProfile,
  clearProfileState,
} from "@/store/slice/instructorProfileSlice";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingScreen from "@/components/LoadingScreen";
import { toast } from "sonner";

const InstructorProfilePage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { profile, loading, successMessage, error } = useSelector(
    (state: RootState) => state.instructorProfile
  );

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
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(updateMyProfile(formData));
    toast.success("Cập nhật hồ sơ thành công");
  };

  if (loading && !profile) return <LoadingScreen />;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Hồ sơ Giảng viên</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="bio" className="text-sm font-medium">
                Tiểu sử (Bio)
              </label>
              <Textarea
                id="bio"
                name="bio"
                placeholder="Giới thiệu ngắn về bản thân..."
                value={formData.bio}
                onChange={handleChange}
                rows={4}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="experience" className="text-sm font-medium">
                Kinh nghiệm làm việc
              </label>
              <Textarea
                id="experience"
                name="experience"
                placeholder="Mô tả kinh nghiệm giảng dạy và làm việc của bạn..."
                value={formData.experience}
                onChange={handleChange}
                rows={6}
              />
            </div>

            <div className="flex justify-end ">
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700"
                disabled={loading}
              >
                {loading ? "Đang lưu..." : "Lưu thay đổi"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfilePage;
