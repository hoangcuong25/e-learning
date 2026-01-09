"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/store";
import { fetchInstructorProfile } from "@/store/slice/instructorProfileSlice";
import { useParams } from "next/navigation";
import LoadingScreen from "@/components/LoadingScreen";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { BookOpen, User, Briefcase, Award } from "lucide-react";

const InstructorProfilePublicPage = () => {
  const params = useParams();
  const instructorId = Number(params.instructorId);
  const dispatch = useDispatch<AppDispatch>();

  const { publicProfile, loading, error } = useSelector(
    (state: RootState) => state.instructorProfile
  );

  useEffect(() => {
    if (instructorId) {
      dispatch(fetchInstructorProfile(instructorId));
    }
  }, [dispatch, instructorId]);

  if (loading) return <LoadingScreen />;

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-red-500 font-medium">Error: {error}</p>
      </div>
    );
  }

  if (!publicProfile) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p className="text-gray-500 font-medium">Instructor not found.</p>
      </div>
    );
  }

  // Assuming publicProfile might contain user info nested or we need to fetch it separately if the backend returns it.
  // Based on service implementation in backend:
  // instructorProfileService.getProfile returns the profile which has `user` relation if included?
  // Let's verify backend service implementation again.
  // Backend: return this.prisma.instructorProfile.findUnique({ where: { userId } });
  // It does NOT currently include the `user` relation in `getProfile`.
  // I should probably update the backend to include `user` info (name, avatar, email) for the public profile view.
  // But for now, I will display what I have.

  // NOTE: Ideally the backend should return user details (name, avatar) with the profile.
  // Attempting to render with potential missing user data gracefully.

  return (
    <div className="container mx-auto py-10 px-4 max-w-4xl">
      <Card className="shadow-lg border-t-4 border-t-primary">
        <CardHeader className="text-center pb-2">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="w-32 h-32 border-4 border-white shadow-md">
              <AvatarImage
                src={
                  publicProfile?.user?.avatar || "https://github.com/shadcn.png"
                }
                alt={publicProfile?.user?.fullname || "Instructor Avatar"}
              />
              <AvatarFallback>
                {(
                  publicProfile?.user?.fullname?.charAt(0) || "I"
                ).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <CardTitle className="text-3xl font-bold">
                {publicProfile?.user?.fullname ||
                  `Giảng viên #${publicProfile.userId}`}
              </CardTitle>
              <p className="text-muted-foreground flex items-center justify-center gap-1">
                <User className="w-4 h-4" /> Instructor
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          {/* Bio Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Giới thiệu</h3>
            </div>
            <Separator />
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {publicProfile.bio || "Chưa có thông tin giới thiệu."}
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h3 className="text-xl font-semibold">Kinh nghiệm giảng dạy</h3>
            </div>
            <Separator />
            <div className="prose max-w-none text-gray-700 leading-relaxed whitespace-pre-line">
              {publicProfile.experience || "Chưa có thông tin kinh nghiệm."}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InstructorProfilePublicPage;
